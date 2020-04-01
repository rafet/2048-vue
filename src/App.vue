<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
import Home from "./components/Home.vue";

export default {
  components: {
    Home
  },
  created() {
    if (!this.$localStorage.get("best")) this.$localStorage.set("best", 0);
  }
};
</script>
