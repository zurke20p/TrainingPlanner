require('dotenv').config();

const express = require("express");
const mongoose = require('mongoose');

const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const validator = require("email-validator");
const jwt = require("jsonwebtoken");

const userFunctions = require('./functions/user');
const userModel = require('./mongoSchemas/userSchema');

const app = express();

const corsOptions = {
   origin: 'http://localhost:4200', 
   credentials: true,
   optionSuccessStatus: 200,
}

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.post("/register", async (req, res) =>
{
    if(!req.body.username || !req.body.mail || !req.body.password)
        return res.json({ status: 'err', code: 0 });
    if(!validator.validate(req.body.mail))
        return res.json({ status: 'err', code: 1 });
    if(req.body.username.length < 4 || req.body.username.length > 10)
        return res.json({ status: 'err', code: 2 });
    if(req.body.password.length < 3 || req.body.password.length > 10)
        return res.json({ status: 'err', code: 3 });

    if(await userFunctions.exists({ username: req.body.username }))
        return res.json({ status: 'err', code: 4 });
    
    const model = await userModel.create(userFunctions.createUser(parseInt(Date.now()), req.body.username, req.body.mail, req.body.password));
    model.save();

    return res.json({ status: 'ok', code: 0 });
});
app.post("/login", async (req, res) =>
{
    console.log(req.cookies['jwt']);

    if(!req.body.username || !req.body.password)
        return res.json({ status: 'err', code: 0 });

    if(!await userFunctions.exists({ username: req.body.username }))
        return res.json({ status: 'err', code: 1 });
    
    const user = await userFunctions.getUser({ username: req.body.username });
    
    if(user.password != req.body.password)
        return res.json({ status: 'err', code: 2 });
   
    const token = jwt.sign({ id: user.userID }, process.env.JWT_SECRET);
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });
        
    return res.json({ status: 'ok', code: 0 });
});

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_SRV)
.then(() => console.log('Connected to the database!'))
.catch(err => console.error(err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));