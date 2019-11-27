const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const bodyParser = require('body-parser');

//use ES6 promises
mongoose.Promise = global.Promise;

const {User} = require('../Schemas/userschema');
const {Schedule} = require('../Schemas/scheduleschema');
const internalMsg = 'Internal server error occured.';

//view multiple driver profiles whether with queries or none
router.get('/', (req,res)=>{
	//store the values of the queries
	const active = req.query.active;
	const verified = req.query.verified;
	let driverPromise;
	//if both queries are undefined, get all the drivers
	if(typeof(active) === "undefined" && typeof(verified) === "undefined"){
		driverPromise = User.find();
	}
	//if we have values for BOTH queries and they are strings
	else if(typeof(active) === "string" && typeof(verified) === "string"){
		//check to see if it's our expected values for both query
		if((active === "true" || active === "false") && (verified === "true" || verified === "false")){
			driverPromise = User.find({isActive: active, verified: verified});
		}
		else{
			const message = `Query values ${active} and/or ${verified} are not expected.`;
			return res.status(400).send(message);
		}
	}
	//if only one of the queries have values
	else if(typeof(active) === "string" || typeof(verified) === "string"){
		//test if active is the one with value and the values are what we expect
		if(typeof(active) === "string" && (active === "true" || active === "false")){
			driverPromise = User.find({isActive: active});
		}
		//then check verified for the same condition
		else if(typeof(verified) === "string" && (verified === "true" || verified === "false")){
			driverPromise = User.find({verified: verified});
		}
		else{
			const message = 'Query value unexpected.';
			return res.status(400).send(message);
		}
	}
	//proceed with the query to the db
	driverPromise
	.then(data => res.status(200).json(data))
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg);
	});
});

//View a single driver account/profile
router.get('/:id', (req, res) => {
	User.findById(req.params.id)
	.then(data => res.status(200).json(data))
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg);
	});
});

//View a single driver schedules
router.get('/:id/schedules', (req, res) => {
	Schedule.find({driver: req.params.id}).populate('bookings.organization')
	.then(data => {console.log(data[0].bookings); res.status(200).json(data);})
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg);
	});
});


//create a new driver profile/account
router.post('/', (req, res)=>{
	//store the required properties in an array
  console.log(req.body)
	const requiredFields = ['userFullName', 'phoneNumber', 'address', 'email', 'userName', 'password'];
	//use for loop to check if all required properties are in the req body
	for(let i=0; i<requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing ${field} in request body.`;
			//console error the message if at least one is missing
			console.error(message);
			//return with a 400 staus and the error message
			return res.status(400).send(message);
		}
	}
  
  return User.find({userName: req.body.userName})
    .countDocuments()
    .then(count => {
    console.log(count);
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(req.body.password);
    })
    .then (hash => {
      console.log('the password equals', hash)

    return User.create({
    userFullName: {
        lastName: req.body.userFullName.lastName,
        firstName: req.body.userFullName.firstName 
    },
		phoneNumber: req.body.phoneNumber,
		address: req.body.address,
		email: req.body.email,
		userName: req.body.userName,
		password: hash,
    isDriver: true
	})
  })
	.then(newDriver => res.status(201).json(newDriver))
  .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'})
});
});

//post a schedule
router.post('/:id/schedules', (req, res)=>{
	// ensure that the id in the request path and the one in request body match
	if(!(req.params.id === req.body.driver)){
		const message = `The request path ID ${req.params.id} and driver ID ${req.body.driver} should match.`;
		console.error(message);
		return res.status(400).send(message);
	}
	//store the required properties in an array
	const requiredFields = ['schedType', 'startingDate', 'endingDate', 'dayOfWeek', 'time','driver', 'bookings'];
	//use for loop to check if all required properties are in the req body
	for(let i=0; i<requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing ${field} in request body.`;
			//console error the message if at least one is missing
			console.error(message);
			//return with a 400 staus and the error message
			return res.status(400).send(message);
		}
	}
	//if all properties are in the request body
	Schedule.create({
		schedType: req.body.schedType,
		startingDate: req.body.startingDate,
		endingDate: req.body.endingDate,
		dayOfWeek: req.body.dayOfWeek,
		time: req.body.time,
		driverFirstName: req.body.firstName,
    driverLastName: req.body.lastName,
		bookings: req.body.bookings
	})
	.then(newSched => res.status(201).json(newSched))
	.catch(err => {
		console.log(err);
		res.status(500).send(internalMsg);
	});
});

//update a specific driver account/profile
router.put('/:id', (req, res)=>{
	// ensure that the id in the request path and the one in request body match
	if(!(req.params.id === req.body.id)){
		const message = `The request path ID ${req.params.id} and request body ID ${req.body.id} should match.`;
		console.error(message);
		return res.status(400).send(message);
	}
	//we need something to hold what the updated data should be
	const toUpdate = {};
	//properties that client can update
	const canBeUpdated = ['userFullName', 'phoneNumber', 'address', 'email', 'password'];
	//loop through the properties that can be updated
	//check if client sent in updated data for those
	for(let i=0; i<canBeUpdated.length;i++){
		const field = canBeUpdated[i];
		//if the property is in the req body and it is not null
		if(field in req.body && req.body.field !== null){
			//start adding the properties to the toUpdate object
			toUpdate[field] = req.body[field];
		}
	}
	//update the database by finding the id first using the id from req
	//then set the data to update
	User.findByIdAndUpdate(req.params.id, {$set: toUpdate})
	.then(()=>{
		return User.findById(req.params.id)
			.then(data => res.status(200).json(data));
	})
	.catch(err => {
		console.log(err);
		res.status(400).send(internalMsg)
	});
});

//update the schedule settings of a driver
router.put('/:id/schedules', (req, res)=>{
	// ensure that the id in the request path and the one in request body match
	if(!(req.params.id === req.body.id)){
		const message = `The request path ID ${req.params.id} and request body ID ${req.body.id} should match.`;
		console.error(message);
		return res.status(400).send(message);
	}
	//we need something to hold what the updated data should be
	const toUpdate = {};
	//properties that client can update
	const canBeUpdated = ['schedType', 'startingDate', 'endingDate', 'dayOfWeek', 'time'];
	//loop through the properties that can be updated
	//check if client sent in updated data for those
	for(let i=0; i<canBeUpdated.length;i++){
		const field = canBeUpdated[i];
		//if the property is in the req body and it is not null
		if(field in req.body && req.body.field !== null){
			//start adding the properties to the toUpdate object
			toUpdate[field] = req.body[field];
		}
	}
	Schedule.findOneAndUpdate({driver: req.params.id}, {$set: toUpdate}, {new: true})
	.then(()=>{
		return Schedule.find({driver: req.params.id})
			.then(data => res.status(200).json(data));
	})
	.catch(err => {
		console.log(err);
		res.status(400).send(internalMsg)
	});
});

//disable a specific driver profile/account by setting isActive to false
router.delete('/:id', (req,res)=>{
	User.findByIdAndUpdate(req.params.id, {$set: {isActive: "false"}})
	.then(result=> res.status(204).end())
	.catch(err => {
		console.log(err);
		res.status(400).send(internalMsg)
	});
});


module.exports = router;