const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = 'khfksfkfjkerfyukfkueayf';



// app.use((req, res, next) => { res.header({"Access-Control-Allow-Origin": "*"}); next(); })
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());


  



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
    console.log("request-body :", req.body)
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
            if(err) throw err;
            res.cookie('token', token).json('ok');
            //res.status(200).json(token);
        });
    } else {
        res.status(400).json('wrong credentials');
    }
});


app.listen(4001);


//mongodb+srv://blog:snblAh1pD1QKu2vb@cluster0.rhnnm9u.mongodb.net/?retryWrites=true&w=majority
// snblAh1pD1QKu2vb
