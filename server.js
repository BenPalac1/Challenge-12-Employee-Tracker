const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//create connection with mysql
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '15_LesPaul_15',
        database: 'employee_db'
    },
    console.log(`Successfully connected to employee_db database!`)
);

db.connect(function (err) {
    if (err) throw err;
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    start();
});

// app starts and show choices for user to select from
function start() {
    inquirer
        .prompt({
            type: "list",
            name: "choices",
            message: "What wouyld you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a dept",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Quit"
            ],
        })
        .then((answer) => {
            switch (answer.choices) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viewAllEmployees();
                    break;
                case "Add a dept":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case  "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee role":
                    updateEmployeeRole();
                    break;
                case "Quit":
                    db.end();
                    console.log("Successfully Disconnected!");
                    break;
            }
        });
}

function viewAllDepartments() {
    db.query("SELECT * FROM departments", (err, res) => {
        if (err) throw err;
        console.table(res);

        start();
    });
}