-- migrations/007_create_requests_table.sql

-- 1) If there’s any leftover requests table, drop it
DROP TABLE IF EXISTS `requests`;

-- 2) Create the new requests table with username FKs
CREATE TABLE
IF NOT EXISTS `requests`
(
  `request_id`            INT           NOT NULL AUTO_INCREMENT,
  `username`              VARCHAR
(50)   NOT NULL,
  `material_id`           VARCHAR
(32)   NOT NULL,
  `cart_id`               INT           DEFAULT NULL,
  `quantity_requested`    INT           NOT NULL,
  `status`                ENUM
('pending','approved','rejected') DEFAULT 'pending',
  `requested_at`          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_at`           TIMESTAMP     NULL    DEFAULT NULL,
  `approved_by_username`  VARCHAR
(50)   NULL,
  `missionDetail`         TEXT          DEFAULT NULL,
  `batch_id`              INT           NOT NULL,
  PRIMARY KEY
(`request_id`),

  INDEX `idx_requests_username`
(`username`),
  INDEX `idx_requests_material`
(`material_id`),
  INDEX `idx_requests_cart`
(`cart_id`),
  INDEX `idx_requests_approved_by_username`
(`approved_by_username`),

  CONSTRAINT `fk_requests_username`
    FOREIGN KEY
(`username`) REFERENCES `users`
(`username`)
      ON
DELETE CASCADE ON
UPDATE CASCADE,

  CONSTRAINT `fk_requests_material`
    FOREIGN KEY
(`material_id`) REFERENCES `materials`
(`material_id`)
      ON
DELETE CASCADE ON
UPDATE CASCADE,

  CONSTRAINT `fk_requests_cart`
    FOREIGN KEY
(`cart_id`) REFERENCES `carts`
(`cart_id`)
      ON
DELETE
SET NULL
ON
UPDATE CASCADE,

  CONSTRAINT `fk_requests_approved_by_username`
    FOREIGN KEY
(`approved_by_username`) REFERENCES `users`
(`username`)
      ON
DELETE
SET NULL
ON
UPDATE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) Mark this new migration as applied
INSERT INTO `schema_migrations` (`
version`)
VALUES('007_create_requests_table')
ON DUPLICATE KEY
UPDATE version=version;
