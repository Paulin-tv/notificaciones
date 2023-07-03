/*
const db = require("../db/notifications.js")
const knex = require("../db/knex");
const Schema = db.Schema;

const taskSchema = new Schema({
    task: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = db.model("task", taskSchema);