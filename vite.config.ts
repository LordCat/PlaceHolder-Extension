import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'
import svgr from 'vite-plugin-svgr'

const root = resolve(__dirname, 'src');
const publicDir = resolve(__dirname, 'public');

const getFeatureDirectories = () => {
  return fs.readdirSync(root, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'components')
    .map(dirent => dirent.name);
};

export default defineConfig({
  root,
  plugins: [
    react(),
    svgr(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(/(['"])(.+)\.tsx(['"])/g, '$1$2.js$3');
      }
    },
    {
      name: 'manifest-transformer',
      generateBundle(options) {
        const manifestPath = resolve(publicDir, 'manifest.json');
        if (fs.existsSync(manifestPath)) {
          const baseManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
          
          const updateChromePaths = (manifest: any) => {
            if (manifest.action && manifest.action.default_popup) {
              manifest.action.default_popup = 'PopUp/PopUp.html';
            }
            if (manifest.background && manifest.background.service_worker) {
              manifest.background.service_worker = 'background.js';
            }
            if (manifest.content_scripts && manifest.content_scripts[0] && manifest.content_scripts[0].js) {
              manifest.content_scripts[0].js = ['content.js'];
            }
            if (manifest.devtools_page) {
              manifest.devtools_page = 'DevTool/DevTool.html';
            }
            return manifest;
          };

          const updateFirefoxPaths = (manifest: any) => {
            const firefoxManifest = {...manifest};
            
            // browser_action for Firefox
            if (firefoxManifest.action) {
              firefoxManifest.action.default_popup = 'PopUp/popup.html';
            }

            // Adjust background for Firefox
            if (firefoxManifest.background) {
              firefoxManifest.background = {
                scripts: ['background.js'],
                type: 'module'
              };
            }

            // Remove content_security_policy for Firefox
            delete firefoxManifest.content_security_policy;

            // Adjust content_scripts for Firefox
            // Adjust content_scripts for Firefox
            if (firefoxManifest.content_scripts) {
              firefoxManifest.content_scripts.forEach((script: any) => {
                if (script.js) {
                  script.js = ['content.js'];
                }
                // Remove 'type' field if present
                delete script.type;
              });
            }

            // Update paths
            if (firefoxManifest.browser_action && firefoxManifest.browser_action.default_popup) {
              firefoxManifest.browser_action.default_popup = 'PopUp/popup.html';
            }
            if (firefoxManifest.devtools_page) {
              firefoxManifest.devtools_page = 'DevTool/DevTool.html';
            }

            return firefoxManifest;
          };

          const chromeManifest = updateChromePaths({...baseManifest});
          const firefoxManifest = updateFirefoxPaths({...baseManifest});

          // Use optional chaining and nullish coalescing to safely check options.dir
          const outputDir = options.dir?.toString() ?? '';

          if (outputDir.includes('chrome-dist')) {
            this.emitFile({
              type: 'asset',
              fileName: 'manifest.json',
              source: JSON.stringify(chromeManifest, null, 2)
            });
          } else if (outputDir.includes('firefox-dist')) {
            this.emitFile({
              type: 'asset',
              fileName: 'manifest.json',
              source: JSON.stringify(firefoxManifest, null, 2)
            });
          }
        }
      }
    } as Plugin
  ],
  build: {
    emptyOutDir: true,
    sourcemap: 'inline',
    rollupOptions: {
      input: {
        'popup': resolve(__dirname, 'src/PopUp/PopUp.html'),
        'devtool': resolve(__dirname, 'src/DevTool/DevTool.html'),
        'background': resolve(__dirname, 'src/background-main.ts'),
        'content': resolve(__dirname, 'src/content-main.ts')
      },
      output: [
        {
          dir: resolve(__dirname, 'dist/chrome-dist'),
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
              return '[name].js';
            }
            return '[name]/[name].js';
          },
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'PopUp.html') {
              return 'PopUp/[name][extname]';
            }
            if (assetInfo.name === 'DevTool.html') {
              return 'DevTool/[name][extname]';
            }
            return 'assets/[name][extname]';
          },
        },
        {
          dir: resolve(__dirname, 'dist/firefox-dist'),
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
              return '[name].js';
            }
            return '[name]/[name].js';
          },
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'PopUp.html') {
              return 'PopUp/[name][extname]';
            }
            if (assetInfo.name === 'DevTool.html') {
              return 'DevTool/[name][extname]';
            }
            return 'assets/[name][extname]';
          },
        }
      ],
    },
    target: ['chrome116', 'firefox115'],
    minify: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@assets': resolve(__dirname, './public/assets'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    __DEV__: process.env.NODE_ENV !== 'production',
  },
  optimizeDeps: {
    include: ['webextension-polyfill']
  },
})