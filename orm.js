const mysql = require("mysql");

// use this wrapper to create promise around mysql
class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args=[] ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

// at top INIT DB connection
const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "90939065Elwin",
    database: "employee_db"
});

function addDepartment(name){
    return db.query(
        "INSERT INTO department (`name`) VALUES(?)", 
        [name]);
}

function addRole(title, salary, department_id){
    return db.query(
        `INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?)`, 
        [title, salary, department_id]);
}

function addEmployee(firstName, lastName, rold_id, manager_id){
    return db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`, 
        [firstName, lastName, rold_id, manager_id]);
}

function editDepartment(name, id){
    return db.query(
        "UPDATE department SET `name`=? WHERE id=?",
        [name, id]
    );
}

function editRole(){
    return db.query(
        "UPDATE role SET `name`=? WHERE id=?",
        [name, id]
    );
}

function editEmployee(id, firstName="", lastName="", roleID="", managerID=""){
    const first_name = (firstName == "" ? "" : `first_name=${firstName}`);
    const last_name = (lastName == "" ? "" : `last_name=${lastName}`);
    const role_id = (roleID == "" ? "" : `role_id=${roleID}`);
    const manager_id = (managerID== "" ? "" : `manager_id=${managerID}`)
    return db.query(
        `UPDATE department SET ${first_name}, ${last_name}, ${role_id}, ${manager_id} WHERE id=?`,
        [id]
    );
}

function deleteDepartment(id){
    return db.query(
        `DELETE FROM department WHERE id=?`, [id]);
}

function deleteRole(id){
    return db.query(
        `DELETE FROM role WHERE id=?`, [id]);
}

function deleteEmployee(id){
    return db.query(
        `DELETE FROM employee WHERE id=?`, [id]);
}

function getDepartment(id){
    return db.query(`SELECT * FROM department` + (id ? `WHERE id=${id}` : ""));
}

function getRole(id){
    return db.query(`SELECT * FROM role` + (id ? `WHERE id=${id}` : ""));
}

function getEmployee(id){
    return db.query(`SELECT * FROM employee` + (id ? `WHERE id=${id}` : ""));
}

module.exports = { addDepartment, addEmployee, addRole, editDepartment, editEmployee, editRole, deleteDepartment, 
                   deleteEmployee, deleteRole, getDepartment, getRole, getEmployee };