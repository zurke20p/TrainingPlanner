require('dotenv').config();

const validator = require("email-validator");
const jwt = require("jsonwebtoken");

const userFunctions = require('../functions/user');

const userModel = require('../mongoSchemas/userSchema');

module.exports = (app) =>
{
    app.post("/register", async (req, res) =>
    {
        if(!req.body.username || !req.body.mail || !req.body.password)
            return res.json({ status: 'err', msg: 0 });
        if(!validator.validate(req.body.mail))
            return res.json({ status: 'err', msg: 1 });
        if(req.body.username.length < 4 || req.body.username.length > 10)
            return res.json({ status: 'err', msg: 2 });
        if(req.body.password.length < 3 || req.body.password.length > 10)
            return res.json({ status: 'err', msg: 3 });
    
        if(await userFunctions.exists({ username: req.body.username }))
            return res.json({ status: 'err', msg: 4 });
        
        const model = await userModel.create(userFunctions.createUser(parseInt(Date.now()), req.body.username, req.body.mail, req.body.password));
        model.save();
    
        return res.json({ status: 'ok', msg: 0 });
    });
    app.post("/login", async (req, res) =>
    {
        if(!req.body.username || !req.body.password)
            return res.json({ status: 'err', msg: 0 });
    
        if(!await userFunctions.exists({ username: req.body.username }))
            return res.json({ status: 'err', msg: 1 });
        
        const user = await userFunctions.getUser({ username: req.body.username });
        
        if(user.password != req.body.password)
            return res.json({ status: 'err', msg: 2 });
       
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
}