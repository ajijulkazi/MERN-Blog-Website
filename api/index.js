const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const User = require('./models/User');
const Post = require('./models/Post');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer  = require('multer');
const uploadMiddleWare = multer({ dest: 'uploads/' });
const fs  = require('fs');
const { userInfo } = require('os');
const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = 'khfksfkfjkerfyukfkueayf';



// app.use((req, res, next) => { res.header({"Access-Control-Allow-Origin": "*"}); next(); })
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'))


  



mongoose.connect('mongodb+srv://blog:snblAh1pD1QKu2vb@cluster0.rhnnm9u.mongodb.net/?retryWrites=true&w=majority');

app.get('/test', (req, res) => {
    res.json(" test ok");
});

app.post('/register', async(req, res) => {
    // console.log("request-body :", req.body)
    const {username,password} = req.body;
    try{
        const userDoc = await User.create({
            username,
            password:bcrypt.hashSync(password,salt),
        });
    res.json(userDoc);
    } catch(e) {
        res.status(400).json(); //`unable register due to ${e.message}`
    }
});

app.post('/login', async (req, res) =>{
    //console.log("request-body :", req.body)
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
            });
            //res.status(200).json(token);
        });
    } else {
        res.status(400).json('wrong credentials');
    }
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
        if(err) throw err;
        res.json(info);
    });
    
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});


app.post('/post', uploadMiddleWare.single('file'), async(req,res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length -1];
    const newPath =  path+'.'+ext;
    fs.renameSync(path, newPath);
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if(err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
    })
       res.json(postDoc);
       // res.json(info);
    });
  
});

app.put('/post', uploadMiddleWare.single('file'), async (req, res) => {
    let newPath= null;
    if(req.file){
        const {originalname,path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length -1];
        newPath =  path+'.'+ext;
        fs.renameSync(path, newPath);
    }
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if(err) throw err;
        const {id,title, summary, content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify( postDoc.author ) === JSON.stringify( info.id );
        if(!isAuthor){
            return res.status(400).json('you are not the author');
        }
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        });
        res.json(postDoc);
    });
});

app.get('/post', async (req, res) =>{
    //const posts = await Post.find();
    res.json(
        await Post.find()
    .populate('author',['username'])
    .sort({createdAt: -1})
    .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

app.listen(4001);


//mongodb+srv://blog:snblAh1pD1QKu2vb@cluster0.rhnnm9u.mongodb.net/?retryWrites=true&w=majority
// snblAh1pD1QKu2vb
