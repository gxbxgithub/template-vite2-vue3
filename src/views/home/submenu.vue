<template>
  <el-sub-menu :index="menu.path">
  
    <template #title>
      <span class="svg" v-if="menu.icon" v-html="menu.icon"></span>
      <span>{{ menu.name }}</span>
    </template>
    
    <template v-for="(subMenu, index) in menu.child" :key="subMenu._id">

      <sub-menu :menu="subMenu" v-if="subMenu.child"></sub-menu>

      <el-menu-item :index="menu.path + subMenu.path" v-else>
        <span>{{ subMenu.name }}</span>
      </el-menu-item>

    </template>

  </el-sub-menu>
</template>

<script lang="ts">
export default {
  name: "SubMenu",
};
</script>
<script lang="ts" setup>
defineProps(["menu"]);
</script>

<style lang="less" scoped>
.svg {
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
  :deep(svg) {
    width: 20px;
    height: 20px;
  }
}
</style>