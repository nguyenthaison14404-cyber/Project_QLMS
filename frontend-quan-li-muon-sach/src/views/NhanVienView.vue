<template>
  <div class="staff-wrapper py-4 px-3 px-md-4">
    <!-- TIÊU ĐỀ & NÚT THÊM MỚI -->
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3"
    >
      <div>
        <h2 class="text-warm-dark fw-bold mb-1 page-title">
          <i class="bi bi-shield-lock-fill me-2 text-warm-primary"></i>Quản Lý
          Nhân Viên
        </h2>
        <p class="text-warm-muted small mb-0">
          Danh sách nhân sự và quản trị viên hệ thống thư viện
        </p>
      </div>

      <!-- BUTTON THÊM MỚI -->
      <button
        @click="moModalThem"
        class="btn btn-warm-primary d-flex align-items-center gap-2 shadow-sm fw-bold px-3 py-2"
      >
        <i class="bi bi-plus-lg"></i> Thêm Nhân Viên Mới
      </button>
    </div>

    <!-- 3 CARD THỐNG KÊ (KPI) -->
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div
          class="card custom-card p-3 border-start border-4 border-warm-primary shadow-sm"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="text-warm-muted small fw-semibold">
                Tổng Số Nhân Viên
              </div>
              <div class="fs-3 fw-bold text-warm-dark">
                {{ dsNhanVien.length }}
              </div>
            </div>
            <div
              class="bg-warm-primary-soft p-3 rounded-circle text-warm-primary"
            >
              <i class="bi bi-people fs-4"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div
          class="card custom-card p-3 border-start border-4 border-warning shadow-sm"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="text-warm-muted small fw-semibold">
                Tài Khoản Quản Lý
              </div>
              <div class="fs-3 fw-bold text-warm-dark">{{ countAdmin }}</div>
            </div>
            <div class="bg-warning-soft p-3 rounded-circle text-warning-dark">
              <i class="bi bi-person-badge fs-4"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div
          class="card custom-card p-3 border-start border-4 border-success shadow-sm"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="text-warm-muted small fw-semibold">
                Trạng Thái Máy Chủ
              </div>
              <div class="fs-6 fw-bold text-warm-success">
                <i class="bi bi-check-circle-fill me-1"></i> Hoạt Động Cực Tốt
              </div>
            </div>
            <div class="bg-success-soft p-3 rounded-circle text-warm-success">
              <i class="bi bi-hdd-network fs-4"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BẢNG DỮ LIỆU -->
    <div class="card custom-card border-0 shadow-sm">
      <div
        class="card-header bg-transparent py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom border-warm-light gap-2"
      >
        <h5 class="fw-bold mb-0 text-warm-primary section-title">
          Danh Sách Cán Bộ
        </h5>
        <div class="input-group style-search" style="max-width: 320px">
          <span
            class="input-group-text bg-warm-input border-end-0 border-warm-light text-warm-muted"
          >
            <i class="bi bi-search"></i>
          </span>
          <input
            type="text"
            v-model="searchQuery"
            class="form-control custom-input border-start-0"
            placeholder="Tìm theo tên hoặc MSNV..."
          />
        </div>
      </div>

      <div class="card-body p-0 table-responsive">
        <table class="table table-hover align-middle mb-0 custom-table">
          <thead>
            <tr>
              <th class="ps-4">Nhân Viên</th>
              <th>MSNV</th>
              <th>Chức Vụ</th>
              <th>Số Điện Thoại</th>
              <th>Địa Chỉ</th>
              <th class="text-end pe-4">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredList.length === 0">
              <td colspan="6" class="text-center py-5 text-warm-muted">
                <i class="bi bi-person-x fs-2 d-block mb-2 text-warm-muted"></i>
                Không tìm thấy nhân viên nào phù hợp.
              </td>
            </tr>

            <tr v-for="nv in paginatedList" :key="nv._id">
              <td class="ps-4">
                <div class="d-flex align-items-center gap-3">
                  <div class="avatar-circle-sm fw-bold">
                    {{ nv.hoTenNV ? nv.hoTenNV.charAt(0).toUpperCase() : "N" }}
                  </div>
                  <div>
                    <div class="fw-bold text-warm-dark">{{ nv.hoTenNV }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span
                  class="badge bg-warm-code text-warm-sub border border-warm-light px-2 py-1"
                  >{{ nv.msnv }}</span
                >
              </td>
              <td>
                <span
                  class="badge px-2.5 py-1.5 rounded-pill fw-semibold"
                  :class="
                    checkIsAdmin(nv.chucVu)
                      ? 'badge-role-admin'
                      : 'badge-role-staff'
                  "
                >
                  {{ nv.chucVu }}
                </span>
              </td>
              <td class="small text-warm-sub fw-medium">
                {{ nv.soDienThoai || "---" }}
              </td>
              <td class="small text-warm-muted">{{ nv.diaChi || "---" }}</td>
              <td class="text-end pe-4">
                <button
                  @click="editNhanVien(nv)"
                  class="btn btn-sm btn-warm-action text-warning-dark me-2"
                  title="Sửa"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button
                  @click="xoaNhanVien(nv)"
                  class="btn btn-sm btn-warm-action text-warm-danger"
                  title="Xóa"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- THANH PHÂN TRANG -->
      <div
        v-if="filteredList.length > 0"
        class="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 border-top border-warm-light gap-2"
      >
        <span class="text-warm-muted small">
          Hiển thị
          <strong class="text-warm-dark">{{
            (currentPage - 1) * itemsPerPage + 1
          }}</strong>
          -
          <strong class="text-warm-dark">{{
            Math.min(currentPage * itemsPerPage, filteredList.length)
          }}</strong>
          trên tổng số
          <strong class="text-warm-dark">{{ filteredList.length }}</strong> nhân
          viên
        </span>

        <nav v-if="totalPages > 1">
          <ul class="pagination pagination-sm mb-0 custom-pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">
                <i class="bi bi-chevron-left"></i> Trước
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
                Sau <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- MODAL THÊM / SỬA NHÂN VIÊN -->
    <div
      v-if="showModal"
      class="modal-backdrop-custom d-flex align-items-center justify-content-center"
    >
      <div
        class="card p-4 shadow-lg border-0 custom-card modal-card"
        style="max-width: 500px; width: 100%"
      >
        <div
          class="d-flex justify-content-between align-items-center mb-3 border-bottom border-warm-light pb-2"
        >
          <h5 class="fw-bold mb-0 text-warm-primary section-title">
            {{ isEdit ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên Mới" }}
          </h5>
          <button @click="showModal = false" class="btn-close"></button>
        </div>

        <form @submit.prevent="saveNhanVien">
          <div class="mb-3">
            <label class="form-label small fw-semibold text-warm-sub"
              >Mã Số Nhân Viên (MSNV)</label
            >
            <input
              type="text"
              v-model="form.msnv"
              class="form-control custom-input"
              placeholder="Ví dụ: NV01"
              :disabled="isEdit"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold text-warm-sub"
              >Họ Và Tên</label
            >
            <input
              type="text"
              v-model="form.hoTenNV"
              class="form-control custom-input"
              placeholder="Nhập Họ và Tên"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold text-warm-sub">
              Mật Khẩu
              <span v-if="isEdit" class="text-warm-muted fw-normal"
                >(Bỏ trống nếu không muốn đổi)</span
              >
            </label>
            <input
              type="password"
              v-model="form.password"
              class="form-control custom-input"
              placeholder="Nhập mật khẩu ..."
              :required="!isEdit"
            />
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold text-warm-sub"
              >Chức Vụ</label
            >
            <select
              v-model="form.chucVu"
              class="form-select custom-input"
              required
            >
              <option value="" disabled>-- Chọn Chức Vụ --</option>
              <option value="Quản lý thư viện">Quản lý thư viện (Admin)</option>
              <option value="Thủ thư ca sáng">Thủ thư ca sáng</option>
              <option value="Thủ thư ca chiều">Thủ thư ca chiều</option>
              <option value="Thủ thư ca tối">Thủ thư ca tối</option>
              <option value="Nhân viên kho">Nhân viên kho</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold text-warm-sub"
              >Số Điện Thoại</label
            >
            <input
              type="text"
              v-model="form.soDienThoai"
              class="form-control custom-input"
              maxlength="10"
              placeholder="Ví dụ: 0901234567"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold text-warm-sub"
              >Địa Chỉ</label
            >
            <input
              type="text"
              v-model="form.diaChi"
              class="form-control custom-input"
              placeholder="Nhập địa chỉ..."
            />
          </div>

          <div class="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              @click="showModal = false"
              class="btn btn-warm-cancel px-3"
            >
              Hủy
            </button>
            <button type="submit" class="btn btn-warm-primary fw-bold px-4">
              Lưu Thông Tin
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

const dsNhanVien = ref([]);
const searchQuery = ref("");
const showModal = ref(false);
const isEdit = ref(false);

const form = ref({
  _id: null,
  msnv: "",
  hoTenNV: "",
  password: "",
  chucVu: "Thủ thư ca sáng",
  soDienThoai: "",
  diaChi: "",
});

const currentPage = ref(1);
const itemsPerPage = ref(10);

const checkIsAdmin = (chucVu) => {
  if (!chucVu) return false;
  return (
    chucVu.toLowerCase().includes("quản lý") ||
    chucVu.toLowerCase().includes("admin")
  );
};

const countAdmin = computed(() => {
  return dsNhanVien.value.filter((nv) => checkIsAdmin(nv.chucVu)).length;
});

const filteredList = computed(() => {
  return dsNhanVien.value.filter(
    (nv) =>
      nv.hoTenNV?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      nv.msnv?.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredList.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredList.value.length / itemsPerPage.value) || 1;
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const resetForm = () => {
  isEdit.value = false;
  form.value = {
    _id: null,
    msnv: "",
    hoTenNV: "",
    password: "",
    chucVu: "Thủ thư ca sáng",
    soDienThoai: "",
    diaChi: "",
  };
};

const moModalThem = () => {
  resetForm();
  showModal.value = true;
};

const layDanhSach = async () => {
  try {
    const res = await api.get("/nhanvien");
    dsNhanVien.value = res.data;

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  } catch (err) {
    console.error("Lỗi lấy danh sách nhân viên:", err);
    Swal.fire({
      icon: "error",
      title: "Lỗi tải dữ liệu",
      text: err.response?.data?.message || "Không thể tải danh sách nhân viên!",
      confirmButtonColor: "#9a3412",
    });
  }
};

const saveNhanVien = async () => {
  // Validate SĐT
  const phoneRegex = /^0[0-9]{9}$/;
  if (!phoneRegex.test(form.value.soDienThoai)) {
    Swal.fire({
      icon: "warning",
      title: "Số điện thoại không hợp lệ",
      text: "Số điện thoại phải bao gồm đúng 10 chữ số và bắt đầu bằng số 0!",
      confirmButtonColor: "#8c4e2a",
    });
    return;
  }

  try {
    if (isEdit.value) {
      await api.put(`/nhanvien/${form.value._id}`, form.value);
      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        timer: 1800,
        showConfirmButton: false,
      });
    } else {
      await api.post("/nhanvien", form.value);
      Swal.fire({
        icon: "success",
        title: "Thêm nhân viên thành công!",
        timer: 1800,
        showConfirmButton: false,
      });
    }

    showModal.value = false;
    await layDanhSach();
  } catch (err) {
    let rawMsg = err.response?.data?.message || err.message || "";
    if (rawMsg.includes("E11000") || rawMsg.includes("msnv")) {
      rawMsg = `Mã nhân viên "${form.value.msnv}" đã tồn tại trong hệ thống!`;
    }

    Swal.fire({
      icon: "error",
      title: isEdit.value ? "Cập nhật thất bại" : "Thêm thất bại",
      text: rawMsg || "Có lỗi xảy ra khi lưu thông tin nhân viên!",
      confirmButtonColor: "#9a3412",
    });
  }
};

const editNhanVien = (nv) => {
  isEdit.value = true;
  form.value = { ...nv };
  showModal.value = true;
};

const xoaNhanVien = async (nv) => {
  const result = await Swal.fire({
    title: "Xác nhận xóa?",
    text: `Bạn có chắc chắn muốn xóa nhân viên "${nv.hoTenNV}" không?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#9a3412",
    cancelButtonColor: "#786c65",
    confirmButtonText: "Đồng ý xóa",
    cancelButtonText: "Hủy bỏ",
  });

  if (!result.isConfirmed) return;

  try {
    await api.delete(`/nhanvien/${nv._id}`);
    Swal.fire({
      icon: "success",
      title: "Đã xóa nhân viên!",
      timer: 1500,
      showConfirmButton: false,
    });
    await layDanhSach();
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Xóa thất bại",
      text: err.response?.data?.message || "Không thể xóa nhân viên này!",
      confirmButtonColor: "#9a3412",
    });
  }
};

onMounted(() => {
  layDanhSach();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

.staff-wrapper {
  background-color: #f7f4ef;
  min-height: 100vh;
  font-family: "Plus Jakarta Sans", sans-serif;
}

.page-title,
.section-title {
  font-family: "Merriweather", serif;
}

/* Card Style */
.custom-card {
  border-radius: 16px;
  background-color: #fdfbf7;
  border: 1px solid #e8e2d8 !important;
}

/* Typography Colors */
.text-warm-dark {
  color: #2c221e;
}

.text-warm-muted {
  color: #786c65;
}

.text-warm-sub {
  color: #61524a;
}

.text-warm-primary {
  color: #8c4e2a;
}

.text-warm-success {
  color: #2e7d32;
}

.text-warm-danger {
  color: #9a3412;
}

.text-warning-dark {
  color: #b45309;
}

.border-warm-light {
  border-color: #e8e2d8 !important;
}

.border-warm-primary {
  border-color: #8c4e2a !important;
}

.bg-warm-code {
  background-color: #f5f0e6;
}

.bg-warm-input {
  background-color: #fcfaf5;
}

/* KPI Soft Backgrounds */
.bg-warm-primary-soft {
  background-color: #f5f0e6;
}

.bg-warning-soft {
  background-color: #fef3c7;
}

.bg-success-soft {
  background-color: #dcfce7;
}

/* Custom Input / Select */
.custom-input {
  background-color: #fcfaf5;
  border-color: #dcd1c2;
  color: #2c221e;
  border-radius: 8px;
}

.custom-input:focus {
  background-color: #ffffff;
  border-color: #8c4e2a;
  box-shadow: 0 0 0 3px rgba(140, 78, 42, 0.12);
}

/* Avatar Circle */
.avatar-circle-sm {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f5f0e6;
  color: #8c4e2a;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e8e2d8;
}

/* Buttons */
.btn-warm-primary {
  background: linear-gradient(135deg, #8c4e2a 0%, #6e391b 100%);
  color: #fcfbf8;
  border: none;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-warm-primary:hover {
  background: linear-gradient(135deg, #743e20 0%, #572d14 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(140, 78, 42, 0.25);
}

.btn-warm-action {
  background-color: #f5f0e6;
  border: 1px solid #e8e2d8;
  transition: all 0.2s ease;
}

.btn-warm-action:hover {
  background-color: #e8e2d8;
}

.btn-warm-cancel {
  background-color: #f5f0e6;
  color: #61524a;
  border: 1px solid #e8e2d8;
  border-radius: 8px;
}

.btn-warm-cancel:hover {
  background-color: #e8e2d8;
  color: #2c221e;
}

/* Custom Table Styling */
.custom-table {
  color: #2c221e;
}

.custom-table thead {
  background-color: #f5f0e6;
}

.custom-table th {
  font-weight: 600;
  color: #61524a;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e8e2d8;
  padding-top: 14px;
  padding-bottom: 14px;
}

.custom-table td {
  border-bottom: 1px solid #f0eae1;
  padding-top: 12px;
  padding-bottom: 12px;
}

.custom-table tbody tr:hover {
  background-color: #f9f6f0;
}

/* Badges Status */
.badge-role-admin {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.badge-role-staff {
  background-color: #e0f2fe;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

/* Custom Pagination */
.custom-pagination .page-link {
  color: #61524a;
  background-color: #fdfbf7;
  border-color: #e8e2d8;
}

.custom-pagination .page-item.active .page-link {
  background-color: #8c4e2a;
  border-color: #8c4e2a;
  color: #ffffff;
}

.custom-pagination .page-item.disabled .page-link {
  color: #a89f91;
  background-color: #f5f0e6;
  border-color: #e8e2d8;
}

.custom-pagination .page-link:hover:not(.active) {
  background-color: #f5f0e6;
  color: #2c221e;
}

/* Modal Overlay */
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 34, 30, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1050;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
