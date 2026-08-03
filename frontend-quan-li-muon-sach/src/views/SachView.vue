<template>
  <div class="book-wrapper py-4 px-3 px-md-4">
    <!-- TIÊU ĐỀ TRANG -->
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3"
    >
      <div>
        <h2 class="text-warm-dark fw-bold mb-1 page-title">
          <i class="bi bi-journal-bookmark-fill me-2 text-warm-primary"></i>Quản
          Lý Kho Sách
        </h2>
        <p class="text-warm-muted small mb-0">
          Cập nhật danh mục sách, đơn giá, số lượng tồn kho và nhà xuất bản
        </p>
      </div>
    </div>

    <!-- 3 CARD THỐNG KÊ (KPI) -->
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div
          class="card custom-card p-3 border-start border-4 border-warm-primary shadow-sm"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="text-warm-muted small fw-semibold">Tổng Đầu Sách</div>
              <div class="fs-3 fw-bold text-warm-dark">{{ dsSach.length }}</div>
            </div>
            <div
              class="bg-warm-primary-soft p-3 rounded-circle text-warm-primary"
            >
              <i class="bi bi-book fs-4"></i>
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
                Tổng Cuốn Trong Kho
              </div>
              <div class="fs-3 fw-bold text-warm-dark">{{ tongSoCuon }}</div>
            </div>
            <div class="bg-warning-soft p-3 rounded-circle text-warning-dark">
              <i class="bi bi-box-seam fs-4"></i>
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
              <div class="text-warm-muted small fw-semibold">Đối Tác NXB</div>
              <div class="fs-3 fw-bold text-warm-dark">{{ dsNXB.length }}</div>
            </div>
            <div class="bg-success-soft p-3 rounded-circle text-warm-success">
              <i class="bi bi-building fs-4"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FORM THÊM / SỬA SÁCH -->
    <div
      class="card custom-card p-4 mb-4 shadow-sm"
      :class="{ 'border-warning-custom': isEditing }"
    >
      <div
        class="d-flex align-items-center justify-content-between mb-3 border-bottom border-warm-light pb-2"
      >
        <h5
          class="fw-bold mb-0 section-title"
          :class="isEditing ? 'text-warning-dark' : 'text-warm-primary'"
        >
          <i
            :class="
              isEditing ? 'bi bi-pencil-square me-2' : 'bi bi-plus-circle me-2'
            "
          ></i>
          {{ isEditing ? "Cập Nhật Thông Tin Sách" : "Thêm Sách Mới Vao Kho" }}
        </h5>
        <span
          v-if="isEditing"
          class="badge bg-warning-soft text-warning-dark px-3 py-1 fw-medium"
        >
          Đang sửa sách: {{ form.maSach }}
        </span>
      </div>

      <form @submit.prevent="saveSach" class="row g-3">
        <div class="col-md-2">
          <label class="form-label fw-semibold small text-warm-sub"
            >Mã Sách</label
          >
          <input
            v-model="form.maSach"
            class="form-control custom-input"
            placeholder="Mã sách"
            :disabled="isEditing"
            required
          />
        </div>
        <div class="col-md-4">
          <label class="form-label fw-semibold small text-warm-sub"
            >Tên Sách</label
          >
          <input
            v-model="form.tenSach"
            class="form-control custom-input"
            placeholder="Nhập tên sách..."
            required
          />
        </div>
        <div class="col-md-3">
          <label class="form-label fw-semibold small text-warm-sub"
            >Tác Giả</label
          >
          <input
            v-model="form.tacGia"
            class="form-control custom-input"
            placeholder="Tên tác giả"
            required
          />
        </div>

        <!-- ĐƠN GIÁ (ĐỊNH DẠNG DẤU PHẨY) -->
        <div class="col-md-3">
          <label class="form-label fw-semibold small text-warm-sub"
            >Đơn Giá (VNĐ)</label
          >
          <input
            v-model="displayDonGia"
            type="text"
            class="form-control custom-input"
            placeholder="0"
            required
          />
        </div>

        <div class="col-md-2">
          <label class="form-label fw-semibold small text-warm-sub"
            >Số Cuốn</label
          >
          <input
            v-model.number="form.soCuong"
            type="number"
            min="0"
            class="form-control custom-input"
            placeholder="0"
            required
          />
        </div>

        <div class="col-md-2">
          <label class="form-label fw-semibold small text-warm-sub"
            >Năm Xuất Bản</label
          >
          <input
            v-model.number="form.namXuatBan"
            type="number"
            min="0"
            class="form-control custom-input"
            placeholder="Năm XB"
            required
          />
        </div>

        <div class="col-md-5">
          <label class="form-label fw-semibold small text-warm-sub"
            >Nhà Xuất Bản</label
          >
          <select
            v-model="form.maNXB"
            class="form-select custom-input"
            required
          >
            <option value="" disabled>-- Chọn Nhà Xuất Bản --</option>
            <option v-for="nxb in dsNXB" :key="nxb._id" :value="nxb.maNXB">
              {{ nxb.tenNXB }} ({{ nxb.maNXB }})
            </option>
          </select>
        </div>

        <div class="col-md-3 d-flex align-items-end gap-2">
          <button
            type="submit"
            :class="
              isEditing
                ? 'btn btn-warm-warning w-100 fw-bold'
                : 'btn btn-warm-primary w-100 fw-bold'
            "
          >
            <i
              :class="isEditing ? 'bi bi-check-lg me-1' : 'bi bi-plus-lg me-1'"
            ></i>
            {{ isEditing ? "Lưu Cập Nhật" : "Thêm Vào Kho" }}
          </button>
          <button
            v-if="isEditing"
            type="button"
            @click="resetForm"
            class="btn btn-warm-cancel"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>

    <!-- BẢNG DANH SÁCH SÁCH -->
    <div class="card custom-card border-0 shadow-sm">
      <div
        class="card-header bg-transparent py-3 border-bottom border-warm-light d-flex justify-content-between align-items-center"
      >
        <h5 class="fw-bold mb-0 text-warm-primary section-title">
          Danh Mục Sách Thư Viện
        </h5>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th class="ps-4">STT</th>
                <th>Mã Sách</th>
                <th>Tên Sách</th>
                <th>Tác Giả</th>
                <th>Đơn Giá</th>
                <th>Tồn Kho</th>
                <th>Năm XB</th>
                <th>Nhà Xuất Bản</th>
                <th class="text-end pe-4">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(sach, index) in paginatedSach" :key="sach._id">
                <td class="ps-4 fw-medium text-warm-muted">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td>
                  <span
                    class="badge bg-warm-code text-warm-sub border border-warm-light px-2 py-1"
                  >
                    {{ sach.maSach }}
                  </span>
                </td>
                <td class="fw-bold text-warm-dark">{{ sach.tenSach }}</td>
                <td class="text-warm-sub small fw-medium">{{ sach.tacGia }}</td>
                <td class="fw-semibold text-warm-primary">
                  {{ (sach.donGia ?? 0).toLocaleString("vi-VN") }} đ
                </td>
                <td>
                  <span
                    class="badge px-2.5 py-1 rounded-pill"
                    :class="
                      sach.soCuong > 0 ? 'badge-stock-in' : 'badge-stock-out'
                    "
                  >
                    {{ sach.soCuong }} cuốn
                    {{ sach.soCuong === 0 ? "(Hết)" : "" }}
                  </span>
                </td>
                <td class="small text-warm-muted">
                  {{ sach.namXuatBan || "N/A" }}
                </td>
                <td>
                  <span class="badge badge-nxb px-2.5 py-1">
                    {{ getNXBName(sach.maNXB) }}
                  </span>
                </td>
                <td class="text-end pe-4">
                  <button
                    @click="editSach(sach)"
                    class="btn btn-sm btn-warm-action text-warning-dark me-2"
                    title="Sửa"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button
                    @click="deleteSach(sach._id)"
                    class="btn btn-sm btn-warm-action text-warm-danger"
                    title="Xóa"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="dsSach.length === 0">
                <td colspan="9" class="text-center text-warm-muted py-5">
                  <i
                    class="bi bi-journal-x fs-2 d-block mb-2 text-warm-muted"
                  ></i>
                  Chưa có dữ liệu sách trong hệ thống.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- THANH PHÂN TRANG -->
        <div
          v-if="dsSach.length > 0"
          class="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 border-top border-warm-light gap-2"
        >
          <span class="text-warm-muted small">
            Hiển thị
            <strong class="text-warm-dark">{{
              (currentPage - 1) * itemsPerPage + 1
            }}</strong>
            -
            <strong class="text-warm-dark">{{
              Math.min(currentPage * itemsPerPage, dsSach.length)
            }}</strong>
            trên tổng số
            <strong class="text-warm-dark">{{ dsSach.length }}</strong> cuốn
            sách
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import api from "../services/api.service";

const dsSach = ref([]);
const dsNXB = ref([]);
const isEditing = ref(false);

const form = ref({
  _id: null,
  maSach: "",
  tenSach: "",
  tacGia: "",
  donGia: 0,
  soCuong: 1,
  namXuatBan: new Date().getFullYear(),
  maNXB: "",
});

// Cấu hình Phân Trang
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Thống kê số cuốn
const tongSoCuon = computed(() => {
  return dsSach.value.reduce((sum, item) => sum + (item.soCuong || 0), 0);
});

// Sách đã cắt theo trang
const paginatedSach = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return dsSach.value.slice(start, end);
});

// Tính tổng số trang
const totalPages = computed(() => {
  return Math.ceil(dsSach.value.length / itemsPerPage.value) || 1;
});

// Chuyển trang
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// COMPUTED PROPERTY: Tự động định dạng dấu phẩy cho ô Đơn giá
const displayDonGia = computed({
  get() {
    if (
      form.value.donGia === null ||
      form.value.donGia === undefined ||
      isNaN(form.value.donGia)
    ) {
      return "";
    }
    return form.value.donGia.toLocaleString("en-US");
  },
  set(value) {
    const cleaned = String(value).replace(/\D/g, "");
    form.value.donGia = cleaned ? parseInt(cleaned, 10) : 0;
  },
});

const fetchData = async () => {
  try {
    const resNXB = await api.get("/nxb");
    dsNXB.value = resNXB.data;
  } catch (err) {
    console.error("Lỗi lấy danh sách NXB:", err);
  }

  try {
    const resSach = await api.get("/sach");
    dsSach.value = resSach.data;

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  } catch (err) {
    console.error("Lỗi lấy danh sách Sách:", err);
  }
};

const getNXBName = (nxbInput) => {
  if (!nxbInput) return "N/A";
  const idToFind = typeof nxbInput === "object" ? nxbInput._id : nxbInput;
  const nxb = dsNXB.value.find(
    (item) => item._id === idToFind || item.maNXB === idToFind,
  );
  return nxb ? nxb.tenNXB : nxbInput;
};

const saveSach = async () => {
  if (form.value.donGia < 0) {
    Swal.fire({
      icon: "warning",
      title: "Dữ liệu không hợp lệ",
      text: "Đơn giá không được là số âm!",
      confirmButtonColor: "#8c4e2a",
    });
    return;
  }
  if (form.value.soCuong < 0) {
    Swal.fire({
      icon: "warning",
      title: "Dữ liệu không hợp lệ",
      text: "Số cuốn không được là số âm!",
      confirmButtonColor: "#8c4e2a",
    });
    return;
  }
  if (form.value.namXuatBan < 0) {
    Swal.fire({
      icon: "warning",
      title: "Dữ liệu không hợp lệ",
      text: "Năm xuất bản không được là số âm!",
      confirmButtonColor: "#8c4e2a",
    });
    return;
  }

  try {
    if (isEditing.value) {
      await api.put(`/sach/${form.value._id}`, form.value);
      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: `Đã lưu thông tin sách "${form.value.tenSach}"`,
        timer: 1800,
        showConfirmButton: false,
      });
    } else {
      await api.post("/sach", form.value);
      Swal.fire({
        icon: "success",
        title: "Thêm sách thành công!",
        text: `Đã thêm sách "${form.value.tenSach}" vào hệ thống`,
        timer: 1800,
        showConfirmButton: false,
      });
    }
    resetForm();
    fetchData();
  } catch (err) {
    let errorMsg = "Thao tác thất bại! Kiểm tra lại thông tin nhập.";
    const serverMsg = err.response?.data?.message || "";

    if (serverMsg.includes("E11000") || serverMsg.includes("duplicate key")) {
      errorMsg = `Mã sách "${form.value.maSach}" đã tồn tại trong hệ thống!`;
    } else if (serverMsg) {
      errorMsg = serverMsg;
    }

    Swal.fire({
      icon: "error",
      title: "Thao tác thất bại",
      text: errorMsg,
      confirmButtonColor: "#9a3412",
    });
  }
};

const editSach = (sach) => {
  isEditing.value = true;
  const nxbId = typeof sach.maNXB === "object" ? sach.maNXB._id : sach.maNXB;
  form.value = { ...sach, maNXB: nxbId };
};

const deleteSach = async (id) => {
  const result = await Swal.fire({
    title: "Xác nhận xóa?",
    text: "Bạn có chắc chắn muốn xóa cuốn sách này khỏi thư viện?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#9a3412",
    cancelButtonColor: "#786c65",
    confirmButtonText: "Đồng ý xóa",
    cancelButtonText: "Hủy bỏ",
  });

  if (!result.isConfirmed) return;

  try {
    await api.delete(`/sach/${id}`);
    Swal.fire({
      icon: "success",
      title: "Đã xóa sách!",
      timer: 1500,
      showConfirmButton: false,
    });
    fetchData();
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Không thể xóa",
      text:
        err.response?.data?.message ||
        "Lỗi khi xóa! Cuốn sách này có thể đang nằm trong lượt mượn của độc giả.",
      confirmButtonColor: "#9a3412",
    });
  }
};

const resetForm = () => {
  isEditing.value = false;
  form.value = {
    _id: null,
    maSach: "",
    tenSach: "",
    tacGia: "",
    donGia: 0,
    soCuong: 1,
    namXuatBan: new Date().getFullYear(),
    maNXB: "",
  };
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

.book-wrapper {
  background-color: #f7f4ef;
  min-height: 100vh;
  font-family: "Plus Jakarta Sans", sans-serif;
}

.page-title,
.section-title {
  font-family: "Merriweather", serif;
}

/* Custom Cards */
.custom-card {
  border-radius: 16px;
  background-color: #fdfbf7;
  border: 1px solid #e8e2d8 !important;
}

.border-warning-custom {
  border-color: #f59e0b !important;
  box-shadow: 0 0 0 1px #f59e0b !important;
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

/* Buttons */
.btn-warm-primary {
  background: linear-gradient(135deg, #8c4e2a 0%, #6e391b 100%);
  color: #fcfbf8;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  transition: all 0.2s ease;
}

.btn-warm-primary:hover {
  background: linear-gradient(135deg, #743e20 0%, #572d14 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(140, 78, 42, 0.25);
}

.btn-warm-warning {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  transition: all 0.2s ease;
}

.btn-warm-warning:hover {
  background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
  color: #ffffff;
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
  padding: 8px 16px;
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

/* Badges */
.badge-stock-in {
  background-color: #f5f0e6;
  color: #8c4e2a;
  border: 1px solid #e8e2d8;
}

.badge-stock-out {
  background-color: #fee2e2;
  color: #9a3412;
  border: 1px solid #fca5a5;
}

.badge-nxb {
  background-color: #e0e7ff;
  color: #3730a3;
  border: 1px solid #c7d2fe;
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
</style>
