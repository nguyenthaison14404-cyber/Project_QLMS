<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <!-- NHÚNG COMPONENT NAVBAR -->
    <Navbar :user="user" @logout="logout" />

    <!-- NỘI DUNG VIEW DỰ ÁN -->
    <main class="flex-grow-1">
      <router-view></router-view>
    </main>

    <!-- FOOTER CHÂN TRANG -->
    <footer
      v-if="user"
      class="bg-white border-top py-3 text-center text-muted small mt-auto"
    >
      <div class="container">
        Thư Viện Trung Tâm — Hệ Thống Quản Lý Nội Bộ &copy; 2026
      </div>
    </footer>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      user: null,
    };
  },
  created() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  },
  methods: {
    logout() {
      if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?")) {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&display=swap");

#app {
  font-family: "Plus Jakarta Sans", sans-serif;
}
</style>
