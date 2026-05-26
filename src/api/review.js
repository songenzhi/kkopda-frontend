import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

// 1. 특정 카페의 리뷰 목록 조회 (수정됨!)
export const getReviewsByCafe = (cafeId) => {
  // 이제 ?cafeId=5 방식이 아니라 /cafes/5/reviews 방식으로 날아갑니다.
  return api.get(`/cafes/${cafeId}/reviews`);
};

// 2. 리뷰 작성 (수정됨!)
// api/review.js
export const createReview = (cafeId, userId, data) => {
  return api.post(`/cafes/${cafeId}/reviews`, data, {
    params: { userId: userId },
  });
};

// 3. 단일 리뷰 조회 (수정됨!)
export const getReview = (cafeId, reviewId) => {
  return api.get(`/cafes/${cafeId}/reviews/${reviewId}`);
};

// 4. 리뷰 업데이트 (수정됨!)
export const updateReview = (cafeId, reviewId, data) => {
  return api.put(`/cafes/${cafeId}/reviews/${reviewId}`, data);
};

// 5. 리뷰 삭제 (수정됨!)
export const deleteReview = (cafeId, reviewId) => {
  return api.delete(`/cafes/${cafeId}/reviews/${reviewId}`);
};
