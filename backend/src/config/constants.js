/**
 * অ্যাপ্লিকেশন ধ্রুবক
 */

const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff'
};

const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  MOBILE_BANKING: 'mobile_banking'
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

const UMRAH_STATUS = {
  PLANNING: 'planning',
  CONFIRMED: 'confirmed',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const EXPENSE_TYPES = {
  HOTEL: 'hotel',
  TRANSPORT: 'transport',
  GUIDE: 'guide',
  MEALS: 'meals',
  VISA: 'visa',
  INSURANCE: 'insurance',
  UTILITIES: 'utilities',
  OTHER: 'other'
};

const TRANSPORT_TYPES = {
  BUS: 'bus',
  FLIGHT: 'flight',
  TRAIN: 'train',
  CAR: 'car'
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'অবৈধ ইমেইল বা পাসওয়ার্ড',
  UNAUTHORIZED: 'অনুমতি অপর্যাপ্ত',
  NOT_FOUND: 'রিসোর্স পাওয়া যায়নি',
  INVALID_INPUT: 'অবৈধ ইনপুট',
  DUPLICATE_ENTRY: 'এই এন্ট্রি ইতিমধ্যে বিদ্যমান',
  INSUFFICIENT_STOCK: 'অপর্যাপ্ত স্টক'
};

const SUCCESS_MESSAGES = {
  CREATED: 'সফলভাবে তৈরি হয়েছে',
  UPDATED: 'সফলভাবে আপডেট হয়েছে',
  DELETED: 'সফলভাবে মুছে ফেলা হয়েছে',
  FETCHED: 'সফলভাবে ফেচ করা হয়েছে'
};

module.exports = {
  ROLES,
  BOOKING_STATUS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  UMRAH_STATUS,
  EXPENSE_TYPES,
  TRANSPORT_TYPES,
  PAGINATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};