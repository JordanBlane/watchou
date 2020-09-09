import React from 'react';
import './CSS/register.css'
import axios, { post } from 'axios'
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
      file:false,
      page:1
    }

    this.Init.bind(this);
    this.Init();

  }


  Init = () => {
    //if user is logged in redirect
    let token = decodeURIComponent(document.cookie);
    if(token){
      window.location.href = `http://${hostname}/`
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
      document.getElementById('pfpDiv').style.display = 'block'
      setTimeout(()=>{
        document.getElementById('passwordDiv').style.left = '-60%'
        document.getElementById('pfpDiv').style.left = '30%'
      },10)
      
    }
  }

  register = () => {
    if(this.state.file !== false)
    {
      var message = {username:this.state.username,email:this.state.email,password:this.state.password,confirmpassword:this.state.confirmpassword,token:process.env.REACT_APP_SECRET_TOKEN_CODE}
      var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.REACT_APP_SECRET_TOKEN_CODE).toString();
      cipher = cipher.replace(/[/]/g,'★')
      cipher = cipher.replace(/[+]/g,'☆')
      var obj = {thum:this.state.file,data:cipher}
      const url = `http://${hostname}:4000/api/register`

      console.log('a')

      return post(url,obj)
      .then(response => {
          if(response.status == 200)
          {
            var d = response.data.data
            d = d.replace(/[★]/g,'/')
            d = d.replace(/[☆]/g,'+')
            var b = cryptoJs.AES.decrypt(d,process.env.REACT_APP_SECRET_TOKEN_CODE.toString())
            var dec = JSON.parse(b.toString(cryptoJs.enc.Utf8))
            document.cookie=`token=${dec.data}`
            window.location.href = `http://${hostname}/`
          }
          else{
              //show upload error
              console.log('show error')
          }
      })
    }
  }

  filehandler = (e) => {
    console.log(e.target.files[0].type.split('/').pop())
    var acceptedTypes = ['jpeg','png']
    if(acceptedTypes.indexOf(e.target.files[0].type.split('/').pop()) == -1)
    {
      return console.log('not accepted')
    }
    var file = e.target.files

    let reader = new FileReader();
    reader.readAsDataURL(file[0])

    reader.onload = (e) => {
        this.setState({file:e.target.result})
    }
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
            <div className="pfpDiv" id='pfpDiv'>
              PFP
              <input type="file" id="pfpinput" onChange={(e)=>{this.filehandler(e)}}/>
              <button className="registerInputs" onClick={()=>{this.register()}}>Register</button>
            </div>
        </div>
    )
  }
}