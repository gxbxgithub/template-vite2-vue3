<template>
  <div class="header-tools-view">
    <p class="main-title">文章编辑</p>
  </div>

  <div class="forms-view">
    <el-form :model="forms" label-width="50px">
      <el-form-item label="标题">
        <el-input v-model.trim="forms.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="forms.type" placeholder="选择文章分类">
          <el-option
            v-for="type in types"
            :key="type._id"
            :label="type.name"
            :value="type._id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="forms.createAt" type="date" placeholder="选择文章发布日期" />
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="forms.intro" type="textarea" placeholder="请输入文章简介" :rows="3"></el-input>
      </el-form-item>

      <mavon-editor 
        v-model="forms.content" 
        :tabSize="2" 
        :html="false"
        @save="handleCommit(0, true)"
        ref="md"
        @imgAdd="handleUploadImg"
      />
      
      <div class="forms-btns-view">
        <el-button v-if="forms._id" type="primary" @click="handleCommit()">更新文章</el-button>
        <template v-else>
          <el-button type="primary" @click="handleCommit(1)">保存并发布</el-button>
          <el-button type="info" @click="handleCommit()">保存为草稿</el-button>
        </template>
      </div>
    </el-form>
  </div>

</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "@vue/reactivity";
import { getCurrentInstance, onMounted } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance()
const store = useStore()
const router = useRouter()
const route = useRoute()

const forms = ref({})
const types = computed(() => store.state.article.types)

const handleCommit = async (publish, save) => {
  let params = {...forms.value}
  if (!params.title || !params.type || !params.content) return proxy.$toast('请将信息填写完成~')
  let result = null

  if (params._id) {
    result = await proxy.$api_loading.put('/article/edit', params)
  } else {
    params.publish = publish
    result = await proxy.$api_loading.post('/article/create', params)
  }
  if (!result) return
  proxy.$toast(result.message, 'success')
  if (save) return
  router.replace('/content/article')
}
const handleUploadImg = async (pos, file) => {
  let formdata = new FormData()
  formdata.append('file', file)
  const result = await proxy.$api.post('/system/upload', formdata)
  if (!result) return
  proxy.$refs.md.$img2Url(pos, result.data);
}

onMounted(async () => {
  // 加载分类
  store.dispatch('article/getTypesList')
  // 加载文章信息
  const articleId = route.query.articleId
  if (articleId) {
    const result = await proxy.$api_loading.get(`/article/detail/${articleId}`)
    if (!result) return
    forms.value = result.data
  }
})

</script>

<style scoped lang="less">
.forms-btns-view{
  margin-top: 20px;
}
</style>