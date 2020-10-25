// importing inquirer package
const inquirer = require('inquirer');
// importing console.table package
const cTable = require('console.table');
// linking orm.js
const orm = require(`./orm.js`);

const messages = ["Please select from the list of options",
                  "Please enter first name",
                  "Please enter last name",
                  "Please select department to add to",
                  "Please select role for employee",
                  "Please select the manager the employee is reporting to",
                  "Please select the employee you want to edit"];
let userInput = "";
let response = "";

async function main(){
    const employeeList = await orm.getEmployee(); // getting all employees
    
    console.log("Welcome to Employee Tracker!");
    while(true){
        userInput = await inquirer.prompt(
            { name: "choice", type: "list", message: messages[0], choices: ["View Employees", "Add", "Edit"]}
        );
        switch (userInput.choice){
            case "View Employees":
                console.log(cTable.getTable(employeeList));
                break;
            case "Add":
                const departmentList = await orm. getAllDepartments(); // getting all department names for prompt
                userInput = await inquirer.prompt([
                    { name: "firstName", type: "input", message: messages[1] },
                    { name: "lastName", type: "input", message: messages[2] },
                    { name: "department", type: "list", message: messages[3], choices: departmentList.map(i => i.name) }
                ]);
                const Name = [userInput.firstName, userInput.lastName]; // storing new employee's name for adding to database
                let departmentID = departmentList.find(i => i.name == userInput.department).id; // getting the selected department id
                const roleList = await orm.getAllRoles(departmentID); // getting all the roles in the selected department
                const managers = await orm.getManager(departmentID); // getting all the managers in the selected department
                // setting up choices list for prompt
                const managerList = [];
                managers.forEach(i => managerList.push(i.manager));
                managerList.push("Not Applicable"); // in case the new employee is a manager
                userInput = await inquirer.prompt([
                    { name: "roleTitle", type: "list", message: messages[4], choices: roleList.map(i => i.title) },
                    { name: "managerName", type: "list", message: messages[5], choices: managerList }
                ]);
                let roleID = roleList.find(i => i.title == userInput.roleTitle).id; // getting role_id for new employee's role
                let managerID = employeeList.find(i => i.first_name + " " + i.last_name == userInput.managerName).id; // getting id for new employee's manager
                response = await orm.addEmployee(Name[0], Name[1], roleID, managerID);
                console.log( `Adding ${Name[0]} ${Name[1]} for ${userInput.roleTitle} ` + (managerID == 1 ? "" : `under ${userInput.managerName}`) );
                break;
            case "Edit":
                // setting up choices list for prompt
                const employeeName = employeeList.map(i => i.first_name + " " + i.last_name)
                employeeName.push(new inquirer.Separator());
                userInput = await inquirer.prompt([
                    { name: "choice", type: "list", message: messages[6], choices: employeeName }
                ]);
                let employeeID = employeeList.find(i => i.first_name + " " + i.last_name == userInput.choice).id;
                response = await orm.getEmployee(employeeID)
                console.log(cTable.getTable(response));
                break;
        }
        // checking if user wants to perform other actions
        userInput = await inquirer.prompt(
            { name: "choice", type: "confirm", message: "Do you want to perform other actions?" },
        );
        if(!userInput.choice) {
            console.log("Thank you for using this CLI! \nExiting now...");
            process.exit();
        }
    }
}

main();