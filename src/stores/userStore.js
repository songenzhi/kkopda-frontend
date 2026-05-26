import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),

  getters: {
    isLogin: (state) => !!state.user,
  },

  actions: {
    login(userData) {
      // 서버에서 받은 userData 전체를 저장
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('스토어에 저장된 최종 정보:', this.user);
    },

    signup(userData) {
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
    },

    logout() {
      this.user = null;
      localStorage.removeItem('user');
    },
  },
});
