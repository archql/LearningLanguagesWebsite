export {};

declare global {
  interface Window {
    __coverage__?: unknown;
  }
}