/// <reference types="chrome"/>

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DevToolsApp from './DevTool/DevtoolsApp'
import Example from './DevTool/routes/example'
import {
  HashRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'
import React from 'react';

chrome.devtools.panels.create(
  "Placeholder Extension",  //CHANGE HERE TO ADJUST TAB NAME IN DEV TOOLS
  "",
  "devtools.html",
  (panel) => {
    console.log("DevTools panel created");
    panel.onShown.addListener((panelWindow) => {
      console.log("Panel shown");
      const root = panelWindow.document.getElementById('root');
      if (root && !root.hasChildNodes()) {
        console.log("Root element found, rendering React component");
        createRoot(root).render(
          <StrictMode>
            <Router>
              <Routes>
                <Route path="" element={<DevToolsApp />} />
                <Route path="example" element={<Example />} />
              </Routes>
            </Router>
          </StrictMode>
          
        );
      } else {
        console.log("Root element not found or already has children");
      }
    });
  }
);