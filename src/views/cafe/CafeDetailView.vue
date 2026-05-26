<template>
  <div class="detail-container">
    <div class="bg-glow"></div>

    <section v-if="cafe" class="cafe-hero">
      <div class="hero-card">
        <div class="info-area">
          <span class="category">CAFE DETAIL</span>
          <h2 class="cafe-name">{{ cafe.name }}</h2>
          <p class="address">📍 {{ cafe.address }}</p>

          <div class="spec-tags">
            <span class="tag"
              >🔌 콘센트 {{ cafe.hasOutlet ? '있음' : '없음' }}</span
            >
            <span class="tag"
              >📶 와이파이 {{ cafe.wifi ? '제공' : '없음' }}</span
            >
            <span class="tag"
              >🚗 주차 {{ cafe.parking ? '가능' : '불가' }}</span
            >
          </div>

          <div class="admin-actions">
            <button class="edit-btn" @click="goToEdit">정보 수정하기</button>
            <button class="delete-btn" @click="handleDelete">삭제</button>
          </div>
        </div>
        <div class="visual-area">
          <div class="cafe-placeholder">
            <span>{{ cafe.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="review-section">
      <div class="section-header">
        <h3>
          사용자 리뷰 <span>({{ reviews.length }})</span>
        </h3>
        <button class="review-add-btn" @click="handleCreateReview">
          + 리뷰 작성
        </button>
      </div>

      <div v-if="reviews.length > 0" class="review-list">
        <div v-for="review in reviews" :key="review.id" class="review-card">
          <div class="review-info">
            <span class="user-name"
              >👤 {{ review.user?.nickname || '익명' }}</span
            >
            <span class="rating">⭐ {{ review.rating }}</span>
          </div>
          <p class="content">{{ review.content }}</p>

          <div class="review-footer">
            <span class="date">{{
              new Date(review.createdAt).toLocaleDateString()
            }}</span>

            <div
              v-if="userStore.user?.id === review.user?.id"
              class="review-actions">
              <button class="action-edit" @click="handleUpdateReview(review)">
                수정
              </button>
              <button
                class="action-delete"
                @click="handleDeleteReview(review.id)">
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-review">
        <p>아직 등록된 리뷰가 없습니다. 첫 리뷰를 남겨보세요!</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCafe, deleteCafe, updateCafe } from '@/api/cafe';
import { deleteReview, getReviewsByCafe, updateReview } from '@/api/review';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const cafe = ref(null);
const reviews = ref([]);

// 데이터 불러오기
const fetchCafeDetail = async () => {
  try {
    const res = await getCafe(route.params.id);
    cafe.value = res.data;
  } catch (error) {
    console.error('데이터 로드 실패', error);
    alert('존재하지 않는 카페이거나 정보를 불러올 수 없습니다.');
    router.push('/cafes');
  }
};

// 수정 페이지로 이동
const goToEdit = () => {
  router.push(`/cafes/${route.params.id}/edit`); // 주소 규칙에 따라 수정
};

// 삭제 로직
const handleDelete = async () => {
  if (confirm('정말로 이 스팟을 삭제하시겠습니까?')) {
    try {
      await deleteCafe(route.params.id);
      alert('삭제되었습니다.');
      router.push('/cafes');
    } catch (error) {
      alert('삭제 실패');
    }
  }
};

const handleUpdateReview = async () => {
  if (confirm('수정하시겠습니까?')) {
    try {
      await updateReview(route.params.id);
      alert('수정되었습니다.');
      router.push(`/cafes/${route.params.id}/reviews/${route.params.id}/edit`);
    } catch (error) {
      alert('수정 실패');
    }
  }
};

const handleCreateReview = () => {
  router.push(`/cafes/${route.params.id}/reviews`);
};

const fetchReviews = async () => {
  try {
    const res = await getReviewsByCafe(route.params.id);
    reviews.value = res.data;
  } catch (error) {
    alert('리뷰 불러오기 실패');
  }
};

// 리뷰 삭제 로직 수정
const handleDeleteReview = async (reviewId) => {
  if (!confirm('댓글을 삭제하시겠습니까?')) return;

  try {
    // 🎯 1. 현재 주소창에서 카페 ID를 가져온다.
    const cafeId = route.params.id;

    // 🎯 2. 카페 ID와 리뷰 ID, 두 개를 순서대로 나란히 넘겨준다!
    await deleteReview(cafeId, reviewId);

    alert('댓글이 삭제되었습니다.');
    fetchReviews(); // 목록 새로고침
  } catch (error) {
    console.error('삭제 실패:', error);
    alert('댓글 삭제 실패');
  }
};

onMounted(() => {
  fetchCafeDetail();
  fetchReviews();
});
</script>

<style scoped>
.detail-container {
  padding: 80px 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.bg-glow {
  position: fixed;
  top: 0;
  right: 0;
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(255, 157, 108, 0.1) 0%,
    transparent 70%
  );
  z-index: -1;
}

.hero-card {
  background: white;
  border-radius: 40px;
  padding: 60px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  box-shadow: 0 30px 60px rgba(61, 43, 31, 0.08);
}

.category {
  color: #bb4d39;
  font-weight: 800;
  font-size: 11px;
  letter-spacing: 3px;
}
.cafe-name {
  font-size: 42px;
  font-weight: 900;
  color: #3d2b1f;
  margin: 15px 0;
}
.address {
  color: #8c7b6e;
  margin-bottom: 30px;
  font-size: 17px;
}

.spec-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 40px;
}
.tag {
  background: #f3f0ec;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 700;
  color: #5c4d43;
  font-size: 14px;
}

/* 버튼 스타일 */
.admin-actions {
  display: flex;
  gap: 15px;
}
.edit-btn {
  background: #3d2b1f;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}
.edit-btn:hover {
  background: #bb4d39;
}

.delete-btn {
  background: none;
  border: 1px solid #e2ddd9;
  color: #a39489;
  padding: 14px 24px;
  border-radius: 15px;
  cursor: pointer;
}
.delete-btn:hover {
  color: #f44336;
  border-color: #f44336;
}

.cafe-placeholder {
  width: 100%;
  height: 100%;
  min-height: 300px;
  background: #f9f7f2;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bb4d39;
  font-weight: 900;
  font-size: 24px;
}

/* 리뷰 섹션 스타일 */
.review-section {
  margin-top: 60px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.section-header h3 {
  font-size: 24px;
  font-weight: 800;
  color: #3d2b1f;
}
.section-header h3 span {
  color: #bb4d39;
}
.review-add-btn {
  background: none;
  border: 2px solid #3d2b1f;
  padding: 8px 20px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}
.empty-review {
  padding: 60px;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 30px;
  border: 2px dashed #e2ddd9;
  color: #a39489;
}
.review-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.review-card {
  background: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  border: 1px solid #f3f0ec;
}

.review-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.user-name {
  font-weight: 700;
  color: #3d2b1f;
}

.rating {
  font-weight: 800;
  color: #bb4d39;
}

.content {
  color: #5c4d43;
  line-height: 1.5;
  margin-bottom: 10px;
}

.date {
  font-size: 12px;
  color: #a39489;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  border-top: 1px solid #f3f0ec;
  padding-top: 10px;
}

.review-actions {
  display: flex;
  gap: 10px;
}

.action-edit,
.action-delete {
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: 0.2s;
}

.action-edit {
  color: #8c7b6e;
}
.action-edit:hover {
  background: #f3f0ec;
  color: #3d2b1f;
}

.action-delete {
  color: #a39489;
}
.action-delete:hover {
  background: #fff0f0;
  color: #f44336;
}
</style>
