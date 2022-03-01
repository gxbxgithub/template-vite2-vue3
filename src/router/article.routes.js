const Article = () => import('@views/article/article.vue')
const ArticleEdit = () => import("@views/article/articleEdit.vue")
const TypeList = () => import('@views/article/type.vue')

const routes = [
  { path: '/content/article', name: 'ArticleList', component: Article },
  { path: '/content/article/edit', name: 'ArticleEdit', component: ArticleEdit },
  { path: '/content/type', name: 'TypeList', component: TypeList },
]

export default routes