import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from 'react';
import { MainPage } from './App.js'
import { TrendingPage } from './trending.js'
import { RegisterPage } from './register.js'
import { ChannelPage } from './channel.js'
import { UploadPage } from './upload.js'
import { WatchPage } from './watch.js'

export default function Routes(){
  return(
    <BrowserRouter>
      <Switch> 
          <Route path='/' exact component={MainPage}></Route>
          <Route path='/trending' exact component={TrendingPage}></Route>
          <Route path='/register' exact component={RegisterPage}></Route>
          <Route path='/channel' exact component={ChannelPage}></Route>
          <Route path='/upload' exact component={UploadPage}></Route>
          <Route path='/watch' exact component={WatchPage}></Route>
          <Route path='/' render={() => <div>404</div>}></Route>
      </Switch>
    </BrowserRouter>
  )
}