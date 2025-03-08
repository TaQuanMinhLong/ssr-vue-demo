import { renderToNodeStream } from "vue/server-renderer";
import { createApp } from "./main";

export const renderHTMLStream = (data?: TemplateData) => {
  console.log("[server] template data", data);
  return renderToNodeStream(createApp(data));
};
