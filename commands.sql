CREATE DATABASE crm;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR (255),
    time VARCHAR(255),
    edit VARCHAR(255),
    password VARCHAR(255),
    token VARCHAR(255),
    verify VARCHAR(255) DEFAULT 'Not',
    expiry INT
);

CREATE TABLE messages (
    msg_id SERIAL PRIMARY KEY,
    sender integer REFERENCES users(user_id) ON DELETE CASCADE,
    receive integer REFERENCES users(user_id) ON DELETE CASCADE,
    date VARCHAR(255)
);

