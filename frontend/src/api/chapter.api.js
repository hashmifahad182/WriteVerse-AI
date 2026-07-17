import axiosClient from './axiosClient';

export const chapterApi = {
  list: (storyId) => axiosClient.get(`/stories/${storyId}/chapters`),
  get: (storyId, chapterId) => axiosClient.get(`/stories/${storyId}/chapters/${chapterId}`),
  create: (storyId, payload) => axiosClient.post(`/stories/${storyId}/chapters`, payload),
  update: (storyId, chapterId, payload) =>
    axiosClient.patch(`/stories/${storyId}/chapters/${chapterId}`, payload),
  remove: (storyId, chapterId) => axiosClient.delete(`/stories/${storyId}/chapters/${chapterId}`),
  summarize: (storyId, chapterId) =>
    axiosClient.post(`/stories/${storyId}/chapters/${chapterId}/summary`),
  generate: (storyId, payload) => axiosClient.post(`/stories/${storyId}/chapters/generate`, payload),
};
