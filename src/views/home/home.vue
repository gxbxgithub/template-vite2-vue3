<template>
  <div class="main-view">
    <el-container class="container-view">
      <el-header class="header-view">
        <p class="title">CMS管理系统</p>
        <el-dropdown class="dropdown" placement="bottom" @command="handleCommand">
          <span class="el-dropdown-link">{{ userInfo.name || "匿名用户" }}，欢迎您</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="edit">修改密码</el-dropdown-item>
              <el-dropdown-item command="exit">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside-view">
          <Menu :menus="menus"></Menu>
        </el-aside>
        <el-main class="body-view">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Menu from "./menu.vue";

const store = useStore()
const { proxy } = getCurrentInstance()
const router = useRouter()

const userInfo = computed(() => store.state.home.userInfo)
const handleCommand = command => {
  if (command == "exit") {
    localStorage.clear();
    location.reload();
  } else if (command == "edit") {
    router.push('/setting/editpass')
  }
}

const menus = ref({})
const loadMenus = async () => {
  const result = await proxy.$api_loading.get('/setting/menus_auth');
  if (!result) return
  console.log('获取左侧菜单项：', result.data);
  menus.value = result.data;
}

onMounted(() => {
  loadMenus()
})
</script>

<style scoped lang="less">
.main-view {
  width: 100%;
  height: 100%;
  position: absolute;
}
.container-view {
  height: 100%;
}
.header-view {
  background: rgb(140, 197, 255);
  .title {
    font-size: 24px;
    font-weight: bold;
    line-height: 60px;
    color: #fff;
    display: inline-block;
  }
  .dropdown {
    float: right;
    line-height: 60px;
    color: #fff;
  }
}
.aside-view {
  background: #f2f6fc;
}
</style>