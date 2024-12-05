# Semantic Versioning for GitHub Pages

Semantic Versioning (SemVer) is a versioning standard often used in software projects, including those hosted on GitHub. For GitHub Pages, where web services are deployed directly from a repository, the standard for SemVer typically applies to the versioning of the codebase, not the deployment itself. Here's how SemVer is generally structured and applied:

## SemVer Format

Semantic Versioning follows the format:

```txt
MAJOR.MINOR.PATCH
```

1. **MAJOR**: Increments when there are incompatible changes that break backward compatibility.
2. **MINOR**: Increments when new features are added in a backward-compatible manner.
3. **PATCH**: Increments when backward-compatible bug fixes are made.

For example:

- `1.0.0`: Initial stable release.
- `1.1.0`: Adds a new feature.
- `1.1.1`: Fixes a bug in `1.1.0`.

## SemVer for GitHub Pages

For projects using GitHub Pages:

- **Committing Changes**: If you commit code changes and version your project, you may tag releases with SemVer to indicate the state of the project.
- **Best Practice**:
  - Use Git tags to indicate version numbers. For example, after committing a change, you can tag the release with:

    ```bash
    git tag -a v1.2.3 -m "Version 1.2.3"
    git push origin v1.2.3
    ```

  - GitHub will associate this tag with a release, making it visible in the repository's "Releases" section.

## When to Update Each Component

- **MAJOR**: If your GitHub Pages project (e.g., a web application or API) introduces breaking changes that make it incompatible with previous versions.
- **MINOR**: For new features that are backward-compatible, such as adding new pages, UI elements, or API endpoints.
- **PATCH**: For fixes, such as resolving typos, fixing styling issues, or addressing bugs.

## Automating SemVer

You can use tools like:

- **GitHub Actions**: Automate the tagging process during deployment or on specific branches.
- **Semantic-release**: A tool that analyzes commits based on conventional commit messages to automatically determine the version.

## References

- [Semantic Versioning Specification](https://semver.org/)
- [Git Tags and Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
- [Semantic-release on GitHub](https://github.com/semantic-release/semantic-release)

If you follow conventional commit messages (e.g., `feat: Add new button` or `fix: Resolve alignment issue`), you can automate the process to ensure compliance with SemVer standards.
