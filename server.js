// import inquirer, express, and mysql2
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
class UserInput {
    async run() {
        const { options } = await inquirer.prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do: ',
                choices: [
                    'View All Employees', 
                    'Add Employee', 
                    'View All Roles',
                    'Update Employee Role', 
                    'Add Role', 
                    'View All Departments', 
                    'Add Department',
                    'Quit'
                ],
                loop: false
            } 
        ]);

        return options;
        
    }
}

const userInput = new UserInput()

// user input from the prompt menu
async function handleUserInput() {
    const selectedOption = await userInput.run();

    switch (selectedOption) {
        case 'Quit':
            console.log('Goodbye!');
            process.exit(0);
            break;
        case 'View All Employees':
            viewAllEmployees();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'View All Roles':
            viewAllRoles();
            break;
        case 'View All Departments':
            viewAllDepartments();
            break;
        case 'Update Employee Role':
            updateEmployeeRole();
            break;
        case 'Add Role':
            newRole();
            break;
        case 'Add Department':
            newDepartment();
            break;
        default:
            console.log(`You selected: ${selectedOption}`);
            handleUserInput();
    }
}

function start() {
    handleUserInput();
}

// view all departments
async function viewAllDepartments() {
    db.query('SELECT * FROm department', function (err, res) {
        if (err) {
            console.error('Error: ', err);
        } else {
            console.table(res);
        }
    start();
    });
}

// view all roles
async function viewAllRoles() {
    db.query('SELECT * FROM role', function (err, res) {
        if (err) {
            console.error('Error: ', err);
        } else {
            console.table(res);
        }
    start();
    });
}

// view all employees
async function viewAllEmployees() {
    db.query('SELECT * FROM employee', function (err, res) {
        if (err) {
            console.error('Error: ', err);
        } else {
            console.table(res);
        }
    start();
    });
}

// prompts user to input a new dept. name
const newDepartmentParams = [
    {
        type: 'input',
        name: 'department',
        message: 'What is the new department name?',
    }
]

class Department {
    async run(questions) {
        const answers = await inquirer.prompt(questions);

        async function createNewDepartment() {
            db.query(`INSERT INTO department (name) VALUES ("${answers.department}")`)
            db.query('SELECT * FROM department', function (err, res) {
                if (err) {
                    console.error('Error: ', err);
                } else {
                    console.table(res);
                }
            start();
            });
        }
        await createNewDepartment()
    }
}

async function newDepartment() {
    const userInput = new Department();
    userInput.run(newDepartmentParams)
}

// prompts user to input role title, salary, and department of new role
const newRoleParams = [
    {
      type: 'input',
      name: 'title',
      message: 'What is title of the new role? ',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary for the new role? ',
    },
    {
      type: 'list',
      name: 'department',
      message: 'Which department is the role in ? ',
      choices: [],
      loop: false
    },
  ];

//callback function to fetch department names for user to select  
  function fetchDepartments(callback) {
    db.query('SELECT name FROM department', function(err, res) {
        if (err) {
            console.error("Error: ", err);
        } else {
            const nameDepartment = res.map(department => department.name);
            callback(null, nameDepartment)
        }
    });
}

class NewRole {

    async run(questions) {

        // retrieves all departments
        const departments = await new Promise ((resolve, reject) => {
            fetchDepartments((err, allDepartments) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(allDepartments)
                }
            });
        });

        questions[2].choices = departments;
        const answers = await inquirer.prompt(questions);
        async function addRole() {

            let department_id = undefined;

            // retreives dept ID to add to role table
            const d_id = await new Promise((resolve, reject) => {
                db.query(`SELECT id FROM department WHERE name = "${answers.department}"`, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });

            if (d_id.length > 0) {
            department_id = d_id[0].id;
            }

            // puts newly added role info into the role table
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answers.title}", "${answers.salary}", ${department_id})`)
            db.query('SELECT * FROM role', function (err, res) {
                if (err) {
                    console.error('Error: ', err);
                } else {
                    console.table(res)
                    start();
                }
            });
        }
        await addRole()
    }
}

// function for adding a new role
async function newRole() {
    const userInput = new NewRole();
    userInput.run(newRoleParams)
}
  