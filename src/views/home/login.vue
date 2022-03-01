<template>
  <div class="main-view">
    <el-card class="login-panal" @keydown.enter="onSubmit">
      <h1>博客后台管理系统</h1>
      <el-input
        v-model.trim="forms.username"
        placeholder="输入用户名"
        prefix-icon="User"
        size="large"
        autocomplete="new-username"
        clearable
        autofocus
      ></el-input>
      <el-input
        type="password"
        v-model.trim="forms.password"
        placeholder="输入密码"
        prefix-icon="Lock"
        size="large"
        autocomplete="new-password"
        clearable
      ></el-input>
      <el-button type="primary" @click="onSubmit" size="large">登录</el-button>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive } from "vue";
import { useStore } from "vuex";
import { JWT_TOKEN_KEY } from "@/libs/constant";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Login",
  setup(props, context) {
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();

    const forms = reactive({
      username: "",
      password: "",
    });
    /**
     * Methods
     */
    const onSubmit = async () => {
      if (!forms.username || !forms.password) {
        return proxy.$toast("请输入正确的用户名和密码~");
      }
      const result = await store.dispatch("home/login", forms);
      if (result) {
        proxy.$toast(result.message, "success");
        const { token } = result.data;
        localStorage.setItem(JWT_TOKEN_KEY, token);
        router.replace('/')
      }
    };
    return {
      forms,
      onSubmit,
    };
  },
});
</script>

<style lang="less" scoped>
.main-view {
  width: 100%;
  height: 100%;
  position: absolute;
  background: skyblue;
}
.login-panal {
  width: 320px;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 45%;
  left: 50%;
  padding: 20px;
  h1 {
    font-size: 23px;
    color: #333;
    text-align: center;
    margin-bottom: 30px;
  }
  .el-input {
    margin-top: 14px;
  }
  .el-button {
    width: 100%;
    margin-top: 30px;
  }
}
</style>