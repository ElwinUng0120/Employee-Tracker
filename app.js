// importing inquirer package
const inquirer = require('inquirer');
// importing console.table package
const cTable = require('console.table');
// linking orm.js
const orm = require(`./orm.js`);

// for repeated use within main()
let userInput = "";
let response = "";

let roleList = [];
let managerList = [];
let departmentList = [];
let employeeList = [];
let roleID = "";
let managerID = "";
let departmentID = "";
let employeeID = "";
let employeeName = "";
let Name ="";

async function main(){

    console.log("Welcome to Employee Tracker!");
    while(true){
        userInput = await inquirer.prompt(
            { name: "choice", type: "list", message: "Please select from the list of options", 
              choices: ["View Employees", "View Employees by Department", "View Employees by Manager",
                        "Add Employee", "Add Department", "Add Role",
                        "Edit Employee", "Edit Department", "Edit Role",
                        "Delete Employee", "Delete Department", "Delete Role",
                        new inquirer.Separator()]}
        );
        switch (userInput.choice){
            case "View Employees":
                console.log(cTable.getTable(await orm.getEmployee(null, "id")));
                break;
            case "View Employees by Department":
                console.log(cTable.getTable(await orm.getEmployee(null, "department")));
                break;
            case "View Employees by Manager":
                console.log(cTable.getTable(await orm.getEmployee(null, "reporting_to")));
                break;
            case "Add Employee":
                employeeList = await orm.getEmployee();
                departmentList = await orm.getAllDepartments(); // getting all department names
                userInput = await inquirer.prompt([
                    { name: "firstName", type: "input", message: "Please enter first name" },
                    { name: "lastName", type: "input", message: "Please enter last name" },
                    { name: "department", type: "list", message: "Please select the new employee's department", choices: departmentList.map(i => i.name) }
                ]);
                Name = [userInput.firstName, userInput.lastName]; // storing new employee's name for adding to database
                departmentID = departmentList.find(i => i.name == userInput.department).id; // getting the selected department id
                // setting up choices list for prompt
                roleList = await orm.getAllRoles(departmentID); // getting all the roles in the selected department
                roleList.push({title: new inquirer.Separator()})
                managerList = await orm.getManager(departmentID); // getting all the managers in the selected department
                managerList.push({manager: "Not Applicable"}); // in case the new employee is a manager
                userInput = await inquirer.prompt([
                    { name: "roleTitle", type: "list", message: "Please select the role for the new employee", choices: roleList.map(i => i.title) },
                    { name: "managerName", type: "list", message: "Please select the manager the new employee is reporting to", choices: managerList.map(i => i.manager) }
                ]);
                roleID = roleList.find(i => i.title == userInput.roleTitle).id; // getting role_id for new employee's role
                // getting id for new employee's manager
                if(userInput.managerName == "Not Applicable") managerID = 1;
                else managerID = employeeList.find(i => i.first_name + " " + i.last_name == userInput.managerName).id;
                response = await orm.addEmployee(Name[0], Name[1], roleID, managerID);
                console.log("New employee ADDED! \nPrinting employee list...");
                console.log(cTable.getTable(await orm.getEmployee(null, "id")));
                break;
            case "Add Department":
                userInput = await inquirer.prompt(
                    { name: "name", type: "input", message: "Please enter the name of the department" }
                )
                response = await orm.addDepartment(userInput.name);
                console.log("New department ADDED! \nPrinting department list...")
                console.log(cTable.getTable(await orm.getAllDepartments()));
                break;
            case "Add Role":
                departmentList = await orm.getAllDepartments(); // getting all department names
                userInput = await inquirer.prompt([
                    { name: "department", type: "list", message: "Please select department for the new role", 
                    choices: departmentList.map(i => i.name)},
                    { name: "title", type: "input", message: "Please enter the title of the new role" },
                    { name: "salary", type: "number", message: "Please enter the salary of the new role. NUMBERS ONLY" }
                ]);
                departmentID = departmentList.find(i => i.name == userInput.department).id; // getting the selected department id
                response = await orm.addRole(userInput.title, userInput.salary, departmentID);
                console.log(`New role ADDED! \nPrinting role list for ${userInput.department}...`);
                console.log(cTable.getTable(await orm.getAllRoles(departmentID)));
                break;
            case "Edit Employee":
                employeeList = await orm.getEmployee(); // getting all employees
                departmentList = await orm.getAllDepartments(); // getting all department names
                // setting up choices list for prompt
                employeeName = employeeList.map(i => i.first_name + " " + i.last_name)
                employeeName.push(new inquirer.Separator());
                userInput = await inquirer.prompt(
                    { name: "choice", type: "list", message: "Please select the employee you want to edit", choices: employeeName }
                );
                employeeID = employeeList.find(i => i.first_name + " " + i.last_name == userInput.choice).id; // getting the selected employee's id
                response = await orm.getEmployee(employeeID)
                // Same as "Add" case
                userInput = await inquirer.prompt([
                    { name: "firstName", type: "input", message: "Please enter first name or leave blank" },
                    { name: "lastName", type: "input", message: "Please enter last name or leave blank" },
                    { name: "department", type: "list", message: "Please select department if the employee is transferring", choices: departmentList.map(i => i.name) }
                ]);
                Name = [userInput.firstName, userInput.lastName]; // storing new employee's name for adding to database
                departmentID = departmentList.find(i => i.name == userInput.department).id; // getting the selected department id
                // setting up choices list for prompt
                roleList = await orm.getAllRoles(departmentID); // getting all the roles in the selected department
                roleList.push({title: new inquirer.Separator()})
                managerList = await orm.getManager(departmentID); // getting all the managers in the selected department
                managerList.push({manager: "Not Applicable"}); // in case the new employee is a manager
                userInput = await inquirer.prompt([
                    { name: "roleTitle", type: "list", message: "Please select the role for the employee", choices: roleList.map(i => i.title) },
                    { name: "managerName", type: "list", message: "Please select the manager the employee is reporting to", choices: managerList.map(i => i.manager) }
                ]);
                roleID = roleList.find(i => i.title == userInput.roleTitle).id; // getting role_id for new employee's role
                // getting id for new employee's manager
                if(userInput.managerName == "Not Applicable") managerID = 1;
                else managerID = employeeList.find(i => i.first_name + " " + i.last_name == userInput.managerName).id;
                response = await orm.editEmployee(employeeID, Name[0], Name[1], roleID, managerID);
                console.log("Edit SAVED! \nPrinting employee list...");
                console.log(cTable.getTable(await orm.getEmployee(null, "id")));
                break;
            case "Edit Department":
                departmentList = await orm.getAllDepartments(); // getting all department names
                userInput = await inquirer.prompt([
                    { name: "choice", type: "list", message: "Please select department to edit" , choices: departmentList.map(i => i.name) },
                    { name: "name", type: "input", message: "Please enter the new name for the department" }
                ]);
                departmentID = departmentList.find(i => i.name == userInput.choice).id;
                resposne = await orm.editDepartment(userInput.name, departmentID);
                console.log("Edit SAVED! \nPrinting department list...");
                console.log(cTable.getTable(await orm.getAllDepartments()));
                break;
            case "Edit Role":
                departmentList = await orm.getAllDepartments(); // getting all department names
                userInput = await inquirer.prompt(
                    { name: "choice", type: "list", message: "Please select department", choices: departmentList.map(i => i.name) }
                );
                departmentID = departmentList.find(i => i.name == userInput.choice).id;
                roleList = await orm.getAllRoles(departmentID);
                userInput = await inquirer.prompt([
                    { name: "choice", type: "list", message: "Please select role", choices: roleList.map(i => i.title) },
                    { name: "title", type: "input", message: "Please enter new title or leave blank" },
                    { name: "salary", type: "number", message: "Please enter new salary or leave blank. NON-ZERO ONLY" }
                ]);
                roleID = roleList.find(i => i.title == userInput.choice).id;
                response = await orm.editRole(userInput.title, userInput.salary, roleID);
                console.log("Edit SAVED! \nPrinting role list...");
                console.log(cTable.getTable(await orm.getAllRoles(departmentID)));
                break;
            case "Delete Employee":
                employeeList = await orm.getEmployee(); // getting all employees
                employeeName = employeeList.map(i => i.first_name + " " + i.last_name)
                employeeName.push(new inquirer.Separator());
                userInput = await inquirer.prompt(
                    { name: "choice", type: "list", message: "Please select the employee you want to delete", choices: employeeName }
                );
                employeeID = employeeList.find(i => i.first_name + " " + i.last_name == userInput.choice).id;
                response = await orm.deleteEmployee(employeeID);
                console.log("Employee DELETED! \nPrinting employee list now...");
                console.log(cTable.getTable(await orm.getEmployee(null, "id")));
                break;
            case "Delete Department":
                departmentList = await orm.getAllDepartments(); // getting all department names
                departmentList.push({name: new inquirer.Separator()});
                userInput = await inquirer.prompt(
                    { name: "choice", type: "list", message: "Please select department", choices: departmentList.map(i => i.name) }
                );
                departmentID = departmentList.find(i => i.name == userInput.choice).id;
                response = await orm.deleteDepartment(departmentID);
                console.log("Department DELETED! \nPrinting department list now...");
                console.log(cTable.getTable(await orm.getAllDepartments()));
                break;
            case "Delete Role":
                departmentList = await orm.getAllDepartments(); // getting all department names
                departmentList.push({name: new inquirer.Separator()});
                userInput = await inquirer.prompt(
                    { name: "choice", type: "list", message: "Please select department", choices: departmentList.map(i => i.name) }
                );
                departmentID = departmentList.find(i => i.name == userInput.choice).id;
                roleList = await orm.getAllRoles(departmentID);
                userInput = await inquirer.prompt(
                    { name: "choice", type: "list", message: "Please select role to delete", choices: roleList.map(i => i.title) }
                );
                roleID = roleList.find(i => i.title == userInput.choice).id;
                response = await orm.deleteRole(roleID);
                console.log("Role DELETED! \nPrinting role list...");
                console.log(cTable.getTable(await orm.getAllRoles(departmentID)));
                break;
            default:
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