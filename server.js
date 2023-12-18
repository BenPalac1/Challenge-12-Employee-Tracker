// const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '15_LesPaul_15',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database!`)
);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// db.connect((err) => {
//     if (err) throw err;
//     // console.log("Connected to the database!");
//     console.log("Server runnng on port 3306");
//     console.log(err, results);
//     start();
// });
