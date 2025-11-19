const pool = require('../src/config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 ডাটাবেস সিড করা শুরু...');

    // প্রশাসক ব্যবহারকারী তৈরি করুন
    const adminId = uuidv4();
    const hashedPassword = await bcrypt.hash('password123', 10);

    await pool.query(
      'INSERT INTO users (id, name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5, $6)',
      [adminId, 'Admin User', 'admin@example.com', hashedPassword, 'admin', '01700000001']
    );
    console.log('✅ প্রশাসক ব্যবহারকারী তৈরি করা হয়েছে');

    // এয়ারলাইন্স তৈরি করুন
    const airlines = [
      { id: uuidv4(), name: 'বাংলাদেশ এয়ারওয়েজ', code: 'BD' },
      { id: uuidv4(), name: 'সৌদি আরেবিয়ান এয়ারওয়েজ', code: 'SV' },
      { id: uuidv4(), name: 'এমিরেটস', code: 'EK' },
      { id: uuidv4(), name: 'কাতার এয়ারওয়েজ', code: 'QR' }
    ];

    for (const airline of airlines) {
      await pool.query(
        'INSERT INTO airlines (id, name, code) VALUES ($1, $2, $3)',
        [airline.id, airline.name, airline.code]
      );
    }
    console.log('✅ এয়ারলাইন্স তৈরি করা হয়েছে');

    // দেশ তৈরি করুন
    const countries = [
      { id: uuidv4(), name: 'সৌদি আরব', code: 'SA' },
      { id: uuidv4(), name: 'সংযুক্ত আরব আমিরাত', code: 'AE' },
      { id: uuidv4(), name: 'মালয়েশিয়া', code: 'MY' },
      { id: uuidv4(), name: 'তুরস্ক', code: 'TR' }
    ];

    for (const country of countries) {
      await pool.query(
        'INSERT INTO countries (id, name, code) VALUES ($1, $2, $3)',
        [country.id, country.name, country.code]
      );
    }
    console.log('✅ দেশ তৈরি করা হয়েছে');

    // টেস্ট গ্রাহক তৈরি করুন
    const customers = [
      { name: 'মোহাম্মদ আহমেদ', phone: '01712345678', email: 'ahmed@example.com' },
      { name: 'ফাতিমা খান', phone: '01812345679', email: 'fatima@example.com' },
      { name: 'আলী হোসেন', phone: '01912345680', email: 'ali@example.com' }
    ];

    for (const customer of customers) {
      await pool.query(
        'INSERT INTO customers (id, name, phone, email) VALUES ($1, $2, $3, $4)',
        [uuidv4(), customer.name, customer.phone, customer.email]
      );
    }
    console.log('✅ গ্রাহক তৈরি করা হয়েছে');

    console.log('🎉 ডাটাবেস সিড সম্পন্ন!');
    process.exit(0);
  } catch (error) {
    console.error('❌ সিড ত্রুটি:', error);
    process.exit(1);
  }
}

seedDatabase();