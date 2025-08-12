# Useful Git

## Removing Tracked Files from Repository

When git is already tracking files, putting these paths in the `.gitignore` file does not remove the tracked files. It only informs git that no further git actions involving the files will be done.

The following removes the file 'config.json' and the folder 'logs/' from being tracked.

```bash
git rm --cached config.json
git rm -r --cached logs/
```

The option `--cached` removes files from being tracked while keeping the file locally. The `-r` option is needed for folders.

See [this guide](https://www.baeldung.com/ops/git-remove-tracked-files-gitignore) for details on using '.gitignore'

---

Here are the best ways to **scan your repo** for large files that could cause sync issues with GitHub (especially the 100 MB hard limit).

## 🔍 1. **Check Unstaged / Tracked Files**

To check your working directory for **large uncommitted files**:

```bash
find . -type f -size +50M -exec du -h {} + | sort -hr
```

This lists all files over **50 MB**, sorted from largest down — useful before staging or committing.

If you want to be more aggressive (e.g., 20 MB warning threshold):

```bash
find . -type f -size +20M -exec du -h {} + | sort -hr
```

---

## 🗃️ 2. **Check Files Staged for Commit**

To see what large files are currently staged (in the index):

```bash
git diff --cached --numstat | awk '$1 > 51200 || $2 > 51200'  # Shows lines added/removed
```

For actual file sizes, use:

```bash
git ls-files -s | awk '{print $4}' | xargs -I{} du -h {} | sort -hr | head
```

---

## 🧠 3. **Check Git History for Large Files**

If you're not sure what’s already been committed (even in the past), use:

```bash
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  awk '$1=="blob" && $3 > 50000000' | \
  numfmt --field=3 --to=iec | \
  sort -k3 -h
```

> This lists committed blobs >50 MB in size.

---

## 🧼 4. **Git Hooks: Automatic Warnings**

To prevent large files from even being staged or committed, add a **pre-commit hook**:

```bash
#!/bin/bash
# .git/hooks/pre-commit
maxsize=100000000  # 100MB

while read file; do
  size=$(wc -c <"$file")
  if [ "$size" -gt "$maxsize" ]; then
    echo "❌ Error: $file is larger than 100 MB. Commit aborted."
    exit 1
  fi
done < <(git diff --cached --name-only)

exit 0
```

Make it executable:

```bash
chmod +x .git/hooks/pre-commit
```

---

## ✅ Summary: Commands to Remember

| Task                           | Command
| ------------------------------ | -----------------------------------------------------------
| List untracked big files       | \`find . -type f -size +50M -exec du -h {} +
| List staged big files          | \`git diff --cached --name-only
| Find large files in history    | Use the long `git rev-list` + `git cat-file` pipeline above
| Prevent commits of large files | Add a `.git/hooks/pre-commit` script

---

Here’s a complete **shell script** you can run manually, or integrate into your CI/dev workflow, to **warn about large files** (e.g. > 50 MB) in different states: untracked, staged, or committed.

Save this as `check-large-files.sh` and make it executable (`chmod +x`):

```bash
#!/usr/bin/env bash
# check-large-files.sh
# Scan for large files in your Git repository and working tree

THRESHOLD=$((50 * 1024 * 1024))   # threshold in bytes (50 MB)
EXIT_CODE=0

echo "🔍 Checking for untracked or unstaged files >50 MB..."
find . -type f -not -path "./.git/*" -size +"${THRESHOLD}c" \
  -print0 | xargs -0 du -h | sort -hr > /tmp/untracked_large.txt

if [[ -s /tmp/untracked_large.txt ]]; then
  echo "⚠️  Untracked/unstaged large files found:"
  cat /tmp/untracked_large.txt
  EXIT_CODE=1
else
  echo "✅ No large untracked files."
fi

echo ""
echo "🔍 Checking for staged files >50 MB..."
git diff --cached --name-only | xargs -r du -h 2>/dev/null | sort -hr > /tmp/staged_large.txt

if [[ -s /tmp/staged_large.txt ]]; then
  echo "⚠️  Staged files exceeding 50 MB:"
  cat /tmp/staged_large.txt
  EXIT_CODE=1
else
  echo "✅ No large staged files."
fi

echo ""
echo "🔍 Checking commit history blobs >50 MB..."
git rev-list --objects --all |
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' |
  awk '$1=="blob" && $3 > '"$THRESHOLD"'' |
  sort -k3 -n > /tmp/history_large.raw

if [[ -s /tmp/history_large.raw ]]; then
  echo "⚠️  Large files in commit history:"
  awk '{ printf "%s %s %s\n", $1, $2, $3 }' /tmp/history_large.raw | \
    numfmt --field=3 --to=iec | '& sort -k3 -h'
  EXIT_CODE=1
else
  echo "✅ No large history blobs."
fi

exit $EXIT_CODE
```

---

### 🧩 How to Use It

1. **Run locally** before committing:

   ```bash
   ./check-large-files.sh
   ```

   * If any large files are found, the script exits with code `1` and lists them.
   * Exit code `0` means "all clear".

2. **Use it as a Git pre-commit hook**:

   * Copy it into `.git/hooks/pre-commit`
   * Add at the top:

     ```bash
     #!/usr/bin/env bash
     ./check-large-files.sh || exit 1
     ```

   * Make sure it's executable: `chmod +x .git/hooks/pre-commit`

3. **Use in CI pipeline**:

   * Add a step in your CI (GitHub Actions, etc.) to run it.
   * Fail the pipeline if the script returns non-zero.

---

### ✅ Why This Works

* **Untracked check** finds new files not yet added.
* **Staged check** warns about files already staged for commit.
* **History blob check** helps detect too-large files already committed (e.g., previously committed PDFs).
* A **50 MB** threshold is recommended by GitHub; you can adjust it higher or lower.

This can be packaged as a Node.js script or in PowerShell
