require('dotenv').config();

const express = require("express");
const mongoose = require('mongoose');

const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const fs = require("fs");

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

const routeFiles = fs.readdirSync(`./routes/`).filter(file => file.endsWith('.js'));
for (const file of routeFiles)
{
    const route = require(`./routes/${file}`);
    route(app);
}

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_SRV)
.then(() => console.log('Connected to the database!'))
.catch(err => console.error(err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));