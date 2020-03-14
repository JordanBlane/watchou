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

    this.Init.bind(this)
    this.Init()

  }
  Init = () => {
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
            var d = response.data.data.data
            d = d.replace(/[★]/g,'/')
            d = d.replace(/[☆]/g,'+')
            var b = cryptoJs.AES.decrypt(d,process.env.REACT_APP_SECRET_TOKEN_CODE.toString())
            var dec = JSON.parse(b.toString(cryptoJs.enc.Utf8))
            console.log(dec.data[0])
            //console.log(response.data.data.video)
            document.getElementById('videoTitle').innerHTML = dec.data[0].videoname
            document.getElementById('videoDes').innerHTML = dec.data[0].videodes
            document.getElementById('videoSource').src = `data:video/${dec.data[0].videoext};base64,${response.data.data.video}`
            document.getElementById('videoPlayer').play()
          })
        }
        else{
          //ERROR NO VIDEO PICKED
        }
      })
    }
  }


  loadvideo = () => {

  }

  render(){
    return(
    <div className="watchWrapper">
      <h1 id='videoTitle' className="videoTitle"></h1>
      <video id='videoPlayer' className="videoPlayer" autoplay controls>
        <source id='videoSource' autoplay></source>
      </video>
      <p id='videoDes' className="videoDes"></p>
    </div>
    )
  }
}