const {Schema, model} = require('mongoose')
const bcrypt = require("bcrypt")
const userSchema = new Schema(
{
	firstname: {
		type: String,
		required: [true, 'firstname is required']
	},
	lastname: {
		type: String,
	},
	email: {
		type: String,
		required: [true, 'email is required'],
		unique: true,
		validate: {
			validator: function(v){
				return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
			},
			message: props => `${props.value} is not a valid email address`
		}
	},
	hash: {
		type: String,
		required: [true, 'password is required']
	},
	role: {
		type: String,
		required: [true, 'role is required. possible values are \'admin\' and \'user\'']
	}
},
{
	timestamps: {
		createdAt: 'created_at',
    	updatedAt: 'updated_at'
	}
})


// middleware for password hashing, before inserting/saving
userSchema.pre("save", async function(next){
	try{
		if(this.hash.length < 8) throw new Error("Invalid password length")
		const salt = await bcrypt.genSalt()
		this.hash = await bcrypt.hash(this.hash, salt)
		next()
	}catch(err){
		err.path = 'password'
		next(err)
	}
})

/* User login logic for database */
userSchema.statics.login = async function(username, password){
	const user = await this.findOne({email: username})
	let err;
	if(user){
		const auth = await bcrypt.compare(password, user.hash)
		if(auth){
			return user;
		}
		err = new Error('incorrect password')
		err.key = 'password'
		err._message = 'incorrect password'
		throw err
	}
	err = new Error('incorrect username')
	err.key = 'username'
	err._message = 'incorrect username'
	throw err
}

userSchema.statics.findByID = async function(_id){
	const user = await this.findOne({_id})
	if(user){
		return user;
	}
}

const Users = model('Users', userSchema, 'users')

module.exports = Users