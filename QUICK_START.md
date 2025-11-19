# ⚡ দ্রুত শুরু চেকলিস্ট

## প্রাক-প্রয়োজনীয়তা যাচাই করুন ✅

- [ ] Node.js v18+ ইনস্টল করা
- [ ] PostgreSQL ইনস্টল করা এবং চলমান
- [ ] Git ইনস্টল করা

## ব্যাকএন্ড সেটআপ ⚙️

```bash
# 1. ব্যাকএন্ড ডিরেক্টরিতে যান
cd backend

# 2. নির্ভরতা ইনস্টল করুন
npm install

# 3. এনভায়রনমেন্ট ফাইল তৈরি করুন
cp .env.example .env

# 4. .env ফাইল এডিট করুন (ডাটাবেস তথ্য যোগ করুন)
nano .env

# 5. ডাটাবেস তৈরি করুন
createdb air_travel_agency

# 6. স্কিমা চালান
psql air_travel_agency < ../database/schema.sql

# 7. ডেটা সিড করুন (অপশনাল)
node scripts/seed-database.js

# 8. সার্ভার শুরু করুন
npm run dev