<template>
  <!-- 筛选 -->
  <div class="header-tools-view">
    <p class="main-title">菜单管理</p>
    <div class="form-view">
      <el-row :gutter="10">
        <el-col :span="4"><el-input v-model="query.name" @keyup.enter="loadMenuList(true)" placeholder="请输入菜单名称"/></el-col>
        <el-col :span="20">
          <el-space :size="20">
            <el-button @click="loadMenuList(true)">查询</el-button>
            <el-button type="primary" plain @click="handleAddMenu">新增</el-button>
          </el-space>
        </el-col>
      </el-row>
    </div>
  </div>

  <!-- 菜单列表 -->
  <el-table class="table-view" :data="menuData.list" empty-text="暂时没有数据" border>
    <el-table-column prop="name" label="名称" width="180" />
    <el-table-column prop="parent" label="父级菜单">
      <template #default="scope">
        {{scope.row.parent && scope.row.parent.name || '-'}}
      </template>
    </el-table-column>
    <el-table-column prop="icon" label="图标" width="180">
      <template #default="scope">
        <span class="svg" v-if="scope.row.icon" v-html="scope.row.icon"></span>
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column prop="weight" label="权重" width="180" />
    <el-table-column prop="path" label="路径">
      <template #default="scope">
        {{ menuPath(scope.row) }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" width="180">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        <el-popconfirm 
          title="确定要删除这个菜单项吗？"
          @confirm="handleDelete(scope.$index, scope.row)"
          icon-color="red"
          confirm-button-text="确定"
          cancel-button-text="取消"
          >
          <template #reference>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <!-- dialog -->
  <el-dialog v-model="dialog.visible" :title="dialog.title" :center="true">
    <el-form :model="forms" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="forms.name" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="父级菜单">
        <el-autocomplete v-model="forms.parentName" placeholder="输入父级菜单名称" prefix-icon="Search" 
          :fetch-suggestions="handleQuerySearch"
          @select="handleSelect"
          @blur="handleSelect('')"
          :trigger-on-focus="false"
          value-key="name"
        />
      </el-form-item>
      <el-form-item label="图标">
        <span class="svg" v-if="forms.icon" v-html="forms.icon"></span>
        <el-button type="primary" icon="Picture" size="small" @click="drawer.visible = true"></el-button>
      </el-form-item>
      <el-form-item label="权重">
        <el-input-number v-model="forms.weight" :min="100" :max="1000"/>
      </el-form-item>
      <el-form-item label="路径">
        <el-input v-model="forms.path" placeholder="请输入菜单路径">
          <template #prepend>{{ forms.parentPath }}</template>
        </el-input>
      </el-form-item>
      <div class="forms-btns-view">
        <el-button type="primary" @click="handleCommit">提交</el-button>
        <el-button type="info" @click="dialog.visible = false">取消</el-button>
      </div>
    </el-form>
  </el-dialog>

  <!-- 选择图标 -->
  <svg-select :drawer="drawer" @select="handleSelectSvg"></svg-select>

</template>

<script lang="ts" setup>
import { computed, reactive, ref, toRefs } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import svgSelect from '@/components/svgSelect.vue'

const { proxy } = getCurrentInstance();
const store = useStore()

/** 列表 */
const menuData = reactive({}),
      query = reactive({page: 1, size: 10, name: ''}),
      menuPath = menu => {
        let parentPath = menu.parent && menu.parent.path || ''
        parentPath = parentPath == '/' ? '' : parentPath
        return parentPath + menu.path
      }
const loadMenuList = async (reload = false) => {
  if (reload) {
    query.page = 1
  }
  let result = await proxy.$api_loading.get('/setting/menus', query)
  Object.assign(menuData, result && result.data || {})
}
const handleEdit = async (index, menu) => {
  // forms.value = {...menu}
  let result = await proxy.$api.get(`/setting/menus/detail/${menu._id}`)
  if (!result) return
  const parent = result.data.parent || {}
  const parentPath = parent.path ? (parent.path == '/' ? '/' : parent.path + '/') : '/'
  let paths = result.data.path && result.data.path.split('/')
  const path = paths && paths[paths.length - 1] || ''
  forms.value = {...result.data, path, parentPath, parentName: parent.name || ''}
  
  dialog.title = '修改菜单项'
  dialog.visible = true
},
handleDelete = async (index, menu) => {
  let result = await proxy.$api_loading.delete('/setting/menus/delete', menu)
  if (!result) return
  proxy.$toast(result.message, 'success')
  loadMenuList(true)
}

/** 新增 */
const forms = ref({}),
      dialog = reactive({visible: false, title: ''})
const handleAddMenu = () => {
  dialog.title = '添加菜单'
  dialog.visible = true
  forms.value = {parentPath: '/'}
},
handleCommit = async () => {
  let result = null
  let params = {...forms.value}
  params.path = '/' + (params.path || '')
  
  if (forms.value._id) {
    result = await proxy.$api_loading.put('/setting/menus/edit', params)
  } else {
    result = await proxy.$api_loading.post('/setting/menus/create', params)
  }
  if (!result) return
  proxy.$toast(result.message, 'success')
  loadMenuList(true)
  dialog.visible = false
},
// 远程搜索
handleQuerySearch = async (name, callback) => {
  const result = await proxy.$api.get('/setting/menus/search', { name })
  if (result) callback(result.data)
  else callback([])
},
handleSelect = (menu) => {
  if (!menu) {
    forms.value.parentPath = '/'
    delete forms.value.parent
    return
  }
  let parentPath = menu.path
  parentPath = parentPath ? (parentPath == '/' ? parentPath : parentPath + '/') : '/'
  forms.value.parentPath = parentPath
  forms.value.parent = menu._id
}

/** SVG */
const drawer = reactive({visible: false, title: '选择图标'})
const handleSelectSvg = svg => {
  forms.value.icon = svg.code
  drawer.visible = false
}

/** 钩子 */
onMounted(loadMenuList)
</script>

<style scoped lang="less">
.svg {
  display: inline-flex; align-items: center; margin-right: 10px;
  :deep(svg){width: 20px; height: 20px;}
}

</style>