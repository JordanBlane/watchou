import React from 'react';
import './CSS/upload.css'
import axios, { post } from 'axios'
var cryptoJs = require('crypto-js');
const hostname = window.location.hostname;


export class UploadPage extends React.Component {

  constructor(props){
    super(props);

    this.state={
        user:'',
        video:'',
        thum:''
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
      })
    }else{
        window.location.href = `http://${hostname}/`
    }
}

handleEventVideo = (event) => {
    var percentage = Math.round((event.loaded / event.total) * 100)
    console.log(`${event.type} : ${percentage} % Bytes Loaded`)
}

  video = (e) => {
    var acceptedTypes = ['mp4','avi','mov','x-matroska']
    if(acceptedTypes.indexOf(e.target.files[0].type.split('/').pop()) == -1)
    {
      return console.log('not accepted wrong file type type=' + e.target.files[0].type)
    
    }
    console.log('aa')
    var file = e.target.files

    let reader = new FileReader();
    reader.addEventListener('progress', this.handleEventVideo);
    reader.readAsDataURL(file[0])
    
    reader.onload = (e) => {
        this.setState({video:e.target.result})
        document.getElementById('aboutVideoDiv').style.display = 'block'
        document.getElementById('uploadFileDiv').style.display = 'none'
    }
  }


  thum = (e) => {
    var acceptedTypes = ['jpeg','png']
    if(acceptedTypes.indexOf(e.target.files[0].type.split('/').pop()) == -1)
    {
      return console.log('not accepted wrong file type')
    }
    console.log('aa')
    var file = e.target.files

    let reader = new FileReader();
    reader.readAsDataURL(file[0])

    reader.onload = (e) => {
        this.setState({thum:e.target.result})
    }
  }

  upload = () => {
      var title = document.getElementById('titleInput').value
      var des = document.getElementById('desInput').value
      var tags = document.getElementById('tagsInput').value
      if(title && des && tags)
      {
        if(this.state.video != '' && this.state.thum != '')
        {
            //SEND REQUEST
            var formData = {videoname:title,videodes:des,channel:this.state.user.token,tags:tags}
            var message = {data:formData,token:process.env.REACT_APP_SECRET_TOKEN_CODE}
            var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.REACT_APP_SECRET_TOKEN_CODE).toString();
            cipher = cipher.replace(/[/]/g,'★')
            cipher = cipher.replace(/[+]/g,'☆')
            var obj = {file:this.state.video,thum:this.state.thum,cipher}
            const url = `http://${hostname}:4000/api/upload`

            console.log('a')

            return post(url,obj)
            .then(response => {
                if(response.status == 200)
                {
                    console.log('a')
                    window.location.href = `http://${hostname}/`
                }
                else{
                    //show upload error
                    console.log('show error')
                }
            })

        }
        else{
            console.log('not all have been eneterd')
        }
      }
      else{
          //throw err not all fields have been entered
      }

  }


  render(){
    return(
        <div className="uploadPageWrapper">
            <div className="uploadFileDiv" id='uploadFileDiv'>
                <h1 className="videoAboutTitle">Upload</h1>
                <input className="fileButton" name="videoInput" type='file' id='videoInput' onChange={(e)=>this.video(e)}/>
                <label for="videoInput" className="videoInputButton" id="videoInputButton"><span className="videoInputButtonText" id="videoInputButtonText">Select File</span></label>
            </div>
            <div className="aboutVideoDiv" id='aboutVideoDiv'>
                <input className="thumbButton" type='file' id='thumInput' placeholder="Thumbnail" onChange={(e)=>this.thum(e)}/>
                <input className="titleInput" id='titleInput' placeholder='Title'/>
                <input className="desInput" id='desInput' placeholder='Description'/>
                <input className="tagsInput" id='tagsInput' placeholder='Tags'/>

                <button className="uploadBtn" onClick={()=>{this.upload()}}>Upload</button>
            </div>
        </div>
    )
  }
}