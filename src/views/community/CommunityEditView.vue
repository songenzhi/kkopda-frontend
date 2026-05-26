<template>
  <div class="edit-page">
    <div class="edit-container">
      <h2>게시글 수정</h2>

      <div class="input-section">
        <label for="title">제목</label>
        <input
          id="title"
          v-model="post.title"
          type="text"
          placeholder="제목을 입력하세요" />
      </div>

      <div class="input-section">
        <label for="content">내용</label>
        <textarea
          id="content"
          v-model="post.description"
          placeholder="내용을 입력하세요"></textarea>
      </div>

      <div class="actions">
        <button @click="$router.back()" class="cancel-btn">취소</button>
        <button @click="handleUpdate" class="save-btn">수정 완료</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCommunity, updateCommunity } from '@/api/community';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const postId = route.params.id;
const post = ref({
  title: '',
  description: '',
});

// 1. 기존 데이터 불러오기
const fetchPost = async () => {
  try {
    const res = await getCommunity(postId);
    post.value = res.data;
  } catch (error) {
    alert('데이터를 불러오지 못했습니다.');
    router.back();
  }
};

// 2. 수정 실행
const handleUpdate = async () => {
  if (!post.value.title || !post.value.description) {
    alert('제목과 내용을 모두 입력해주세요.');
    return;
  }

  try {
    // API 호출 시 (ID, 수정할 데이터)를 함께 보냅니다.
    await updateCommunity(postId, post.value);
    alert('수정이 완료되었습니다.');
    router.push(`/community/${postId}`); // 수정 후 상세 페이지로 이동
  } catch (error) {
    console.error(error);
    alert('수정 실패');
  }
};

onMounted(() => {
  fetchPost();
});
</script>

<style scoped>
.edit-page {
  padding: 60px 20px;
}

.edit-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f0ec;
}

h2 {
  color: #3d2b1f;
  margin-bottom: 30px;
  font-weight: 800;
  text-align: center;
}

.input-section {
  margin-bottom: 25px;
}

label {
  display: block;
  font-weight: 700;
  margin-bottom: 10px;
  color: #8c7b6e;
}

input[type='text'],
textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #e2ddd9;
  border-radius: 12px;
  outline: none;
  font-size: 1rem;
  color: #5d4a3e;
  background-color: #fcfaf8;
}

input[type='text']:focus,
textarea:focus {
  border-color: #3d2b1f;
  background-color: white;
}

textarea {
  min-height: 300px;
  resize: none;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.save-btn {
  flex: 2;
  background: #3d2b1f;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.cancel-btn {
  flex: 1;
  background: #f3f0ec;
  color: #8c7b6e;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}
</style>
