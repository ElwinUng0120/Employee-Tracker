DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department(
	id INT AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    
    PRIMARY KEY (id)
);

CREATE TABLE `role`(
	id INT AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id) 
		ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE employee(
	id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    
	PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES `role`(id) 
		ON UPDATE CASCADE
        ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employee(id) 
		ON UPDATE CASCADE
        ON DELETE SET NULL
);

INSERT INTO department (`name`) VALUES("HR");
INSERT INTO department (`name`) VALUES("Engineering");
INSERT INTO department (`name`) VALUES("Management");

INSERT INTO `role` VALUES(0, "Departmnet Manager", 100000, 1); -- id: 1
INSERT INTO `role` VALUES(0, "Senior Staff", 75000, 1); -- id: 2
INSERT INTO `role` VALUES(0, "Junior Staff", 55000, 1); -- id: 3

INSERT INTO `role` VALUES(0, "Departmnet Manager", 100000, 2); -- id: 4
INSERT INTO `role` VALUES(0, "Senior Staff", 75000, 2); -- id: 5
INSERT INTO `role` VALUES(0, "Junior Staff", 55000, 2); -- id: 6

INSERT INTO `role` VALUES(0, "Departmnet Manager", 100000, 3); -- id: 7
INSERT INTO `role` VALUES(0, "Senior Staff", 75000, 3); -- id: 8
INSERT INTO `role` VALUES(0, "Junior Staff", 55000, 3); -- id: 9

INSERT INTO employee (id, first_name, last_name) VALUES(1, "Not", "Applicable");

INSERT INTO employee VALUES(0, "John", "Doe", 1, 1); -- id: 2
INSERT INTO employee VALUES(0, "Kent", "Lee", 2, 2); -- id: 3
INSERT INTO employee VALUES(0, "Great", "Paint", 2, 2); -- id: 4
INSERT INTO employee VALUES(0, "Poor", "Student", 3, 3); -- id: 5
 
INSERT INTO employee VALUES(0, "Jane", "Paul", 4, 1); -- id: 6
INSERT INTO employee VALUES(0, "Pro", "Engineer", 5, 6); -- id: 7
INSERT INTO employee VALUES(0, "Student", "Intern", 6, 7); -- id: 8

INSERT INTO employee VALUES(0, "Roger", "Upney", 7, 1); -- id: 9
INSERT INTO employee VALUES(0, "Project", "Manager", 8, 9); -- id: 10