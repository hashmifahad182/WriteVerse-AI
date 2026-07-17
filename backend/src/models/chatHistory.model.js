const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    retrievedChunkIds: [{ type: String }],
  },
  { timestamps: true, _id: false }
);

const chatHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true, index: true },
    messages: [chatMessageSchema],
  },
  { timestamps: true }
);

chatHistorySchema.index({ user: 1, story: 1 }, { unique: true });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
