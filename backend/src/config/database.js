import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/nsc_ai_dev";

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    /** Set for email/password accounts; OAuth-linked accounts use a random hash. */
    password: { type: String, required: false },
    clerk_id: { type: String, sparse: true, unique: true },
    phone_number: { type: String },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    role: {
      type: String,
      default: "patient",
      enum: ["patient", "dermatologist", "admin"],
    },
    phone_verified: { type: Boolean, default: false },
    otp: { type: String },
    otp_expires: { type: Date },
    reset_password_token: { type: String },
    reset_password_expires: { type: Date },
    date_of_birth: { type: Date },
    gender: { type: String },
    allergies: { type: String },
    current_medications: { type: String },
    emergency_contact: { type: String },
    notification_preferences: {
      sms_reminders: { type: Boolean, default: true },
      email_notifications: { type: Boolean, default: true },
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// Booking Schema
const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dermatologist_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    appointment_date: { type: Date, required: true },
    severity_score: { type: Number },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "completed", "cancelled", "waiting-list"],
    },
    payment_status: {
      type: String,
      default: "unpaid",
      enum: ["unpaid", "paid", "refunded"],
    },
    consultation_type: { type: String, enum: ["in-person", "follow-up"] },
    notes: { type: String },
    is_urgent_slot: { type: Boolean, default: false },
    cancellation_reason: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// Image Schema
const imageSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    image_url: { type: String },
    analysis_result: { type: String },
    severity_score: { type: Number },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

// Prescription Schema
const prescriptionSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    medication_name: { type: String, required: true },
    dosage: { type: String, required: true },
    duration: { type: String, required: true },
    notes: { type: String },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

// SMS Log Schema
const smsLogSchema = new mongoose.Schema(
  {
    recipient_phone: { type: String, required: true },
    message_content: { type: String, required: true },
    status: {
      type: String,
      default: "sent",
      enum: ["sent", "pending", "failed"],
    },
    delivery_status: {
      type: String,
      default: "pending",
      enum: ["pending", "delivered", "failed"],
    },
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    reminder_type: {
      type: String,
      enum: ["appointment-48h", "appointment-24h", "confirmation", "reminder"],
    },
  },
  { timestamps: { createdAt: "sent_at", updatedAt: false } },
);

// Payment/Transaction Schema
const transactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    pharmacy_order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PharmacyOrder",
    },
    amount: { type: Number, required: true },
    transaction_type: {
      type: String,
      required: true,
      enum: ["booking", "prescription", "refund"],
    },
    payment_method: {
      type: String,
      default: "m-pesa",
      enum: ["m-pesa", "card", "cash"],
    },
    mpesa_transaction_code: { type: String },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "success", "failed"],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

// Pharmacy Order Schema
const pharmacyOrderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prescription_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      required: true,
    },
    delivery_method: {
      type: String,
      required: true,
      enum: ["pickup", "delivery"],
    },
    delivery_address: { type: String },
    total_amount: { type: Number, required: true },
    payment_status: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "refunded"],
    },
    order_status: {
      type: String,
      default: "received",
      enum: ["received", "in-preparation", "ready", "dispatched", "delivered"],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// Voice AI Session Schema
const voiceSessionSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    session_id: { type: String, required: true, unique: true },
    conversation_transcript: { type: String },
    booking_result: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    status: {
      type: String,
      default: "active",
      enum: ["active", "completed", "failed", "transferred"],
    },
    ended_at: { type: Date },
  },
  { timestamps: { createdAt: "started_at", updatedAt: false } },
);

// Create models
const User = mongoose.model("User", userSchema);
const Booking = mongoose.model("Booking", bookingSchema);
const Image = mongoose.model("Image", imageSchema);
const Prescription = mongoose.model("Prescription", prescriptionSchema);
const SMSLog = mongoose.model("SMSLog", smsLogSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);
const PharmacyOrder = mongoose.model("PharmacyOrder", pharmacyOrderSchema);
const VoiceSession = mongoose.model("VoiceSession", voiceSessionSchema);

// Initialize Database
async function initializeDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ MongoDB connection successful");
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error.message);
    throw error;
  }
}

export {
  initializeDatabase,
  User,
  Booking,
  Image,
  Prescription,
  SMSLog,
  Transaction,
  PharmacyOrder,
  VoiceSession,
  MONGODB_URI,
};
