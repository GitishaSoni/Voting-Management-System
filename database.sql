create database voting;
use voting;
CREATE TABLE voters (
    id INT AUTO_INCREMENT PRIMARY KEY,     
    voter_id VARCHAR(10) NOT NULL UNIQUE, 
    name VARCHAR(100) NOT NULL,             
    age INT NOT NULL,                       
    address VARCHAR(255) NOT NULL,          
    mobile VARCHAR(10) NOT NULL,            
    dob DATE NOT NULL                        
);

select * from voters;
