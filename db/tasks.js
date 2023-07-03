const knex = require("./knex");

//Creating the database operations to create, retrieve, delete and update task objects from 'tasks' table previously created through GUI DBBrowser
//In this case the 'models' are contained in the database, since it has the data structure we will be using to push and receive tasks. 

function createTask(task) {
    return knex("tasks").insert(task);
};

function getAllTasks(){
    return knex("tasks").select("*");
};

function deleteTask(id){
return knex ("tasks").where("id", id).del();
};

function updateTask(id, task){
    return knex("tasks").where("id", id).update(task);
};

function getTaskById(id) {
    return knex('tasks')
        .select('*')
        .where('id', id)
        .first();
}

function getTasksByUserId(userId) {
    return knex("tasks")
        .select("*")
        .where("userId", userId);
}


//Exporting functions that will be used in server.js
module.exports = {
    createTask,
    getAllTasks,
    deleteTask,
    updateTask,
    getTaskById,
    getTasksByUserId
};