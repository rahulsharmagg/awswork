const User = require('../../models/user.model')
const JWT = require('../../models/jwt.model')
const handle_login_path = (req, res, next) => {
	let { username, password } = req.body
	username = username.trim().toLowerCase()
	password = password.trim()

	User.login(username, password).then((user)=>{
		if(user){
			const { firstname, lastname, email, role } = user
			JWT.generateToken({
				firstname,
				lastname,
				email,
				role
			}).then((token) => {
				res.json({
					message: 'You are logged in',
					type: 'success',
					user: { firstname, lastname, email, role },
					token
				})
			}).catch(tokenerror => {
				res.json({
					message: 'Fail to generate new token',
					type: 'error'
				})
			})
		}else{
			throw new Error('Invalid login details')
		}
	}).catch(error=>{
		res.status(401).json({
			message: error.message || 'Unauthorized',
			type: 'error'
		})
	})
}

const handle_logout_path = (req, res, next) => {
	res.json({
		message: 'You hit api logout'
	})
}


const authenticateAccess = (req, res, next) => {
	const authHeader = req.headers['authorization']

	// Check if the Authorization header exists and has a Bearer token
	if (authHeader && authHeader.startsWith('Bearer ')) {
		
		// Extract the token from the header
		const token = authHeader.split(' ')[1];
		JWT.verifyToken(token).then(result => {
			const { role } = result.data
			res.locals.payload = result.data
			if (role === 'admin') {
				req.permissions = ['CREATE', 'READ', 'UPDATE', 'DELETE']
			} else if (role === 'user') {
				req.permissions = ['READ']
			} else {
				return res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
			}
			next()
		}).catch(error => {
			res.sendStatus(401)
		})
	} else {	    
		res.status(401).json({ message: 'Unauthorized' })
	}
}

/* Export all the controller function */
exports.handle_login_path = handle_login_path;
exports.handle_logout_path = handle_logout_path;
exports.authenticateAccess = authenticateAccess;