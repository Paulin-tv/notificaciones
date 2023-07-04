const express = require("express");
const app = express();
const db = require("../db/tasks.js")
const bodyParser = require("body-parser");
const knex = require("../db/knex");
const cors = require ("cors");
const PORT = 5000;
const {authUser, authUserr, authAdmin} = require('./middlewares.js')


//parsing the req to a json body. (middleware)
app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());  Modified from bodyParser to express due to 'managing user roles' tutorial
app.use(express.json());


//Enabling CORS for all routes in my app
app.use(cors());

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.get("/test", (req, res) => {
    res.status(200).json({ success: true })
});

//#API REQUESTS OR ENDPOINTS

//This function checks if database tasks exists. If so, it will post the new task object. Else, it will create the table and then call the 'createTask function to post.
//Admin permit doesnt work when passed on postman due to table not containing a value field.Will assign userId 1 to admin upon creation. 
app.post("/tasks", authUser(["1"]), async (req, res) => {
    try {
        const tableExists = await knex.schema.hasTable("tasks");
        if (tableExists) {
            const results = await db.createTask(req.body);
        } else {
            await knex.schema.createTable("tasks", (table) => {
                table.increments("id").primary();
                table.string("name");
                table.string("description");
                table.integer("userId");
                table.string("assignedTo");
            });
            const results = await db.createTask(req.body);
            res.status(200).json({id: results[0]});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
});

//Retrieves all existing tasks in table regardless of userId
//Admin permit works
app.get("/tasks", authAdmin(["admin"]), async (req, res) => {
    const tasks = await db.getAllTasks();
    res.status(200).json({tasks});
});

//Retrieves task by individual id, this will serve upon clicking on it and being able to edit them
//permits for admin work fine when "role":"admin" is passed
app.get("/tasks/:id", authAdmin(["admin"]), async (req, res) => {
    try {   const task = await db.getTaskById(req.params.id);
            res.status(200).json(task);
       
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
});


// put request to update existing tasks
app.put("/tasks/:id", authAdmin(["admin"]), async (req, res) => {
    try {
        const id = await db.updateTask(req.params.id, req.body);
        res.status(200).json({id});
    } catch (err) {
     res.send(error).json({error: "error"})
    }
});

//Delete request of individual task
app.delete("/tasks/:id", authAdmin(["admin"]), async (req, res) => {
    try {
            await db.deleteTask(req.params.id);
            res.status(200).json({success: true});
       
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
});


//# USER ENDPOINTS

//Retrieves all tasks by userId, used to display the array of tasks in the feed filtered by userId.
app.get("/main/:userId", authUser(), async (req, res) => {
    try {
        const tasks = await db.getTasksByUserId(req.params.userId);
        console.log(tasks); // log the tasks array to the console
        res.status(200).json({tasks});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
});


app.listen(PORT, () => console.log("Server is running on port 5000."));
