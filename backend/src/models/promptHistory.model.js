const mongoose = require('mongoose');

const promptHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true, index: true },
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    actionType: {
      type: String,
      enum: [
        'continue_writing',
        'rewrite',
        'improve_writing',
        'expand',
        'shorten',
        'change_tone',
        'generate_dialogue',
        'generate_chapter',
        'plot_suggestion',
        'story_summary',
        'translate',
        'title_generator',
        'cover_prompt',
      ],
      required: true,
      index: true,
    },
    inputText: { type: String },
    options: { type: mongoose.Schema.Types.Mixed },
    outputText: { type: String },
    tokensUsed: {
      input: { type: Number, default: 0 },
      output: { type: Number, default: 0 },
    },
    latencyMs: { type: Number },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PromptHistory', promptHistorySchema);
