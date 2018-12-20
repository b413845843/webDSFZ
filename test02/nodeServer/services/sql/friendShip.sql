/* eslint-disable */
CREATE TABLE IF NOT EXISTS `friendships` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `uid` int NOT NULL ,
  `fid` int NOT NULL 
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
