import React from 'react';
import './CSS/App.css'
import Axios from 'axios';
var cryptoJs = require('crypto-js');
const hostname = window.location.hostname;


export class MainPage extends React.Component {

  constructor(props){
    super(props);

    this.state={
      sidebar: true,
      user : {},
      loginPopup:false
    }

    this.Init.bind(this);
    this.Init();

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
        document.getElementById('registerButton').style.display = 'none'
        document.getElementById('loginButton').style.display = 'none'
        document.getElementById('accountButton').style.display = 'block'
        document.getElementById('uploadButton').style.display = 'block'
        document.getElementById('accountButton').src = `${dec.user[0].thum}`
      })
    }
    for(let i=1;i<=10;i++){
      var message = {token:process.env.REACT_APP_SECRET_TOKEN_CODE,id:i}
      var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.REACT_APP_SECRET_TOKEN_CODE).toString();
      cipher = cipher.replace(/[/]/g,'★')
      cipher = cipher.replace(/[+]/g,'☆')
      Axios.get(`http://${hostname}:4000/api/getvideo?data=${cipher}`)
      .then(response => {
        var d = response.data.data.data
        d = d.replace(/[★]/g,'/')
        d = d.replace(/[☆]/g,'+')
        var b = cryptoJs.AES.decrypt(d,process.env.REACT_APP_SECRET_TOKEN_CODE.toString())
        var dec = JSON.parse(b.toString(cryptoJs.enc.Utf8))
        if(dec){
          document.getElementById('feedwrapper').innerHTML += `<div class='feedvideo'><img id='videoimg' onclick='window.location.href="http://${hostname}/watch?video=${dec.data[0].uid}"' src='data:image/${dec.data[0].thumext};base64,${response.data.data.thum}'/><h1 id='videotitle'>${dec.data[0].videoname}</h1></div>`
        }
      })
    }
  }




  togglesidebar = () => {
    if(this.state.sidebar == false){
      document.getElementById('sidebar').style.left = '-15%';
      document.getElementById('sidebar').style.transitionDelay = '0s';
      document.getElementById('smallsidebar').style.transitionDelay = '0.18s';
      document.getElementById('feedwrapper').style.transitionDelay = '0s';
      document.getElementById('smallsidebar').style.left = '0%';
      document.getElementById('feedwrapper').style.width = '95%';
      this.setState({sidebar : true})
    }
    else{
      document.getElementById('sidebar').style.left = '0%';
      document.getElementById('sidebar').style.transitionDelay = '0.06s';
      document.getElementById('smallsidebar').style.transitionDelay = '0s';
      document.getElementById('feedwrapper').style.transitionDelay = '0.06s';
      document.getElementById('smallsidebar').style.left = '-5%';
      document.getElementById('feedwrapper').style.width = '85%';
      this.setState({sidebar : false})
    }
  }


  search = (a) => {
    var message = {token:process.env.REACT_APP_SECRET_TOKEN_CODE,data:a}
    var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.REACT_APP_SECRET_TOKEN_CODE).toString();
    cipher = cipher.replace(/[/]/g,'★')
    cipher = cipher.replace(/[+]/g,'☆')
    fetch(`http://${hostname}:4000/api/search?data=${cipher}`)
    .then(response => response.json())
    .then(data => {
      var searchresultsdiv = document.getElementById('searchResults');

      if(a == ''){
        searchresultsdiv.innerHTML = '';
        searchresultsdiv.style.display = 'none';
        return false;
      }
      searchresultsdiv.innerHTML = '';

      if(data.data[0]){
        searchresultsdiv.style.display='inline-block';
        for(let i=0;i<data.data.length;i++){
          searchresultsdiv.innerHTML += `<div id='searchresultdiv'> <h3 id="searchresulttitle" onclick='window.location.href="http://${hostname}/watch?video=${data.data[i].uid}"'>${data.data[i].videoname}</h3></div>`
        }
      }else{
        searchresultsdiv.style.display = 'hidden';
        searchresultsdiv.innerHTML = '';
      }
    })
  }


  login = () => {
    var username = document.getElementById('usernameInput').value
    var password = document.getElementById('passwordInput').value

    var message = {token:process.env.REACT_APP_SECRET_TOKEN_CODE,username:username,password:password}
    var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.REACT_APP_SECRET_TOKEN_CODE).toString();
    cipher = cipher.replace(/[/]/g,'★')
    cipher = cipher.replace(/[+]/g,'☆')
    fetch(`http://${hostname}:4000/api/login?data=${cipher}`)
    .then(response => response.json())
    .then(data => {
      var d = data.data
      d = d.replace(/[★]/g,'/')
      d = d.replace(/[☆]/g,'+')
      var b = cryptoJs.AES.decrypt(d,process.env.REACT_APP_SECRET_TOKEN_CODE.toString())
      var dec = JSON.parse(b.toString(cryptoJs.enc.Utf8))
      document.cookie = `token=${dec.data}`
      var message = {token:process.env.REACT_APP_SECRET_TOKEN_CODE,data:dec.data}
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
        this.setState({user:dec.user[0]})
        document.getElementById('loginPopup').style.display = 'none'
        document.getElementById('registerButton').style.display = 'none'
        document.getElementById('loginButton').style.display = 'none'
        document.getElementById('accountButton').style.display = 'block'
        document.getElementById('uploadButton').style.display = 'block'
      })
    })

  }



  toggleLogin = () => {
    if(this.state.loginPopup == false){
      document.getElementById('loginPopup').style.display = 'inline-block';
      this.setState({loginPopup : true})
    }else{
      document.getElementById('loginPopup').style.display = 'none';
      this.setState({loginPopup : false})
    }
  }


  render(){
    return(
      <div className="mainWrapper">
        <div className="topBar">
          <h1 id="title">Watchou</h1>
          <button className="toggleSidebar" onClick={this.togglesidebar}>☰</button>
          <input className="searchBar" id='searchbar' placeholder="Search" onChange={()=>{this.search(document.getElementById('searchbar').value)}}/>
          <button id='registerButton' className="registerButton" onClick={()=>{window.location.href=`http://${hostname}/register`}}>Create An Account</button>
          <button id='loginButton' className="loginButton" onClick={()=>{this.toggleLogin()}}>Login</button>
          <img id='accountButton' className="accountButton"/>
          <button id='uploadButton' className="uploadButton" onClick={()=>{window.location.href=`http://${hostname}/upload`}}>Upload</button>
        </div>
        <div id="searchResults" className="searchResults">

        </div>

      <div className="sidebar" id='sidebar'>
        <button id="active" className="sidebarButton" onClick={()=>{window.location.href=`http://${hostname}/`}}><svg height='20' width='20'><path d="M18.121,9.88l-7.832-7.836c-0.155-0.158-0.428-0.155-0.584,0L1.842,9.913c-0.262,0.263-0.073,0.705,0.292,0.705h2.069v7.042c0,0.227,0.187,0.414,0.414,0.414h3.725c0.228,0,0.414-0.188,0.414-0.414v-3.313h2.483v3.313c0,0.227,0.187,0.414,0.413,0.414h3.726c0.229,0,0.414-0.188,0.414-0.414v-7.042h2.068h0.004C18.331,10.617,18.389,10.146,18.121,9.88 M14.963,17.245h-2.896v-3.313c0-0.229-0.186-0.415-0.414-0.415H8.342c-0.228,0-0.414,0.187-0.414,0.415v3.313H5.032v-6.628h9.931V17.245z M3.133,9.79l6.864-6.868l6.867,6.868H3.133z"></path></svg> Home</button>
        <button className="sidebarButton" onClick={()=>{window.location.href=`http://${hostname}/trending`}}><svg height='20' width='20'><path d="M11.709,7.438H8.292c-0.234,0-0.427,0.192-0.427,0.427v8.542c0,0.234,0.192,0.427,0.427,0.427h3.417c0.233,0,0.426-0.192,0.426-0.427V7.865C12.135,7.63,11.942,7.438,11.709,7.438 M11.282,15.979H8.719V8.292h2.563V15.979zM6.156,11.709H2.74c-0.235,0-0.427,0.191-0.427,0.426v4.271c0,0.234,0.192,0.427,0.427,0.427h3.417c0.235,0,0.427-0.192,0.427-0.427v-4.271C6.583,11.9,6.391,11.709,6.156,11.709 M5.729,15.979H3.167v-3.416h2.562V15.979zM17.261,3.167h-3.417c-0.235,0-0.427,0.192-0.427,0.427v12.812c0,0.234,0.191,0.427,0.427,0.427h3.417c0.234,0,0.427-0.192,0.427-0.427V3.594C17.688,3.359,17.495,3.167,17.261,3.167 M16.833,15.979h-2.562V4.021h2.562V15.979z"></path></svg> Trending</button>
        <button className="sidebarButton"><svg height='20' width='20'><path d="M17.35,2.219h-5.934c-0.115,0-0.225,0.045-0.307,0.128l-8.762,8.762c-0.171,0.168-0.171,0.443,0,0.611l5.933,5.934c0.167,0.171,0.443,0.169,0.612,0l8.762-8.763c0.083-0.083,0.128-0.192,0.128-0.307V2.651C17.781,2.414,17.587,2.219,17.35,2.219M16.916,8.405l-8.332,8.332l-5.321-5.321l8.333-8.332h5.32V8.405z M13.891,4.367c-0.957,0-1.729,0.772-1.729,1.729c0,0.957,0.771,1.729,1.729,1.729s1.729-0.772,1.729-1.729C15.619,5.14,14.848,4.367,13.891,4.367 M14.502,6.708c-0.326,0.326-0.896,0.326-1.223,0c-0.338-0.342-0.338-0.882,0-1.224c0.342-0.337,0.881-0.337,1.223,0C14.84,5.826,14.84,6.366,14.502,6.708"></path></svg>Subscriptions</button>
        <hr/>
        <button className="sidebarButton">Library</button>
        <button className="sidebarButton">History</button>
        <button className="sidebarButton">Liked</button>
        <button className="sidebarButton">Watch Later</button>
        <hr/>
        <button className="sidebarButton">Settings</button>
        <button className="sidebarButton">Report History</button>
        <button className="sidebarButton">Help</button>
        <button className="sidebarButton">Send Feedback</button>
        <hr/>
        <div id='sidebarBottom'>
          <a className='linktext' href="About">About</a>
          <a className='linktext' href="Press">Press</a>
          <a className='linktext' href="Copyright">Copyright</a>
          <a className='linktext' href="Contact">Contact</a>
          <a className='linktext' href="Creators">Creators</a>
          <a className='linktext' href="Advertise">Advertise</a>
          <a className='linktext' href="Developers">Developers</a>
          <a className='linktext' href="Terms">Terms</a>
          <a className='linktext' href="Privacy">Privacy Policy</a>
          <a className='linktext' href="Beta">Beta Testing</a>
        </div>
      </div>

      <div className="smallSidebar" id='smallsidebar'>
        <button className="smallSidebarButton" onClick={()=>{window.location.href=`http://${hostname}/`}}><svg height='20' width='20'><path d="M18.121,9.88l-7.832-7.836c-0.155-0.158-0.428-0.155-0.584,0L1.842,9.913c-0.262,0.263-0.073,0.705,0.292,0.705h2.069v7.042c0,0.227,0.187,0.414,0.414,0.414h3.725c0.228,0,0.414-0.188,0.414-0.414v-3.313h2.483v3.313c0,0.227,0.187,0.414,0.413,0.414h3.726c0.229,0,0.414-0.188,0.414-0.414v-7.042h2.068h0.004C18.331,10.617,18.389,10.146,18.121,9.88 M14.963,17.245h-2.896v-3.313c0-0.229-0.186-0.415-0.414-0.415H8.342c-0.228,0-0.414,0.187-0.414,0.415v3.313H5.032v-6.628h9.931V17.245z M3.133,9.79l6.864-6.868l6.867,6.868H3.133z"></path></svg>‏‏‎‎‎Home</button>
        <button className="smallSidebarButton" onClick={()=>{window.location.href=`http://${hostname}/trending`}}><svg height='20' width='20'><path d="M11.709,7.438H8.292c-0.234,0-0.427,0.192-0.427,0.427v8.542c0,0.234,0.192,0.427,0.427,0.427h3.417c0.233,0,0.426-0.192,0.426-0.427V7.865C12.135,7.63,11.942,7.438,11.709,7.438 M11.282,15.979H8.719V8.292h2.563V15.979zM6.156,11.709H2.74c-0.235,0-0.427,0.191-0.427,0.426v4.271c0,0.234,0.192,0.427,0.427,0.427h3.417c0.235,0,0.427-0.192,0.427-0.427v-4.271C6.583,11.9,6.391,11.709,6.156,11.709 M5.729,15.979H3.167v-3.416h2.562V15.979zM17.261,3.167h-3.417c-0.235,0-0.427,0.192-0.427,0.427v12.812c0,0.234,0.191,0.427,0.427,0.427h3.417c0.234,0,0.427-0.192,0.427-0.427V3.594C17.688,3.359,17.495,3.167,17.261,3.167 M16.833,15.979h-2.562V4.021h2.562V15.979z"></path></svg>Trending</button>
        <button className="smallSidebarButton"><svg height='20' width='20'><path d="M17.35,2.219h-5.934c-0.115,0-0.225,0.045-0.307,0.128l-8.762,8.762c-0.171,0.168-0.171,0.443,0,0.611l5.933,5.934c0.167,0.171,0.443,0.169,0.612,0l8.762-8.763c0.083-0.083,0.128-0.192,0.128-0.307V2.651C17.781,2.414,17.587,2.219,17.35,2.219M16.916,8.405l-8.332,8.332l-5.321-5.321l8.333-8.332h5.32V8.405z M13.891,4.367c-0.957,0-1.729,0.772-1.729,1.729c0,0.957,0.771,1.729,1.729,1.729s1.729-0.772,1.729-1.729C15.619,5.14,14.848,4.367,13.891,4.367 M14.502,6.708c-0.326,0.326-0.896,0.326-1.223,0c-0.338-0.342-0.338-0.882,0-1.224c0.342-0.337,0.881-0.337,1.223,0C14.84,5.826,14.84,6.366,14.502,6.708"></path></svg>Subscriptions</button>
      </div>

      <div className="feedWrapper" id='feedwrapper'>

      </div>

      <div className="loginPop" id='loginPopup'>
        <input className="usernameInput" id='usernameInput' placeholder='Username'/>
        <input className="passwordInput" id='passwordInput' placeholder='Password'/>
        <button className="loginPopupButton" onClick={()=>{this.login()}}>Login</button>
        <button className="closeLoginPopup" onClick={()=>{this.toggleLogin()}}>X</button>
      </div>

    </div>
    )
  }
}