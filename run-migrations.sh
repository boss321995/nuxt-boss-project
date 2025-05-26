 #!/usr/bin/env bash
 set -e

+# ทางไปยัง mysql.exe ใน XAMPP (ปรับตามที่คุณติดตั้งไว้)
+MYSQL_CMD="/c/xampp/mysql/bin/mysql.exe"

 # อ่าน config จาก .env
 DB_HOST="${DB_HOST:-127.0.0.1}"
 DB_USER="${DB_USER:-root}"
 DB_PASS="${DB_PASSWORD:-}"
 DB_NAME="${DB_NAME:-myapp_db}"

 # ฟังก์ชันช่วยรัน mysql ไม่ prompt ถ้าไม่มีรหัสผ่าน
-run_mysql() {
-  if [ -n "$DB_PASS" ]; then
-    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" "$@"
-  else
-    mysql -h "$DB_HOST" -u "$DB_USER" "$DB_NAME" "$@"
-  fi
-}
+run_mysql() {
+  if [ -n "$DB_PASS" ]; then
+    "$MYSQL_CMD" -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" "$@"
+  else
+    "$MYSQL_CMD" -h "$DB_HOST" -u "$DB_USER" "$DB_NAME" "$@"
+  fi
+}

 # 1) สร้างตาราง schema_migrations (ถ้ายังไม่มี)
 echo "Applying migrations/000_init_schema_migrations.sql"
 run_mysql < migrations/000_init_schema_migrations.sql

 # 2) วนรันทุกไฟล์ migration ลำดับถัดไป
 for file in migrations/[0-9][0-9][0-9]_*.sql; do
   version=$(basename "$file" | cut -d'_' -f1)
-  already=$(run_mysql -N -s -e "SELECT version FROM schema_migrations WHERE version='$version';")
+  already=$(run_mysql -N -s -e "SELECT version FROM schema_migrations WHERE version='$version';")
   if [ -z "$already" ]; then
     echo "Applying $file"
     run_mysql < "$file"
   else
     echo "Skipping $file"
   fi
 done

 echo "All migrations applied."