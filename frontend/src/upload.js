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
        window.location.href = `http://${hostname}:3000/`
    }
}

  video = (e) => {
    var file = e.target.files

    let reader = new FileReader();
    reader.readAsDataURL(file[0])
    
    reader.onload = (e) => {
        this.setState({video:e.target.result})
    }
  }

  thum = (e) => {
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
            console.log('video and thum entered')
            //check to see if uploaded file to thum is a valid type
            var thum = document.getElementById('thumInput').value
            var thumindex = thum.lastIndexOf('.')
            var thumext = thum.substring(thumindex,thum.length)
            var validthum = ['.png','.jpeg']
            if(validthum.indexOf(thumext) == -1)
            {
                console.log('not the right thum ext')
                return false;
            }

            //check to see if uploaded file to video is a valid type
            var video = document.getElementById('videoInput').value
            var videoindex = video.lastIndexOf('.')
            var videoext = video.substring(videoindex,video.length)
            var validvideo = ['.mp4','.mov','.avi']
            if(validvideo.indexOf(videoext) == -1)
            {
                console.log('not the right video ext')
                return false;
            }

            //SEND REQUEST
            var formData = {videoname:title,videodes:des,channel:this.state.user.token,tags:tags}
            var message = {data:formData,token:process.env.REACT_APP_SECRET_TOKEN_CODE}
            var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.REACT_APP_SECRET_TOKEN_CODE).toString();
            cipher = cipher.replace(/[/]/g,'★')
            cipher = cipher.replace(/[+]/g,'☆')
            var obj = {file:this.state.video,thum:this.state.thum,cipher}
            const url = `http://${hostname}:4000/api/upload`
  
            return post(url,obj)
            .then(response => {
                if(response.status == 200)
                {
                    window.location.href = `http://${hostname}:3000/`
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
            <h1 className="uploadTitle">Upload</h1>
            <h1 className="videoTitle">Video</h1>
            <input className="fileBtn" type='file' id='videoInput' onChange={(e)=>this.video(e)}/>
            <h1 className="thumbTitle">Thumb Nail</h1>
            <input className="thumbBtn" type='file' id='thumInput' onChange={(e)=>this.thum(e)}/>
            <input className="videoDescInputs" id='titleInput' placeholder='Title'/>
            <input className="videoDescInputs" id='desInput' placeholder='Description'/>
            <input className="videoDescInputs" id='tagsInput' placeholder='Tags'/>

            <button className="uploadBtn" onClick={()=>{this.upload()}}>Upload</button>
        </div>
    )
  }
}