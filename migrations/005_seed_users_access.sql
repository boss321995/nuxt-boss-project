-- 005_seed_users_access.sql

-- Seed ข้อมูล users พร้อม material_access
INSERT IGNORE
INTO `users`
(`user_id`, `username`, `password`, `role`, `material_access`)
VALUES
(1, '26200737', '$2y$10$AS0v5D/jMjet/ryQGRUE6uZrUy.EltrqC78s4SRH5WaQLAvuCXScy', 'admin',      'plumbing,electrical,office_supplies'),
(3, '14101074', '$2y$10$v0r4T9gwuUKTxuqTCGSHheosSEYDhcAQz7MBigYiLVsjgVie.yOJu', 'supervisor', 'plumbing,electrical'),
(4, '25901237', '$2y$10$VgYMg3i26bp7ksM3T/4YlOueF4qTk1NhA9hzjluvLcFgCYRBk0MCi', 'customer',   'plumbing,electrical,air'),
(5, '13715985', '$2y$10$oXW1OLxInIdWBffxEFYySeiiRVHLMKqQW/4og/eIE2VD6FrxrWNMu', 'supervisor', 'office_supplies');

-- บันทึกเวอร์ชันให้ runner รู้ว่า 005 รันแล้ว
INSERT INTO schema_migrations
    (version)
VALUES('005_seed_users_access')
ON DUPLICATE KEY
UPDATE version = version;
