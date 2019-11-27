const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const bodyParser = require('body-parser');

//use ES6 promises
mongoose.Promise = global.Promise;

const {User} = require('../Schemas/userschema');
const incorrectMsg = 'Incorrect credentials.';

router.post('/', (req, res)=>{
	const requiredFields = ['username', 'password'];
		for(let i=0; i < requiredFields.length; i++){
    		const field = requiredFields[i];
    		if(!(field in req.body)){
    			const message = `Missing ${field} in request body.`;
				console.error(message);
				return res.send(message);
    		}
    	}
    //check Driver collection first
    User.findOne({username: req.body.username})
    .then(data => {
    	//if no document was found with matching username, look in the voter collection
    	if(data === null && typeof(data) === 'object'){
        	return User.findOne({username: req.body.username})
        			.then(data => {
        				if(data === null && typeof(data) === 'object'){
        					res.send(incorrectMsg);
        				}
        				else{
        					if(data.password === req.body.password){
        						res.status(200).json({voterToken: data._id});
        					}
        					else{
        						res.send(incorrectMsg);
        					}
        				}
        			});
    	}
    	else{
        	if(data.password === req.body.password){
        		res.status(200).json({driverToken: data._id});
        	}
        	else{
        		res.send(incorrectMsg);
        	}
    	}
    });

    router.delete('/', (req,res) => {
        //do something
    });
});


module.exports = router;