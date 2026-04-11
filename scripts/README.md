# Scripts

Versioned automation scripts and git hooks.

## Commands

- `npm run hooks:install`: copies versioned hooks from `scripts/hooks` into `.git/hooks`
- `npm run sync:engram`: stage `.engram` changes if the directory exists
- `npm run sync:engram:stage`: explicit staging-only mode
- `npm run sync:engram:commit`: stage + auto-commit `.engram` changes with recursion guard
- `npm run release:declare`: writes `releases/pending-release.md` from git history

## Hook flow

- `pre-commit` → runs `gga run` (fails if `gga` is missing)
- `post-commit` → runs `sync:engram:commit` (guarded by `ENGRAM_POST_COMMIT_AUTOCOMMIT=1`)
- `pre-push` → runs `release:declare`; if `releases/pending-release.md` changed, stages and auto-commits it as `chore: update release declaration`
