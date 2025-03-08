import { createSSRApp } from "vue";
import App from "./app.vue";

import HelloWorld from "./templates/hello-world.vue";
import HelloWorld2 from "./templates/hello-world-2.vue";

export const createApp = (data?: TemplateData) => {
  const app = createSSRApp(App, data);
  // Register templates here
  app.component("HelloWorld", HelloWorld);
  app.component("HelloWorld2", HelloWorld2);
  return app;
};
