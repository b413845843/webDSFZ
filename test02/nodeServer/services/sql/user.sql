/* eslint-disable */
CREATE TABLE IF NOT EXISTS `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL default '',
  `password` VARCHAR(50) NOT NULL default '',
  `mail` VARCHAR(50) NOT NULL default '',
  `remark` VARCHAR(50) default '普通用户',
  `group` int
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT `users` ( username, password, remark, mail) values
( 'user', '123' ,'普通用户' , '1376969231@qq.com'),
( 'admin', '123', '管理员' ,'413845843@qq.com');