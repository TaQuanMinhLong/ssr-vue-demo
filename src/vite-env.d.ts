/// <reference types="vite/client" />

declare global {
  type TemplateData = {
    /**
     * The template to render
     */
    name: string;
    /**
     * The props to pass to the template
     */
    props: Record<string, PlainObject>;
  };
  interface Window {
    __SSR_DATA__: TemplateData;
  }

  type Primitive = string | number | boolean | null | undefined;
  type PlainObject = {
    [key: string]: Primitive | PlainObject | Array<Primitive | PlainObject>;
  };

  // CSS tracker global variable
  var __vite_css_map: Map<string, string[]>;
}

export type {};
