'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const {User} = require('../Schemas/userschema');
const mongoose = require('mongoose');

// this makes the expect syntax available throughout
// this module
const expect = chai.expect;

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedUserData() {
  console.info('seeding user data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateUserData());
  }
  // this will return a promise
  return User.insertMany(seedData);
}

// used to generate data to put in db
function generateUserFullName() {
  const userFullName = [
    'firstName', 'lastName'];
  return userFullName [Math.floor(Math.random() * userFullName.length)];
}

// used to generate data to put in db
function generateAddress() {
  const address = ['street', 'city', 'state', 'zipcode'];
  return address[Math.floor(Math.random() * address.length)];
}

// used to generate data to put in db
function generateIsDriver() {
  const driverTruth = ['true', 'false'];

  };
  
function generateIsVoter() {
  const voterTruth = ['true', 'false'];

}

// generate an object represnting a user.
// can be used to generate seed data for db
// or request.body data
function generateUserData() {
  return {
    userFullName: generateUserFullName(),
    address: generateAddress(),
    isVoter: generateIsVoter(),
    isDriver: generateIsDriver(),
    isVoter: generateIsDriver(),
  };
}


// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Users API resource', function() {

  // we need each of these hook functions to return a promise
  // otherwise we'd need to call a `done` callback. `runServer`,
  // `seedRUserData` and `tearDownDb` each return a promise,
  // so we return the value returned by these function calls.
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedUserData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  // note the use of nested `describe` blocks.
  // this allows us to make clearer, more discrete tests that focus
  // on proving something small
  describe('GET endpoint', function() {

    it('should return all existing users', function() {
      // strategy:
      //    1. get back all users returned by by GET request to `/users`
      //    2. prove res has right status, data type
      //    3. prove the number of users we got back is equal to number
      //       in db.
      //
      // need to have access to mutate and access `res` across
      // `.then()` calls below, so declare it here so can modify in place
      let res;
      return chai.request(app)
        .get('../Routers/driverrouter')
        .get('../Routers/voterrouter')
        .then(function(_res) {
          // so subsequent .then blocks can access response object
          res = _res;
          expect(res).to.have.status(200);
          // otherwise our db seeding didn't work
          expect(res.body.users).to.have.lengthOf.at.least(1);
          return User.count();
        })
        .then(function(count) {
          expect(res.body.users).to.have.lengthOf(count);
        });
    });
    

        it('should return all existing users', function() {
      // strategy:
      //    1. get back all users returned by by GET request to `/users`
      //    2. prove res has right status, data type
      //    3. prove the number of users we got back is equal to number
      //       in db.
      //
      // need to have access to mutate and access `res` across
      // `.then()` calls below, so declare it here so can modify in place
      let res;
      return chai.request(app)
        .get('../Routers/driverrouter')
        .get('../Routers/voterrouter')
        .then(function(_res) {
          // so subsequent .then blocks can access response object
          res = _res;
          expect(res).to.have.status(200);
          // otherwise our db seeding didn't work
          expect(res.body.users).to.have.lengthOf.at.least(1);
          return User.count();
        })
        .then(function(count) {
          expect(res.body.users).to.have.lengthOf(count);
        });
    });

    
    it('should return users with right fields', function() {
      // Strategy: Get back all users, and ensure they have expected keys

      let resUser;
      return chai.request(app)
        .get('../Routers/driverrouter')
        .get('../Routers/voterdriver')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.userFullName).to.be.a('array');
          expect(res.body.resUser).to.have.lengthOf.at.least(1);

          res.body.resUser.forEach(function(resUser) {
            expect(resUser).to.be.a('object');
            expect(resUser).to.include.keys(
              'id', 'userFullName', 'phoneNumber', 'address', 'isVoter', 'isDriver');
          });
          resUser = res.body.driverrouter[0];
          return User.findById(resUser.id);
        })
        .then(function(resUser) {

          expect(resUser.id).to.equal(resUser.id);
          expect(resUser.userFullName.firstName).to.equal(resUser.userFullName.firstName);
          expect(resUser.userFullName.lastName).to.equal(resUser.userFullName.lastName);
          expect(resUser.phoneNumber).to.equal(resUser.phoneNumber);
          expect(resUser.isVoter).to.equal(resUser.isVoter);
          expect(resUser.isDriver).to.equal(resUser.isDriver);
          expect(resUser.address.street).to.contain(resUser.address.street);
          expect(resUser.address.city).to.contain(resUser.address.city);
          expect(resUser.address.state).to.contain(resUser.address.state);
          expect(resUser.address.zipcode).to.contain(resUser.address.zipcode);
        });
    });
  });

  describe('POST endpoint', function() {
    // strategy: make a POST request with data,
    // then prove that the user we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new user', function() {

      const newUser = generateUserData();

      return chai.request(app)
        .post('../Routers/driverrouter')
        .post('../Routers/voterrouter')
        .send(newUser)
        .then(function(res) {
          expect(res).to.have.status(201);newUser
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'userFullName', 'phoneNumber', 'address', 'isVoter', 'isDriver');
          expect(res.body.userFullName.firstName).to.equal(newUser.userFullName.firstName);
          expect(res.body.userFullName.lastName).to.equal(newUser.userFullName.lastName);
          expect(res.body.phoneNumber).to.equal(newUser.phoneNumber);
          expect(res.body.address.street).to.equal(newUser.address.street);
          expect(res.body.address.city).to.equal(newUser.address.city);
          expect(res.body.address.state).to.equal(newUser.address.state);
          expect(res.body.address.zipcode).to.equal(newUser.address.zipcode);
          // cause Mongo should have created id on insertion
          expect(res.body.id).to.not.be.null;
          expect(res.body.isVoter).to.equal(newUser.isVoter);
          expect(res.body.isDriver).to.equal(newUser.isDriver);


          return newUser.findById(res.body.id);
        })
        .then(function(newUser) {
          expect(newUser.userFullName.firstName).to.equal(newUser.UserFullName.firstName);
          expect(newUser.userFullName.lastName).to.equal(newUser.UserFullName.lastName);
          expect(newUser.phoneNumber).to.equal(newUser.phoneNumber);
          expect(newUser.address.street).to.equal(newUser.address.street);
          expect(newUser.address.city).to.equal(newUser.address.city);
          expect(newUser.address.state).to.equal(newUser.address.state);
          expect(newUser.address.zipcode).to.equal(newUser.address.zipcode);
          expect(newUser.isVoter).to.equal(newUser.isVoter);
          expect(newUser.isDriver).to.equal(newUser.isDriver);
        });
    });
  });

  describe('PUT endpoint', function() {

    // strategy:
    //  1. Get an existing user from db
    //  2. Make a PUT request to update that user
    //  3. Prove user returned by request contains data we sent
    //  4. Prove user in db is correctly updated
    it('should update fields you send over', function() {
      const updateData = {
        firstname: 'fofofofofofofof',
        lastname: 'fsdjkfdsfs',
        street: 'main',
        city: 'town',
        state: 'CC',
        zipcode: '55555'
      };

      let updatedUser
      
      return updatedUser
        .findOne()
        .then(function(updatedUser) {
          updateData.id = updatedUser.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/Routers/driverrouter/${updatedUser.id}`)
            .put(`/Routers/voterrouter/${updatedUser.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return User.findById(updateData.id);
        })
        .then(function(user) {
          expect(user.userFullName.firstName).to.equal(updateData.userFullName.firstName);
          expect(user.userFullName.lastName).to.equal(updateData.userFullName.lastName);
          expect(user.phoneNumber).to.equal(updateData.phoneNumber);
          expect(user.address.street).to.equal(updateData.address.street);
          expect(user.address.city).to.equal(updateData.address.city);
          expect(user.address.state).to.equal(updateData.address.state);
          expect(user.address.zipcode).to.equal(updateData.address.zipcode);
          expect(user.isVoter).to.equal(updateData.address.isVoter);
          expect(user.isDriver).to.equal(updateData.address.isDriver);
        });
    });
  });

  describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a user
    //  2. make a DELETE request for that user's id
    //  3. assert that response has right status code
    //  4. prove that user with the id doesn't exist in db anymore
    it('delete a user by id', function() {

      let user;

      return User
        .findOne()
        .then(function(_user) {
          user = _user;
          return chai.request(app).delete(`Routers/driverrouter/${user.id}`);
          return chai.request(app).delete(`Routers/voterrouter/${user.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return User.findById(user.id);
        })
        .then(function(_user) {
          expect(_user).to.be.null;
        });
    });
  });
});
