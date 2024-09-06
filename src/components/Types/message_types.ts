export interface BrowserInfoMessage {
  type: 'BROWSER_INFO';
  payload: string;
}

export interface UrlMessage {
  type: 'URL';
  payload: string;
}

export interface GetBrowserInfoMessage {
  type: 'GET_BROWSER_INFO';
}

export interface GetCurrentUrlMessage {
  type: 'GET_CURRENT_URL';
}

export interface CurrentUrlMessage {
  type: 'CURRENT_URL';
  payload: string;
}

export type Message = 
  | BrowserInfoMessage 
  | UrlMessage 
  | GetBrowserInfoMessage 
  | GetCurrentUrlMessage 
  | CurrentUrlMessage;