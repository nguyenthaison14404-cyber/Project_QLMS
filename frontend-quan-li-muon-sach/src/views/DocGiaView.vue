<template>
  <div class="doc-gia-wrapper py-4 px-3 px-lg-5">
    <!-- TIÊU ĐỀ & THAO TÁC CHÍNH -->
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3"
    >
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <div class="icon-title-box">
            <i class="bi bi-book-half"></i>
          </div>
          <h3 class="fw-bold text-warm-dark mb-0 fs-4">Quản Lý Độc Giả</h3>
        </div>
        <p class="text-warm-muted small mb-0 ms-1">
          Quản lý thông tin thẻ thư viện, danh sách bạn đọc và hồ sơ thành viên
        </p>
      </div>

      <!-- BUTTON THÊM MỚI -->
      <button
        @click="moModalThem"
        class="btn btn-warm-primary d-flex align-items-center gap-2 shadow-sm fw-semibold px-3 py-2"
      >
        <i class="bi bi-person-plus-fill fs-6"></i>
        <span>Thêm Độc Giả Mới</span>
      </button>
    </div>

    <!-- 2 CARD THỐNG KÊ KPI (ẤM ÁP / PHONG CÁCH SÁCH) -->
    <div class="row g-3 mb-4">
      <div class="col-md-6">
        <div class="kpi-card card-amber">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="kpi-label">Tổng Số Độc Giả</div>
              <div class="kpi-value text-warm-dark">{{ dsDocGia.length }}</div>
            </div>
            <div class="kpi-icon icon-amber">
              <i class="bi bi-person-vcard-fill"></i>
            </div>
          </div>
          <div class="kpi-footer text-amber-700">
            <i class="bi bi-card-heading me-1"></i> Thẻ độc giả đang hoạt động
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="kpi-card card-terracotta">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="kpi-label">Độc Giả Nam / Nữ</div>
              <div class="kpi-value text-warm-dark">
                {{ countNam }} / {{ countNu }}
              </div>
            </div>
            <div class="kpi-icon icon-terracotta">
              <i class="bi bi-gender-ambiguous"></i>
            </div>
          </div>
          <div class="kpi-footer text-terracotta-700">
            <i class="bi bi-pie-chart-fill me-1"></i> Cân bằng giới tính độc giả
          </div>
        </div>
      </div>
    </div>

    <!-- BẢNG DANH SÁCH ĐỘC GIẢ -->
    <div class="custom-card card border-0 shadow-sm">
      <div
        class="card-header bg-warm-card py-3 px-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom border-warm-light gap-3"
      >
        <div class="d-flex align-items-center gap-2">
          <h6 class="fw-bold mb-0 text-warm-dark">Danh Sách Bạn Đọc</h6>
          <span class="badge bg-warm-pill text-warm-sub rounded-pill"
            >{{ filteredList.length }} độc giả</span
          >
        </div>

        <div class="search-box">
          <i class="bi bi-search search-icon"></i>
          <input
            type="text"
            v-model="searchQuery"
            class="form-control search-input"
            placeholder="Tìm theo tên, mã DG, SĐT..."
          />
        </div>
      </div>

      <div class="card-body p-0 table-responsive">
        <table class="table table-hover align-middle mb-0 custom-table">
          <thead>
            <tr>
              <th class="ps-4">STT</th>
              <th>Mã DG</th>
              <th>Họ Và Tên</th>
              <th>Phái</th>
              <th>Số Điện Thoại</th>
              <th>Địa Chỉ</th>
              <th class="text-end pe-4">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredList.length === 0">
              <td colspan="7" class="text-center py-5 text-muted">
                <i
                  class="bi bi-journal-bookmark fs-2 d-block mb-2 text-warm-sub"
                ></i>
                Không tìm thấy dữ liệu độc giả phù hợp.
              </td>
            </tr>

            <tr v-for="(dg, index) in paginatedDocGia" :key="dg._id">
              <td class="ps-4 fw-semibold text-warm-sub">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td>
                <span class="madg-tag">{{ dg.maDocGia }}</span>
              </td>
              <td>
                <div class="d-flex align-items-center gap-3">
                  <div class="user-avatar">
                    {{ dg.ten ? dg.ten.charAt(0).toUpperCase() : "D" }}
                  </div>
                  <div>
                    <div class="fw-bold text-warm-dark mb-0">
                      {{ dg.hoLot }} {{ dg.ten }}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span
                  :class="{
                    'badge-gender-nam': dg.phai === 'Nam',
                    'badge-gender-nu': dg.phai === 'Nữ',
                    'badge-gender-khac': dg.phai !== 'Nam' && dg.phai !== 'Nữ',
                  }"
                  class="gender-badge"
                >
                  <i
                    :class="{
                      'bi bi-gender-male': dg.phai === 'Nam',
                      'bi bi-gender-female': dg.phai === 'Nữ',
                      'bi bi-gender-ambiguous':
                        dg.phai !== 'Nam' && dg.phai !== 'Nữ',
                    }"
                    class="me-1"
                  ></i>
                  {{ dg.phai || "Khác" }}
                </span>
              </td>
              <td class="small font-monospace fw-semibold text-warm-dark">
                {{ dg.dienThoai || "---" }}
              </td>
              <td
                class="small text-warm-sub text-truncate"
                style="max-width: 200px"
              >
                {{ dg.diaChi || "Chưa cập nhật" }}
              </td>
              <td class="text-end pe-4">
                <button
                  @click="editDocGia(dg)"
                  class="action-btn btn-edit me-1"
                  title="Chỉnh sửa"
                >
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button
                  @click="deleteDocGia(dg._id)"
                  class="action-btn btn-delete"
                  title="Xóa độc giả"
                >
                  <i class="bi bi-trash3-fill"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- THANH PHÂN TRANG (PAGINATION) -->
      <div
        v-if="filteredList.length > 0"
        class="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 px-4 border-top border-warm-light gap-2"
      >
        <span class="text-warm-muted small">
          Hiển thị <strong>{{ (currentPage - 1) * itemsPerPage + 1 }}</strong> -
          <strong>{{
            Math.min(currentPage * itemsPerPage, filteredList.length)
          }}</strong>
          trong <strong>{{ filteredList.length }}</strong> độc giả
        </span>

        <nav v-if="totalPages > 1">
          <ul class="pagination pagination-sm mb-0 custom-pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <button class="page-link" @click="changePage(page)">
                {{ page }}
              </button>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
              <button class="page-link" @click="changePage(currentPage + 1)">
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- MODAL THÊM / CẬP NHẬT ĐỘC GIẢ -->
    <div
      v-if="showModal"
      class="modal-backdrop-custom d-flex align-items-center justify-content-center"
    >
      <div class="card shadow-lg border-0 modal-card animated-fadeIn">
        <div
          class="modal-header-styled d-flex justify-content-between align-items-center p-4 border-bottom border-warm-light"
        >
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-journal-bookmark-fill text-amber-700 fs-5"></i>
            <h5 class="fw-bold mb-0 text-warm-dark">
              {{
                isEditing
                  ? "Cập Nhật Thông Tin Độc Giả"
                  : "Thêm Thẻ Độc Giả Mới"
              }}
            </h5>
          </div>
          <button @click="dongModal" class="btn-close-custom">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="saveDocGia" class="p-4">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label custom-label">Mã Độc Giả (Mã thẻ)</label>
              <input
                type="text"
                v-model="form.maDocGia"
                class="form-control custom-input"
                placeholder="Ví dụ: DG01"
                :disabled="isEditing"
                required
              />
            </div>

            <div class="col-md-6">
              <label class="form-label custom-label">Giới Tính</label>
              <select
                v-model="form.phai"
                class="form-select custom-input"
                required
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label custom-label">Họ Lót</label>
              <input
                type="text"
                v-model="form.hoLot"
                class="form-control custom-input"
                placeholder="Nguyễn Văn"
                required
              />
            </div>

            <div class="col-md-6">
              <label class="form-label custom-label">Tên</label>
              <input
                type="text"
                v-model="form.ten"
                class="form-control custom-input"
                placeholder="An"
                required
              />
            </div>

            <div class="col-12">
              <label class="form-label custom-label">Số Điện Thoại</label>
              <input
                type="tel"
                v-model="form.dienThoai"
                class="form-control custom-input"
                placeholder="0901234567"
                maxlength="10"
                required
              />
            </div>

            <div class="col-12">
              <label class="form-label custom-label">Địa Chỉ Thường Trú</label>
              <input
                type="text"
                v-model="form.diaChi"
                class="form-control custom-input"
                placeholder="Số nhà, đường, phường/xã..."
              />
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2 mt-4 pt-2">
            <button
              type="button"
              @click="dongModal"
              class="btn btn-warm-cancel px-4"
            >
              Hủy Bỏ
            </button>
            <button type="submit" class="btn btn-warm-primary px-4 fw-semibold">
              <i class="bi bi-check-lg me-1"></i>
              {{ isEditing ? "Cập Nhật" : "Lưu Độc Giả" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import api from "../services/api.service";

const dsDocGia = ref([]);
const searchQuery = ref("");
const showModal = ref(false);
const isEditing = ref(false);

const form = ref({
  _id: null,
  maDocGia: "",
  hoLot: "",
  ten: "",
  phai: "Nam",
  diaChi: "",
  dienThoai: "",
});

// Cấu hình Phân Trang
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Thống kê đếm giới tính
const countNam = computed(
  () => dsDocGia.value.filter((dg) => dg.phai === "Nam").length,
);
const countNu = computed(
  () => dsDocGia.value.filter((dg) => dg.phai === "Nữ").length,
);

// Danh sách sau khi lọc từ khóa tìm kiếm
const filteredList = computed(() => {
  return dsDocGia.value.filter((dg) => {
    const hoTen = `${dg.hoLot || ""} ${dg.ten || ""}`.toLowerCase();
    const ma = (dg.maDocGia || "").toLowerCase();
    const sdt = (dg.dienThoai || "").toLowerCase();
    const query = searchQuery.value.toLowerCase();
    return hoTen.includes(query) || ma.includes(query) || sdt.includes(query);
  });
});

// Độc giả cắt theo trang hiện tại
const paginatedDocGia = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredList.value.slice(start, end);
});

// Tính tổng số trang dựa theo danh sách đã lọc
const totalPages = computed(() => {
  return Math.ceil(filteredList.value.length / itemsPerPage.value) || 1;
});

// Chuyển trang
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const resetForm = () => {
  isEditing.value = false;
  form.value = {
    _id: null,
    maDocGia: "",
    hoLot: "",
    ten: "",
    phai: "Nam",
    diaChi: "",
    dienThoai: "",
  };
};

const moModalThem = () => {
  resetForm();
  showModal.value = true;
};

const dongModal = () => {
  showModal.value = false;
  resetForm();
};

const fetchDocGia = async () => {
  try {
    const res = await api.get("/docgia");
    dsDocGia.value = res.data;

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  } catch (err) {
    console.error("Lỗi lấy danh sách độc giả:", err);
    Swal.fire({
      icon: "error",
      title: "Lỗi tải dữ liệu",
      text: "Không thể kết nối đến máy chủ để lấy danh sách độc giả!",
      confirmButtonColor: "#8c4e2a",
    });
  }
};

const saveDocGia = async () => {
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(form.value.dienThoai)) {
    Swal.fire({
      icon: "warning",
      title: "Số điện thoại không hợp lệ",
      text: "Số điện thoại phải gồm đúng 10 chữ số và không chứa ký tự đặc biệt!",
      confirmButtonColor: "#8c4e2a",
    });
    return;
  }

  try {
    if (isEditing.value) {
      await api.put(`/docgia/${form.value._id}`, form.value);
      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: `Đã lưu thông tin cho độc giả ${form.value.hoLot} ${form.value.ten}`,
        timer: 1800,
        showConfirmButton: false,
      });
    } else {
      await api.post("/docgia", form.value);
      Swal.fire({
        icon: "success",
        title: "Thêm độc giả thành công!",
        timer: 1800,
        showConfirmButton: false,
      });
    }
    showModal.value = false;
    resetForm();
    fetchDocGia();
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Thao tác thất bại",
      text:
        err.response?.data?.message ||
        "Kiểm tra lại dữ liệu hoặc Mã Độc Giả đã tồn tại!",
      confirmButtonColor: "#8c4e2a",
    });
  }
};

const editDocGia = (dg) => {
  isEditing.value = true;
  form.value = { ...dg };
  showModal.value = true;
};

const deleteDocGia = async (id) => {
  const result = await Swal.fire({
    title: "Xác nhận xóa?",
    text: "Bạn có chắc chắn muốn xóa độc giả này khỏi hệ thống?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#b91c1c",
    cancelButtonColor: "#78716c",
    confirmButtonText: "Đồng ý xóa",
    cancelButtonText: "Hủy bỏ",
  });

  if (!result.isConfirmed) return;

  try {
    await api.delete(`/docgia/${id}`);
    Swal.fire({
      icon: "success",
      title: "Đã xóa độc giả!",
      timer: 1500,
      showConfirmButton: false,
    });
    fetchDocGia();
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Không thể xóa",
      text:
        err.response?.data?.message ||
        "Lỗi khi xóa! Độc giả này có thể đang có lịch sử mượn sách.",
      confirmButtonColor: "#b91c1c",
    });
  }
};

onMounted(() => {
  fetchDocGia();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

/* Tone màu giấy cũ, bìa sách, phong cách thơ mộng, ấm áp */
.doc-gia-wrapper {
  background-color: #f7f4ef;
  min-height: 100vh;
  font-family: "Plus Jakarta Sans", sans-serif;
}

/* Typography Ấm Áp */
.text-warm-dark {
  color: #2c221e;
  font-family: "Merriweather", serif;
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
.text-amber-700 {
  color: #8c4e2a;
}
.text-terracotta-700 {
  color: #9a3412;
}

/* Biểu tượng Icon trang chính */
.icon-title-box {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #603813 0%, #3a220b 100%);
  color: #fdfbf7;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(58, 34, 11, 0.15);
}

/* Nút Bấm Ấm Tone Màu Bìa Sách Nâu Đỏ / Amber */
.btn-warm-primary {
  background: linear-gradient(135deg, #8c4e2a 0%, #6e391b 100%);
  color: #fcfbf8;
  border: none;
  border-radius: 10px;
  transition: all 0.25 ease;
}
.btn-warm-primary:hover {
  background: linear-gradient(135deg, #743e20 0%, #572d14 100%);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(140, 78, 42, 0.3) !important;
}

.btn-warm-cancel {
  background-color: #e8e2d8;
  color: #52463e;
  border-radius: 8px;
  font-weight: 600;
}
.btn-warm-cancel:hover {
  background-color: #ded6c9;
}

/* KPI Cards Style Thơ Mộng */
.kpi-card {
  background: #fdfbf7;
  border-radius: 16px;
  padding: 1.35rem;
  border: 1px solid #ebd8c8;
  box-shadow: 0 4px 15px -3px rgba(88, 64, 46, 0.05);
  position: relative;
  overflow: hidden;
}
.kpi-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
}
.card-amber::before {
  background: #8c4e2a;
}
.card-terracotta::before {
  background: #9a3412;
}

.kpi-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #8c786c;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}
.kpi-value {
  font-size: 1.85rem;
  font-weight: 700;
  line-height: 1.2;
  margin-top: 4px;
}
.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}
.icon-amber {
  background-color: #f7ede2;
  color: #8c4e2a;
}
.icon-terracotta {
  background-color: #fbebe6;
  color: #9a3412;
}

.kpi-footer {
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 3px;
}

/* Custom Card & Bảng Dữ Liệu */
.custom-card {
  border-radius: 16px;
  overflow: hidden;
  background-color: #fdfbf7;
  border: 1px solid #e8e2d8 !important;
}
.bg-warm-card {
  background-color: #faf7f2;
}
.bg-warm-pill {
  background-color: #eae3d5;
}

/* Ô Tìm Kiếm */
.search-box {
  position: relative;
  width: 100%;
  max-width: 280px;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #a39387;
  font-size: 0.9rem;
}
.search-input {
  padding-left: 36px;
  border-radius: 10px;
  border: 1px solid #e2d8cc;
  background-color: #f5f0e6;
  font-size: 0.875rem;
  color: #2c221e;
}
.search-input:focus {
  background-color: #ffffff;
  border-color: #8c4e2a;
  box-shadow: 0 0 0 3px rgba(140, 78, 42, 0.12);
}

/* Custom Table Style */
.custom-table thead {
  background-color: #f3ede2;
}
.custom-table th {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #61524a;
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom: none;
}
.custom-table tbody tr {
  transition: background-color 0.15s ease;
  border-bottom: 1px solid #f0e9df;
}
.custom-table tbody tr:hover {
  background-color: #f7f2ea;
}

/* User Avatar Thơ Mộng */
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ebd8c8 0%, #d8c2b0 100%);
  color: #523522;
  font-weight: 700;
  font-family: "Merriweather", serif;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

/* Tag Mã Độc Giả */
.madg-tag {
  background-color: #f0e8dc;
  color: #4a3c34;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  border: 1px solid #dcd1c2;
}

/* Badge Giới tính Warm Tone */
.gender-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
}
.badge-gender-nam {
  background-color: #edf3f8;
  color: #2b5b84;
  border: 1px solid #c8daea;
}
.badge-gender-nu {
  background-color: #fbeee9;
  color: #9a3412;
  border: 1px solid #f2d4c9;
}
.badge-gender-khac {
  background-color: #f0e8dc;
  color: #61524a;
  border: 1px solid #e0d5c5;
}

/* Action Buttons */
.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}
.btn-edit {
  background-color: #fef3c7;
  color: #b45309;
}
.btn-edit:hover {
  background-color: #b45309;
  color: #ffffff;
}
.btn-delete {
  background-color: #fee2e2;
  color: #b91c1c;
}
.btn-delete:hover {
  background-color: #b91c1c;
  color: #ffffff;
}

/* Custom Pagination */
.custom-pagination .page-link {
  color: #61524a;
  background-color: #f7f2ea;
  border-color: #e5dccf;
}
.custom-pagination .page-item.active .page-link {
  background-color: #8c4e2a;
  border-color: #8c4e2a;
  color: #ffffff;
}

/* Modal UI Ấm Áp */
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 34, 30, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1050;
}
.modal-card {
  width: 100%;
  max-width: 540px;
  border-radius: 18px;
  background: #fdfbf7;
  overflow: hidden;
}
.btn-close-custom {
  background: transparent;
  border: none;
  color: #8c786c;
  font-size: 1.1rem;
  border-radius: 8px;
  padding: 4px 8px;
  transition: background 0.15s;
}
.btn-close-custom:hover {
  background-color: #f0e8dc;
  color: #2c221e;
}

.custom-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #4a3c34;
  margin-bottom: 4px;
}
.custom-input {
  border-radius: 8px;
  border: 1px solid #dcd1c2;
  background-color: #fcfaf5;
  font-size: 0.875rem;
  padding: 8px 12px;
  color: #2c221e;
}
.custom-input:focus {
  border-color: #8c4e2a;
  box-shadow: 0 0 0 3px rgba(140, 78, 42, 0.12);
  background-color: #ffffff;
}

/* Animation */
.animated-fadeIn {
  animation: modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
