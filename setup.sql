DROP DATABASE IF EXISTS chesspp;
CREATE DATABASE chesspp;
\c chesspp

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE
);

CREATE TABLE rooms (
    room_id VARCHAR(4) PRIMARY KEY,
    players JSONB NOT NULL,
    turn_order TEXT[] NOT NULL,
    turn INTEGER NOT NULL,
    board JSONB NOT NULL
);
