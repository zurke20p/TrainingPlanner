const userModel = require('../mongoSchemas/userSchema');

const jwt = require("jsonwebtoken");

module.exports = {
    exists: async (search) =>
    {
        const user = await userModel.findOne(search);

        return user != undefined;
    },
    getUser: async (search) =>
    {
        const user = await userModel.findOne(search);

        return user;
    },
    createUser: (id, name, mail, password) =>
    {
        const user = {
            userID: id,
            username: name,
            mail: mail,
            password: password,
        };

        return user;
    },
    changeData: async (filter, data) =>
    {
        await userModel.findOneAndUpdate(
            filter, 
            { $set: data });
    },
}