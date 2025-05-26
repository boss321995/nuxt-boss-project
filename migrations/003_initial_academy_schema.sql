-- 003_initial_academy_schema.sql
-- สร้างตารางทั้งหมดจาก dump ของ database academy

-- ก่อนสร้างใหม่ ให้ลบตารางที่อาจสร้างผิดพลาดออกทั้งหมด (ลดปัญหา FK)
DROP TABLE IF EXISTS `stock_entries`;
DROP TABLE IF EXISTS `request_material`;
DROP TABLE IF EXISTS `requests`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `materials`;
DROP TABLE IF EXISTS `material_categories`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `buyiddetail`;

-- 1) buyiddetail
CREATE TABLE IF NOT EXISTS `buyiddetail` (
  `buyID` int(11) NOT NULL AUTO_INCREMENT,
  `buyIDDetail` text NOT NULL,
  `buyIDDate` date NOT NULL,
  `taxpayerIdentificationNumber` varchar(32) NOT NULL,
  `ValueBeforeVAT` decimal(10,2) NOT NULL,
  `ValueAfterVAT` decimal(10,2) NOT NULL,
  `VATExemptGoods` decimal(10,2) NOT NULL,
  `totalValue` decimal(10,2) NOT NULL,
  PRIMARY KEY (`buyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 2) users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','supervisor','customer') NOT NULL,
  `material_access` set('plumbing','electrical','office_supplies','air') NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 3) material_categories
CREATE TABLE IF NOT EXISTS `material_categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 4) materials
CREATE TABLE IF NOT EXISTS `materials` (
  `material_id` varchar(32) NOT NULL,
  `material_name` varchar(100) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `priceperunit` decimal(10,2) NOT NULL,
  `discountPrice` decimal(10,2) DEFAULT NULL,
  `netPrice` decimal(10,2) DEFAULT NULL,
  `buyIDCC` varchar(64) NOT NULL,
  PRIMARY KEY (`material_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `materials_ibfk_1`
    FOREIGN KEY (`category_id`) REFERENCES `material_categories` (`category_id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 5) carts
CREATE TABLE IF NOT EXISTS `carts` (
  `cart_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 6) cart_items
CREATE TABLE IF NOT EXISTS `cart_items` (
  `cart_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `cart_id` int(11) DEFAULT NULL,
  `material_id` varchar(32) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `cart_id` (`cart_id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `cart_items_ibfk_1`
    FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_items_ibfk_2`
    FOREIGN KEY (`material_id`) REFERENCES `materials` (`material_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 7) requests
CREATE TABLE IF NOT EXISTS `requests` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `material_id` varchar(32) NOT NULL,
  `cart_id` int(11) DEFAULT NULL,
  `quantity_requested` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `requested_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_at` timestamp NULL DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `missionDetail` text,
  `batch_id` int(11) NOT NULL,
  PRIMARY KEY (`request_id`),
  KEY `user_id` (`user_id`),
  KEY `material_id` (`material_id`),
  KEY `cart_id` (`cart_id`),
  KEY `approved_by` (`approved_by`),
  CONSTRAINT `requests_ibfk_1`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `requests_ibfk_2`
    FOREIGN KEY (`material_id`) REFERENCES `materials` (`material_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `requests_ibfk_3`
    FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `requests_ibfk_4`
    FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 8) request_material
CREATE TABLE IF NOT EXISTS `request_material` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `material_id` varchar(32) NOT NULL,
  `quantity_requested` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `requested_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  CONSTRAINT `request_material_ibfk_1`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `request_material_ibfk_2`
FOREIGN KEY (`material_id`) REFERENCES `materials` (`material_id`)
ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 9) stock_entries
CREATE TABLE IF NOT EXISTS `stock_entries` (
  `entry_id` int(11) NOT NULL AUTO_INCREMENT,
  `buyID` int(11) NOT NULL,
  `material_id` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_per_unit` decimal(10,2) NOT NULL,
  `entry_date` date NOT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`entry_id`),
  KEY `buyID` (`buyID`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `stock_entries_ibfk_1`
    FOREIGN KEY (`buyID`) REFERENCES `buyiddetail` (`buyID`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stock_entries_ibfk_2`
    FOREIGN KEY (`material_id`) REFERENCES `materials` (`material_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 10) บันทึกเวอร์ชันใน schema_migrations
INSERT INTO schema_migrations(version)
VALUES('003_initial_academy_schema')
  ON DUPLICATE KEY UPDATE version=version;

-- 10) Seed material_categories
INSERT IGNORE INTO `material_categories` (`category_id`,`category_name`) VALUES
  (1,'plumbing'),
  (2,'electrical'),
  (3,'office_supplies'),
  (6,'air');

-- 11) Seed materials
INSERT IGNORE INTO `materials`
  (`material_id`,`material_name`,`category_id`,`quantity`,`unit`,`qr_code`,`priceperunit`,`discountPrice`,`netPrice`,`buyIDCC`) VALUES
  ('A68012025000001','หลอดไฟธรรมดา 18 w สั้น',2,1,'กล่อง','',0.00,0.00,0.00,'1'),
  ('A68012025000002','หลอดไฟธรรมดา 36 w ยาว สีเหลือง',2,2,'กล่อง','',0.00,0.00,0.00,'1'),
  ('A68012025000003','หลอดไฟธรรมดา 36 w ยาว สีขาว',2,3,'กล่อง','',0.00,0.00,0.00,'1');
  -- เพิ่มรายการที่เหลือต่อไป…

-- 12) บันทึกเวอร์ชันใน schema_migrations
INSERT INTO schema_migrations(version)
VALUES('003_initial_academy_schema')
  ON DUPLICATE KEY UPDATE version=version;
