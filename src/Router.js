import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './pages/Login/index'
import AdminIndex from './pages/AdminIndex/index'

const RouterMap = () => {
  return (
    <Router>
      <Route path='/login' exact component={Login} />
      <Route path='/index' component={AdminIndex} />
    </Router>
  )
}

export default RouterMap