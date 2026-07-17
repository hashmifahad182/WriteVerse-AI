const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    type: { type: String, enum: ['story', 'novel', 'blog', 'script'], required: true },
    genre: { type: String, trim: true },
    pov: {
      type: String,
      enum: ['first_person', 'third_person', 'not_applicable'],
      default: 'not_applicable',
    },
    writingStyle: { type: String, trim: true },
    coverPrompt: { type: String },
    coverImageUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'in_progress', 'completed', 'archived'],
      default: 'draft',
    },
    wordCount: { type: Number, default: 0 },
    faissIndexId: { type: String },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

storySchema.index({ owner: 1, isDeleted: 1 });

// Global query middleware: exclude soft-deleted stories unless explicitly overridden
function excludeDeleted(next) {
  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
}
storySchema.pre(/^find/, excludeDeleted);

module.exports = mongoose.model('Story', storySchema);
