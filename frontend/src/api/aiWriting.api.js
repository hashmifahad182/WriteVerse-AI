import axiosClient from './axiosClient';

export const aiWritingApi = {
  continueWriting: (storyId, payload) => axiosClient.post(`/stories/${storyId}/ai/continue`, payload),
  rewrite: (storyId, payload) => axiosClient.post(`/stories/${storyId}/ai/rewrite`, payload),
  improve: (storyId, payload) => axiosClient.post(`/stories/${storyId}/ai/improve`, payload),
  expand: (storyId, payload) => axiosClient.post(`/stories/${storyId}/ai/expand`, payload),
  shorten: (storyId, payload) => axiosClient.post(`/stories/${storyId}/ai/shorten`, payload),
  changeTone: (storyId, payload) => axiosClient.post(`/stories/${storyId}/ai/tone`, payload),
  generateDialogue: (storyId, payload) => axiosClient.post(`/stories/${storyId}/ai/dialogue`, payload),
};
