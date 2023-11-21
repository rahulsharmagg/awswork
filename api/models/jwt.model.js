const jwt = require('jsonwebtoken')
require("dotenv").config()

// JWT class methods
class JWT{
	static async generateToken(payload){
		return await jwt.sign({data: payload}, process.env.JWT_SECRET, {expiresIn: '10h'})
	}
	static async verifyToken(token){
		return await jwt.verify(token, process.env.JWT_SECRET)
	}
}

module.exports = JWT