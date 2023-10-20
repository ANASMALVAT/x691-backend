const express = require("express");
const app = express();
require('dotenv').config();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json());
const cors = require('cors');
app.use(cors());

const ProjectController = require("../controllers/projectController")
const GroupController = require("../controllers/groupController");

app.post('/project' ,ProjectController.ProjectControl,
(req,res) => {
    res.status(200).json({ usersData: req.userdata});
});

app.post('/group' ,GroupController.GroupControl,
(req,res) => {
    res.status(200).json({ usersData: req.userdata});
});

module.exports = app; 