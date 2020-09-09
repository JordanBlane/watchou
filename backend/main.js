const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const crypto = require('crypto');
const cryptoJs = require('crypto-js');
const fs = require('fs');


const app = express();

function get_connection(){
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '26265071',
        database: 'watchou',
        charset : 'utf8mb4'
    })
}

let connection = get_connection();


app.use(cors());
app.use(bodyParser.urlencoded({limit:'100mb',extended : false}));
app.use(bodyParser.json({limit:'100mb'}));

// --------- API -----------

app.get('/api',(req,res)=>{
    res.send('Code Challenge Website Api');
})


// ------- LOGIN -------

app.get('/api/login', (req,res) => {
    console.log('Loging in')
    var { data } = req.query;
    data = data.replace(/[★]/g,'/')
    data = data.replace(/[☆]/g,'+')
    //decrypt query
    var byte = cryptoJs.AES.decrypt(data, process.env.SECRET_TOKEN_CODE)
    var dec = JSON.parse(byte.toString(cryptoJs.enc.Utf8))

    console.log(dec)

    if(dec.username && dec.password && dec.token){
        if(dec.token !== process.env.SECRET_TOKEN_CODE){
            var message = {data:'you cannot make calls to this api'}
            var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
            cipher = cipher.replace(/[/]/g,'★')
            cipher = cipher.replace(/[+]/g,'☆')
            return res.json({data:cipher})
        }
        const CHECK_USER = `SELECT * FROM users WHERE username='${dec.username}' AND password='${dec.password}'`
        connection.query(CHECK_USER,(err,result)=>{
            if(err){return console.log(err)}
            if(result[0]){
                var message = {data:result[0].token}
                var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
                cipher = cipher.replace(/[/]/g,'★')
                cipher = cipher.replace(/[+]/g,'☆')
                return res.json({data:cipher})
            }else{
                var message = {data:'no user'}
                var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
                cipher = cipher.replace(/[/]/g,'★')
                cipher = cipher.replace(/[+]/g,'☆')
                return res.json({data:cipher})
            }
        })
    }
    else{
        var message = {data:'enter all fields'}
        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
        cipher = cipher.replace(/[/]/g,'★')
        cipher = cipher.replace(/[+]/g,'☆')
        return res.json({data:cipher})
    }

})

// ------- CHECK EMAIL ------

app.get('/api/checkemail',(req,res)=>{
    var { data } = req.query;
    data = data.replace(/[★]/g,'/')
    data = data.replace(/[☆]/g,'+')
    //decrypt query
    var byte = cryptoJs.AES.decrypt(data, process.env.SECRET_TOKEN_CODE)
    var dec = JSON.parse(byte.toString(cryptoJs.enc.Utf8))

    if(dec.token !== process.env.SECRET_TOKEN_CODE)
    {
        var message = {data:'No access to api'}
        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
        cipher = cipher.replace(/[/]/g,'★')
        cipher = cipher.replace(/[+]/g,'☆')
        return res.json({data : cipher})
    }

    const CHECK_EMAIL = `SELECT email FROM users WHERE email='${dec.email}'`
    connection.query(CHECK_EMAIL,(err,result)=>{
        if(err){return console.log(err)}
        if(result[0]){
            var message = {data:'taken'}
            var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
            cipher = cipher.replace(/[/]/g,'★')
            cipher = cipher.replace(/[+]/g,'☆')
            return res.json({data:cipher})
        }
        else{
            var message = {data:'not taken'}
            var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
            cipher = cipher.replace(/[/]/g,'★')
            cipher = cipher.replace(/[+]/g,'☆')
            return res.json({data : cipher})
        }
    })
})



// ------- CHECK USERNAME --------

app.get('/api/checkusername',(req,res) => {
    var { data } = req.query;
    data = data.replace(/[★]/g,'/')
    data = data.replace(/[☆]/g,'+')
    //decrypt query
    var byte = cryptoJs.AES.decrypt(data, process.env.SECRET_TOKEN_CODE)
    var dec = JSON.parse(byte.toString(cryptoJs.enc.Utf8))

    if(dec.token !== process.env.SECRET_TOKEN_CODE)
    {
        var message = {data:'No access to api'}
        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
        cipher = cipher.replace(/[/]/g,'★')
        cipher = cipher.replace(/[+]/g,'☆')
        return res.json({data : cipher})
    }

    const CHECK_USERNAME = `SELECT username FROM users WHERE username='${dec.username}'`
    connection.query(CHECK_USERNAME,(err,result) => {
        if(err) {return console.log(err)}
        if(result[0]){
            var message = {data:'taken'}
            var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
            cipher = cipher.replace(/[/]/g,'★')
            cipher = cipher.replace(/[+]/g,'☆')
            return res.json({data : cipher})
        }else{
            var message = {data:'not taken'}
            var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
            cipher = cipher.replace(/[/]/g,'★')
            cipher = cipher.replace(/[+]/g,'☆')
            return res.json({data : cipher})
        }
    })


})



// ------ Register ------

app.post('/api/register', (req,res) => {
    var { data } = req.body;
    data = data.replace(/[★]/g,'/')
    data = data.replace(/[☆]/g,'+')
    //decrypt query
    var byte = cryptoJs.AES.decrypt(data, process.env.SECRET_TOKEN_CODE)
    var dec = JSON.parse(byte.toString(cryptoJs.enc.Utf8))

    if(dec.email && dec.username && dec.password && dec.confirmpassword && req.body.thum && dec.token)
    {
        if(dec.token !== process.env.SECRET_TOKEN_CODE){
            var message = {data:'no access to api'}
            var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
            cipher = cipher.replace(/[/]/g,'★')
            cipher = cipher.replace(/[+]/g,'☆')
            return res.json({data : cipher})
        }

        if(dec.confirmpassword !== dec.password){
            var message = {data:'passwords do not match'}
            var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
            cipher = cipher.replace(/[/]/g,'★')
            cipher = cipher.replace(/[+]/g,'☆')
            return res.json({data : cipher})
        }
        else{

            const CHECK_EMAIL = `SELECT email FROM users WHERE email='${dec.email}'`
            connection.query(CHECK_EMAIL,(err,result)=>{
                if(err){return console.log(err)}
                if(result[0]){
                    var message = {data:'email taken'}
                    var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
                    cipher = cipher.replace(/[/]/g,'★')
                    cipher = cipher.replace(/[+]/g,'☆')
                    return res.json({data : cipher})
                }
                const CHECK_USERNAME = `SELECT username FROM users WHERE username='${dec.username}'`
                connection.query(CHECK_USERNAME,(err,result) => {
                    if(err) {return console.log(err)}
                    if(result[0]){
                        var message = {data:'username taken'}
                        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
                        cipher = cipher.replace(/[/]/g,'★')
                        cipher = cipher.replace(/[+]/g,'☆')
                        return res.json({data : cipher})
                    }
                    key_check = () => {
                        var token = crypto.randomBytes(64).toString('hex')
                        const CHECK_TOKEN = `SELECT token FROM users WHERE token='${token}'`
                        connection.query(CHECK_TOKEN,(err,result) => {
                            if(err) {return console.log(err)}
                            if(result[0]){
                                key_check();
                            }else{
                                const ADD_USER_TO_DB = `INSERT INTO users(username,password,email,token,expire,thum) VALUES('${dec.username}','${dec.password}','${dec.email}','${token}','june','${req.body.thum}')`
                                connection.query(ADD_USER_TO_DB,(err,result) => {
                                    if(err){return console.log(err)}
                                    var message = {data:token}
                                    var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
                                    cipher = cipher.replace(/[/]/g,'★')
                                    cipher = cipher.replace(/[+]/g,'☆')
                                    return res.json({data : cipher})
                                })
                            }
                        })
                    }
                    key_check();
                })



            })
        }
    }
    else{
        var message = {data:'not all in'}
        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
        cipher = cipher.replace(/[/]/g,'★')
        cipher = cipher.replace(/[+]/g,'☆')
        return res.json({data : cipher})
    }
})


// ------- GET USER -------

app.get('/api/getuser',(req,res) => {
    var { data  } = req.query;

    data = data.replace(/[★]/g,'/')
    data = data.replace(/[☆]/g,'+')
    //decrypt query
    var byte = cryptoJs.AES.decrypt(data, process.env.SECRET_TOKEN_CODE)
    var dec = JSON.parse(byte.toString(cryptoJs.enc.Utf8))


    if(dec.token !== process.env.SECRET_TOKEN_CODE)
    {
        var message = {data:'no access to api'}
        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
        cipher = cipher.replace(/[/]/g,'★')
        cipher = cipher.replace(/[+]/g,'☆')
        return res.json({data : cipher})
    }

    const GET_USER = `SELECT * FROM users WHERE token='${dec.data}'`
    connection.query(GET_USER,(err,result) => {
        if(err){return console.log(err)}
        if(result[0]){
            var message = {user:result}
            var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
            cipher = cipher.replace(/[/]/g,'★')
            cipher = cipher.replace(/[+]/g,'☆')
            return res.json({data : cipher})
        }
        else{
            var message = {data:'no user found'}
            var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
            cipher = cipher.replace(/[/]/g,'★')
            cipher = cipher.replace(/[+]/g,'☆')
            return res.json({data:cipher})
        }
    })
})


// ------ GET CHANNEL ------

app.get('/api/getchannel',(req,res)=>{
    var { data } = req.query;
    data = data.replace(/[★]/g,'/')
    data = data.replace(/[☆]/g,'+')
    //decrypt query
    var byte = cryptoJs.AES.decrypt(data, process.env.SECRET_TOKEN_CODE)
    var dec = JSON.parse(byte.toString(cryptoJs.enc.Utf8))

    if(dec.token !== process.env.SECRET_TOKEN_CODE)
    {
        var message = {data:'no access to api'}
        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
        cipher = cipher.replace(/[/]/g,'★')
        cipher = cipher.replace(/[+]/g,'☆')
        return res.json({data:cipher})
    }

    const GET_CHANNEL = `SELECT * FROM users WHERE username='${dec.data}'`
    connection.query(GET_CHANNEL,(err,result)=>{
        if(err){return console.log(err)}
        if(result[0])
        {
            var message = {data:result}
            var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
            cipher = cipher.replace(/[/]/g,'★')
            cipher = cipher.replace(/[+]/g,'☆')
            return res.json({data : cipher})
        }
        var message = {data:'no user found'}
        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
        cipher = cipher.replace(/[/]/g,'★')
        cipher = cipher.replace(/[+]/g,'☆')
        return res.json({data : cipher})
    })

})


// ------ test -------

app.get('/api/test', (req,res) => {
    var b = cryptoJs.AES.decrypt('U2FsdGVkX18q3cAe8KRjGbH2sMmO/E9tvQx/9sf7zyoheJu5A04jkWU9HuOWlx99VBS/SaZwaID32EaCl3IgD3vAUW7rRc9nFNKqIJysCllX2zJi2o4jpqINKQCRN8lF/KqNZbb86kPFJYzVff9iQb9F0rKmltZ8TCWBWsfJs7Pb2q+PA9N5hx4tHQ4FwgY0Zfk9lwLRuNo9VLQ+Phd0YQ==',process.env.SECRET_TOKEN_CODE.toString())
    var m = JSON.parse(b.toString(cryptoJs.enc.Utf8))
    console.log(m)
})

// ------- GET VIDEO -------

app.get('/api/getvideo',(req,res)=>{
    var { data  } = req.query;

    data = data.replace(/[★]/g,'/')
    data = data.replace(/[☆]/g,'+')
    //decrypt query
    var byte = cryptoJs.AES.decrypt(data, process.env.SECRET_TOKEN_CODE)
    var dec = JSON.parse(byte.toString(cryptoJs.enc.Utf8))

    if(dec.token !== process.env.SECRET_TOKEN_CODE)
    {
        var message = {data:'no access'}
        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
        cipher = cipher.replace(/[/]/g,'★')
        cipher = cipher.replace(/[+]/g,'☆')
        return res.json({data : cipher})
    }
    let GET_VIDEO = `SELECT * FROM videos WHERE id = ${dec.id}`
    connection.query(GET_VIDEO,(err,result)=>{
        if(err){return console.log(err)}
        //Get thumbnail
        if(result[0])
        {
            var a = result[0].id
            var b = result[0].thumext
            var bitmap = fs.readFileSync(`./videos/${a}.${b}`)
            var thum = new Buffer(bitmap).toString('base64');
            var message = {data:result}
            var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
            cipher = cipher.replace(/[/]/g,'★')
            cipher = cipher.replace(/[+]/g,'☆')
            var obj = {thum:thum,data:cipher}
            return res.json({data : obj})
        }
    })
})


// ------- GET VIDEO by uid -------
app.get('/api/getvideobyuid',(req,res)=>{
    var { data  } = req.query;

    data = data.replace(/[★]/g,'/')
    data = data.replace(/[☆]/g,'+')
    //decrypt query
    var byte = cryptoJs.AES.decrypt(data, process.env.SECRET_TOKEN_CODE)
    var dec = JSON.parse(byte.toString(cryptoJs.enc.Utf8))

    if(dec.token !== process.env.SECRET_TOKEN_CODE)
    {
        var message = {data:'no access'}
        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
        cipher = cipher.replace(/[/]/g,'★')
        cipher = cipher.replace(/[+]/g,'☆')
        return res.json({data : cipher})
    }
    let GET_VIDEO = `SELECT * FROM videos WHERE uid='${dec.uid}'`
    connection.query(GET_VIDEO,(err,result)=>{
        if(err){return console.log(err)}
        //Get thumbnail
        if(result[0])
        {
            var a = result[0].id
            var b = result[0].thumext
            var bitmap = fs.readFileSync(`./videos/${a}.${b}`)
            var thum = new Buffer(bitmap).toString('base64');
            var message = {data:result}
            var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
            cipher = cipher.replace(/[/]/g,'★')
            cipher = cipher.replace(/[+]/g,'☆')
            var obj = {thum:thum,data:cipher}
            return res.json({data : obj})
        }
    })
})


// ------- SEARCH -------

app.get('/api/search',(req,res)=>{
    var { data  } = req.query;

    data = data.replace(/[★]/g,'/')
    data = data.replace(/[☆]/g,'+')
    //decrypt query
    var byte = cryptoJs.AES.decrypt(data, process.env.SECRET_TOKEN_CODE)
    var dec = JSON.parse(byte.toString(cryptoJs.enc.Utf8))


    if(dec.token !== process.env.SECRET_TOKEN_CODE)
    {
        var message = {data:'no access'}
        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
        cipher = cipher.replace(/[/]/g,'★')
        cipher = cipher.replace(/[+]/g,'☆')
        return res.json({data : cipher})
    }
    let SEARCH = `SELECT * FROM videos WHERE videoname LIKE '%${dec.data}%'`

    connection.query(SEARCH,(err,result)=>{
        if(err){return console.log(err)}
        return res.json({ data : result})
    })
})


// -------- UPLOAD --------


app.post('/api/upload', (req,res) => {
    var data = req.body.cipher;
    data = data.replace(/[★]/g,'/')
    data = data.replace(/[☆]/g,'+')
    //decrypt query
    var byte = cryptoJs.AES.decrypt(data, process.env.SECRET_TOKEN_CODE)
    var dec = JSON.parse(byte.toString(cryptoJs.enc.Utf8))

    if(dec.token !== process.env.SECRET_TOKEN_CODE)
    {
        var message = {data:'no access'}
        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
        cipher = cipher.replace(/[/]/g,'★')
        cipher = cipher.replace(/[+]/g,'☆')
        return res.json({data : cipher})
    }

    let validTypes = ['mp4','mov','avi']
    let videoType = req.body.file.split(';base64,')[0]
    videoType = videoType.split('/').pop()
    if(validTypes.indexOf(videoType) == -1)
    {
        var message = {data:'Invalid Video Type'}
        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
        cipher = cipher.replace(/[/]/g,'★')
        cipher = cipher.replace(/[+]/g,'☆')
        return res.json({data : cipher})
    }
    let validImgTypes = ['png','jpeg']
    let imgType = req.body.thum.split(';base64,')[0]
    imgType = imgType.split('/').pop()
    if(validImgTypes.indexOf(imgType) == -1)
    {
        var message = {data:'Invalid thum type'}
        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
        cipher = cipher.replace(/[/]/g,'★')
        cipher = cipher.replace(/[+]/g,'☆')
        return res.json({data : cipher})
    }
    let base64Video = req.body.file.split(';base64,').pop();
    let base64Thum = req.body.thum.split(';base64,').pop();

    const GET_LATEST_VIDEO = `SELECT MAX(id) as latest FROM videos`
    connection.query(GET_LATEST_VIDEO,(err,result)=>{
        if(err){return console.log(err)}
        var videoName = result[0].latest +1
        fs.writeFile('./videos/'+videoName+'.'+videoType, base64Video, {encoding: 'base64'}, function(err){
            if(err){return console.log(err)}
            fs.writeFile('./videos/'+videoName+'.'+imgType, base64Thum, {encoding: 'base64'}, function(err){
                if(err){return console.log(err)}
                console.log('created')
                key_check = () => {
                    var token = crypto.randomBytes(64).toString('hex')
                    const CHECK_TOKEN = `SELECT token FROM users WHERE token='${token}'`
                    connection.query(CHECK_TOKEN,(err,result) => {
                        if(err) {return console.log(err)}
                        if(result[0]){
                            key_check();
                        }else{
                            const ADD_VIDEO_TO_DB = `INSERT INTO videos(videoName,videodes,views,channel,likes,dislikes,tags,videoext,thumext,uid) VALUES('${dec.data.videoname}','${dec.data.videodes}',0,'${dec.data.channel}',0,0,'${dec.data.tags}','${videoType}','${imgType}','${token}')`
                            connection.query(ADD_VIDEO_TO_DB,(err,result)=>{
                                if(err){return console.log(err)}
                                console.log('uploaded')
                                var message = {data:'added'}
                                var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
                                cipher = cipher.replace(/[/]/g,'★')
                                cipher = cipher.replace(/[+]/g,'☆')
                                return res.json({data : cipher})
                            })
                        }
                    })
                }
                key_check();
            })
        })
    })

})


// ----- GET VIDEO ------

app.get('/api/video', function(req, res) {
    var { data  } = req.query;

    data = data.replace(/[★]/g,'/')
    data = data.replace(/[☆]/g,'+')
    //decrypt query
    var byte = cryptoJs.AES.decrypt(data, process.env.SECRET_TOKEN_CODE)
    var dec = JSON.parse(byte.toString(cryptoJs.enc.Utf8))


    if(dec.token !== process.env.SECRET_TOKEN_CODE)
    {
        var message = {data:'no access'}
        var cipher = cryptoJs.AES.encrypt(JSON.stringify(message),process.env.SECRET_TOKEN_CODE).toString();
        cipher = cipher.replace(/[/]/g,'★')
        cipher = cipher.replace(/[+]/g,'☆')
        return res.json({data : cipher})
    }

    const GET_VIDEO = `SELECT * FROM videos WHERE uid='${dec.uid}'`
    connection.query(GET_VIDEO,(err,result)=>{
        if(err){return console.log(err)}
        const path = `./videos/${result[0].id}.${result[0].videoext}`
        const stat = fs.statSync(path)
        const fileSize = stat.size
        const range = req.headers.range
        if (range) {
          const parts = range.replace(/bytes=/, "").split("-")
          const start = parseInt(parts[0], 10)
          const end = parts[1] 
            ? parseInt(parts[1], 10)
            : fileSize-1
          const chunksize = (end-start)+1
          const file = fs.createReadStream(path, {start, end})
          const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
          }
          res.writeHead(206, head);
          file.pipe(res);
        } else {
          const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
          }
          res.writeHead(200, head)
          fs.createReadStream(path).pipe(res)
        }
    })
})



app.listen(4000, ()=>{
    console.log('Listening');
})