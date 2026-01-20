CREATE database CRPMS;

use crpms;

create table users(
	userID int primary key auto_increment not null,
    userName varchar(25) not null,
    userEmail varchar(30) not null unique,
    userKey varchar(255) not null
);

create table cars(
	carID int primary key not null auto_increment,
    carPlate varchar(25) not null unique,
    carType varchar(25) not null,
    carModel varchar(25) not null,
    carYear int not null,
    driverNum varchar(15) not null,
    mechName varchar(15) not null
);

create table services(
	servID int primary key not null auto_increment,
    servCode varchar(5) not null unique,
    servName varchar(15) not null,
    servPrice int not null
);

create table serv_records(
	recID int primary key auto_increment not null,
    servID int not null,
    carID int not null,
    recDate date default (CURRENT_DATE),
    created_at timestamp default current_timestamp,
    
    foreign key (servID) references services(servID) on delete cascade,
    foreign key (carID) references cars(carID) on delete cascade
);

create table payments(
	payID int primary key auto_increment not null,
    recID int not null,
    amount int not null,
    payDate date default (CURRENT_DATE),
    created_at timestamp default current_timestamp,
    
    foreign key (recID) references serv_records(recID) on delete cascade
);