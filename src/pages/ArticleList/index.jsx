import React, { useState, useEffect} from 'react'
import { List, Row, Col, Modal, message, Button, Popconfirm } from 'antd'
import axios from 'axios'
import moment from 'moment'
import  servicePath  from '../../config/apiUrl'

import './style.css'
const { confirm } = Modal

const ArticleList = (props) => {
  const [list, setList]=useState([])

  const getList = () => {
    axios({
      method: 'get',
      url: servicePath.getArticleList,
      withCredentials: true
    }).then(res => {
        if (res.data.data == "没有登录") {
           props.push('/login')
        } else {
          setList(res.data.list)
        }
      }
    )
  }

  const deleteArticle = (id) => {
    axios({
      method: 'post',
      url: servicePath.deleteArticle,
      data: { id: id },
      withCredentials: true
    }).then(res => {
        if (res.data.data == "没有登录") {
           props.push('/login')
        } else {
          getList()
        }
      }
    )
  }

  //修改文章
  const updateArticle = (id, checked) => {
    props.history.push('/index/add?id='+id)
  }

  useEffect(() => {
    getList()
  }, [])
  

  return <div>
    <List
      header={
        <Row className="list-div">
          <Col span={8}>
            <b>标题</b>
          </Col>
          <Col span={3}>
            <b>类别</b>
          </Col>
          <Col span={3}>
            <b>发布时间</b>
          </Col>
          <Col span={3}>
            <b>集数</b>
          </Col>
          <Col span={3}>
            <b>浏览量</b>
          </Col>
          <Col span={4}>
            <b>操作</b>
          </Col>
        </Row>
      }
      bordered
      dataSource={list}
      renderItem={item => (
        <List.Item>
          <Row className="list-div">
            <Col span={8}>
              {item.title}
            </Col>
            <Col span={3}>
              {item.typeName}
            </Col>
            <Col span={3}>
              {moment(item.addTime).format('YYYY-MM-DD')}
            </Col>
            <Col span={3}>
              共<span>{item.part_count}</span>集
            </Col>
            <Col span={3}>
              {item.view_count}
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={() => updateArticle(item.id)} >修改</Button>&nbsp;
              <Popconfirm placement="top" title={'是否确认删除文章？'} onConfirm={() => deleteArticle(item.id)} okText="确认" cancelText="取消">
                <Button>删除 </Button>
              </Popconfirm>
            </Col>
          </Row>
        </List.Item>
      )}
      />
  </div>
}

export default ArticleList