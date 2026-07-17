const TimelineEvent = require('../models/timeline.model');
const ApiError = require('../utils/apiError');

async function createTimelineEvent(storyId, payload) {
  return TimelineEvent.create({ ...payload, story: storyId });
}

async function listTimelineForStory(storyId) {
  return TimelineEvent.find({ story: storyId }).sort({ chronologicalOrder: 1 });
}

async function updateTimelineEvent(eventId, storyId, updates) {
  const event = await TimelineEvent.findOne({ _id: eventId, story: storyId });
  if (!event) throw ApiError.notFound('Timeline event not found');

  Object.assign(event, updates, { isManuallyEdited: true });
  await event.save();
  return event;
}

async function deleteTimelineEvent(eventId, storyId) {
  const event = await TimelineEvent.findOne({ _id: eventId, story: storyId });
  if (!event) throw ApiError.notFound('Timeline event not found');
  await event.deleteOne();
}

/**
 * Checks proposed new event data against existing timeline for basic
 * contradictions (e.g. same character in two "location_change" events
 * at the same chronological position with different locations).
 * Returns warnings only — does not block creation, since the user/AI
 * may be intentionally correcting the timeline.
 */
async function detectContradictions(storyId, proposedEvent) {
  const warnings = [];
  const nearbyEvents = await TimelineEvent.find({
    story: storyId,
    chronologicalOrder: {
      $gte: proposedEvent.chronologicalOrder - 2,
      $lte: proposedEvent.chronologicalOrder + 2,
    },
  });

  if (proposedEvent.eventType === 'location_change') {
    const conflicting = nearbyEvents.find(
      (e) =>
        e.eventType === 'location_change' &&
        e.chronologicalOrder === proposedEvent.chronologicalOrder &&
        e.location !== proposedEvent.location &&
        e.charactersInvolved.some((c) => proposedEvent.charactersInvolved?.includes(c.toString()))
    );
    if (conflicting) {
      warnings.push(
        `Possible conflict: a character is placed in "${conflicting.location}" and "${proposedEvent.location}" at the same point in the timeline.`
      );
    }
  }

  return warnings;
}

module.exports = {
  createTimelineEvent,
  listTimelineForStory,
  updateTimelineEvent,
  deleteTimelineEvent,
  detectContradictions,
};
