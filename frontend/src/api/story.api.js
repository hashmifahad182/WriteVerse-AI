import axiosClient from './axiosClient';

export const storyApi = {
  list: () => axiosClient.get('/stories'),
  get: (storyId) => axiosClient.get(`/stories/${storyId}`),
  create: (payload) => axiosClient.post('/stories', payload),
  update: (storyId, payload) => axiosClient.patch(`/stories/${storyId}`, payload),
  remove: (storyId) => axiosClient.delete(`/stories/${storyId}`),

  getSummary: (storyId) => axiosClient.get(`/stories/${storyId}/summary`),
  getPlotSuggestions: (storyId, requestType) =>
    axiosClient.get(`/stories/${storyId}/plot-suggestions`, { params: { requestType } }),
  generateTitles: (storyId, summary) => axiosClient.post(`/stories/${storyId}/titles`, { summary }),
  generateCoverPrompt: (storyId, summary) =>
    axiosClient.post(`/stories/${storyId}/cover-prompt`, { summary }),
  translateChapter: (storyId, chapterId, targetLanguage) =>
    axiosClient.post(`/stories/${storyId}/translate`, { chapterId, targetLanguage }),
};
