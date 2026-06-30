# Chrome/FireFox Vite-React w/ tailwindcss Extension Template

A basic extension template to fork and build from, using Vite, React, and Tailwind CSS, created by LordCat and AtlasWiki/mrunoriginal. Comes with three UI templates - developer tools tab/panel, extension popup, and accessible webpage through `chrome-extension` url. Also includes a background service worker and content script with typed message passing between them.

<br>


https://github.com/user-attachments/assets/216ab206-27f3-402d-8153-8c05458f431d


## Key Features
- **Accessibility** - Accessible as a DevTools panel, extension popup, and `chrome-extension` url as a webpage.
- **Modularity** - Comes with an organized structure that can be expanded upon.
- **Routing** - Includes page routing/navigation through react components.
- **Easy Template Use** - Allows you to use reactjs, tailwindcss, and even expand this simple structure, simplifying the intial extension set up allowing you to focus on building your extension!
- **Typescript Support** - Prefer your type definitions at compile time? Typescript support included.
- **Background & Content Scripts** - Includes a background service worker and content script with typed message passing between them out of the box.

<br>

## Getting Started

### Prerequisites

- Node.js and npm installed on your system

### Clone the Repository

```bash
git clone https://github.com/LordCat/PlaceHolder-Extension.git
cd PlaceHolder-Extension
```

### Install Dependencies

```bash
npm install
```

### Build the Project

```bash
npm run build
```

### Load the Extension

**Chrome:**
1. Open your Chrome-based web browser
2. Go to the Extensions page (`chrome://extensions`)
3. Enable "Developer mode" (top right corner)
4. Click "Load unpacked"
5. Select the `dist` folder in your project directory

**Firefox:**
1. Open Firefox
2. Go to (`about:debugging#/runtime/this-firefox`)
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file inside the `dist` folder

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
