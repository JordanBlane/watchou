import React from 'react';
import './CSS/register.css'
var cryptoJs = require('crypto-js');
const hostname = window.location.hostname;


export class RegisterPage extends React.Component {

  constructor(props){
    super(props);

    this.state={
      email:'',
      username:'',
      password:'',
      confirmpassword:'',
      tags:'',
      page:1
    }

    this.Init.bind(this);
    this.Init();

  }


  Init = () => {
    //if user is logged in redirect
    let token = decodeURIComponent(document.cookie);
    if(token){
      window.location.href = `http://${hostname}:3000/`
    }
  }

  next = () => {
    if(this.state.page == 1)
    {
      var emailInput = document.getElementById('emailinput').value
      if(emailInput == '' || null || undefined)
      {
        //ERROR MESSAGE
        return
      }
      var message = {email:emailInput,token:process.env.REACT_APP_SECRET_TOKEN_CODE}
      var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.REACT_APP_SECRET_TOKEN_CODE).toString();
      cipher = cipher.replace(/[/]/g,'★')
      cipher = cipher.replace(/[+]/g,'☆')
      fetch(`http://${hostname}:4000/api/checkemail?data=${cipher}`)
      .then(response => response.json())
      .then(data => {
        var d = data.data
        d = d.replace(/[★]/g,'/')
        d = d.replace(/[☆]/g,'+')
        var b = cryptoJs.AES.decrypt(d,process.env.REACT_APP_SECRET_TOKEN_CODE.toString())
        var dec = JSON.parse(b.toString(cryptoJs.enc.Utf8))
        if(dec.data == 'taken'){
          //POP UP EMAIL TAKEN TRY AGAIN
          document.getElementById('emailinput').value = ''
        }else{
          this.setState({email : emailInput})
          this.setState({page : 2})
          document.getElementById('emailinput').value = ''
          document.getElementById('usernameDiv').style.display = 'block'
          //ANIMATION NEXT PAGE
          setTimeout(()=>{
            document.getElementById('emailDiv').style.left = '-60%'
            document.getElementById('usernameDiv').style.left = '30%'
          },10)
        }
      })
    }
    if(this.state.page == 2)
    {
      var usernameInput = document.getElementById('usernameinput').value
      if(usernameInput == '' || null || undefined)
      {
        //ERROR MESSAGE
        return
      }
      var message = {username:usernameInput,token:process.env.REACT_APP_SECRET_TOKEN_CODE}
      var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.REACT_APP_SECRET_TOKEN_CODE).toString();
      cipher = cipher.replace(/[/]/g,'★')
      cipher = cipher.replace(/[+]/g,'☆')
      fetch(`http://${hostname}:4000/api/checkusername?data=${cipher}`)
      .then(response => response.json())
      .then(data => {
        var d = data.data
        d = d.replace(/[★]/g,'/')
        d = d.replace(/[☆]/g,'+')
        var b = cryptoJs.AES.decrypt(d,process.env.REACT_APP_SECRET_TOKEN_CODE.toString())
        var dec = JSON.parse(b.toString(cryptoJs.enc.Utf8))
        if(dec.data == 'taken'){
          //POP UP USERNAME TAKEN TRY AGAIN
          document.getElementById('usernameinput').value = ''
        }else{
          this.setState({username : usernameInput})
          this.setState({page : 3})
          document.getElementById('usernameinput').value = ''
          //ANIMATION NEXT PAGE
          document.getElementById('passwordDiv').style.display = 'block'
          setTimeout(()=>{
            document.getElementById('usernameDiv').style.left = '-60%'
            document.getElementById('passwordDiv').style.left = '30%'
          },10)
        }
      })

    }
    if(this.state.page == 3)
    {
      var passwordInput = document.getElementById('passwordinput').value
      var passwordconfirmInput = document.getElementById('passwordconfirminput').value
      if(passwordconfirmInput == '' || null || undefined)
      {
        //ERROR MESSAGE
        return
      }
      if(passwordInput == '' || null || undefined)
      {
        //ERROR MESSAGE
        return
      }

      if(passwordInput !== passwordconfirmInput)
      {
        //PASSWORD DO NOT MATCH POP UP
        document.getElementById('passwordinput').value = ''
        document.getElementById('passwordconfirminput').value = ''
        return false;
      }

      this.setState({password : passwordInput})
      this.setState({confirmpassword : passwordconfirmInput})
      this.setState({page : 4})
      document.getElementById('passwordinput').value = ''
      document.getElementById('passwordconfirminput').value = ''
      //ANIMATION NEXT PAGE
      document.getElementById('tagsDiv').style.display = 'block'
      setTimeout(()=>{
        document.getElementById('passwordDiv').style.left = '-60%'
        document.getElementById('tagsDiv').style.left = '30%'
      },10)
      
    }
  }

  register = () => {
    var message = {username:this.state.username,email:this.state.email,password:this.state.password,confirmpassword:this.state.confirmpassword,token:process.env.REACT_APP_SECRET_TOKEN_CODE}
    var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.REACT_APP_SECRET_TOKEN_CODE).toString();
    cipher = cipher.replace(/[/]/g,'★')
    cipher = cipher.replace(/[+]/g,'☆')
    fetch(`http://${hostname}:4000/api/register?data=${cipher}`)
    .then(response => response.json())
    .then(data => {
      var d = data.data
      d = d.replace(/[★]/g,'/')
      d = d.replace(/[☆]/g,'+')
      var b = cryptoJs.AES.decrypt(d,process.env.REACT_APP_SECRET_TOKEN_CODE.toString())
      var dec = JSON.parse(b.toString(cryptoJs.enc.Utf8))
      document.cookie = `token=${dec.data}`
      window.location.href = `http://${hostname}:3000/`

    })
  }


  render(){
    return(
        <div className="registerPageWrapper">
            <div className="emailDiv" id='emailDiv'>
              <input className="registerInputs" id='emailinput' placeholder='Email'/>
              <button className="nextButton" onClick={()=>{this.next()}}>Next</button>
            </div>
            <div className="usernameDiv" id='usernameDiv'>
              <input className="registerInputs" id='usernameinput' placeholder='Username'/>
              <button className="nextButton" onClick={()=>{this.next()}}>Next</button>
            </div>
            <div className="passwordDiv" id='passwordDiv'>
              <input className="registerInputs" id='passwordinput' placeholder='Password' type='password'/>
              <input className="registerInputs" id='passwordconfirminput' placeholder='Confirm Password' type='password'/>
              <button className="nextButton" onClick={()=>{this.next()}}>Next</button>
            </div>
            <div className="tagsDiv" id='tagsDiv'>
              tags
              <button className="registerInputs" onClick={()=>{this.register()}}>Register</button>
            </div>
        </div>
    )
  }
}