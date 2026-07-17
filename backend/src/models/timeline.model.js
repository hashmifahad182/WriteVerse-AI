const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema(
  {
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true, index: true },
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
    eventType: {
      type: String,
      enum: [
        'major_event',
        'character_introduction',
        'character_death',
        'location_change',
        'flashback',
        'plot_twist',
        'important_object',
        'relationship_change',
        'time_skip',
      ],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    charactersInvolved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
    location: { type: String, trim: true },
    storyTimeReference: { type: String, trim: true },
    chronologicalOrder: { type: Number, required: true },
    isManuallyEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

timelineEventSchema.index({ story: 1, chronologicalOrder: 1 });

module.exports = mongoose.model('TimelineEvent', timelineEventSchema);
