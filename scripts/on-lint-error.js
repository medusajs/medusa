console.log(`

Oops! Medusa noticed some lint or style warnings in the code for this
commit. Your changes have been committed, but you should fix the warnings before
creating a pull request.
Use 'yarn run lint' to manually re-run these checks. You can also disable these
checks:
- for a single commit: git commit --no-verify
- for all future commits: yarn run hooks:uninstall

`)

process.exit(1)
