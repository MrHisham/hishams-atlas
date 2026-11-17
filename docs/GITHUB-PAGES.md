# Deploy Atlas to GitHub Pages

The repository must have `package.json`, `package-lock.json`, `index.html`, `src/`, `public/` and `.github/` at its root. Upload the extracted source files rather than a ZIP as a single repository file.

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Commit `.github/workflows/deploy.yml` to `main`. If using GitHub's web editor, select **Add file → Create new file**, enter that full path, paste the prepared YAML and commit.
4. Open **Actions → Deploy Atlas to GitHub Pages**. The workflow runs on a commit to `main`. If it has not started, select **Run workflow** for `main`.
5. After the workflow succeeds, return to **Settings → Pages** and use **Visit site**, or use the deployment URL in the workflow run.

The workflow installs dependencies, runs unit checks, builds with `npm run build -- --base=./`, uploads only `dist/` and deploys the resulting Pages artifact. Relative build asset paths support repository subdirectories without entering your repository name in Vite config. The source repository remains on `main`; Pages consumes the workflow's built artifact.

No Jekyll theme is needed for this application. The workflow uses standard GitHub Pages token permissions, not a personal token. It assumes GitHub Actions/Pages are available and enabled for the repository; follow any repository policy messages displayed by GitHub.

If a run fails, open the failed step for its actual error. Check that package files are at the root, the workflow is committed to `main`, and Pages Source is set to GitHub Actions. This package prepares the workflow; it does not claim that a deployment has run in your GitHub account.

The hosted site has a different origin from localhost. Existing local progress can be moved using Atlas's JSON backup/restore; browser storage is not automatically shared across origins.

References: [Vite GitHub Pages deployment](https://vite.dev/guide/static-deploy#github-pages), [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
