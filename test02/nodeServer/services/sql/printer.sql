/* eslint-disable */
CREATE TABLE IF NOT EXISTS `printer` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `mid` int,
  `name` VARCHAR(50) NOT NULL default '',
  `number` VARCHAR(50) NOT NULL default ''
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT `printer` ( name, number) values
( '打印机1', '001' ),
( '打印机2', '002');