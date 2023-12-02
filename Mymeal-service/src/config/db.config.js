const debug = require('debug')('MyMeal-api:db');
const mongoose = require('mongoose');
const envconfig = require('./env.config')
const uri = envconfig.MONGO_URI;

const connect = async () => {
    try {
      await mongoose.connect(uri);
      debug('Connected successfully to database!!');
    } catch (error) {
      debug("[Error]: Can't connect to database!");
    }
  }

module.exports = { connect };