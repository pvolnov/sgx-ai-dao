/// <reference types="vite/client" />

declare module "*.svg?react" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

var image: (src: string) => string;

var turnstile: any;

interface Window {
  Telegram: { WebApp: any };
}
