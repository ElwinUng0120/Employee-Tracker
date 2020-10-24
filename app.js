// importing inquirer package
const inquirer = require('inquirer');
// linking orm.js
const orm = require(`./orm.js`);

const questions = [];
let userInput = "";

async function main(){
    console.log("Welcome to Employee Tracker!");
    userInput = await inquirer.prompt(
        { name: "choice", type: "list", message: "Please select from the list of options", choices: ["View Employees", "Add", "Edit"]}
    );
    switch (userInput){
        
    }
}

main();