<template>
  <div class="community-container">
    <div class="header-section">
      <h2>커뮤니티 게시판</h2>
      <button @click="$router.push('/community/create')" class="write-btn">
        글쓰기
      </button>
    </div>

    <div class="table-card">
      <table class="community-table">
        <thead>
          <tr>
            <th width="10%">번호</th>
            <th width="40%">제목</th>
            <th width="15%">작성자</th>
            <th width="15%">작성일</th>
            <th width="20%">관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(post, index) in community" :key="post.id">
            <td>{{ index + 1 }}</td>

            <td class="title-cell" @click="goToDetail(post.id)">
              {{ post.title }}
            </td>
            <td class="author-cell">{{ post.user?.nickname || '익명' }}</td>
            <td class="date-cell">{{ formatDate(post.createdAt) }}</td>

            <td class="manage-cell">
              <div class="btn-group">
                <button
                  @click.stop="goToEdit(post.id)"
                  class="edit-sm-btn"
                  v-if="isAuthor(post)">
                  수정
                </button>
                <button
                  @click.stop="handleToDelete(post.id)"
                  class="delete-sm-btn"
                  v-if="isAuthor(post)">
                  삭제
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { deleteCommunity, getCommunityList } from '@/api/community';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const community = ref([]);
const userStore = useUserStore();

// 내가 쓴 글인지 확인 (수정/삭제 버튼 노출용)
const isAuthor = (post) => {
  return userStore.user?.id === post.user?.id;
};

const fetchCommunityData = async () => {
  try {
    const res = await getCommunityList();
    community.value = res.data;
  } catch (error) {
    console.error(error);
    alert('정보 조회 실패');
  }
};

const goToDetail = (id) => {
  router.push(`/community/${id}`);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// 특정 ID를 받아서 수정 페이지로 이동
const goToEdit = (id) => {
  router.push(`/community/edit/${id}`);
};

const handleToDelete = async (id) => {
  if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;

  try {
    await deleteCommunity(id);
    alert('삭제되었습니다.');
    fetchCommunityData(); // 목록 새로고침
  } catch (error) {
    alert('삭제 실패');
  }
};

onMounted(() => {
  fetchCommunityData();
});
</script>

<style scoped>
/* 기존 스타일 유지하면서 추가/수정된 부분 */
.community-container {
  max-width: 1000px; /* 버튼 컬럼이 생겼으므로 조금 더 넓게 조정 */
  margin: 50px auto;
  padding: 0 20px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h2 {
  color: #3d2b1f;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 800;
}

.table-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #f3f0ec;
}

.community-table {
  width: 100%;
  border-collapse: collapse;
}

.community-table th {
  background-color: #fcfaf8;
  color: #8c7b6e;
  font-weight: 700;
  padding: 18px 12px;
  border-bottom: 2px solid #f3f0ec;
  font-size: 0.95rem;
}

.community-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f3f0ec;
  color: #5d4a3e;
  font-size: 0.95rem;
  vertical-align: middle;
}

.title-cell {
  text-align: left;
  font-weight: 600;
  color: #3d2b1f;
  cursor: pointer;
}

.title-cell:hover {
  text-decoration: underline;
}

/* 관리 버튼 그룹 스타일 */
.manage-cell {
  text-align: center;
}

.btn-group {
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* 작고 감성적인 버튼 스타일 */
.edit-sm-btn,
.delete-sm-btn {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.edit-sm-btn {
  background: #f3f0ec;
  color: #8c7b6e;
}

.edit-sm-btn:hover {
  background: #e2ddd9;
  color: #3d2b1f;
}

.delete-sm-btn {
  background: #fff0f0;
  color: #e57373;
}

.delete-sm-btn:hover {
  background: #ffe5e5;
  color: #d32f2f;
}

.write-btn {
  background: #3d2b1f;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s,
    opacity 0.2s;
}

.write-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.no-data {
  padding: 80px 0;
  color: #c2b9b0;
  font-weight: 500;
}
</style>
