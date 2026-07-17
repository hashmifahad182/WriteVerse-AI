import axiosClient from './axiosClient';

export const aiChatApi = {
  ask: (storyId, question) => axiosClient.post(`/stories/${storyId}/chat/ask`, { question }),
  history: (storyId) => axiosClient.get(`/stories/${storyId}/chat/history`),
};
