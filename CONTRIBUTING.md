# Contributing to 3D Model Viewer

Thank you for your interest in contributing! 🎉

## How to Contribute

1. **Fork** the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/my-improvement
   ```
3. Make your changes following the guidelines below.
4. **Test** your changes in at least two browsers (e.g. Chrome and Firefox).
5. Commit with a clear message:
   ```bash
   git commit -m "feat: add wireframe toggle button"
   ```
6. Push and open a **Pull Request** against `main`.

## Code Style Guidelines

- Use **vanilla JavaScript** (ES6+). No framework dependencies.
- Add **JSDoc comments** for every new function.
- Keep functions small and single-purpose.
- Use `const` / `let` — avoid `var`.
- Indent with **2 spaces**.
- Use single quotes for strings.

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use for |
|---|---|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation changes |
| `style:` | CSS / formatting changes |
| `refactor:` | Code refactors (no behaviour change) |
| `perf:` | Performance improvements |
| `chore:` | Build / config changes |

## Pull Request Process

1. Ensure your PR description clearly explains **what** and **why**.
2. Link any related issues with `Closes #<issue-number>`.
3. Screenshots / recordings are very welcome for UI changes.
4. A maintainer will review and merge within a few days.

## Reporting Bugs

Open a [GitHub Issue](https://github.com/trambak001/3d-model-viewer/issues) with:
- Browser and OS version
- Steps to reproduce
- Expected vs actual behaviour
- Console error messages (if any)

## Suggesting Features

Open an issue with the `enhancement` label and describe:
- The problem it solves
- Proposed solution / approach
- Any relevant references or examples

---

*By contributing you agree that your work will be released under the [MIT License](LICENSE).*
