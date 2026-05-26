<template>
  <div class="cafe-map-page">
    <header class="list-hero">
      <div class="hero-content">
        <span class="tag">PREMIUM PLUG SPOTS</span>
        <h2 class="title">최적의 <span>지도 탐색</span></h2>
        <div class="search-container">
          <div class="search-bar">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="카페 이름을 검색하세요"
              @keyup.enter="searchPlaces" />
            <button class="search-btn" @click="searchPlaces">🔍 검색</button>
          </div>
        </div>
      </div>
    </header>

    <main class="map-container-wrapper">
      <div class="map-card">
        <div id="map" ref="mapContainer" class="kakao-map"></div>

        <transition name="slide-up">
          <div v-if="selectedPlace" class="place-info-card">
            <h3 class="place-name">{{ selectedPlace.name }}</h3>
            <p class="place-addr">📍 {{ selectedPlace.address }}</p>
            <div class="card-actions">
              <button class="action-main-btn" @click="goToCreate">
                이 스팟 등록하기
              </button>
            </div>
          </div>
        </transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const mapContainer = ref(null);
const searchQuery = ref('');
const selectedPlace = ref(null);
let map = null;

const initMap = () => {
  window.kakao.maps.load(() => {
    map = new window.kakao.maps.Map(mapContainer.value, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 3,
    });
  });
};

const searchPlaces = () => {
  const ps = new window.kakao.maps.services.Places();
  ps.keywordSearch(searchQuery.value, (data, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      const place = data[0];
      selectedPlace.value = {
        name: place.place_name,
        address: place.road_address_name || place.address_name,
      };
      map.panTo(new window.kakao.maps.LatLng(place.y, place.x));
    }
  });
};

// 💡 정보를 쿼리에 담아 배달하는 함수
const goToCreate = () => {
  router.push({
    path: '/cafes/create',
    query: {
      name: selectedPlace.value.name,
      address: selectedPlace.value.address,
    },
  });
};

onMounted(() => initMap());
</script>

<style scoped>
/* 기존 스타일 유지 */
.cafe-map-page {
  padding: 80px 20px;
  max-width: 1300px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
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
}

.list-hero {
  margin-bottom: 60px;
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
  z-index: 1;
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

/* 검색바 디자인 */
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
  outline: none;
  background: transparent;
}

.search-btn {
  background: #bb4d39;
  color: white;
  border: none;
  padding: 0 30px;
  border-radius: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover {
  background: #a33f2c;
}

/* 지도 카드 디자인 */
.map-container-wrapper {
  margin-top: 20px;
}

.map-card {
  background: white;
  border-radius: 30px;
  padding: 20px;
  box-shadow: 0 30px 60px rgba(61, 43, 31, 0.1);
  border: 1px solid #f3f0ec;
  position: relative;
}

.kakao-map {
  width: 100%;
  height: 600px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

/* 🎯 새롭게 추가/수정된 정보 카드 및 버튼 디자인 */
.place-info-card {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(61, 43, 31, 0.15);
  z-index: 10;
  width: 90%;
  max-width: 400px;
  text-align: center;
  border: 1px solid rgba(243, 240, 236, 0.8);
}

.place-name {
  font-size: 22px;
  font-weight: 900;
  color: #3d2b1f;
  margin: 0 0 8px 0;
}

.place-addr {
  font-size: 14px;
  color: #8c7b6e;
  margin: 0 0 24px 0;
  font-weight: 500;
}

.card-actions {
  width: 100%;
}

.action-main-btn {
  background: #bb4d39;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 800;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 20px rgba(187, 77, 57, 0.2);
}

.action-main-btn:hover {
  background: #a33f2c;
  transform: translateY(-3px);
  box-shadow: 0 15px 25px rgba(187, 77, 57, 0.3);
}

.action-main-btn:active {
  transform: translateY(0);
  box-shadow: 0 5px 10px rgba(187, 77, 57, 0.2);
}

/* 🎯 부드럽게 올라오는 애니메이션 (slide-up) */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 30px);
}
</style>
