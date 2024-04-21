require('dotenv').config();

const validator = require("email-validator");
const jwt = require("jsonwebtoken");

const userFunctions = require('../functions/user');
const utility = require('../functions/utility');

const userModel = require('../mongoSchemas/userSchema');
const friendRequestModel = require('../mongoSchemas/friendRequestSchema');

let tokens = new Array();

module.exports = (app) =>
{
    app.post("/register", async (req, res) =>
    {
        if(req.cookies["emailSent"])
            return res.json({ status: 'err', msg: 0 });
        if(await utility.authenticate(req))
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
        if(await utility.authenticate(req))
            return res.json({ status: 'err', msg: "User is already logged in." });
        if(!req.body.username || !req.body.password)
            return res.json({ status: 'err', msg: "Username or password empty" });
    
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
        if(!await utility.authenticate(req))
            return res.json({ status: 'err', msg: 0 });

        const cookie = req.cookies['jwt'];

        const claims = jwt.verify(cookie, process.env.JWT_SECRET);
        const user = await userFunctions.getUser({ userID: claims.id });

        const { password, ...data } = user.toJSON();
        
        return res.json({ status: 'ok', msg: data });
    });
    app.post("/logout", async (req, res) =>
    {
        if(!await utility.authenticate(req))
            return res.json({ status: 'err', msg: 0 });

        res.cookie('jwt', '', { maxAge: 0 });
            
        return res.json({ status: 'ok', msg: 0 });
    });
    app.get('/register/tokens/:token', async (req, res) => {
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
    app.post("/getPotentialFriends", async (req, res) => {
        if(!await utility.authenticate(req))
            return res.json({ status: 'err', msg: "User not logged in." });

        if(!req.body.nickName)
            return res.json({ status: 'err', msg: "No nickname was given." });

        let users = await userFunctions.getUsers({ username: new RegExp(req.body.nickName, 'i') });
        
        // prevents user from searching themselfs
        const cookie = req.cookies['jwt'];
        const claims = jwt.verify(cookie, process.env.JWT_SECRET);
        const user = await userFunctions.getUser({ userID: claims.id });
        users = users.filter(el => el.username != user.username);

        // removes users that already have sent or received invitation(I have no idea how but it works)
        users = await users.reduce(async (acc, v) => {
            const result = !await userFunctions.friendRequestExists(user.userID, v.userID);
            if (!result) {
                return acc;
            }
            return (await acc).concat(v);
        }, []);

        users = users.filter(el => !(el.userID in user.friends));

        users = users.map(el => el.username);

        return res.json({ status: 'ok', msg: users});
    });
    app.post("/sendFriendRequest", async (req, res) => {
        if(!await utility.authenticate(req))
            return res.json({ status: 'err', msg: "User not logged in." });
        if(!req.body.nickName)
            return res.json({ status: 'err', msg: "No nickname was given." });

        const cookie = req.cookies['jwt'];
        const claims = jwt.verify(cookie, process.env.JWT_SECRET);
        const sender = await userFunctions.getUser({ userID: claims.id });
        const receiver = await userFunctions.getUser({username: req.body.nickName});

        if(!receiver)
            return res.json({ status: 'err', msg: "No matching user for receiver found" });    
        if(sender.userID == receiver.userID)
            return res.json({ status: 'err', msg: "Sender and receiver are the same user." });
        if(await userFunctions.friendRequestExists(sender.userID, receiver.userID))
            return res.json({ status: 'err', msg: "Friend request already exists." });

        
        const friendRequest = userFunctions.createFriendRequest(sender.userID, receiver.userID);
        const model = await friendRequestModel.create(friendRequest);
        model.save();

        return res.json({ status: 'ok', msg: "success"});
    })
    app.post("/getFriendRequests", async (req, res) => {
        if(!await utility.authenticate(req))
            return res.json({ status: 'err', msg: "User not logged in." });
        
        const cookie = req.cookies['jwt'];
        const claims = jwt.verify(cookie, process.env.JWT_SECRET);
        const user = await userFunctions.getUser({ userID: claims.id });

        let sentFriendRequest = await userFunctions.getSentFriendRequests(user.userID);
        let receivedFriendRequests = await userFunctions.getReceivedFriendRequests(user.userID);

        sentFriendRequest = await Promise.all(sentFriendRequest.map(async (el) =>  {
            el = await userFunctions.getUser({ userID: el.receiverID });
            return el.username;
        }));

        receivedFriendRequests = await Promise.all(receivedFriendRequests.map(async (el) =>  {
            el = await userFunctions.getUser({ userID: el.senderID });
            return el.username;
        }));

        return res.json({ status: 'ok', msg: [sentFriendRequest, receivedFriendRequests]});
    })
    app.post("/cancelFriendRequest", async (req, res) => {
        if(!await utility.authenticate(req))
            return res.json({ status: 'err', msg: "User not logged in." });
        if(!req.body.nickName)
            return res.json({ status: 'err', msg: "No nickname was given." });
        if(!("sent" in req.body))
            return res.json({ status: 'err', msg: "No information about sender was given." });

        const cookie = req.cookies['jwt'];
        const claims = jwt.verify(cookie, process.env.JWT_SECRET);
        const user = await userFunctions.getUser({ userID: claims.id });

        const user2 = await userFunctions.getUser({username: req.body.nickName});
        if(!user2)
            return res.json({ status: 'err', msg: "No matching user for given nickname." });  

        let requestDeleted = await userFunctions.deleteFriendRequest({senderID : req.body.sent ? user.userID : user2.userID, receiverID : req.body.sent ? user2.userID : user.userID});

        if(!requestDeleted)
            return res.json({ status: 'err', msg: "Couldn't find matching friend request." });  
        

        return res.json({ status: 'ok', msg: "Friend request successfully deleted."});
    })
    app.post("/acceptFriendRequest", async (req, res) => {
        if(!await utility.authenticate(req))
            return res.json({ status: 'err', msg: "User not logged in." });
        if(!req.body.nickName)
            return res.json({ status: 'err', msg: "No nickname was given." });

        const cookie = req.cookies['jwt'];
        const claims = jwt.verify(cookie, process.env.JWT_SECRET);
        const user = await userFunctions.getUser({ userID: claims.id });

        const sender = await userFunctions.getUser({username: req.body.nickName});
        if(!sender)
            return res.json({ status: 'err', msg: "No matching user for given nickname." });  

        let requestDeleted = await userFunctions.deleteFriendRequest({senderID : sender.userID, receiverID : user.userID});
        if(!requestDeleted)
            return res.json({ status: 'err', msg: "Couldn't find matching friend request." });  
        
        user.friends.push(sender.userID);
        sender.friends.push(user.userID);

        userFunctions.changeData({userID: user.userID}, {friends: user.friends})
        userFunctions.changeData({userID: sender.userID}, {friends: sender.friends})

        return res.json({ status: 'ok', msg: "Friend request successfully accepted."});
    })

}