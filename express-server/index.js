'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoute = require("./routes/User.route");
const stockRoute = require("./routes/Stock.route");
const reportRoute = require("./routes/Report.route");
const harvestRoute = require("./routes/Harvest.route");
const config = require('./config');
const morgan = require('morgan');


const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Routes
app.use('/users', userRoute);
app.use('/stocks', stockRoute);
app.use('/reports', reportRoute);
app.use('/harvest', harvestRoute);
app.listen(config.port, () => console.log('App is listening on url http://localhost:' + config.port));
