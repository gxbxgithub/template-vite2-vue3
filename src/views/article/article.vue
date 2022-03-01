<template>
  <!-- 筛选 -->
  <div class="header-tools-view">
    <p class="main-title">文章管理</p>
    <div class="form-view">
      <el-row :gutter="10">
        <el-col :span="4"><el-input v-model="query.title" @keyup.enter="loadArticleList(true)" placeholder="请输入文章标题"/></el-col>
        <el-col :span="4">
          <el-select v-model="query.type" placeholder="选择文章分类" @change="loadArticleList(true)">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="type in types"
              :key="type._id"
              :label="type.name"
              :value="type._id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="query.publish" placeholder="选择文章状态" @change="loadArticleList(true)">
            <el-option label="全部" value=""></el-option>
            <el-option label="已发布" value="1"></el-option>
            <el-option label="未发布" value="0"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-space :size="20">
            <el-button @click="loadArticleList(true)">查询</el-button>
            <el-button type="primary" plain @click="handleAddArticle">新增</el-button>
            <el-button type="primary" plain @click="handlePushArticle">SEO推送</el-button>
          </el-space>
        </el-col>
      </el-row>
    </div>
  </div>

  <!-- 菜单列表 -->
  <el-table class="table-view" :data="articleData.list" empty-text="暂时没有数据" border>
    <el-table-column prop="title" label="标题">
      <template #default="scope">
        <a class="title-link" :href="'https://guoxb.com/article/' + scope.row._id + '.html'" target="__blank">{{ scope.row.title }}</a>
      </template>
    </el-table-column>
    <el-table-column prop="typeName" label="分类" width="160" />
    <el-table-column prop="readCount" label="阅读数" width="160" />
    <el-table-column prop="publish" label="状态" width="160">
      <template #default="scope">
        <el-tag :type="scope.row.publish == 1 ? 'success' : 'warning'">{{ scope.row.publish == 1 ? '已发布' : '未发布' }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="createAt" label="发布时间" width="160">
      <template #default="scope">
        {{ $dayjs(scope.row.createAt).format('YYYY-MM-DD') }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" width="230">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        <el-popconfirm
          :title="'确定要' + (scope.row.publish == 1 ? '下架' : '发布') + '这篇文章吗？'"
          icon-color="red"
          @confirm="handleEdit(scope.$index, scope.row, 'publish')"
          :confirm-button-text="scope.row.publish == 1 ? '下架' : '发布'"
          cancel-button-text="取消"
        >
          <template #reference>
            <el-button size="small" :type="scope.row.publish == 1 ? 'warning' : 'success'" plain>{{ scope.row.publish == 1 ? '下架' : '发布' }}</el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm 
          title="确定要删除这篇文章吗？"
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

</template>

<script lang="ts" setup>
import { computed, reactive } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const { proxy } = getCurrentInstance()
const router = useRouter()
const store = useStore()

const articleData = reactive({})
const query = reactive({page: 1, size: 10, title: '', type: '', publish: ''})
const types = computed(() => store.state.article.types)
const handleEdit = async (index, article, action) => {
  if (!action) return router.push(`/content/article/edit?articleId=${article._id}`)
  const result = await proxy.$api_loading.put('/article/publish', {_id: article._id, publish: article.publish == 1 ? 0 : 1})
  if (!result) return
  proxy.$toast(result.message, 'success')
  loadArticleList(true)
},
handleDelete = async (index, article) => {
  console.log(article);
  
  const result = await proxy.$api_loading.delete('/article/delete', article)
  if (!result) return
  proxy.$toast(result.message, 'success')
  loadArticleList(true)
},
handleAddArticle = () => {
  router.push('/content/article/edit')
},
handlePushArticle = async () => {
  const result = await proxy.$api_loading.post('/article/push', {})
  if (!result) return
  proxy.$toast(result.message, 'success')
},
loadArticleList = async reload => {
  if (reload) query.page = 1
  let result = await proxy.$api_loading.get('/article/list', query)
  if (!result) return
  Object.assign(articleData, result.data)
}

onMounted(() => {
  store.dispatch('article/getTypesList')
  loadArticleList()
})
</script>

<style scoped lang="less">
.table-view{
  .title-link{
    color: #333;
  }
}
</style>