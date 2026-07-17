const mongoose = require('mongoose');

const relationshipSchema = new mongoose.Schema(
  {
    character: { type: mongoose.Schema.Types.ObjectId, ref: 'Character' },
    relationType: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const characterSchema = new mongoose.Schema(
  {
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true, index: true },
    name: { type: String, required: true, trim: true },
    aliases: [{ type: String, trim: true }],
    age: { type: Number },
    gender: { type: String, trim: true },
    personality: { type: String, trim: true },
    background: { type: String, trim: true },
    goals: { type: String, trim: true },
    speakingStyle: { type: String, trim: true },
    relationships: [relationshipSchema],
    importantFacts: [{ type: String, trim: true }],
    status: { type: String, enum: ['alive', 'dead', 'unknown', 'missing'], default: 'alive' },
    diedInChapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', default: null },
    firstAppearanceChapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    lastKnownLocation: { type: String, trim: true },
  },
  { timestamps: true }
);

characterSchema.index({ story: 1, name: 1 }, { unique: true });

/**
 * Produces a compact structured-context block used by the AI orchestration
 * layer. This is injected verbatim into prompts as a hard constraint —
 * it is NOT retrieved via vector similarity, it's a direct DB read.
 */
characterSchema.methods.toContextBlock = function toContextBlock() {
  return {
    name: this.name,
    aliases: this.aliases,
    age: this.age,
    gender: this.gender,
    personality: this.personality,
    speakingStyle: this.speakingStyle,
    status: this.status,
    lastKnownLocation: this.lastKnownLocation,
    importantFacts: this.importantFacts,
  };
};

module.exports = mongoose.model('Character', characterSchema);
