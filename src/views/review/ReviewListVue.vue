<template>
  <div class="review-container">
    <!-- <div class="search-box">
      <input
        v-model="searchQuery"
        @keyup.enter="fetchReviews"
        type="text"
        placeholder="카페 이름으로 리뷰 검색..." />
      <button @click="fetchReviews">검색</button>
    </div> -->

    <div v-if="reviews.length > 0" class="review-grid">
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <h4>{{ review.cafeName }}</h4>
        <p>{{ review.content }}</p>
        <span class="rating">⭐ {{ review.rating }}</span>
      </div>
    </div>

    <div v-else class="empty-state">
      검색 결과가 없거나 리뷰가 존재하지 않습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // ref 추가!
import { getReviewsByCafe } from '@/api/review';

const reviews = ref([]);
const searchQuery = ref('');

const fetchReviews = async () => {
  try {
    const res = await getReviewsByCafe({ name: searchQuery.value });
    reviews.value = res.data;
  } catch (error) {
    console.error(error);
    alert('리뷰 불러오기 실패');
  }
};

onMounted(() => {
  fetchReviews();
});
</script>

<style scoped>
.review-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}
.search-box input {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
}
.search-box button {
  padding: 0 20px;
  background: #3d2b1f;
  color: white;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.review-grid {
  display: grid;
  gap: 20px;
}
.review-card {
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.review-card h4 {
  margin: 0 0 10px 0;
  color: #bb4d39;
}
.rating {
  color: #ff9d6c;
  font-weight: bold;
}
.empty-state {
  text-align: center;
  color: #a39489;
  padding: 50px;
}
</style>
