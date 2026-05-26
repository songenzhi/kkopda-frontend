<template>
  <div class="cafe-list-page">
    <div class="bg-glow"></div>

    <header class="list-hero">
      <div class="hero-content">
        <span class="tag">PREMIUM PLUG SPOTS</span>
        <h2 class="title">
          당신의 몰입을 위한<br />최적의 <span>플러그 스팟</span>
        </h2>

        <div class="action-area">
          <button class="create-link-btn" @click="goToCreate">
            <span class="plus-icon">+</span> 새로운 스팟 등록하기
          </button>
        </div>

        <div class="search-container">
          <div class="search-bar">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="카페 이름이나 지역을 검색하세요"
              @keyup.enter="fetchCafes" />
            <button class="search-btn" @click="fetchCafes">
              <span class="search-icon">🔍</span> 검색
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="cafe-grid-container">
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>전국의 콘센트를 찾는 중... 🔌</p>
      </div>

      <div v-else-if="cafes && cafes.length > 0" class="cafe-grid">
        <div
          v-for="cafe in cafes"
          :key="cafe.id"
          class="cafe-card"
          @click="goToDetail(cafe.id)">
          <div class="card-image-wrapper">
            <div class="card-pattern"></div>
            <div class="overlay">상세보기 →</div>
          </div>

          <div class="card-body">
            <h3 class="name">{{ cafe.name }}</h3>
            <p class="addr">📍 {{ cafe.address }}</p>
            <div class="card-footer">
              <div class="meta-item plug">
                <span class="icon">🔌</span>
                <span class="label">콘센트</span>
                <span class="value">{{
                  cafe.hasOutlet ? '있음' : '없음'
                }}</span>
              </div>
              <div class="meta-item star">
                <span class="icon">⭐</span>
                <span class="value">{{ cafe.rating.toFixed(1) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-data">
        <div class="no-data-icon">🏜️</div>
        <h3>검색 결과가 없어요</h3>
        <p>다른 키워드로 검색하거나 직접 스팟을 등록해보세요!</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCafes } from '@/api/cafe';

const router = useRouter();
const cafes = ref([]);
const loading = ref(true);
const searchQuery = ref('');

const fetchCafes = async () => {
  loading.value = true;
  try {
    const res = await getCafes({ name: searchQuery.value });
    // res.data가 없으면 res 자체를 넣거나, 둘 다 없으면 빈 배열 [] 할당
    cafes.value = res.data || res || [];
  } catch (error) {
    console.error('카페 목록 로드 실패:', error);
    cafes.value = []; // 에러가 났을 때도 빈 배열로 초기화해줘야 화면이 안 깨짐
  } finally {
    loading.value = false;
  }
};

const goToDetail = (id) => router.push(`/cafes/${id}`);
const goToCreate = () => router.push('/cafes/create');

// 상태에 따른 배지 색상 클래스 처리
// const getBadgeClass = (status) => {
//   if (status === '혼잡') return 'hard';
//   if (status === '보통') return 'normal';
//   return 'easy';
// };

onMounted(() => fetchCafes());
</script>

<style scoped>
.cafe-list-page {
  padding: 80px 20px;
  max-width: 1300px;
  margin: 0 auto;
  min-height: 100vh;
}

.bg-glow {
  position: fixed;
  top: 0;
  right: 0;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(255, 157, 108, 0.1) 0%,
    transparent 70%
  );
  z-index: -1;
  pointer-events: none;
}

/* 히어로 섹션 */
.list-hero {
  margin-bottom: 80px;
  text-align: center;
}

.tag {
  color: #bb4d39;
  font-weight: 800;
  font-size: 11px;
  letter-spacing: 3px;
  display: block;
  margin-bottom: 15px;
}

.title {
  font-size: 48px;
  font-weight: 900;
  color: #3d2b1f;
  line-height: 1.2;
  margin-bottom: 30px;
}

.title span {
  color: #bb4d39;
  position: relative;
  display: inline-block;
}

.title span::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(255, 157, 108, 0.3);
  z-index: -1;
}

/* 등록 버튼 */
.create-link-btn {
  background: #3d2b1f;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 20px rgba(61, 43, 31, 0.15);
  margin-bottom: 40px;
}

.create-link-btn:hover {
  transform: translateY(-5px);
  background: #bb4d39;
  box-shadow: 0 15px 30px rgba(187, 77, 57, 0.25);
}

/* 검색바 */
.search-container {
  display: flex;
  justify-content: center;
}

.search-bar {
  display: flex;
  background: white;
  padding: 8px;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(61, 43, 31, 0.08);
  width: 100%;
  max-width: 600px;
  border: 1px solid rgba(243, 240, 236, 0.8);
}

.search-bar input {
  flex: 1;
  border: none;
  padding: 15px 25px;
  font-size: 16px;
  border-radius: 15px;
  outline: none;
}

.search-btn {
  background: #bb4d39;
  color: white;
  border: none;
  padding: 0 30px;
  border-radius: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

/* 카페 그리드 */
.cafe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 40px;
}

.cafe-card {
  background: white;
  border-radius: 30px;
  overflow: hidden;
  transition: all 0.4s ease;
  cursor: pointer;
  border: 1px solid #f3f0ec;
  display: flex;
  flex-direction: column;
}

.cafe-card:hover {
  transform: translateY(-15px);
  box-shadow: 0 30px 60px rgba(61, 43, 31, 0.12);
}

.card-image-wrapper {
  height: 220px;
  position: relative;
  overflow: hidden;
  background: #3d2b1f;
}

.card-pattern {
  width: 100%;
  height: 100%;
  opacity: 0.1;
  background-image: radial-gradient(#ff9d6c 1px, transparent 1px);
  background-size: 20px 20px;
}

.badge {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 800;
  color: white;
  letter-spacing: 1px;
}

.badge.easy {
  background: #4caf50;
}
.badge.normal {
  background: #ff9800;
}
.badge.hard {
  background: #f44336;
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
  color: white;
  padding: 20px;
  font-weight: 700;
  font-size: 14px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s;
}

.cafe-card:hover .overlay {
  opacity: 1;
  transform: translateY(0);
}

.card-body {
  padding: 30px;
}

.name {
  font-size: 24px;
  font-weight: 800;
  color: #3d2b1f;
  margin-bottom: 10px;
}

.addr {
  font-size: 14px;
  color: #8c7b6e;
  margin-bottom: 25px;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #f3f0ec;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-item.plug .value {
  color: #bb4d39;
  font-weight: 800;
}

.meta-item.star .value {
  font-weight: 800;
  color: #3d2b1f;
}

/* 로딩 & 데이터 없음 */
.loading-state,
.no-data {
  text-align: center;
  padding: 100px 0;
}

.loader {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f0ec;
  border-top: 5px solid #bb4d39;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
