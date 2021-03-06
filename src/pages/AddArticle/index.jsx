import React, { useState, useEffect } from 'react'
import { Row, Col ,Input, Select, Button, DatePicker, message } from 'antd'
import axios from 'axios'
import servicePath from '../../config/apiUrl'
import marked from 'marked'

import './style.css'

const { Option } = Select
const { TextArea } = Input

const AddArticle = (props) => {
  const [articleId, setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
  const [articleTitle, setArticleTitle] = useState('')   //文章标题
  const [articleContent , setArticleContent] = useState('')  //markdown的编辑内容
  const [markdownContent, setMarkdownContent] = useState('预览内容') //html内容
  const [introducemd, setIntroducemd] = useState()            //简介的markdown内容
  const [introducehtml, setIntroducehtml] = useState('等待编辑') //简介的html内容
  const [showDate, setShowDate] = useState('')   //发布日期
  const [updateDate, setUpdateDate] = useState() //修改日志的日期
  const [typeInfo ,setTypeInfo] = useState([]) // 文章类别信息
  const [selectedType, setSelectType] = useState(2) //选择的文章类别
  
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
  })

  useEffect(() => {
    getTypeInfo()
    //获得文章ID
    console.log('props', props)
    let tmpId = props.location.search ? props.location.search.split('?')[1].split('=')[1] : null
    console.log('tmpId', tmpId)
    if (tmpId) {
      setArticleId(tmpId)
      getArticleById(tmpId)
    } 
  }, [])

  const getArticleById = (id) => {
    axios({
      url: `${servicePath.detailArticle}/${id}`,
      withCredentials: true,
      header:{ 'Access-Control-Allow-Origin':'*' }
    }).then(res => {
        res = res.data
        if (res.data == "没有登录") {
          props.push('/login/')
        }else{
          setArticleTitle(res.data.title)
          setArticleContent(res.data.article_content)
          let html = marked(res.data.article_content)
          setMarkdownContent(html)
          setIntroducemd(res.data.introduce)
          let tmpInt = marked(res.data.introduce)
          setIntroducehtml(tmpInt)
          setShowDate(res.data.addTime)
          setSelectType(res.data.type_id)
        }
      }
    )
  }

  const getTypeInfo = () => {
    axios({
      method: 'get',
      url: servicePath.getTypeInfo,
      withCredentials: true
    }).then(res => {
        if (res.data.data == "没有登录") {
          localStorage.removeItem('openId')
          props.history.push('/')  
        }else{
          setTypeInfo(res.data.data)
        }
      }
    )
  }

  const changeContent = (e)=>{
    setArticleContent(e.target.value)
    let html = marked(e.target.value)
    setMarkdownContent(html)
  }

  const changeIntroduce = (e)=>{
    setIntroducemd(e.target.value)
    let html = marked(e.target.value)
    setIntroducehtml(html)
  }

  const saveArticle = () => {
    if(!selectedType){
        message.error('必须选择文章类别')
        return false
    }else if(!articleTitle){
        message.error('文章名称不能为空')
        return false
    }else if(!articleContent){
        message.error('文章内容不能为空')
        return false
    }else if(!introducemd){
        message.error('简介不能为空')
        return false
    }else if(!showDate){
        message.error('发布日期不能为空')
        return false
    }
    // {
    //   "title": "我是帅哥",
    //   "type_id": 2,
    //   "introduce": "这是一个postman创建的文章",
    //   "article_content": "爸爸吃酒我吃肉",
    //   "view_count": "291"
    // }
    let dataProps = {}   //传递到接口的参数
    dataProps.type_id = selectedType 
    dataProps.title = articleTitle
    dataProps.article_content = articleContent
    dataProps.introduce =introducemd
    dataProps.addTime = showDate

    if(articleId == 0){
      dataProps.view_count = Math.ceil(Math.random() * 100) + 1000
      axios({
        method: 'post',
        url: servicePath.addArticle,
        data: dataProps,
        withCredentials: true
      }).then(res => {
          if (res.data.status == 200) {
            setArticleId(res.data.data.insertId)
            message.success('文章保存成功')
          } else {
            message.error('文章保存失败');
          }
        }
      )
    } else {
      dataProps.view_count = Math.ceil(Math.random() * 100) + 1000
      dataProps.id = articleId
      axios({
        method: 'post',
        url: servicePath.updateArticle,
        data: dataProps,
        withCredentials: true
      }).then(res => {
          if (res.data.status == 200) {
            setArticleId(res.data.data.insertId)
            message.success('文章更新成功')
          } else {
            message.error('文章更新失败');
          }
        }
      )
    }
  }
  return <div>
    <Row gutter={5}>
      <Col span={18}>
        <Row gutter={10} >
          <Col span={20}>
            <Input
              placeholder="博客标题"
              value={articleTitle}
              size="large"
              onChange={e => { setArticleTitle(e.target.value) }}
            />
          </Col>
          <Col span={4}>
            <Select defaultValue={selectedType} size="large" onChange={setSelectType}>
              {
                typeInfo.map((item, index) => {
                    return (<Option key={index} value={item.id}>{item.typeName}</Option>)
                })
              }
            </Select>
          </Col>
        </Row>
        <br/>
        <Row gutter={10} >
          <Col span={12}>
            <TextArea
              value={articleContent}
              onChange={changeContent} 
              onPressEnter={changeContent}
              className="markdown-content"
              rows={35}
              placeholder="文章内容"
            />
          </Col>
          <Col span={12}>
            <div className="show-html" dangerouslySetInnerHTML={{__html:markdownContent}}></div>
          </Col>
        </Row>  
      </Col>
      <Col span={6}>
        <Row>
          <Col span={24}>
            <Button size="large">暂存文章</Button>&nbsp;
            <Button type="primary" size="large" onClick={saveArticle}>发布文章</Button>
            <br/>
          </Col>
          <Col span={24}>
            <br/>
            <TextArea
              value={introducemd}  
              onChange={changeIntroduce} 
              onPressEnter={changeIntroduce}
              rows={4}
              placeholder="文章简介" />
            <br/><br/>
            <div
              className="introduce-html"
              dangerouslySetInnerHTML = {{__html:'文章简介：'+introducehtml}}></div>
          </Col>
          <Col span={12}>
            <div className="date-select">
              <DatePicker
                onChange={(date, dateString) => setShowDate(dateString)}
                placeholder="发布日期"
                size="large"
              />
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
}

export default AddArticle