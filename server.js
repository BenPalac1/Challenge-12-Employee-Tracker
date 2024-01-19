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

class AddDepartment {
    async run(questions) {
        const answers = await inquirer.prompt(questions);

        async function createNewDepartment() {
            db.query(`INSERT INTO department (name) VALUES ('${answers.department}')`)
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
    const userInput = new AddDepartment();
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
      message: 'Which department is the role in? ',
      choices: [],
      loop: false
    },
  ];

//callback function to fetch department names for user to then select
  function fetchDepartments(callback) {
    db.query('SELECT name FROM department', (err, res) => {
        if (err) {
            console.error("Error: ", err);
            callback(err);
        } else {
            const nameDepartment = res.map(department => department.name);
            callback(null, nameDepartment);
        }
    });
}

class AddRole {
    async run(questions) {

        // retrieves depts.
        const departments = await new Promise ((resolve, reject) => {
            fetchDepartments((err, allDepartments) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(allDepartments)
                }
            });
        });

        questions[2].choices = departments;// updates departments, 3rd option in array
        const answers = await inquirer.prompt(questions);

        async function addRole() {
            let department_id = undefined;

            // retreives dept ID to then add to role table
            const dept_id = await new Promise((resolve, reject) => {
                db.query(`SELECT id FROM department WHERE name = '${answers.department}'`, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });

            if (dept_id.length > 0) {
            department_id = dept_id[0].id;
            }

            // puts newly added role info into the role table
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answers.title}', '${answers.salary}', ${department_id})`)
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
    const userInput = new AddRole();
    userInput.run(newRoleParams)
}

// prompts user to enter employees first name, last name, role, and manager
const addEmployeePrompts = [
    {
      type: 'input',
      name: 'firstName',
      message: 'What is their first name? ',
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is their last name? ',
    },
    {
      type: 'list',
      name: 'Role',
      message: 'What is their role? ',
      choices: [],
      loop: false
    },
    {
      type: 'list',
      name: 'Manager',
      message: 'Managers Name? ',
      choices: [],
      loop: false
    },
  ];

  // callback function to fetch roles for user to choose from
function fetchRoles(callback) {
    db.query('SELECT title FROM role', (err, res) => {
        if (err) {
            console.error("Error: ", err);
            callback(err);
        } else {
            const roleTitles = res.map(role => role.title);
            callback(null, roleTitles);
        }
    });
}

// callback function to fetch the Managers for user to choose from
function fetchManagers(callback) {
    db.query('SELECT first_name, last_name FROM employee', (err, res) => {
        if (err) {
            console.error("Error: ", err);
            callback(err);
        } else {
            const managerNames = res.map(manager => `${manager.first_name} ${manager.last_name}`);
            callback(null, managerNames);
        }
    });
}


class AddEmployee {
    async run(questions) {

        const roles = await new Promise((resolve, reject) => {
            fetchRoles((err, roleTitles) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(roleTitles);
                }
            });
        });

        questions[2].choices = roles; // updates role, from questions array

        const managers = await new Promise((resolve, reject) => {
            fetchManagers((err, allManagers) => {
                if (err) {
                    reject(err);
                } else {
                    allManagers.push('NULL');
                    resolve(allManagers)
                }
            });
        });

        questions[3].choices = managers; // updates manager, from questions array
        
        const answers = await inquirer.prompt(questions);

        async function newEmployee() {

            let role_id = undefined;
            let manager_id = undefined;
            const manager_name = answers.Manager.split (' ');

            const empRole_id = await new Promise((resolve, reject) => {
                db.query(`SELECT id FROM role WHERE title = '${answers.Role}'`,
                    (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                });
            });

            const empMngr_id = await new Promise((resolve, reject) => {
                db.query(`SELECT id FROM employee WHERE first_name = '${manager_name[0]}' AND last_name = '${manager_name[1]}'`,
                    (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                });
            });

            if (empRole_id.length > 0) {
                role_id = empRole_id[0].id;
            }

            if (empMngr_id.length > 0) {
                manager_id = empMngr_id[0].id;
            }

            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                VALUES (
                    '${answers.firstName}', 
                    '${answers.lastName}', 
                    ${role_id}, 
                    ${manager_id}
            )`)

            db.query('SELECT * FROM employee', function (err, res) {
                if (err) {
                    res(err);
                } else {
                    console.table(res)
                    start();
                }
            });
        }
        await newEmployee()
    }
}

//func for adding a new Employee
async function addEmployee() {
    const userInput = new AddEmployee();
    userInput.run(addEmployeePrompts)
};


