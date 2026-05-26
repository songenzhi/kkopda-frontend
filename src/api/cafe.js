import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

export const getCafes = (params) => {
  return api.get('/cafes', { params });
};

export const createCafe = (data) => {
  return api.post('/cafes', data);
};

export const getCafe = (id) => {
  return api.get(`/cafes/${id}`);
};

export const updateCafe = (id, data) => {
  return api.put(`/cafes/${id}`, data);
};

export const deleteCafe = (id) => {
  return api.delete(`/cafes/${id}`);
};

export const checkCafeExists = (kakaoId) => {
  return axios.get(`/cafes/check/${kakaoId}`);
};
