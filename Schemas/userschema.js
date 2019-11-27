const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

var userSchema = mongoose.Schema({
	userFullName: {
		firstName: {type: String, required: true},
		lastName: {type: String, required: true}
	},
	phoneNumber: {
		type: String,
		required: true
	},
	address: {
		street: {type: String, required: true},
		city: {type: String, required: true},
		state: {type: String, required: true},
		zipcode: {type: String, required: true}
	},
	email: {
		type: String,
		required: true
	},
	userName: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	verified: {
		type: Boolean,
		required: true,
		default: false
	},
	memberSince: {
		type: Date,
		required: true,
		default: Date.now
	},
	isActive: {
		type: Boolean,
		required: true,
		default: true
	},
  isDriver: {
  type: Boolean,
  default: false
},
  isVoter: {
  type: Boolean,
  default: false
},
  isAdmin: {
  type: Boolean,
  default: false
   }
});


userSchema.virtual('fullName').get(function(){
	return `${this.userFullName.firstName} ${this.userFullName.lastName}`;
});

userSchema.virtual('fullAddress').get(function(){
	return `${this.address.building}, ${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipcode}`;
});

userSchema.methods.serialize = function() {
  console.log("User schema serialized method = " + this)
  return {
    userFullName: this.fullName,
    phoneNumber: this.phoneNumber,
    address: this.fullAddress,
    email: this.email,
    id: this._id,
    userName: this.userName,
    verified: this.verified,
    memberSince: this.memberSince,
    isActive: this.isActive,
    isDriver: this.isDriver,
    isVoter: this.isVoter
  };
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = {User};