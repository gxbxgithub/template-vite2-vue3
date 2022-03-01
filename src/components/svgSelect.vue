<template>
  <!-- drawer -->
  <el-drawer v-model="drawer.visible" direction="rtl">
    <template #title>
      <div class="main-title">
        <p>{{ drawer.title }}</p>
        <el-button type="primary" icon="Plus" size="small" circle @click="dialogVisible = true"></el-button>
      </div>
    </template>

    <!-- list -->
    <el-input prefix-icon="Search" placeholder="请输入名称" v-model="search" clearable debounce></el-input>
    <div class="infinite-list-wrapper" style="overflow: auto;">
      <ul class="svg-list" infinite-scroll-disabled="disabled">
        <li v-for="svg in svgSearchList" @click="$emit('select', {...svg})">
          <div class="svg" v-html="svg.code"></div>
          <p>{{ svg.name }}</p>
        </li>
      </ul>
    </div>

    <!-- dialog -->
    <el-dialog v-model="dialogVisible" title="添加图标" :center="true">
      <el-form v-model="forms" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model.trim="forms.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="SVG代码">
          <el-input v-model.trim="forms.code" placeholder="请输入SVG代码" clearable></el-input>
        </el-form-item>
        <div class="forms-btns-view">
          <el-button type="primary" @click="handleCommit">提交</el-button>
          <el-button type="info" @click="dialogVisible = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>

  </el-drawer>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, reactive, ref } from "@vue/runtime-core";

defineProps(["drawer"]);
defineEmits(["select"])
const { proxy } = getCurrentInstance()

const dialogVisible = ref(false)
const forms = ref({})
const handleCommit = async () => {
  const { name, code } = forms.value
  if (!name || !code) {
    return proxy.$toast('请将图标信息补充完整~')
  }
  const result = await proxy.$api_loading.post('/setting/svg/create', forms.value)
  if (result) {
    proxy.$toast(result.message, 'success')
    loadSvgList()
  }
}

const svgList = ref([])
const search = ref('')
const svgSearchList = computed(() => {
  return svgList.value.filter(svg => svg.name.toLowerCase().includes(search.value.toLowerCase()))
})
const loadSvgList = async () => {
  const result = await proxy.$api_loading.get('/setting/svg')
  if (result) {
    svgList.value = result.data
  }
}

onMounted(() => {
  loadSvgList()
})

</script>

<style scoped lang="less">
.main-title {
  font-size: 24px;
  color: #333;
  line-height: 34px;
  font-weight: bold;
  display: flex;
  align-items: center;
  p{margin-right: 10px;}
}
.svg-list{
  display: flex; flex-wrap: wrap;
  li{
    width: 20%; padding: 10px 0; cursor: pointer;
    &:hover{background: #dcdfe6;}
    :deep(svg){width: 20px; height: 20px; margin: 0 auto; display: block;}
    p{font-size: 12px; color: #333; line-height: 20px; text-align: center; margin-top: 10px;}
  }
}
.infinite-list-wrapper{
  margin-top: 20px;
}
</style>