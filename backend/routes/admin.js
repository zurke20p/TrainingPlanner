require('dotenv').config();

const jwt = require("jsonwebtoken");

const utility = require('../functions/utility');

module.exports = (app) =>
{
    app.post("/admin/login", async (req, res) =>
    {
        if(await utility.authenticate(req, 'admin'))
            return res.json({ status: 'err', msg: "Admin is already logged in." });
        if(!req.body.passwordF || !req.body.passwordS)
            return res.json({ status: 'err', msg: 0 });
    
        if(req.body.passwordF != process.env.PASSWORDF)
            return res.json({ status: 'err', msg: "Incorrect password." });
        if(req.body.passwordS != process.env.PASSWORDS)
            return res.json({ status: 'err', msg: "Incorrect password." });
       
        const passwordObject = {
            passF: req.body.passwordF,
            passS: req.body.passwordS,
        }

        const token = jwt.sign(passwordObject, process.env.JWT_SECRET);
        res.cookie('admin', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
            
        return res.json({ status: 'ok', msg: 0 });
    });
    app.get("/admin/authenticate", async (req, res) =>
    {
        if(!await utility.authenticate(req, 'admin'))
            return res.json({ status: 'err', msg: 0 });

        const cookie = req.cookies['admin'];

        const claims = jwt.verify(cookie, process.env.JWT_SECRET);
        if(claims.passF != process.env.PASSWORDF)
            return res.json({ status: 'err', msg: "Incorrect password." });
        if(claims.passS != process.env.PASSWORDS)
            return res.json({ status: 'err', msg: "Incorrect password." });

        return res.json({ status: 'ok', msg: 0 });
    });
}