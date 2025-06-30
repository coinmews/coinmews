// Type definitions for Google Analytics gtag.js API
interface Window {
  dataLayer: any[];
  gtag: (
    command: 'config' | 'event' | 'js' | 'set' | 'consent',
    targetId: string,
    config?: {
      [key: string]: any;
    }
  ) => void;
}

declare function gtag(
  command: 'config' | 'event' | 'js' | 'set' | 'consent',
  targetId: string,
  config?: {
    [key: string]: any;
  }
): void;
