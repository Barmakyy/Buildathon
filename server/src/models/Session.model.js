import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'model'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'New Chat' },
    subject: {
      type: String,
      enum: ['mathematics', 'physics', 'chemistry', 'biology', 'computer_science'],
      default: 'mathematics',
    },
    languageMode: {
      type: String,
      enum: ['english', 'swahili', 'sheng'],
      default: 'sheng',
    },
    messages: [messageSchema],
    lastActivity: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

sessionSchema.pre('save', function (next) {
  this.lastActivity = new Date();
  if (this.messages.length > 0 && this.title === 'New Chat') {
    const firstUserMsg = this.messages.find((m) => m.role === 'user');
    if (firstUserMsg) {
      this.title = firstUserMsg.content.slice(0, 60);
    }
  }
  next();
});

export default mongoose.model('Session', sessionSchema);
