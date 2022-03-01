<template>
  <div class="header-tools-view">
    <p class="main-title">分类管理</p>
    <div class="form-view">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-space :size="20">
            <el-button type="primary" plain @click="dialog.visible = true">新增</el-button>
          </el-space>
        </el-col>
      </el-row>
    </div>
  </div>

  <!-- 分类列表 -->
  <el-table class="table-view" :data="typesList" empty-text="暂时没有数据" border>
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="shortName" label="路径名称" />
    <el-table-column prop="count" label="文章数量" />
    <el-table-column align="center" label="操作" width="180">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- dialog -->
  <el-dialog v-model="dialog.visible" :title="dialog.title" :center="true">
    <el-form :model="forms" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model.trim="forms.name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="路径名称">
        <el-input v-model.trim="forms.shortName" placeholder="请输入路径名称（小写英文）"></el-input>
      </el-form-item>
      <div class="forms-btns-view">
        <el-button type="primary" @click="handleCommit">提交</el-button>
        <el-button type="info" @click="dialog.visible = false">取消</el-button>
      </div>
    </el-form>
  </el-dialog>

</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance()
const store = useStore()

const dialog = reactive({visible: false, title: ''})
const forms = ref({})
const typesList = computed(() => store.state.article.types)
const handleCommit = async () => {
  let params = {...forms.value}
  if (!params.name) return proxy.$toast('请填写分类的名称~')
  if (!params.shortName) return proxy.$toast('请填写路径名称~')
  params.shortName = params.shortName.toLowerCase()
  let result = null
  if (params._id) {
    result = await proxy.$api_loading.put('/type/edit', params)
  } else {
    result = await proxy.$api_loading.post('/type/create', params)
  }
  if (!result) return
  loadTypesList(true)
  dialog.visible = false
}
const handleEdit = async (index, type) => {
  const result = await proxy.$api.get(`/type/detail/${type._id}`)
  if (!result) return
  forms.value = result.data
  dialog.title = '修改分类'
  dialog.visible = true
}
const loadTypesList = reload => store.dispatch('article/getTypesList', reload)

onMounted(() => {
  loadTypesList()
})
</script>

<style scoped>

</style>