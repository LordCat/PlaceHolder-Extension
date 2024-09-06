import browser from 'webextension-polyfill';
import { Message, UrlMessage, GetCurrentUrlMessage, CurrentUrlMessage } from '../Types/message_types';

const tabUrls = new Map<number, string>();

export function urlMessage_Handler() {
  console.log('Message handler initialized');

  browser.runtime.onMessage.addListener((message: unknown, sender, sendResponse) => {
    if (typeof message === 'object' && message !== null && 'type' in message) {
      const typedMessage = message as Message;
      
      if (typedMessage.type === 'URL' && sender.tab && sender.tab.id) {
        const urlMessage = typedMessage as UrlMessage;
        handleUrlMessage(sender.tab.id, urlMessage.payload);
      }

      if (typedMessage.type === 'GET_CURRENT_URL') {
        getCurrentTabUrl().then(url => {
          const response: CurrentUrlMessage = { type: 'CURRENT_URL', payload: url };
          sendResponse(response);
        });
        return true; // Indicates we wish to send a response asynchronously
      }
    }
  });
}

function handleUrlMessage(tabId: number, url: string) {
  tabUrls.set(tabId, url);
  console.log(`URL updated for tab ${tabId}: ${url}`);
}

async function getCurrentTabUrl(): Promise<string> {
  const tabs = await browser.tabs.query({active: true, currentWindow: true});
  if (tabs[0] && tabs[0].id) {
    if (tabUrls.has(tabs[0].id)) {
      return tabUrls.get(tabs[0].id) || 'Unknown URL';
    } else {
      return tabs[0].url || 'Unknown URL';
    }
  }
  return 'Unknown URL';
}