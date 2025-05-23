import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Set base path for GitHub Pages deployment
  base: mode === 'production' ? '/Grind_OS/' : '/',
  server: {
    host: true, // This enables listening on all addresses, including network
    port: 3000,
    strictPort: false, // Allow Vite to find another port if 3000 is in use
    open: true, // Automatically open browser on start
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        landing: 'public/landing.html',
        about: 'public/about.html',
        careers: 'public/careers.html',
        blog: 'public/blog.html',
        contact: 'public/contact.html',
        terms: 'public/terms.html',
        privacy: 'public/privacy.html',
        cookies: 'public/cookies.html',
      }
    }
  },
  plugins: [
    react(),
    {
      name: 'serve-static-pages',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Map routes to HTML files
          const routes = {
            '/landing': '/landing.html',
            '/about': '/about.html',
            '/careers': '/careers.html',
            '/blog': '/blog.html',
            '/contact': '/contact.html',
            '/terms': '/terms.html',
            '/privacy': '/privacy.html',
            '/cookies': '/cookies.html',
          };

          if (routes[req.url]) {
            req.url = routes[req.url];
          }

          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
