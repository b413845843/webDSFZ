/* eslint-disable */
DROP DATABASE IF EXISTS dascom;

CREATE DATABASE dascom;

USE dascom;

SOURCE ./user.sql;
SOURCE ./printer.sql;
SOURCE ./friendShip.sql;
SOURCE ./group.sql;