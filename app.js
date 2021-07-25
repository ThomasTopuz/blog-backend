const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('config');
const gateway = require("./routes/gateway");
var morgan = require('morgan')

// ENV VARS CHECK
if (!config.get("jwtPrivateKey") ) {
    console.error("jwt privatekey not defined!");
    process.exit(1);
}
if (!config.get("db")) {
    console.error("db connection string not defined!");
    process.exit(1);
}

// MIDDLEWARES
app.use(morgan('tiny'));
app.use(
    cors({
        exposedHeaders: ["x-auth-token"], //returns the x-auth-token
    })
);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api/v1', gateway);

// HEALTHCHECK ENDPOINT
app.get("/health", ((req, res) => {
    res.send('api works').status(200);
}));

// DB CONNECTION
mongoose
    .connect(config.get("db"))
    .then(() => {
        console.log("running");
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(process.env.PORT || 5000, () => console.log("Listening on 5000"))
module.exports = app;
