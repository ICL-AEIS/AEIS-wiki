# AEIS Wiki

**Live Website**: [https://ICL-AEIS.github.io/AEIS-wiki/](https://ICL-AEIS.github.io/AEIS-wiki/)


## Note for co-Authors

Please follow the workflow below whenever adding or editing content.

The courses page is generated automatically from data in `courses-data.json`. Add courses and reviews here making sure not to delete existing data.


## Prerequisites & installation

Before you can build or test the website locally, make sure you have the following installed on your computer:

### 1. Node.js & npm
Node.js (v18 or higher) is required to run the build tools and local server.
- **Download**: [nodejs.org](https://nodejs.org/)
- **Verify installation**:
  ```bash
  node -v
  npm -v
  ```

### 2. Quarto CLI
Quarto is used to render the Markdown / `.qmd` files into the static website.
- **Download**: Download the installer for your OS from [quarto.org/docs/get-started](https://quarto.org/docs/get-started/)
- **Verify installation**:
  ```bash
  quarto --version
  ```

### 3. Project dependencies
After cloning the repository, navigate to the project folder in your terminal and install the project dependencies (including `staticrypt` and `serve`):

```bash
npm install
```



## Local development workflow

Before pushing any changes to GitHub, **always test your changes locally** to verify that the layout, formatting, and content look as expected.

Execute the following command in your project directory:

```bash
npm run deploy_local
```

This command automatically:
1. Generate `courses.qmd` from `courses-data.json`
2. Renders all `.qmd` files using Quarto.
3. Encrypts the generated HTML files using the local test password: **`test`**.
4. Starts a local web server (typically at `http://localhost:3000`).

Then navigate to `http://localhost:3000`. Enter the password **`test`** to unlock and preview the website.



## Publishing to production (GitHub Pages)

Once you are satisfied with your local preview:

1. **Commit and push** your changes to the `main` branch:

2. **Automated CI/CD**:
   - Pushing to `main` automatically triggers the **GitHub Actions** workflow `/.github/workflows/publish.yml`.
   - The workflow renders the site with Quarto, encrypts all HTML files using staticrypt with the password stored securely in the repository's GitHub Secrets (`STATICRYPT_PASSWORD`), and publishes the updated site to GitHub Pages.
