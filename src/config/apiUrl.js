let ipUrl = 'http://47.99.134.126:7001/admin/'

let servicePath = {
  checkLogin: `${ipUrl}login`, // 登录接口
  getTypeInfo: `${ipUrl}type_info`,  //  获得文章类别信息
  getArticleList: `${ipUrl}get_article_list`, // 获取列表
  addArticle: `${ipUrl}add_article`, // 添加文章
  updateArticle: `${ipUrl}update_article`, // 更新文章
  deleteArticle: `${ipUrl}delete_article`, // 删除文章
  detailArticle: `${ipUrl}detail` // 获取文章详情
}

export default servicePath