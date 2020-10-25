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

function getAllDepartments(){
    return db.query(`SELECT * FROM department`);
}

function getAllRoles(id){
    return db.query("SELECT * FROM `role` WHERE `role`.department_id=?", [id]);
}

function getEmployee(id){ 
    // default: return all employees
    // if an id is provided: return specific employee
    return db.query(
        "SELECT e.id, e.first_name, e.last_name, r.title, d.`name` AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager " + 
        "FROM (employee AS e, `role` AS r, department AS d) " +
        "LEFT JOIN employee AS m ON e.manager_id=m.id " +
        "WHERE e.role_id=r.id AND r.department_id=d.id " +
        (id ? `AND e.id=${id}` : ""));
}

function getManager(id){
    return db.query(
        "SELECT CONCAT(e.first_name, ' ', e.last_name) AS manager " + 
        "FROM employee AS e " +
        "LEFT JOIN `role` AS r ON e.role_id=r.id "+
        "WHERE r.title LIKE '%Manager%' AND r.department_id=?", [id]);
}

module.exports = { addDepartment, addEmployee, addRole, editDepartment, editEmployee, editRole, deleteDepartment, 
                   deleteEmployee, deleteRole, getAllDepartments, getAllRoles, getEmployee, getManager };