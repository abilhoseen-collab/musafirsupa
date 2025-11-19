const Joi = require('joi');

// টিকেট ভ্যালিডেশন স্কিমা
const ticketSchema = Joi.object({
  airline_id: Joi.string().uuid().required(),
  destination_country_id: Joi.string().uuid().required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(0).required(),
  route: Joi.string().optional()
});

// গ্রাহক ভ্যালিডেশন স্কিমা
const customerSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  phone: Joi.string().pattern(/^[0-9]{10,20}$/).required(),
  email: Joi.string().email().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional()
});

// বুকিং ভ্যালিডেশন স্কিমা
const bookingSchema = Joi.object({
  customer_id: Joi.string().uuid().required(),
  ticket_sale_id: Joi.string().uuid().required(),
  booking_date: Joi.date().optional(),
  departure_date: Joi.date().required(),
  status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').optional()
});

// পেমেন্ট ভ্যালিডেশন স্কিমা
const paymentSchema = Joi.object({
  customer_id: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  payment_method: Joi.string().valid('cash', 'card', 'bank_transfer', 'mobile_banking').required(),
  reference_number: Joi.string().optional(),
  description: Joi.string().optional()
});

// ওমরাহ গ্রুপ ভ্যালিডেশন
const umrahGroupSchema = Joi.object({
  group_name: Joi.string().min(3).max(255).required(),
  departure_date: Joi.date().required(),
  return_date: Joi.date().required(),
  group_size: Joi.number().integer().positive().required(),
  total_budget: Joi.number().positive().optional(),
  coordinator_name: Joi.string().max(255).optional()
});

// ওমরাহ যাত্রী ভ্যালিডেশন
const umrahPilgrimSchema = Joi.object({
  group_id: Joi.string().uuid().required(),
  name: Joi.string().min(3).max(255).required(),
  passport_number: Joi.string().pattern(/^[A-Z0-9]{6,20}$/).required(),
  phone: Joi.string().pattern(/^[0-9]{10,20}$/).optional(),
  email: Joi.string().email().optional(),
  emergency_contact: Joi.string().optional(),
  cost_per_person: Joi.number().positive().optional()
});

module.exports = {
  ticketSchema,
  customerSchema,
  bookingSchema,
  paymentSchema,
  umrahGroupSchema,
  umrahPilgrimSchema
};