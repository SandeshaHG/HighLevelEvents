import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";

const app = createApp(App);

app.use(store); // Use the store with the application instance

app.mount("#app");
