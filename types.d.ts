// Minimal ambient declarations to satisfy TS without DOM lib
declare module 'react-dom/client' {
  import * as ReactDOMClient from 'react-dom';
  export = ReactDOMClient;
}

declare const document: any;
