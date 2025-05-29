-- 006_use_username_in_requests.sql

-- 1) Add the new username columns at the end of the table
ALTER TABLE `requests`
ADD COLUMN `username`             VARCHAR
(50) NOT NULL,
ADD COLUMN `approved_by_username` VARCHAR
(50) NULL;

-- 2) Back‐fill the new columns from the existing integer FKs
UPDATE `requests` AS r
JOIN   `users
`    AS u1 ON r.user_id       = u1.user_id
LEFT JOIN `users` AS u2 ON r.approved_by   = u2.user_id
SET
  r
.username             = u1.username,
  r.approved_by_username = u2.username;

-- 3) Drop the old foreign keys (that pointed at users.user_id)
ALTER TABLE `requests`
DROP FOREIGN KEY `requests_ibfk_1`,
-- user_id → users(user_id)
DROP FOREIGN KEY `requests_ibfk_4`;
-- approved_by → users(user_id)

-- 4) Drop their indexes & the integer columns
ALTER TABLE `requests`
DROP INDEX `user_id`,
DROP INDEX `approved_by`,
DROP COLUMN `user_id`,
DROP COLUMN `approved_by`;

-- 5) Add indexes & new FKs on the username columns
ALTER TABLE `requests`
ADD INDEX  `idx_requests_username`
(`username`),
ADD INDEX  `idx_requests_approved_by_username`
(`approved_by_username`),
ADD CONSTRAINT `fk_requests_username`
    FOREIGN KEY
(`username`)              REFERENCES `users`
(`username`)
      ON
DELETE CASCADE ON
UPDATE CASCADE,
ADD CONSTRAINT `fk_requests_approved_by_username`
    FOREIGN KEY
(`approved_by_username`) REFERENCES `users`
(`username`)
      ON
DELETE
SET NULL
ON
UPDATE CASCADE;

-- 6) Mark the migration as applied
INSERT INTO `schema_migrations` (`
version`)
VALUES('006_use_username_in_requests')
ON DUPLICATE KEY
UPDATE version = version;
