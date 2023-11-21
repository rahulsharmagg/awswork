const { Router } = require("express")

// Import all the api controller
const { 
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
} = require("../controllers/api/api.controller")

const router = Router()

router.get('/', handle_index_path)
router.post('/auth/login', handle_login_path)
router.post('/auth/logout', handle_logout_path)

/* This api routes register user and admin after that login automatically */
router.post('/create/user', createUser, handle_login_path)
router.post('/create/admin', createAdmin, handle_login_path)


/* Todo routes */

// GET all todos
router.get('/todos', authenticateAccess, getAllTodos);

// GET a specific todo by ID
router.get('/todos/:id', authenticateAccess, getTodoById);

// POST a new todo
router.post('/todos', authenticateAccess, createTodo);

// PUT/PATCH to update a todo by ID
router.put('/todos/:id', authenticateAccess, updateTodoById);

// DELETE a todo by ID
router.delete('/todos/:id', authenticateAccess, deleteTodoById);


module.exports = router;