# Publishing and maintenance

The project is published at <https://github.com/Bigguysahaj/indian-ghost-database>.

The repository already exists and now carries the full package: the JSON database, schema, generated Markdown, research notes, contribution documentation and the `.github` directory with the issue/PR templates and the validation workflow. There is nothing left to create — this file now covers working against the published repository.

The four input book photographs are intentionally absent from this package and should not be committed.

## Working on a clone

```bash
git clone https://github.com/Bigguysahaj/indian-ghost-database.git
cd indian-ghost-database
python scripts/catalogue.py --check
```

Python 3.10 or newer is sufficient; no third-party packages are required.

## Making a change

Edit `data/ghosts.json` (or `research/evidence.json`, `data/references.json`), then regenerate the Markdown and validate before committing:

```bash
python scripts/catalogue.py          # regenerate GHOSTS.md and ghosts/*.md
python scripts/catalogue.py --check  # validate; must exit 0
python scripts/sync_site.py          # mirror data/images into site/, if either changed
```

`GHOSTS.md` and `ghosts/*.md` are generated files. Edit the JSON and regenerate rather than editing the Markdown by hand — `--check` fails if the two fall out of sync. `site/data/` and `site/images/ghosts/` are likewise generated copies for the website (see `site/README.md`); the CI workflow fails if they drift from the source.

Commit the regenerated Markdown alongside the JSON change, then open a pull request:

```bash
git checkout -b <short-branch-name>
git add .
git commit -m "<what changed>"
git push -u origin <short-branch-name>
```

The `Validate catalogue` GitHub Actions workflow (`.github/workflows/validate.yml`) runs `python scripts/catalogue.py --check` on every push and pull request. A red check means the change is not ready to merge.

See [CONTRIBUTING.md](CONTRIBUTING.md) for what belongs in an entry, how to cite sources at the claim level, and how unknown values are recorded.

## Releasing data snapshots

The JSON files are the canonical artefacts. If a tagged snapshot is wanted for downstream consumers, tag a commit on `main` after `--check` passes:

```bash
git tag -a v0.1.0 -m "Initial 84-entry research release"
git push origin v0.1.0
```

Keep the schema version in `schema/ghosts.schema.json` in step with any breaking change to the entry shape.

## Not yet done

The searchable website (ghost profiles, regional filters, research status, citations, JSON downloads and contribution links) has not been built or deployed. The database is the prerequisite and is now published.
