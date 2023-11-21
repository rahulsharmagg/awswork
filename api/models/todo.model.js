const { Schema, model } = require('mongoose')

/**
 * Todo Schema for database collection
 * @type {Schema}
 */
const todoSchema = new Schema({
	list_id: {
		type: Number,
		default: 0
	},
	title: {
		type: String,
		required: true
	},
	details: {
		type: String
	},
	due_date: {
		type: String
	},
	completed: {
		type: Boolean,
		default: false
	},
	creator: {
		type: String,
	}
},
{
	timestamps: {
		createdAt: 'created_at',
    	updatedAt: 'updated_at'
	}
})


todoSchema.statics.findByID = async function(id){
	const list = await this.findOne({list_id: id})
	return list
}

todoSchema.statics.findLastID = async function(){
	const latest = await this.find({}).sort({ created_at: -1 }).limit(1)
	console.log(latest)
	if(latest.length > 0){
		return latest[0]
	}else{
		return { list_id: 0 }
	}
}

todoSchema.statics.updateByID = async function(id, updateData) {
	try {
		const updatedTodo = await this.updateOne({list_id: id}, updateData, { new: true });
		return updatedTodo;
	} catch (error) {
		throw new Error(`Error updating Todo by ID: ${error}`);
	}
};

todoSchema.statics.deleteById = async function(id) {
	try {
		const deleteTodo = await this.deleteOne({list_id: id});
		return deleteTodo;
	} catch (error) {
		throw new Error(`Error updating Todo by ID: ${error}`);
	}
}

const Todo = model('Todo', todoSchema, 'mytodo')

module.exports = Todo
