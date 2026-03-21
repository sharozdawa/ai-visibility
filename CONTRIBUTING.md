# Contributing to ai-visibility

Thanks for your interest in contributing to ai-visibility! This guide will help you get started.

## Reporting Bugs

Open a [Bug Report](../../issues/new?template=bug_report.md) issue with:

- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, version)

## Suggesting Features

Open a [Feature Request](../../issues/new?template=feature_request.md) issue describing:

- The problem your feature would solve
- Your proposed solution
- Any alternatives you've considered

## Submitting Pull Requests

1. **Fork** the repository and create a branch from `main`
2. **Install dependencies**: `npm install`
3. **Start the dev server**: `npm run dev`
4. Make your changes
5. **Test** your changes locally to ensure everything works
6. **Commit** with a clear, descriptive message
7. **Push** your branch and open a pull request

### PR Guidelines

- Keep PRs focused on a single change
- Update documentation if your change affects usage
- Describe what your PR does and why in the description
- Link any related issues

## Code Style

- **TypeScript** for all source code
- **Next.js** conventions for pages, components, and API routes
- **Prisma** for database schema changes -- run `npx prisma generate` after modifying `schema.prisma`
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names

## Development Setup

```bash
git clone https://github.com/your-username/ai-visibility.git
cd ai-visibility
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
