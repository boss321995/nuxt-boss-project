INSERT INTO users (username, password) VALUES
  ('bob',     '$2y$10$7QJ8I9V6tgQZ8cKjL5YzmetG3aWxF0hN6rVbujlX6nJwQ3jF9kA2e'),
  ('charlie', '$2y$10$C9uQdF8RzYtP0LmN4WxGhOZiKj7VrStUvWyXyZaBcDeFgHiJkLmNoP'),
  ('alice',   '$2b$10$n9fSazAXmzpSRPNsuJJ2y.GZ/x7zXZOJ30g3m/dNG0iw7i.y6Wf7y')
ON DUPLICATE KEY UPDATE password=VALUES(password);
INSERT INTO schema_migrations(version)
VALUES('002_seed_sample_users')
  ON DUPLICATE KEY UPDATE version=version;
