<template>
  <div id="app">
    <BookEvent />
    <ShowEvents />
  </div>
</template>

<script>
import BookEvent from "./components/BookEvent.vue";
import ShowEvents from "./components/ShowEvents.vue";

export default {
  name: "App",
  components: {
    BookEvent,
    ShowEvents,
  },
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  color: #333;
  padding: 20px;
}
</style>
