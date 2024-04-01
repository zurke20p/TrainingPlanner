require('dotenv').config();

const validator = require("email-validator");
const jwt = require("jsonwebtoken");

const userFunctions = require('../functions/user');
const utility = require('../functions/utility');

const userModel = require('../mongoSchemas/userSchema');

let tokens = new Array();

module.exports = (app) =>
{
    app.post("/register", async (req, res) =>
    {
        if(req.cookies["emailSent"])
            return res.json({ status: 'err', msg: 0 });
        if(userFunctions.authenticate(req))
            return res.json({ status: 'err', msg: "User is already logged in" });
        if(!req.body.username || !req.body.mail || !req.body.password)
            return res.json({ status: 'err', msg: 2 });
        if(!validator.validate(req.body.mail))
            return res.json({ status: 'err', msg: 3 });
        if(req.body.username.length < 4 || req.body.username.length > 10)
            return res.json({ status: 'err', msg: 4 });
        if(req.body.password.length < 3 || req.body.password.length > 10)
            return res.json({ status: 'err', msg: 5 });
    
        if(await userFunctions.exists({ username: req.body.username }))
            return res.json({ status: 'err', msg: 6 });

        if(await userFunctions.exists({ mail: req.body.mail }))
            return res.json({ status: 'err', msg: 7 });
        
        const user = userFunctions.createUser(parseInt(Date.now()), req.body.username, req.body.mail, req.body.password);

        const token = jwt.sign(user, process.env.JWT_SECRET);
        tokens.push(token);

        setTimeout(() => {
            tokens = tokens.filter(el => el != token);
        }, 1000 * 60 * 10);

        const text = `<h2>Hello my fellow gym buddy,</h2>
I'm your new best personal trainer and I would love to verify if this email belongs to account:
${req.body.username}.
If this is Your account please click this link:
<a href="${process.env.PAGE_ADDRESS}/register/tokens/${token}">${process.env.PAGE_ADDRESS}/register/tokens/${token}</a>
Remember that this link will expire in 10 minutes.
My best regards to all my fellow gym buddyies,
Your Best personal Gym Trainer!!!`;

        if(!await utility.sendMail(req.body.mail,"Identity Verification", text))
            return res.json({ status: 'err', msg: 8 });

        res.cookie('emailSent', true, {
            httpOnly: true,
            maxAge: 10 * 60 * 1000
        });
        return res.json({ status: 'ok', msg: 0 });
    });
    app.post("/login", async (req, res) =>
    {
        if(userFunctions.authenticate(req))
            return res.json({ status: 'err', msg: "User is already logged in." });
        if(!req.body.username || !req.body.password)
            return res.json({ status: 'err', msg: 0 });
    
        if(!await userFunctions.exists({ username: req.body.username }))
            return res.json({ status: 'err', msg: "Username doesn't exist." });
        
        const user = await userFunctions.getUser({ username: req.body.username });
        
        if(user.password != req.body.password)
            return res.json({ status: 'err', msg: "Incorrect password." });
       
        const token = jwt.sign({ id: user.userID }, process.env.JWT_SECRET);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
            
        return res.json({ status: 'ok', msg: 0 });
    });
    app.get("/user/authenticate", async (req, res) =>
    {
        if(!userFunctions.authenticate(req))
            return res.json({ status: 'err', msg: 0 });

        const cookie = req.cookies['jwt'];

        const claims = jwt.verify(cookie, process.env.JWT_SECRET);
        const user = await userFunctions.getUser({ userID: claims.id });

        const { password, ...data } = user.toJSON();
        
        return res.json({ status: 'ok', msg: data });
    });
    app.post("/logout", async (req, res) =>
    {
        if(!userFunctions.authenticate(req))
            return res.json({ status: 'err', msg: 0 });

        res.cookie('jwt', '', { maxAge: 0 });
            
        return res.json({ status: 'ok', msg: 0 });
    });
    app.get('/register/tokens/:token', async (req, res) => {
        console.log(tokens)
        if(!tokens.some(token => token == req.params.token))
            return res.send("err");

        const user = jwt.verify(req.params.token, process.env.JWT_SECRET);
        tokens = tokens.filter(token => token != req.params.token);
        
        if(await userFunctions.exists({ username: user.username }))
            return res.send("err");

        if(await userFunctions.exists({ mail: user.mail }))
            return res.send("err");

        const model = await userModel.create(user);
        model.save();
        return res.send("Account created successfully!!!");
    });

}