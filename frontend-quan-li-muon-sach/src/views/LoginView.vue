<template>
  <div class="login-wrapper d-flex align-items-center justify-content-center">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-xl-10 col-lg-11">
          <div
            class="card overflow-hidden border-0 shadow-lg my-auto custom-card"
          >
            <div class="row g-0">
              <!-- CỘT TRÁI: BRANDING & HERO BANNER -->
              <div
                class="col-lg-6 login-hero-bg d-none d-lg-flex flex-column justify-content-between p-5 text-white"
              >
                <div>
                  <div class="d-flex align-items-center gap-2 mb-4">
                    <div class="brand-icon-box">
                      <i class="bi bi-journal-bookmark-fill fs-3"></i>
                    </div>
                    <span
                      class="fs-4 fw-bold text-white tracking-wide brand-title"
                      >LibSystem.</span
                    >
                  </div>
                  <h2 class="display-6 fw-bold mb-3 hero-heading">
                    Hệ Thống Quản Lý Thư Viện Thông Minh
                  </h2>
                  <p class="text-white-50 leading-relaxed hero-desc">
                    Không gian số hóa ấm cúng hỗ trợ quản lý kho sách, độc giả
                    và quy trình mượn trả một cách tinh tế.
                  </p>
                </div>

                <div class="hero-footer text-white-50 small">
                  <div class="d-flex align-items-center gap-3">
                    <span
                      ><i class="bi bi-shield-check text-amber me-1"></i> Bảo
                      mật 256-bit</span
                    >
                    <span
                      ><i class="bi bi-speedometer2 text-amber me-1"></i> Vận
                      hành mượt mà</span
                    >
                  </div>
                  <div class="mt-3">
                    © 2026 LibSystem Enterprise. All rights reserved.
                  </div>
                </div>
              </div>

              <!-- CỘT PHẢI: FORM ĐĂNG NHẬP -->
              <div
                class="col-lg-6 bg-warm-card p-4 p-sm-5 d-flex flex-column justify-content-center"
              >
                <div class="text-center text-lg-start mb-4">
                  <span
                    class="badge bg-warm-badge text-warm-primary px-3 py-2 rounded-pill fw-semibold mb-2"
                  >
                    Cổng Đăng Nhập Nội Bộ
                  </span>
                  <h3 class="fw-bold text-warm-dark mb-1 form-heading">
                    Xin chào trở lại! 📖
                  </h3>
                  <p class="text-warm-muted small">
                    Vui lòng nhập thông tin tài khoản nhân viên để tiếp tục
                  </p>
                </div>

                <!-- CẢNH BÁO LỖI -->
                <div
                  v-if="errorMessage"
                  class="alert alert-danger-warm d-flex align-items-center border-0 rounded-3 small mb-4"
                >
                  <i class="bi bi-exclamation-triangle-fill fs-5 me-2"></i>
                  <div>{{ errorMessage }}</div>
                </div>

                <form @submit.prevent="handleLogin">
                  <div class="mb-3">
                    <label class="form-label fw-semibold text-warm-sub small"
                      >Mã Số Nhân Viên (MSNV)</label
                    >
                    <div class="input-group">
                      <span
                        class="input-group-text bg-warm-input border-end-0 text-warm-muted"
                        ><i class="bi bi-person-badge"></i
                      ></span>
                      <input
                        type="text"
                        v-model="msnv"
                        class="form-control custom-input border-start-0 ps-0"
                        placeholder="Nhập mã nhân viên ..."
                        required
                      />
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-semibold text-warm-sub small"
                      >Mật Khẩu</label
                    >
                    <div class="input-group">
                      <span
                        class="input-group-text bg-warm-input border-end-0 text-warm-muted"
                        ><i class="bi bi-lock"></i
                      ></span>
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        v-model="password"
                        class="form-control custom-input border-start-0 border-end-0 ps-0"
                        placeholder="Nhập mật khẩu ..."
                        required
                      />
                      <button
                        type="button"
                        class="btn bg-warm-input border border-start-0 text-warm-muted"
                        @click="showPassword = !showPassword"
                      >
                        <i
                          :class="
                            showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'
                          "
                        ></i>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-warm-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    :disabled="loading"
                  >
                    <span
                      v-if="loading"
                      class="spinner-border spinner-border-sm"
                    ></span>
                    <span v-else>
                      Đăng Nhập Ngay <i class="bi bi-arrow-right"></i>
                    </span>
                  </button>
                </form>

                <div class="mt-4 pt-3 text-center border-top border-warm-light">
                  <p class="text-warm-muted small mb-0">
                    Quên tài khoản hoặc mật khẩu? Vui lòng liên hệ
                    <strong class="text-warm-dark">Quản lý hệ thống</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginView",
  data() {
    return {
      msnv: "",
      password: "",
      showPassword: false,
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const res = await axios.post("http://localhost:3000/api/auth/login", {
          msnv: this.msnv,
          password: this.password,
        });

        localStorage.setItem("user", JSON.stringify(res.data));
        window.location.href = "/";
      } catch (err) {
        this.errorMessage =
          err.response?.data?.message || "Không thể kết nối đến máy chủ!";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

/* Style Nền Trắng Giấy Ấm / Tone Sách */
.login-wrapper {
  min-height: 100vh;
  background-color: #f7f4ef;
  font-family: "Plus Jakarta Sans", sans-serif;
}

.custom-card {
  border-radius: 20px;
  background-color: #fdfbf7;
  border: 1px solid #e8e2d8 !important;
}

/* Banner Bên Trái - Phong Cách Bìa Sách Cổ / Da Nâu */
.login-hero-bg {
  background: linear-gradient(135deg, #603813 0%, #3a220b 100%);
  position: relative;
}

.brand-title,
.hero-heading {
  font-family: "Merriweather", serif;
}

.brand-icon-box {
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.text-amber {
  color: #f59e0b;
}

/* Cột Phải - Form Đăng Nhập */
.bg-warm-card {
  background-color: #fdfbf7;
}

.form-heading {
  font-family: "Merriweather", serif;
}

.text-warm-dark {
  color: #2c221e;
}

.text-warm-muted {
  color: #786c65;
}

.text-warm-sub {
  color: #61524a;
}

.border-warm-light {
  border-color: #e8e2d8 !important;
}

.bg-warm-badge {
  background-color: #f7ede2;
}

.text-warm-primary {
  color: #8c4e2a;
}

/* Ô Nhập Liệu Custom */
.bg-warm-input {
  background-color: #f5f0e6;
  border-color: #dcd1c2;
  color: #786c65;
}

.custom-input {
  background-color: #fcfaf5;
  border-color: #dcd1c2;
  color: #2c221e;
}

.custom-input:focus {
  background-color: #ffffff;
  border-color: #8c4e2a;
  box-shadow: 0 0 0 3px rgba(140, 78, 42, 0.12);
}

/* Nút Bấm Chính Warm Accent */
.btn-warm-primary {
  background: linear-gradient(135deg, #8c4e2a 0%, #6e391b 100%);
  color: #fcfbf8;
  border: none;
  border-radius: 10px;
  transition: all 0.25s ease;
}

.btn-warm-primary:hover {
  background: linear-gradient(135deg, #743e20 0%, #572d14 100%);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(140, 78, 42, 0.3) !important;
}

.alert-danger-warm {
  background-color: #fbebe6;
  color: #9a3412;
  border: 1px solid #f2d4c9 !important;
}
</style>
