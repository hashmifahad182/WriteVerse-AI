import axiosClient from './axiosClient';

export const timelineApi = {
  list: (storyId) => axiosClient.get(`/stories/${storyId}/timeline`),
  create: (storyId, payload) => axiosClient.post(`/stories/${storyId}/timeline`, payload),
  update: (storyId, eventId, payload) =>
    axiosClient.patch(`/stories/${storyId}/timeline/${eventId}`, payload),
  remove: (storyId, eventId) => axiosClient.delete(`/stories/${storyId}/timeline/${eventId}`),
};

export const characterApi = {
  list: (storyId) => axiosClient.get(`/stories/${storyId}/characters`),
  create: (storyId, payload) => axiosClient.post(`/stories/${storyId}/characters`, payload),
  update: (storyId, characterId, payload) =>
    axiosClient.patch(`/stories/${storyId}/characters/${characterId}`, payload),
  remove: (storyId, characterId) =>
    axiosClient.delete(`/stories/${storyId}/characters/${characterId}`),
  markDeath: (storyId, characterId, chapterId) =>
    axiosClient.post(`/stories/${storyId}/characters/${characterId}/mark-death`, { chapterId }),
};
