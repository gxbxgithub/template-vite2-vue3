<template>
  <el-menu class="menu-view" 
    :unique-opened="true" 
    :router="true"
    :default-active="$route.path"
    >
    <template v-for="(menu, index) in menus" :key="menu._id">

      <sub-menu :menu="menu" v-if="menu.child"></sub-menu>

      <el-menu-item :index="menu.path" v-else>
        <span>{{ menu.name }}</span>
      </el-menu-item>

    </template>
  </el-menu>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import SubMenu from './submenu.vue'

defineProps(['menus'])
</script>

<style lang="less" scoped>
.svg {
  display: inline-flex; align-items: center; margin-right: 10px;
  :deep(svg){width: 20px; height: 20px;}
}
</style>