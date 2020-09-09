import React from 'react';
import './CSS/watch.css'
import Axios from 'axios';
var cryptoJs = require('crypto-js');
const queryString = require('query-string');
const hostname = window.location.hostname;


export class WatchPage extends React.Component {

  constructor(props){
    super(props);

    this.state={
      user:''
    }

    this.loadvideo.bind(this)
    this.Init.bind(this)
    this.Init()
    this.loadvideo()

  }
  Init = () => {
    console.log('a')
    let token = decodeURIComponent(document.cookie);
    if(token){
      token = token.split('=');
      token = token[1];
      var message = {token:process.env.REACT_APP_SECRET_TOKEN_CODE,data:token}
      var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.REACT_APP_SECRET_TOKEN_CODE).toString();
      cipher = cipher.replace(/[/]/g,'★')
      cipher = cipher.replace(/[+]/g,'☆')
      fetch(`http://${hostname}:4000/api/getuser?data=${cipher}`)
      .then(response => response.json())
      .then(data => {
        var d = data.data
        d = d.replace(/[★]/g,'/')
        d = d.replace(/[☆]/g,'+')
        var b = cryptoJs.AES.decrypt(d,process.env.REACT_APP_SECRET_TOKEN_CODE.toString())
        var dec = JSON.parse(b.toString(cryptoJs.enc.Utf8))
        this.setState({user : dec.user[0]})
      })
    }
  }


  loadvideo = () => {
    var query = queryString.parse(window.location.search);
    console.log(query)
    if(query.video)
    {
      var message = {token:process.env.REACT_APP_SECRET_TOKEN_CODE,uid:query.video}
      var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.REACT_APP_SECRET_TOKEN_CODE).toString();
      cipher = cipher.replace(/[/]/g,'★')
      cipher = cipher.replace(/[+]/g,'☆')
      Axios.get(`http://${hostname}:4000/api/getvideobyuid?data=${cipher}`)
      .then(response => {
        // return console.log(response)
        var d = response.data.data.data
        d = d.replace(/[★]/g,'/')
        d = d.replace(/[☆]/g,'+')
        var b = cryptoJs.AES.decrypt(d,process.env.REACT_APP_SECRET_TOKEN_CODE.toString())
        var dec = JSON.parse(b.toString(cryptoJs.enc.Utf8))
        document.getElementById('videoTitle').innerHTML = dec.data[0].videoname
        document.getElementById('videoDes').innerHTML = dec.data[0].videodes
        document.getElementById('videoPlayer').type = `video/${dec.data[0].videoext}`
        var message = {token:process.env.REACT_APP_SECRET_TOKEN_CODE,uid:dec.data[0].uid}
        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.REACT_APP_SECRET_TOKEN_CODE).toString();
        cipher = cipher.replace(/[/]/g,'★')
        cipher = cipher.replace(/[+]/g,'☆')
        document.getElementById('videoPlayer').src = `http://${hostname}:4000/api/video?data=${cipher}`
        document.getElementById('videoPlayer').poster = `data:image/${dec.data[0].thumext};base64,${response.data.data.thum}`
        document.getElementById('videotime').value = 0
        document.getElementById('videoPlayer').play();
        document.getElementById('videoPlayer').ontimeupdate = () => {this.updatevideotime()}
        document.getElementById('videoPlayer').volume = document.getElementById('videovolume').value
      })
    }
    else{
      //ERROR NO VIDEO PICKED
    }
  }


  inputhandler = () => {
    document.getElementById('videotime').max = document.getElementById('videoPlayer').duration
    document.getElementById('videoPlayer').currentTime = document.getElementById('videotime').value
  }

  handlePlay = (e) => {
    console.log(e)
    if(e == '1'){
      var isPaused = document.getElementById('videoPlayer').paused 
      if(isPaused){
        //SHOW PLAY SYMBOLL
        document.getElementById('playbutton').innerHTML = '❚❚'
        document.getElementById('videoPlayer').play()
      }else{
        document.getElementById('playbutton').innerHTML = '►'
        document.getElementById('videoPlayer').pause()
      }
    }
    else{
      var isPaused = document.getElementById('videoPlayer').paused 
      if(isPaused){
        //SHOW PAUSE SYMBOLL
        document.getElementById('playbutton').innerHTML = '❚❚'
        document.getElementById('videoPlayer').play()
      }else{
        document.getElementById('playbutton').innerHTML = '►'
        document.getElementById('videoPlayer').pause()
      }
    }
  }

  handlevolume = () => {
    document.getElementById('videoPlayer').volume = document.getElementById('videovolume').value
  }

  updatevideotime = () => {
    document.getElementById('videotime').max = document.getElementById('videoPlayer').duration
    document.getElementById('videotime').value = document.getElementById('videoPlayer').currentTime

    //Time left display
    var duration = document.getElementById('videoPlayer').duration
    var TimeLeft = duration - document.getElementById('videoPlayer').currentTime

    var minutes = Math.floor(Math.round(TimeLeft) / 60)
    var secconds = Math.round(TimeLeft) - minutes * 60;

    if(secconds < 10){
      document.getElementById('videoDuration').innerHTML = `-${minutes}:0${secconds}`
    }
    else{
      document.getElementById('videoDuration').innerHTML = `-${minutes}:${secconds}`
    }
    
    //currentTime Display
    var minutes_ = Math.floor(Math.round(document.getElementById('videoPlayer').currentTime) / 60)
    var secconds_ = Math.round(document.getElementById('videoPlayer').currentTime) - minutes_ * 60;
    if(secconds_ < 10){
      document.getElementById('videoCurrentTime').innerHTML = `${minutes_}:0${secconds_}`
    }
    else{
      document.getElementById('videoCurrentTime').innerHTML = `${minutes_}:${secconds_}`
    }
  }


  render(){
    return(
    <div className="watchWrapper">
      <div className="leftScreen">
        <div className="videoContainer">
          <video id='videoPlayer' className="videoPlayer" onClick={()=>{this.handlePlay('1')}}>
            
          </video>
          <div className="videoControlsHover">
          <div className="videoControls">
            <button className="videobutton" id='playbutton' onClick={()=>{this.handlePlay('2')}}>►</button>
            <p id='videoCurrentTime'>0:00</p>
            <input type="range" min="0" max="100" id="videotime" className="videotime" onChange={()=>{this.inputhandler()}} />
            <p id='videoDuration'>0:00</p>
            <input type="range" min="0" max="0.4" id="videovolume" className="videovolume" step="0.01" onChange={()=>{this.handlevolume()}} />
          </div>
          </div>
        </div>
        <div className="aboutVideo">
          <div className="topAboutDiv">
            <h1 id='videoTitle' className="videoTitle"></h1>
          </div>
          <hr className="breaker" />
          <p id='videoDes' className="videoDes"></p>
        </div>
      </div>
      {/* <button onClick={()=>{        console.log(document.getElementById('videoPlayer').duration)}}>asd</button> */}
      <div className="rightScreen">
        <div className="sidebarDiv" id='sidebarDiv'>
        </div>
      </div>
    </div>
    )
  }
}