import browser from 'webextension-polyfill';
import { UrlMessage, GetBrowserInfoMessage, BrowserInfoMessage } from '../Types/message_types';

export function getCurrentURL() {
  console.log('Content script initialized');

  const currentUrl = window.location.href;
  const urlMessage: UrlMessage = {
    type: 'URL',
    payload: currentUrl
  };

  // Send the current URL to the background script
  browser.runtime.sendMessage(urlMessage);

  // Request browser info from the background script
  const getBrowserInfoMessage: GetBrowserInfoMessage = { type: 'GET_BROWSER_INFO' };
  browser.runtime.sendMessage(getBrowserInfoMessage)
    .then((response: unknown) => {
      if (typeof response === 'object' && response !== null && 'type' in response) {
        const typedResponse = response as BrowserInfoMessage;
        if (typedResponse.type === 'BROWSER_INFO') {
          console.log(`Running in: ${typedResponse.payload}`);
        }
      }
    })
    .catch(error => {
      console.error('Error getting browser info:', error);
    });
}