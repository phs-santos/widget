const express = require('express');
const app = express()

const cors = require('cors');
app.use(cors());


app.get('/', express.static(__dirname + '/public'));
app.use('/component', express.static(__dirname + '/build'));

module.exports = app;