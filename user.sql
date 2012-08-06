-- MySQL dump 10.13  Distrib 5.5.24, for debian-linux-gnu (i686)
--
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id`        int(11)      NOT NULL AUTO_INCREMENT,
  `name`      varchar(40)  NOT NULL,
  `username`  varchar(40)  NOT NULL,
  `password`  varchar(40)  NOT NULL,
  `type`      varchar(20)  NOT NULL,
  `phone`     varchar(40)  NOT NULL,
  `address`   varchar(20)  DEFAULT "",
  `introduce` varchar(200) DEFAULT "",
  `picture`   varchar(30)  NOT NULL,
  `score`     tinyint(4)   DEFAULT 0,
  UNIQUE (`username`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user` WRITE;

UNLOCK TABLES;
