import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import browser from 'webextension-polyfill'
import DevToolsApp from './DevtoolApp'
import Example from './routes/example'
import {
  HashRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'

// Create the DevTools panel
browser.devtools.panels.create(
  "PlaceHolder Extension",
  "",
  "DevTool/DevTool.html"
).then((panel) => {
  console.log("DevTools panel created");
}).catch((error) => {
  console.error("Error creating DevTools panel:", error);
});

// Render the React app
function renderApp() {
  const root = document.getElementById('root');
  if (root) {
    createRoot(root).render(
      <StrictMode>
        <Router>
          <Routes>
            <Route path="/" element={<DevToolsApp />} />
            <Route path="/example" element={<Example />} />
          </Routes>
        </Router>
      </StrictMode>
    );
  } else {
    console.error("Root element not found");
  }
}

// Wait for the DOM to be fully loaded before rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}