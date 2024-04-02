require('dotenv').config();

const userFunctions = require('../functions/user');
const excersiseFunctions = require('../functions/excersise');

const excersiseModel = require('../mongoSchemas/excersiseSchema');

module.exports = (app) =>
{
    app.get("/excersise", async (req, res) =>
    {
        if(!await userFunctions.authenticate(req))
            return res.json({ status: 'err', msg: "User is not logged in" });

        const excersises = await excersiseFunctions.getExcersises();
    
        return res.json({ status: 'ok', msg: excersises });
    });
    app.post("/excersise/add", async (req, res) =>
    {
        if(!await userFunctions.authenticate(req))
            return res.json({ status: 'err', msg: "User is not logged in" });

        if(!req.body.title || req.body.desc == undefined || !req.body.type || !req.body.equipment || !req.body.visibility || req.body.videoTimeStamp == undefined || req.body.videoLink == undefined)
            return res.json({ status: 'err', msg: 1 });
        
        if(await excersiseFunctions.exists({ title: req.body.title }))
            return res.json({ status: 'err', msg: 2 });

        if(!excersiseFunctions.validate(req.body.type, req.body.equipment, req.body.visibility, req.body.videoTimeStamp))
            return res.json({ status: 'err', msg: 3 });
    
        const model = await excersiseModel.create(excersiseFunctions.createExcersise(parseInt(Date.now()), req.body.title, req.body.desc, req.body.type, JSON.stringify(req.body.equipment), req.body.visibility, req.body.videoTimeStamp, req.body.videoLink));
        model.save();
    
        return res.json({ status: 'ok', msg: 0 });
    });
}