require('dotenv').config();

const userFunctions = require('../functions/user');
const excersiseFunctions = require('../functions/excersise');

const excersiseModel = require('../mongoSchemas/excersiseSchema');

module.exports = (app) =>
{
    app.post("/excersise/add", async (req, res) =>
    {
        if(!userFunctions.authenticate(req))
            return res.json({ status: 'err', msg: 0 });

        if(!req.body.title || !req.body.desc || !req.body.type || !req.body.equipment || !req.body.visibility)
            return res.json({ status: 'err', msg: 0 });
        
        if(await excersiseFunctions.exists({ title: req.body.title }))
            return res.json({ status: 'err', msg: 1 });

        if(!excersiseFunctions.validate(req.body.type, req.body.equipment, req.body.visibility))
            return res.json({ status: 'err', msg: 2 });
    
        const model = await excersiseModel.create(excersiseFunctions.createExcersise(parseInt(Date.now()), req.body.title, req.body.desc, req.body.type, JSON.stringify(req.body.equipment), req.body.visibility));
        model.save();
    
        return res.json({ status: 'ok', msg: 0 });
    });
}