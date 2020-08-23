import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'
import { AppBar } from './components'
import { Drive, Login, ForgotPassword } from './scenes'

function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <AppBar />

        <Switch>
          <Route exact path='/'>
            <Login />
          </Route>
          <Route path='/drive'>
            <Drive />
          </Route>
          <Route exact path='/forgot-password'>
            <ForgotPassword />
          </Route>
          <Route path='*'>
            <Redirect to='/' />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  )
}

export default App
