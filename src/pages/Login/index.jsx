import React, { useState } from 'react'
import { Card, Input, Icon, Spin, Button, message } from 'antd'
import axios from 'axios'
import servicePath from '../../config/apiUrl'
import './style.css'

const Login = (props) => {
  const [ userName, setUserName ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const checkLogin = () => {
    setLoading(true)
    if(!userName){
      message.error('用户名不能为空')
      return false
    }else if(!password){
      message.error('密码不能为空')
      return false
    }
    let dataProps = {
      'userName':userName,
      'password':password
    }
    axios({
        method: 'post',
        url: servicePath.checkLogin,
        data: dataProps,
        withCredentials: true
    }).then(
      res=>{
        setLoading(false)
        if(res.data.data == '登录成功'){
            localStorage.setItem('openId',res.data.openId)
            props.history.push('/index')
        }else{
            message.error('用户名密码错误')
        }
      }
    )
  }

  return <div className='login-container'>
    <Spin tip='Loading...' spinning={loading}>
      <Card title='陈尼克博客系统' bordered={true} style={{ width: 400 }}>
        <Input
          id='userName'
          size='large'
          placeholder='请输入用户名'
          prefix={<Icon type='user' />}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        <Input
          id='password'
          size='large'
          placeholder='请输入密码'
          prefix={<Icon type='lock' />}
          value={password}
          type='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <br/>
        <br/>
        <Button block type='primary' size='large' onClick={checkLogin}>提交</Button>
      </Card>
    </Spin>
  </div>
}

export default Login