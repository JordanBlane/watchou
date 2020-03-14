import React from 'react';
import './CSS/channel.css'
var cryptoJs = require('crypto-js');
const queryString = require('query-string');
const hostname = window.location.hostname;


export class ChannelPage extends React.Component {

  constructor(props){
    super(props);

    this.state={
        user:{},
        channel:''
    }

    this.Init.bind(this);
    this.Init();

  }


  Init = () => {
    //if user is logged in redirect
    let token = decodeURIComponent(document.cookie);
    if(token){
      token = token.split('=');
      token = token[1];
      console.log(token)
      var message = {data:token,token:process.env.REACT_APP_SECRET_TOKEN_CODE}
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
        console.log(dec)
        this.setState({user : dec.user})
        var query = queryString.parse(window.location.search);
        if(query.channel)
        {
            var message = {data:query.channel,token:process.env.REACT_APP_SECRET_TOKEN_CODE}
            var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.REACT_APP_SECRET_TOKEN_CODE).toString();
            cipher = cipher.replace(/[/]/g,'★')
            cipher = cipher.replace(/[+]/g,'☆')
            fetch(`http://${hostname}:4000/api/getchannel?data=${cipher}`)
            .then(response => response.json())
            .then(data => {
                var d = data.data
                d = d.replace(/[★]/g,'/')
                d = d.replace(/[☆]/g,'+')
                var b = cryptoJs.AES.decrypt(d,process.env.REACT_APP_SECRET_TOKEN_CODE.toString())
                var dec = JSON.parse(b.toString(cryptoJs.enc.Utf8))
                console.log(dec)
            })
        }
        else
        {
          this.setState({channel : this.state.user})
        }
      })
    }
  }


  render(){
    return(
        <div className="channelPageWrapper">

        </div>
    )
  }
}