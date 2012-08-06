-- MySQL dump 10.13  Distrib 5.5.24, for debian-linux-gnu (i686)
--
DROP TABLE IF EXISTS `wines`;

CREATE TABLE `wines` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `address` varchar(20) DEFAULT "USA",
  `type` varchar(20) NOT NULL,
  `notes` varchar(200) DEFAULT "",
  `picture` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `wines` WRITE;

UNLOCK TABLES;

