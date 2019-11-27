const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var scheduleSchema = mongoose.Schema({
	schedType: {
		type: String,
		required: true
	},
	startingDate: {
		required: true,
		type: Date
	},
	endingDate: {
		required: true,
		type: Date
	},
	dayOfWeek: [{
		required: true,
		type: Number
	}],
	time: {
		hour: {required: true, type: Number},
		minutes: {required: true, type: Number}
	},
	driver:{ 
		type: mongoose.Schema.Types.ObjectId, //string with ID of driver
		ref: 'driver',
		required: true
	},
	voter: {
		type: String, 
		required: true
	},
	bookings: [{
		date: {type: Date},
		voter: {type: mongoose.Schema.Types.ObjectId, ref: 'Voter'},
		voterName: {type: String}
	}]
});

scheduleSchema.virtual('hourMin').get(function(){
	return `${this.time.hour}:${this.time.minutes}`;
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = {Schedule};