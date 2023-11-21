const Todo = require('../../models/todo.model')

/**
 * Sanitize response
 */
function sanitizeResponse(todoObj, isAdmin) {
  const {__v, _id, ...todo} = todoObj
  if (!isAdmin) {
    const { creator, ...sanitizedTodo } = todo;
    return sanitizedTodo;
  }
  return todo;
}


/**
 * Returns all the todo lists
 */
const getAllTodos = async (req, res, next) => {
	const { permissions } = req
	const { payload } = res.locals
	const isAdmin = payload.role === 'admin' ? true : false

	if(permissions.indexOf('READ') !== -1){
		const lists = await Todo.find()
		const sanitizedList = lists.map(({_doc}) => sanitizeResponse(_doc, isAdmin))
		const count = sanitizedList.length
		res.json({
			message: `Found ${count} lists`,
			count,
			lists: sanitizedList
		})
	}else{
		return res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
	}
}

/**
 * Finds todo list by Id
 */
const getTodoById = async (req, res, next) => {
	const { permissions } = req
	const { payload } = res.locals
	const id = req.params.id
	const isAdmin = payload.role === 'admin' ? true : false
	if(permissions.indexOf('READ') !== -1){
		const lists = await Todo.findByID(id)
		if(lists){
			const sanitizedList = [sanitizeResponse(lists._doc, isAdmin)]
			const count = sanitizedList.length
			res.json({
				message: `Found ${count} list`,
				count,
				lists: sanitizedList
			})
		}else{
			return res.status(404).json({ message: 'Not Found: No list found for list Id: '+id })
		}
	}else{
		return res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
	}
}

/**
 * Creates new todo list
 */
const createTodo = async (req, res, next) => {
	const { permissions } = req
	const { payload } = res.locals
	let { title, details, dueDate } = req.body
	let creator = payload.email
	if(permissions.indexOf('CREATE') !== -1){
		const latest = await Todo.findLastID()
		try{
			const id = latest.list_id + 1
			const list = await Todo.create({
				title,
				details,
				creator,
				list_id: id,
				due_date: dueDate
			})
			await res.json({
				message: 'Create Successfully',
				status: 'success',
				list_id: list.list_id,
				payload: {
					title,
					details,
					due_date: dueDate
				}
			})
		}catch(error){
			res.status(400).json({
				message: error.message || 'Error creating new list',
				type: 'error'
			})
		}
	}else{
		return res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
	}
}

/**
 * Update field of todo list by id
 */
const updateTodoById = async (req, res, next) => {
	const { permissions } = req
	const { payload } = res.locals
	const id = parseInt(req.params.id)
	const updateKeys = req.body

	/* Converting To Boolean */
	if(updateKeys.completed === 'true'){
		updateKeys.completed = true
	}else{
		updateKeys.completed = false
	}

	if(permissions.indexOf('UPDATE') !== -1){
		try {
			const updated = await Todo.updateByID(id, updateKeys)
			res.json({
				list_id: id,
				message: 'Update Successfully',
				payload: updateKeys,
				modified_count: updated.modifiedCount,
				type: 'success'
			})
		} catch(error) {
			res.status(400).json({
				message: error.message || 'Error updating list',
				type: 'error'
			})
		}
	}else{
		return res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
	}
}

/**
 * Delete todo list by id
 */
const deleteTodoById = async (req, res, next) => {
	const { permissions } = req
	const { payload } = res.locals
	const id = parseInt(req.params.id)

	if(permissions.indexOf('DELETE') !== -1){
		try {
			const deleted = await Todo.deleteById(id)
			res.json({
				list_id: id,
				message: 'Delete Successfully',
				type: 'success',
				deleted_count: deleted.deletedCount
			})
		} catch(error) {
			res.status(400).json({
				message: error.message || 'Error deleting list',
				type: 'error'
			})
		}
	}else{
		return res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
	}
}


module.exports = {
	getAllTodos,
	getTodoById,
	createTodo,
	updateTodoById,
	deleteTodoById
}