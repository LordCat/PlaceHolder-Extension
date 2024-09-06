import browser from 'webextension-polyfill';
import { Message, BrowserInfoMessage } from '../Types/message_types';

let cachedBrowserInfo: string | null = null;

export function Hello_World() {
  console.log('Background script initialized');

  // Get and cache browser info on initialization
  getBrowserInfo().then(info => {
    cachedBrowserInfo = info;
    console.log('Browser info cached:', cachedBrowserInfo);
  });

  browser.runtime.onMessage.addListener((message: unknown, sender, sendResponse) => {
    if (typeof message === 'object' && message !== null && 'type' in message) {
      const typedMessage = message as Message;
      if (typedMessage.type === 'GET_BROWSER_INFO') {
        if (cachedBrowserInfo) {
          sendResponse({ type: 'BROWSER_INFO', payload: cachedBrowserInfo } as BrowserInfoMessage);
        } else {
          getBrowserInfo().then(browserInfo => {
            cachedBrowserInfo = browserInfo;
            sendResponse({ type: 'BROWSER_INFO', payload: browserInfo } as BrowserInfoMessage);
          });
        }
        return true; // Indicates we wish to send a response asynchronously
      }
    }
  });
}

export function getBrowserInfo(): Promise<string> {
  // Check if getBrowserInfo is available (Firefox)
  if (typeof browser.runtime.getBrowserInfo === 'function') {
    return browser.runtime.getBrowserInfo()
      .then(info => `${info.name} ${info.version}`);
  } else {
    // Fallback for Chrome and other browsers
    return new Promise(resolve => {
      const userAgent = navigator.userAgent;
      if (userAgent.includes("Chrome")) {
        resolve("Chrome");
      } else if (userAgent.includes("Firefox")) {
        resolve("Firefox");
      } else {
        resolve("Unknown Browser");
      }
    });
  }
}
