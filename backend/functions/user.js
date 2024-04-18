const userModel = require('../mongoSchemas/userSchema');
const friendRequestModel = require('../mongoSchemas/friendRequestSchema');

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
    getUsers: async (search) =>
    {
        const user = await userModel.find(search);

        return user;
    },
    createUser: (id, name, mail, password) =>
    {
        const user = {
            userID: id,
            username: name,
            mail: mail,
            password: password,
            friends : []
        };

        return user;
    },
    createFriendRequest: (senderID, receiverID) => {
        const friendRequest = {
            senderID: senderID,
            receiverID: receiverID
        };

        return friendRequest;
    },
    friendRequestExists: async (userID1, userID2) => {
        const res = await friendRequestModel.findOne({
            $or:[
                {
                    $and:[
                        {senderID: userID1},
                        {receiverID: userID2}
                    ]
                },{
                    $and:[
                        {senderID: userID2},
                        {receiverID: userID1}
                    ]
                }
            ]
        });
        if(res)
            return true;
        else
            return false;
    },
    getReceivedFriendRequests: async (userID) => {
        const res = await friendRequestModel.find({
            receiverID: userID
        });
        if(res)
            return res;
        else
            return false;
    },
    getSentFriendRequests: async (userID) => {
        const res = await friendRequestModel.find({
            senderID: userID
        });
        if(res)
            return res;
        else
            return false;
    },
    deleteFriendRequest: async (search) => {
        const res = await friendRequestModel.findOneAndDelete(search);
        
        return res;
    },
    changeData: async (filter, data) =>
    {
        await userModel.findOneAndUpdate(
            filter, 
            { $set: data });
    },
    authenticate: async (req) =>
    {
        const cookie = req.cookies['jwt'];
        if(!cookie) return false;
        
        const claims = jwt.verify(cookie, process.env.JWT_SECRET);

        if(!claims) return false;
    
        return true;
    },

}