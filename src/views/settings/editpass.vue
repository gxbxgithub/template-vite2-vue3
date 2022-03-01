<template>
  <!-- 筛选 -->
  <div class="header-tools-view">
    <p class="main-title">修改密码</p>
  </div>

  <div class="forms-view">
    <el-form :model="forms" label-width="60px">
      <el-form-item label="旧密码">
        <el-input v-model.trim="forms.oldpass" type="password" placeholder="请输入旧密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model.trim="forms.newpass" type="password" placeholder="请输入新密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model.trim="forms.surepass" type="password" placeholder="确认新密码" show-password></el-input>
      </el-form-item>
      <div class="forms-btns-view">
        <el-button type="primary" @click="handleCommit">确认</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "@vue/reactivity";
import { getCurrentInstance } from "@vue/runtime-core";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance()
const router = useRouter()

const forms = ref({})
const handleCommit = async () => {
  const {oldpass, newpass, surepass} = forms.value
  
  if (!oldpass || !newpass || !surepass) {
    return proxy.$toast('请将信息填写完整~')
  }
  const result = await proxy.$api_loading.put('/user/edit/password', forms.value)
  if (result) {
    proxy.$toast(result.message, 'success')
    setTimeout(() => {
      localStorage.clear();
      location.reload();
    }, 1500)
  }
}
</script>

<style scoped lang="less">
.forms-view{
  width: 30%; min-width: 360px; margin: 0 auto;
}
</style>