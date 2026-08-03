import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import NhaXuatBanView from '../views/NhaXuatBanView.vue';
import SachView from '../views/SachView.vue';
import DocGiaView from '../views/DocGiaView.vue';
import MuonSachView from '../views/MuonSachView.vue';
import NhanVienView from '../views/NhanVienView.vue';

const routes = [
  // 1. TRANG ĐĂNG NHẬP (Công khai)
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },

  // 2. CÁC TRANG CẦN ĐĂNG NHẬP (Cả Admin và Nhân viên đều vào được)
  {
    path: '/',
    name: 'NhaXuatBan',
    component: NhaXuatBanView,
    meta: { requiresAuth: true },
  },
  {
    path: '/sach',
    name: 'Sach',
    component: SachView,
    meta: { requiresAuth: true },
  },
  {
    path: '/doc-gia',
    name: 'DocGia',
    component: DocGiaView,
    meta: { requiresAuth: true },
  },
  {
    path: '/muon-sach',
    name: 'MuonSach',
    component: MuonSachView,
    meta: { requiresAuth: true },
  },

  // 3. TRANG CHỈ ADMIN MỚI CÓ QUYỀN VÀO
  {
    path: '/nhan-vien',
    name: 'NhanVien',
    component: NhanVienView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  // Chuyển hướng các đường dẫn không tồn tại về trang chủ
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ⚡ BỘ LỌC BẢO VỆ ROUTE & PHÂN QUYỀN (NAVIGATION GUARD)
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // Nếu chưa đăng nhập mà truy cập trang yêu cầu đăng nhập -> Chuyển về /login
  if (to.meta.requiresAuth && !user) {
    return next({ name: 'Login' });
  }

  // Nếu đã đăng nhập rồi mà cố vào lại trang /login -> Cho về trang chủ
  if (to.path === '/login' && user) {
    return next({ name: 'NhaXuatBan' });
  }

  // Nếu không phải Admin mà cố tình gõ URL vào /nhan-vien -> Chặn lại & Thông báo
  if (to.meta.requiresAdmin && (!user || !user.isAdmin)) {
    alert('⛔ Bạn không có quyền truy cập vào trang Quản Lý Nhân Viên!');
    return next({ name: 'NhaXuatBan' });
  }

  next();
});

export default router;