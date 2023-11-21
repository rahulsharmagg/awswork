const User = require('../../models/user.model')

const {handle_login_path, handle_logout_path, authenticateAccess} = require('./auth-controller');
const {
	getAllTodos,
	getTodoById,
	createTodo,
	updateTodoById,
	deleteTodoById
} = require('./todo-controller')

const handle_index_path = (req, res, next) => {
	res.sendStatus(200)
}
const register = (req, res, next) => {
	const role = req.role || 'user'
	let {firstname, lastname, email, password} = req.body
	firstname = firstname.trim().toLowerCase()
	lastname = lastname.trim().toLowerCase()
	email = email.trim().toLowerCase()
	password = password.trim()

	/* Proceed creation of user/admin */
	User.create({firstname, lastname, email, hash: password, role}).then((user) => {
		if(user._id){
			req.body.username = email
			req.body.password = password
			next()
		}
	}).catch(error=>{
		if(error.code === 11000){
			error.message = `${email} alreay exists`
		}
		res.status(400).json({
			message: error.message || 'Error creating new user',
			type: 'error'
		})
	})
}

/**
 * Register User and Admin
 * @param  {[type]}   req  [HTTP Request Object]
 * @param  {[type]}   res  [HTTP Response Object]
 * @param  {Function} next [Trigger next middleware]
 * @return {[type]}        [HTTP Response (JSON)]
 */
const createUser = [(req, res, next)=>{
	req.role = 'user'
	next()
}, register];

const createAdmin = [(req, res, next)=>{
	req.role = 'admin'
	next()
}, register];


/* Exports all the controller functons */
module.exports = {
	handle_index_path,
	handle_login_path,
	handle_logout_path,
	createUser,
	createAdmin,
	authenticateAccess,
	getAllTodos,
	getTodoById,
	createTodo,
	updateTodoById,
	deleteTodoById
}