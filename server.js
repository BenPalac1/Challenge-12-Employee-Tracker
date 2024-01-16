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

// view all  departments
async function viewAllDepartments() {
    db.query('SELECT * FROm department', function (err, res) {
        if (err) {
            console.err('Error: ', err);
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
            console.err('Error: ', err);
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
            console.err('Error: ', err);
        } else {
            console.table(res);
        }
    start();
    });
}
  