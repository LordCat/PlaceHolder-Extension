import browser from 'webextension-polyfill';
import { getCurrentURL } from './components/Content/getCurrent_URL';

getCurrentURL();
browser.runtime.sendMessage({ type: 'URL', payload: window.location.href });

// You can add more initialization logic here if need