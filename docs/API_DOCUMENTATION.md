# 📚 API ডকুমেন্টেশন

এয়ার ট্রাভেল এজেন্সি ম্যানেজমেন্ট সিস্টেমের সম্পূর্ণ API রেফারেন্স।

## 📌 সাধারণ তথ্য

**বেস URL**: `http://localhost:5000/api`

**অথেনটিকেশন**: সমস্ত এন্ডপয়েন্ট JWT টোকেন প্রয়োজন (লগইন ছাড়া)

**অনুরোধ ফরম্যাট**: JSON

**রেসপন্স ফরম্যাট**: JSON

---

## 🔐 অথেনটিকেশন

### লগইন
```http
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "admin@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}

Error (401):
{
  "error": "অবৈধ ইমেইল বা পাসওয়ার্ড"
}
```

### নতুন ব্যবহারকারী নিবন্ধন (Admin শুধু)
```http
POST /auth/register
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "name": "নতুন ব্যবহারকারী",
  "email": "newuser@example.com",
  "password": "securepassword123",
  "role": "staff"  // admin, manager, staff
}

Response (201):
{
  "success": true,
  "message": "ব্যবহারকারী সফলভাবে তৈরি হয়েছে",
  "userId": "550e8400-e29b-41d4-a716-446655440001"
}
```

---

## 🎫 টিকেট এন্ডপয়েন্টস

### সমস্ত টিকেট তালিকা প্রাপ্ত করুন
```http
GET /tickets
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "airline_id": "a50e8400-e29b-41d4-a716-446655440001",
      "airline_name": "বাংলাদেশ এয়ারওয়েজ",
      "destination_country_id": "c50e8400-e29b-41d4-a716-446655440001",
      "country_name": "সৌদি আরব",
      "price": 25000,
      "quantity": 50,
      "route": "Dhaka - Riyadh",
      "created_at": "2025-11-19T10:30:00Z"
    }
  ],
  "count": 1
}
```

### নতুন টিকেট তৈরি করুন (Manager/Admin শুধু)
```http
POST /tickets
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "airline_id": "a50e8400-e29b-41d4-a716-446655440001",
  "destination_country_id": "c50e8400-e29b-41d4-a716-446655440001",
  "price": 25000,
  "quantity": 50,
  "route": "Dhaka - Riyadh"
}

Response (201):
{
  "success": true,
  "message": "টিকেট সফলভাবে তৈরি হয়েছে",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    ...
  }
}
```

### টিকেট আপডেট করুন
```http
PUT /tickets/{id}
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "price": 26000,
  "quantity": 45
}

Response (200):
{
  "success": true,
  "message": "টিকেট সফলভাবে আপডেট হয়েছে",
  "data": { ... }
}
```

### টিকেট বিক্রয় করুন
```http
POST /tickets/sell
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "ticket_id": "550e8400-e29b-41d4-a716-446655440001",
  "quantity": 2,
  "customer_id": "650e8400-e29b-41d4-a716-446655440001",
  "price_sold": 26000
}

Response (201):
{
  "success": true,
  "message": "টিকেট সফলভাবে বিক্রয় হয়েছে",
  "data": {
    "id": "750e8400-e29b-41d4-a716-446655440001",
    "ticket_id": "550e8400-e29b-41d4-a716-446655440001",
    "quantity": 2,
    "total_amount": 52000,
    "created_at": "2025-11-19T10:35:00Z"
  },
  "stock_remaining": 48
}
```

---

## 📋 বুকিং এন্ডপয়েন্টস

### সমস্ত বুকিং প্রাপ্ত করুন
```http
GET /bookings
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [ ... ],
  "count": 10
}
```

### নতুন বুকিং তৈরি করুন
```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "customer_id": "650e8400-e29b-41d4-a716-446655440001",
  "ticket_sale_id": "750e8400-e29b-41d4-a716-446655440001",
  "departure_date": "2025-02-15",
  "status": "pending"
}

Response (201):
{
  "success": true,
  "message": "বুকিং সফলভাবে তৈরি হয়েছে",
  "data": { ... }
}
```

### বুকিং স্ট্যাটাস আপডেট করুন
```http
PUT /bookings/{id}/status
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "status": "confirmed"  // pending, confirmed, cancelled, completed
}

Response (200):
{
  "success": true,
  "message": "বুকিং স্ট্যাটাস সফলভাবে আপডেট হয়েছে",
  "data": { ... }
}
```

---

## 🕌 ওমরাহ এন্ডপয়েন্টস

### সমস্ত ওমরাহ গ্রুপ প্রাপ্ত করুন
```http
GET /umrah/groups
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "850e8400-e29b-41d4-a716-446655440001",
      "group_name": "জুমরাত গ্রুপ ২০২৫",
      "departure_date": "2025-02-01",
      "return_date": "2025-02-15",
      "group_size": 50,
      "total_budget": 2500000,
      "pilgrims_count": 45,
      "total_expenses": 1200000,
      "status": "confirmed"
    }
  ],
  "count": 1
}
```

### নতুন গ্রুপ তৈরি করুন
```http
POST /umrah/groups
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "group_name": "জুমরাত গ্রুপ ২০২৫",
  "departure_date": "2025-02-01",
  "return_date": "2025-02-15",
  "group_size": 50,
  "total_budget": 2500000,
  "coordinator_name": "আবিদ হোসেন"
}

Response (201):
{
  "success": true,
  "message": "ওমরাহ গ্রুপ সফলভাবে তৈরি হয়েছে",
  "data": { ... }
}
```

### গ্রুপ বিস্তারিত প্রাপ্ত করুন
```http
GET /umrah/groups/{id}
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "group": { ... },
    "pilgrims": [ ... ],
    "expenses": [ ... ],
    "summary": {
      "total_pilgrims": 45,
      "total_expenses": 1200000,
      "average_cost_per_person": 26666.67,
      "budget_remaining": 1300000
    }
  }
}
```

### যাত্রী যোগ করুন
```http
POST /umrah/pilgrims
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "group_id": "850e8400-e29b-41d4-a716-446655440001",
  "name": "আহমেদ আলী",
  "passport_number": "AB12345678",
  "phone": "01712345678",
  "email": "ahmed@example.com",
  "emergency_contact": "ফাতিমা বেগম",
  "cost_per_person": 50000
}

Response (201):
{
  "success": true,
  "message": "যাত্রী সফলভাবে যোগ করা হয়েছে",
  "data": { ... }
}
```

### খরচ রেকর্ড যোগ করুন
```http
POST /umrah/expenses
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "group_id": "850e8400-e29b-41d4-a716-446655440001",
  "expense_type": "hotel",  // hotel, transport, guide, meals, visa, insurance, utilities, other
  "amount": 500000,
  "description": "হোটেল বুকিং - মদিনা",
  "vendor_name": "হোটেল এক্সপ্রেস"
}

Response (201):
{
  "success": true,
  "message": "খরচ সফলভাবে যোগ করা হয়েছে",
  "data": { ... }
}
```

---

## 💰 পেমেন্ট এন্ডপয়েন্টস

### সমস্ত পেমেন্ট প্রাপ্ত করুন
```http
GET /payments
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [ ... ],
  "count": 25
}
```

### পেমেন্ট রেকর্ড করুন
```http
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "customer_id": "650e8400-e29b-41d4-a716-446655440001",
  "amount": 50000,
  "payment_method": "bank_transfer",  // cash, card, bank_transfer, mobile_banking
  "reference_number": "TRX123456789",
  "description": "টিকেট পেমেন্ট"
}

Response (201):
{
  "success": true,
  "message": "পেমেন্ট সফলভাবে রেকর্ড করা হয়েছে",
  "data": {
    "id": "950e8400-e29b-41d4-a716-446655440001",
    "amount": 50000,
    "payment_method": "bank_transfer",
    "created_at": "2025-11-19T10:40:00Z"
  }
}
```

---

## 👥 গ্রাহক এন্ডপয়েন্টস

### সমস্ত গ্রাহক প্রাপ্ত করুন
```http
GET /customers
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [ ... ],
  "count": 100
}
```

### নতুন গ্রাহক যোগ করুন
```http
POST /customers
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "name": "মোহাম্মদ আহসান",
  "phone": "01712345678",
  "email": "ahsan@example.com",
  "address": "৫০ ডা. লাল সাহেব রোড",
  "city": "ঢাকা"
}

Response (201):
{
  "success": true,
  "message": "গ্রাহক সফলভাবে তৈরি হয়েছে",
  "data": { ... }
}
```

---

## 📊 রিপোর্ট এন্ডপয়েন্টস

### বিক্রয় রিপোর্ট
```http
GET /reports/sales
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "sale_date": "2025-11-19",
      "total_sales": 25,
      "total_revenue": 650000,
      "average_sale": 26000,
      "unique_customers": 15
    }
  ]
}
```

### আর্থিক রিপোর্ট
```http
GET /reports/financial
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "total_sales": 5000000,
    "total_payments": 4500000,
    "total_expenses": 1200000,
    "net_balance": 3800000
  }
}
```

---

## ⚠️ ত্রুটি রেসপন্স

### সাধারণ ত্রুটি ফরম্যাট
```json
{
  "error": "বর্ণনামূলক ত্রুটি বার্তা",
  "timestamp": "2025-11-19T10:30:00Z"
}
```

### সাধারণ ত্রুটি কোড

| কোড | মানে | বর্ণনা |
|------|------|--------|
| 400 | Bad Request | অনুরোধে ত্রুটি আছে |
| 401 | Unauthorized | অথেনটিকেশন প্রয়োজন |
| 403 | Forbidden | অনুমতি অপর্যাপ্ত |
| 404 | Not Found | রিসোর্স পাওয়া যায়নি |
| 409 | Conflict | সংঘাত (যেমন, ডুপ্লিকেট) |
| 500 | Server Error | অভ্যন্তরীণ সার্ভার ত্রুটি |

---

## 🔄 রেট লিমিটিং

বর্তমানে রেট লিমিটিং প্রয়োগ করা হয় না, কিন্ত উৎপাদন পরিবেশে সুপারিশ করা হয়:
- প্রতি মিনিটে ৬০টি অনুরোধ
- IP ঠিকানা অনুযায়ী ট্র্যাকিং
