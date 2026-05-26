import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

// 1.  조회
export const getCommunityList = () => {
  return api.get('/community');
};

// 2.  작성
export const createCommunity = (userId, data) => {
  return api.post(`/community?userId=${userId}`, data);
};

// 3. 단일  조회
export const getCommunity = (communityId) => {
  return api.get(`/community/${communityId}`);
};

// 4.  업데이트
export const updateCommunity = (communityId, data) => {
  return api.put(`/community/${communityId}`, data);
};

// 5.  삭제
export const deleteCommunity = (communityId) => {
  return api.delete(`/community/${communityId}`);
};
