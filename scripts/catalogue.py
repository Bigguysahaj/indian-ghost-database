"""Validate the research data and render Markdown, using only Python's standard library."""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def read(path):
    return json.loads((ROOT / path).read_text(encoding='utf-8'))

def validate_schema(value, rule, schema, path='$'):
    """Validate the JSON Schema keywords used by this repository's schema."""
    if '$ref' in rule:
        target = schema
        for part in rule['$ref'].removeprefix('#/').split('/'):
            target = target[part]
        return validate_schema(value, target, schema, path)
    types = {'object': dict, 'array': list, 'string': str, 'null': type(None)}
    if 'type' in rule:
        expected = rule['type'] if isinstance(rule['type'], list) else [rule['type']]
        if not any(isinstance(value, types[t]) for t in expected):
            raise ValueError(f'{path}: expected {expected}')
    if 'enum' in rule and value not in rule['enum']:
        raise ValueError(f'{path}: invalid enum value')
    if 'const' in rule and value != rule['const']:
        raise ValueError(f'{path}: wrong constant')
    if isinstance(value, str):
        if len(value) < rule.get('minLength', 0):
            raise ValueError(f'{path}: empty string')
        if 'pattern' in rule and not re.search(rule['pattern'], value):
            raise ValueError(f'{path}: invalid pattern')
    if isinstance(value, dict):
        missing = set(rule.get('required', [])) - value.keys()
        if missing:
            raise ValueError(f'{path}: missing {sorted(missing)}')
        for key, item in value.items():
            child = rule.get('properties', {}).get(key)
            if child is None:
                child = rule.get('additionalProperties', True)
            if child is False:
                raise ValueError(f'{path}: unexpected field {key}')
            if isinstance(child, dict):
                validate_schema(item, child, schema, f'{path}.{key}')
    if isinstance(value, list):
        if rule.get('uniqueItems') and len({json.dumps(x, sort_keys=True) for x in value}) != len(value):
            raise ValueError(f'{path}: duplicate values')
        for index, item in enumerate(value):
            validate_schema(item, rule.get('items', {}), schema, f'{path}[{index}]')

def validate(data, evidence, references):
    schema = read('schema/ghosts.schema.json')
    validate_schema(data, schema, schema)
    ids = [g['id'] for g in data['ghosts']]
    if len(ids) != len(set(ids)):
        raise ValueError('Duplicate ghost IDs')
    all_sources = references + evidence
    source_ids = [s['id'] for s in all_sources]
    if len(source_ids) != len(set(source_ids)):
        raise ValueError('Duplicate source IDs')
    known = set(source_ids)
    seed_numbers = []
    for ghost in data['ghosts']:
        seed = ghost['seed_reference']
        if seed:
            if seed['source_id'] not in known or not isinstance(seed['chapter_start_page'], int):
                raise ValueError(f'{ghost["id"]}: invalid seed reference')
            seed_numbers.append(seed['entry_number'])
        for field, c in ghost['claims'].items():
            if c['value'] is None:
                if c['status'] != 'unknown' or c['source_ids']:
                    raise ValueError(f'{ghost["id"]}.{field}: null must be unknown without sources')
            elif c['status'] == 'unknown' or not c['source_ids']:
                raise ValueError(f'{ghost["id"]}.{field}: populated claims require evidence')
            if not set(c['source_ids']) <= known:
                raise ValueError(f'{ghost["id"]}.{field}: unresolved evidence link')
        for variant in ghost['variants']:
            if not set(variant['source_ids']) <= known:
                raise ValueError(f'{ghost["id"]}: unresolved variant evidence link')
        if ghost['research_status'] == 'name_only' and any(c['value'] is not None for c in ghost['claims'].values()):
            raise ValueError(f'{ghost["id"]}: name-only status conflicts with populated claims')
        for relationship in ghost['relationships']:
            if relationship['target_id'] not in ids or not set(relationship['source_ids']) <= known:
                raise ValueError(f'{ghost["id"]}: unresolved relationship')
    if len(seed_numbers) != len(set(seed_numbers)):
        raise ValueError('Duplicate seed chapter numbers')

def cell(text):
    return str(text).replace('|', '\\|').replace('\n', '<br>')

def render(data, sources):
    outputs = {}
    index = ['# Indian Ghost Database — catalogue', '', 'Generated from `data/ghosts.json`. Edit the JSON and regenerate.', '',
             'All supernatural descriptions below are attributed folklore claims. **Provisional** means the cited web account has been read, but the underlying regional or primary evidence still needs review. **Unknown** means no supported value has been entered.', '',
             '| # | Name | Book page | Research status |', '| --- | --- | --- | --- |']
    for g in data['ghosts']:
        seed = g['seed_reference']
        number, page = (seed['entry_number'], seed['chapter_start_page']) if seed else ('—', '—')
        index.append(f'| {number} | [{g["name"]}](ghosts/{g["id"]}.md) | {page} | {g["research_status"]} |')
        md = [f'# {g["name"]}', '', f'ID: `{g["id"]}` · Research status: **{g["research_status"]}**', '']
        if seed:
            md += [f'Listed in Riksundar Banerjee’s *The Book of Indian Ghosts*, entry {number}, chapter starts on page {page} in the photographed edition. Only the contents entry was supplied; this is not evidence for the lore below.', '']
        if g['aliases']:
            md += ['Proposed search aliases (equivalence needs review): '+', '.join(g['aliases']), '']
        md += ['| Field | Research note | Evidence status |', '| --- | --- | --- |']
        used = set()
        for field, c in g['claims'].items():
            refs = ' '.join(f'[{sid}]({sources[sid]["url"]})' for sid in c['source_ids'])
            used.update(c['source_ids'])
            text = c['value'] if c['value'] is not None else 'Unknown — research needed.'
            md.append(f'| {field.replace("_", " ").capitalize()} | {cell(text)} {refs} | {c["status"]} |')
        md += ['', '## Research questions', ''] + ['- '+q for q in g['research_questions']]
        if used:
            md += ['', '## Source limitations', '']
            for sid in sorted(used):
                md.append(f'- [{sources[sid]["title"]}]({sources[sid]["url"]}): {sources[sid].get("limitations", "See reference record.")}')
        md += ['', '## Regional variants', '']
        if not g['variants']:
            md.append('No regional variant records added yet.')
        for variant in g['variants']:
            refs = ' '.join(f'[{sid}]({sources[sid]["url"]})' for sid in variant['source_ids'])
            md += ['', f'### {variant["region"]}', '', f'{variant["difference"]} {refs}']
        if g['relationships']:
            md += ['', '## Related beings', '']
            for relation in g['relationships']:
                refs = ' '.join(f'[{sid}]({sources[sid]["url"]})' for sid in relation['source_ids'])
                md.append(f'- [{relation["target_id"]}]({relation["target_id"]}.md): {relation["relation"]} {refs}')
        if g['native_names']:
            md += ['', '## Native-name records', '', '```json', json.dumps(g['native_names'], ensure_ascii=False, indent=2), '```']
        md += ['', '## Game adaptations', '']
        md += ['- **Creative interpretation:** '+n['text'] for n in g['game_design_notes']] or ['No game mechanics added. Label invented mechanics as `creative_interpretation`.']
        md += ['', '[Back to catalogue](../GHOSTS.md)', '']
        outputs[f'ghosts/{g["id"]}.md'] = '\n'.join(md)
    outputs['GHOSTS.md'] = '\n'.join(index)+'\n'
    return outputs

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true', help='Validate data and fail if generated Markdown is stale')
    args = parser.parse_args()
    data = read('data/ghosts.json')
    evidence = read('research/evidence.json')['sources']
    references = read('data/references.json')['references']
    validate(data, evidence, references)
    outputs = render(data, {s['id']: s for s in references+evidence})
    for path, content in outputs.items():
        target = ROOT/path
        if args.check:
            if not target.exists() or target.read_text(encoding='utf-8') != content:
                raise ValueError(f'Stale generated file: {path}')
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content, encoding='utf-8')
    count = sum(g['research_status']=='initial_notes' for g in data['ghosts'])
    print(f'Validated {len(data["ghosts"])} entries, {count} initial-note records, {len(evidence)} web evidence records and {len(outputs)} Markdown outputs.')

if __name__ == '__main__':
    main()
