<template>
  <div class="main-view">
    404 This Page Not Found.
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NotFound",
});
</script>

<style lang="less" scoped>
.main-view {
  font-size: 20px;
  color: #333;
  line-height: 80px;
}
</style>