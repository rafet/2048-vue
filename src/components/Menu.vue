<template>
  <div>
    <p style="font-size:14px;float:right;cursor:pointer">
      <span @click="onClose">
        Close
      </span>
    </p>
    <h5 style="color:white">New Game</h5>
    <a-row type="flex" :gutter="10">
      <a-col :span="12" v-for="(item, index) in sizes" :key="index">
        <a-button @click="handleClick(item)" class="size-button"
          >{{ item }} x {{ item }}</a-button
        >
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      sizes: [3, 4, 5, 6]
    };
  },
  methods: {
    handleClick(val) {
      this.$emit("input", val);
      this.$emit("select-new-game");
    },
    onClose() {
      this.$emit("close");
    }
  }
};
</script>
<style scoped>
.label {
  font-size: 14px;
}
.size-button {
  width: 100%;
  height: 100px;
  font-size: 24px;
  margin-bottom: 10px;
}
</style>
