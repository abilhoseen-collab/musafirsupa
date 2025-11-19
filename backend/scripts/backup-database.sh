#!/bin/bash

# ডাটাবেস ব্যাকআপ স্ক্রিপ্ট

BACKUP_DIR="./backups"
DB_NAME=${DB_NAME:-air_travel_agency}
BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"

# ব্যাকআপ ডিরেক্টরি তৈরি করুন
mkdir -p $BACKUP_DIR

# ব্যাকআপ করুন
pg_dump -U postgres $DB_NAME > $BACKUP_FILE

echo "✅ ব্যাকআপ সফল: $BACKUP_FILE"

# পুরানো ব্যাকআপ সরান (৭ দিনের বেশি পুরানো)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "✅ পুরানো ব্যাকআপ পরিষ্কার করা হয়েছে"