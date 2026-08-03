<template>
  <nav class="navbar navbar-expand-lg custom-navbar shadow-sm mb-4">
    <div class="container-fluid px-lg-5">
      <!-- LOGO / TÊN HỆ THỐNG -->
      <router-link
        class="navbar-brand fw-bold d-flex align-items-center gap-2"
        to="/"
      >
        <div class="brand-icon-box">
          <i class="bi bi-book-half"></i>
        </div>
        <span class="brand-title"
          >Lib<span class="text-amber">System</span></span
        >
      </router-link>

      <!-- NÚT TOGGLER MÀN HÌNH NHỎ (MOBILE) -->
      <button
        class="navbar-toggler custom-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i class="bi bi-list text-light fs-3"></i>
      </button>

      <!-- MENU ĐIỀU HƯỚNG -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto gap-1 py-2 py-lg-0 ms-lg-4">
          <li class="nav-item">
            <router-link
              class="nav-link custom-nav-link"
              to="/"
              active-class="active"
            >
              <i class="bi bi-building me-2 icon-accent"></i> Nhà Xuất Bản
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link custom-nav-link"
              to="/sach"
              active-class="active"
            >
              <i class="bi bi-journal-bookmark-fill me-2 icon-accent"></i> Kho
              Sách
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link custom-nav-link"
              to="/doc-gia"
              active-class="active"
            >
              <i class="bi bi-people-fill me-2 icon-accent"></i> Độc Giả
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link custom-nav-link"
              to="/muon-sach"
              active-class="active"
            >
              <i class="bi bi-card-checklist me-2 icon-accent"></i> Theo Dõi
              Mượn Trả
            </router-link>
          </li>

          <!-- MỤC CHỈ DÀNH CHO ADMIN -->
          <li v-if="user && user.isAdmin" class="nav-item">
            <router-link
              class="nav-link custom-nav-link text-admin-link"
              to="/nhan-vien"
              active-class="active"
            >
              <i class="bi bi-shield-lock-fill me-2 icon-admin"></i> Quản Lý
              Nhân Viên
            </router-link>
          </li>
        </ul>

        <!-- THÔNG TIN TÀI KHOẢN & ĐĂNG XUẤT -->
        <div
          v-if="user"
          class="d-flex align-items-center gap-3 pt-2 pt-lg-0 border-top border-lg-0 border-secondary-subtle"
        >
          <div class="d-flex align-items-center gap-2">
            <div class="avatar-circle bg-amber text-white fw-bold shadow-sm">
              {{ getInitials(user.hoTenNV) }}
            </div>
            <div class="d-none d-sm-block text-end">
              <div class="fw-bold text-white small leading-tight">
                {{ user.hoTenNV }}
              </div>
              <span
                class="badge mt-0.5"
                :class="user.isAdmin ? 'badge-admin' : 'badge-user'"
              >
                {{ user.isAdmin ? "👑 Quản Lý" : "👤 Thủ Thư" }}
              </span>
            </div>
          </div>

          <button
            @click="emit('logout')"
            class="btn btn-logout btn-sm px-3 rounded-pill fw-semibold"
            title="Đăng Xuất"
          >
            <i class="bi bi-box-arrow-right me-1"></i> Thoát
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["logout"]);

// Hàm lấy 2 chữ cái đầu tiên của tên làm Avatar
const getInitials = (name) => {
  if (!name) return "NV";
  const parts = name.trim().split(" ");
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase();
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap");

/* Nền Navbar Nâu Đậm (Espresso / Dark Mahogany) */
.custom-navbar {
  background: linear-gradient(135deg, #2a150c 0%, #1a0c07 100%);
  border-bottom: 3px solid #b45309;
  padding-top: 10px;
  padding-bottom: 10px;
  font-family: "Plus Jakarta Sans", sans-serif;
}

/* Brand Section */
.brand-title {
  font-family: "Merriweather", serif;
  font-size: 1.3rem;
  color: #ffffff !important;
  letter-spacing: 0.5px;
}

.bg-amber {
  background-color: #b45309 !important;
}

.text-amber {
  color: #f59e0b !important;
}

.brand-icon-box {
  width: 40px;
  height: 40px;
  background-color: #b45309;
  color: #ffffff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

/* Nav Links */
.custom-nav-link {
  color: #f3eae1 !important;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 8px 14px !important;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
}

.icon-accent {
  color: #f59e0b;
  font-size: 1.1rem;
}

.icon-admin {
  color: #fbbf24;
}

.text-admin-link {
  color: #fcd34d !important;
}

/* Hover State */
.custom-nav-link:hover {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.12);
}

.custom-nav-link:hover .icon-accent {
  color: #fbbf24;
}

/* Active State */
.custom-nav-link.active {
  color: #ffffff !important;
  background: linear-gradient(135deg, #b45309 0%, #78350f 100%);
  box-shadow: 0 3px 10px rgba(180, 83, 9, 0.4);
  font-weight: 700;
}

.custom-nav-link.active .icon-accent,
.custom-nav-link.active .icon-admin {
  color: #ffffff;
}

/* User Profile Styles */
.avatar-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.88rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.badge-admin {
  background-color: #fef3c7;
  color: #92400e;
  font-weight: 700;
  font-size: 0.72rem;
  padding: 3px 8px;
}

.badge-user {
  background-color: #e0f2fe;
  color: #0369a1;
  font-weight: 700;
  font-size: 0.72rem;
  padding: 3px 8px;
}

/* Nút Đăng xuất */
.btn-logout {
  background-color: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.4);
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background-color: #dc2626;
  color: #ffffff;
  border-color: #dc2626;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
}

/* Mobile Toggler */
.custom-toggler {
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 4px 8px;
  border-radius: 8px;
}

.custom-toggler:focus {
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.4);
}
</style>
