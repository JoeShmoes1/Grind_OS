# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/50c407b3-4c75-4c01-946b-6d5f3c6a180f

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/50c407b3-4c75-4c01-946b-6d5f3c6a180f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### GitHub Pages Deployment (Recommended)

This project is configured for deployment to GitHub Pages. Follow these steps:

#### Automatic Deployment

1. **Push to GitHub**: Push your code to a GitHub repository
2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" in the sidebar
   - Under "Source", select "GitHub Actions"
3. **Automatic Deployment**: The GitHub Actions workflow will automatically build and deploy your app when you push to the main branch

Your app will be available at: `https://JoeShmoes1.github.io/Grind_OS/`

#### Manual Deployment

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build for GitHub Pages**:
   ```bash
   npm run build:gh-pages
   ```

3. **Deploy manually** (requires gh-pages package):
   ```bash
   npm run deploy
   ```

#### Custom Domain Setup

If you want to use a custom domain:

1. **Add CNAME file**: Create a `CNAME` file in the `public` directory with your domain name
2. **Update base path**: In `vite.config.ts`, change the base path from `/Grind_OS/` to `/`
3. **Configure DNS**: Point your domain to GitHub Pages:
   - For apex domain (example.com): Create A records pointing to GitHub's IPs
   - For subdomain (www.example.com): Create CNAME record pointing to `JoeShmoes1.github.io`

### Alternative: Lovable Deployment

Simply open [Lovable](https://lovable.dev/projects/50c407b3-4c75-4c01-946b-6d5f3c6a180f) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
