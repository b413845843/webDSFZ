/* eslint-disable */
CREATE TABLE IF NOT EXISTS `groups` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL default '',
  `uid` int NOT NULL ,
  `fid` int NOT NULL 
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
