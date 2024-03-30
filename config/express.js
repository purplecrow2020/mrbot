const express = require('express');
const config = require('./config');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');


const app = express();


app.use(helmet());
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));
app.use(bodyParser.json({ limit: '50mb' }));


app.set('config', config)


const client = new MongoClient(config.mongo.host);
console.log("connecting to mongo", config.mongo.host)


dbInit();

async function dbInit() {
    await client.connect()
    const mongoConnection = client.db(config.mongo.dbname)
    app.set('db', mongoConnection)
    console.log("connected to mongodb !!")
}



for (const k in config.versions) {
    app.use(config.versions[k], require(`../server${config.versions[k]}/index.route`));
}


module.exports = app;