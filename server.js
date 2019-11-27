'use strict'; 
//const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');

const adminRouter = require('./Routers/adminrouter');
const driverRouter = require('./Routers/driverrouter');
const scheduleRouter = require('./Routers/schedulerouter');
const sessionRouter = require('./Routers/sessionrouter');
const voterRouter = require('./Routers/voterrouter');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const app = express();

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/admin', adminRouter);
app.use('/driver', driverRouter);
app.use('/schedule', scheduleRouter);
app.use('/session', sessionRouter);
app.use('/voter', voterRouter);
app.use('/auth', authRouter);

app.use(morgan('common'));


// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

// A protected endpoint which needs a valid JWT to access it
/*app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});*/

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;



function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.set('debug', true);
    mongoose.connect(DATABASE_URL, { useNewUrlParser: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
