const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema(
  {
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true, index: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
    content: { type: String, default: '' },
    summary: { type: String, default: '' },
    wordCount: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'final'], default: 'draft' },
    isEmbedded: { type: Boolean, default: false },
    lastEmbeddedAt: { type: Date },
  },
  { timestamps: true }
);

chapterSchema.index({ story: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('Chapter', chapterSchema);
