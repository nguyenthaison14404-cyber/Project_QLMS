<template>
  <div class="borrow-wrapper py-4 px-3 px-md-4">
    <!-- TIÊU ĐỀ TRANG -->
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h2 class="text-warm-dark fw-bold mb-1 page-title">
          <i class="bi bi-journal-bookmark me-2 text-warm-primary"></i>Theo Dõi
          Mượn / Trả Sách
        </h2>
        <p class="text-warm-muted small mb-0">
          Quản lý lượt mượn, trả sách và lịch sử lưu trữ của độc giả
        </p>
      </div>
    </div>

    <!-- FORM TẠO PHIẾU MƯỢN -->
    <div class="card custom-card border-0 shadow-sm mb-4">
      <div class="card-body p-4">
        <h5 class="card-title text-warm-primary fw-bold mb-3 section-title">
          <i class="bi bi-journal-plus me-2"></i>Tạo Phiếu Mượn Sách Mới
        </h5>

        <form @submit.prevent="taoPhieuMuon">
          <div class="row g-3 align-items-end">
            <!-- 1. Chọn Độc Giả -->
            <div class="col-md-4">
              <label class="form-label fw-semibold text-warm-sub small"
                >Chọn Độc Giả</label
              >
              <select
                v-model="form.maDocGia"
                class="form-select custom-input"
                required
              >
                <option value="" disabled>-- Chọn Độc Giả --</option>
                <option
                  v-for="dg in dsDocGia"
                  :key="dg._id || dg.maDocGia"
                  :value="dg.maDocGia || dg.MaDocGia"
                >
                  {{ dg.hoLot || dg.HoLot }} {{ dg.ten || dg.Ten }} ({{
                    dg.maDocGia || dg.MaDocGia
                  }})
                </option>
              </select>
            </div>

            <!-- 2. Chọn Sách -->
            <div class="col-md-4">
              <label class="form-label fw-semibold text-warm-sub small"
                >Chọn Sách Mượn</label
              >
              <select
                v-model="form.maSach"
                class="form-select custom-input"
                required
              >
                <option value="" disabled>-- Chọn Sách --</option>
                <option
                  v-for="sach in dsSach"
                  :key="sach._id || sach.maSach"
                  :value="sach.maSach || sach.MaSach"
                >
                  {{ sach.tenSach || sach.TenSach }} ({{
                    sach.maSach || sach.MaSach
                  }}) - Còn: {{ getVal(sach, "soCuong", "soCuon") ?? 0 }} cuốn
                </option>
              </select>
            </div>

            <!-- 3. Ngày Mượn -->
            <div class="col-md-2">
              <label class="form-label fw-semibold text-warm-sub small"
                >Ngày Mượn</label
              >
              <input
                type="date"
                v-model="form.ngayMuon"
                :max="maxDate"
                class="form-control custom-input"
                required
              />
            </div>

            <!-- Nút Tạo Phiếu -->
            <div class="col-md-2">
              <button
                type="submit"
                class="btn btn-warm-primary w-100 fw-bold d-flex align-items-center justify-content-center gap-1 py-2"
              >
                <i class="bi bi-plus-lg"></i> Tạo Phiếu
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- BẢNG DANH SÁCH MƯỢN SÁCH -->
    <div class="card custom-card border-0 shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table
            class="table table-hover align-middle mb-0 text-center custom-table"
          >
            <thead>
              <tr>
                <th style="width: 60px" class="ps-3">STT</th>
                <th class="text-start ps-3">Độc Giả</th>
                <th>Mã Sách</th>
                <th>Ngày Mượn</th>
                <th>Ngày Trả</th>
                <th>Trạng Thái</th>
                <th style="width: 140px">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="dsMuonSach.length === 0">
                <td colspan="7" class="py-5 text-warm-muted">
                  <i class="bi bi-inbox fs-2 d-block mb-2 text-warm-muted"></i>
                  Chưa có lượt mượn sách nào trong hệ thống.
                </td>
              </tr>

              <tr
                v-for="(item, index) in paginatedMuonSach"
                :key="item._id || index"
              >
                <td class="fw-bold text-warm-muted ps-3">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="text-start ps-3">
                  <div class="fw-bold text-warm-dark">
                    {{ getTenDocGia(getVal(item, "maDocGia", "MaDocGia")) }}
                  </div>
                  <small class="text-warm-muted"
                    >Mã: {{ getVal(item, "maDocGia", "MaDocGia") }}</small
                  >
                </td>
                <td>
                  <span
                    class="badge bg-warm-code text-warm-sub border border-warm-light px-2 py-1"
                    >{{ getVal(item, "maSach", "MaSach") }}</span
                  >
                  <div class="small text-warm-muted mt-1">
                    {{ getTenSach(getVal(item, "maSach", "MaSach")) }}
                  </div>
                </td>
                <td class="text-warm-sub fw-medium">
                  {{ formatDate(getVal(item, "ngayMuon", "NgayMuon")) }}
                </td>

                <td>
                  <span
                    v-if="getVal(item, 'ngayTra', 'NgayTra')"
                    class="fw-bold text-warm-success"
                  >
                    {{ formatDate(getVal(item, "ngayTra", "NgayTra")) }}
                  </span>
                  <span v-else class="text-warm-muted fst-italic"
                    >Chưa trả</span
                  >
                </td>

                <td>
                  <span
                    class="badge px-3 py-2 rounded-pill fw-semibold"
                    :class="
                      getVal(item, 'ngayTra', 'NgayTra')
                        ? 'badge-status-returned'
                        : 'badge-status-borrowing'
                    "
                  >
                    {{
                      getVal(item, "ngayTra", "NgayTra")
                        ? "Đã trả"
                        : "Đang mượn"
                    }}
                  </span>
                </td>

                <td>
                  <button
                    v-if="!getVal(item, 'ngayTra', 'NgayTra')"
                    @click="traSach(item)"
                    class="btn btn-sm btn-warm-outline fw-bold px-3 py-1"
                  >
                    <i class="bi bi-box-arrow-in-left me-1"></i>Trả sách
                  </button>
                  <div
                    v-else
                    class="d-inline-flex align-items-center justify-content-center gap-2"
                  >
                    <span class="text-warm-success small fw-bold"
                      ><i class="bi bi-check-circle-fill me-1"></i>Hoàn
                      thành</span
                    >
                    <button
                      @click="xoaPhieuMuon(item)"
                      class="btn btn-sm btn-warm-danger border-0 p-1 lh-1"
                      title="Xóa lượt mượn này"
                    >
                      <i class="bi bi-trash fs-6"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- THANH PHÂN TRANG (PAGINATION) -->
        <div
          v-if="dsMuonSach.length > 0"
          class="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 border-top border-warm-light gap-2"
        >
          <span class="text-warm-muted small">
            Hiển thị
            <strong class="text-warm-dark">{{
              (currentPage - 1) * itemsPerPage + 1
            }}</strong>
            -
            <strong class="text-warm-dark">{{
              Math.min(currentPage * itemsPerPage, dsMuonSach.length)
            }}</strong>
            trên tổng số
            <strong class="text-warm-dark">{{ dsMuonSach.length }}</strong> lượt
            mượn
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

const homNay = new Date().toISOString().substring(0, 10);
const maxDate = ref(homNay);

const form = ref({
  maDocGia: "",
  maSach: "",
  ngayMuon: homNay,
});

const dsDocGia = ref([]);
const dsSach = ref([]);
const dsMuonSach = ref([]);

// Cấu hình Phân Trang
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Danh sách mượn sách đã cắt theo trang hiện tại
const paginatedMuonSach = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return dsMuonSach.value.slice(start, end);
});

// Tính tổng số trang
const totalPages = computed(() => {
  return Math.ceil(dsMuonSach.value.length / itemsPerPage.value) || 1;
});

// Chuyển trang
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const getVal = (obj, key1, key2) => {
  if (!obj) return null;
  if (obj[key1] !== undefined && obj[key1] !== null) return obj[key1];
  if (obj[key2] !== undefined && obj[key2] !== null) return obj[key2];
  return null;
};

const layDanhSachDocGia = async () => {
  try {
    const res = await api.get("/docgia");
    dsDocGia.value = res.data;
  } catch (err) {
    console.error("Lỗi lấy danh sách độc giả:", err);
  }
};

const layDanhSachSach = async () => {
  try {
    const res = await api.get("/sach");
    dsSach.value = res.data;
  } catch (err) {
    console.error("Lỗi lấy danh sách sách:", err);
  }
};

const layDanhSachMuonSach = async () => {
  try {
    const res = await api.get("/muonsach");
    dsMuonSach.value = res.data;

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  } catch (err) {
    console.error("Lỗi lấy danh sách mượn sách:", err);
  }
};

const taoPhieuMuon = async () => {
  if (form.value.ngayMuon > homNay) {
    Swal.fire({
      icon: "warning",
      title: "Ngày mượn không hợp lệ",
      text: "Ngày mượn không được vượt quá thời gian hiện tại!",
      confirmButtonColor: "#8c4e2a",
    });
    return;
  }

  const sachChon = dsSach.value.find(
    (s) => getVal(s, "maSach", "MaSach") === form.value.maSach,
  );
  if (sachChon) {
    const stock = getVal(sachChon, "soCuong", "soCuon") ?? sachChon.SoCuon ?? 0;
    if (stock <= 0) {
      Swal.fire({
        icon: "error",
        title: "Hết sách trong kho",
        text: `Sách "${getVal(sachChon, "tenSach", "TenSach")}" hiện đã hết, không thể mượn!`,
        confirmButtonColor: "#9a3412",
      });
      return;
    }
  }

  try {
    const payload = {
      maDocGia: form.value.maDocGia,
      maSach: form.value.maSach,
      ngayMuon: form.value.ngayMuon,
      ngayTra: null,
    };

    await api.post("/muonsach", payload);
    Swal.fire({
      icon: "success",
      title: "Tạo phiếu mượn thành công!",
      timer: 1800,
      showConfirmButton: false,
    });

    form.value.maDocGia = "";
    form.value.maSach = "";
    form.value.ngayMuon = homNay;

    await layDanhSachMuonSach();
    await layDanhSachSach();
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Tạo phiếu thất bại",
      text: err.response?.data?.message || "Có lỗi xảy ra khi tạo phiếu mượn!",
      confirmButtonColor: "#9a3412",
    });
  }
};

const traSach = async (item) => {
  const id = item._id || item.id;

  const { value: ngayTraNhap } = await Swal.fire({
    title: "Xác nhận trả sách",
    text: "Chọn hoặc nhập ngày trả sách:",
    input: "date",
    inputValue: homNay,
    inputAttributes: {
      max: homNay,
    },
    showCancelButton: true,
    confirmButtonText: "Xác nhận trả",
    cancelButtonText: "Hủy",
    confirmButtonColor: "#8c4e2a",
  });

  if (!ngayTraNhap) return;

  if (ngayTraNhap > homNay) {
    Swal.fire({
      icon: "warning",
      title: "Ngày trả không hợp lệ",
      text: "Ngày trả không được vượt quá thời gian hiện tại!",
      confirmButtonColor: "#8c4e2a",
    });
    return;
  }

  const ngayMuonRaw = getVal(item, "ngayMuon", "NgayMuon");
  const ngayMuonStr = new Date(ngayMuonRaw).toISOString().substring(0, 10);

  if (ngayTraNhap <= ngayMuonStr) {
    Swal.fire({
      icon: "warning",
      title: "Ngày trả không hợp lệ",
      text: `Ngày trả (${formatDate(ngayTraNhap)}) phải lớn hơn ngày mượn (${formatDate(ngayMuonStr)})!`,
      confirmButtonColor: "#8c4e2a",
    });
    return;
  }

  try {
    await api.put(`/muonsach/tra/${id}`, {
      ngayTra: ngayTraNhap,
    });

    Swal.fire({
      icon: "success",
      title: "Trả sách thành công!",
      timer: 1800,
      showConfirmButton: false,
    });

    await layDanhSachMuonSach();
    await layDanhSachSach();
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Trả sách thất bại",
      text: err.response?.data?.message || "Không thể thực hiện trả sách!",
      confirmButtonColor: "#9a3412",
    });
  }
};

const xoaPhieuMuon = async (item) => {
  const id = item._id || item.id;

  const result = await Swal.fire({
    title: "Xác nhận xóa?",
    text: "Bạn có chắc chắn muốn xóa lượt mượn sách này không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#9a3412",
    cancelButtonColor: "#786c65",
    confirmButtonText: "Đồng ý xóa",
    cancelButtonText: "Hủy bỏ",
  });

  if (!result.isConfirmed) return;

  try {
    await api.delete(`/muonsach/${id}`);
    Swal.fire({
      icon: "success",
      title: "Đã xóa lượt mượn!",
      timer: 1500,
      showConfirmButton: false,
    });

    await layDanhSachMuonSach();
    await layDanhSachSach();
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Không thể xóa",
      text: err.response?.data?.message || "Không thể xóa phiếu mượn này!",
      confirmButtonColor: "#9a3412",
    });
  }
};

const getTenDocGia = (maDocGia) => {
  if (!maDocGia) return "---";
  const dg = dsDocGia.value.find(
    (d) => getVal(d, "maDocGia", "MaDocGia") === maDocGia,
  );
  if (!dg) return maDocGia;
  const ho = getVal(dg, "hoLot", "HoLot") || "";
  const ten = getVal(dg, "ten", "Ten") || "";
  return `${ho} ${ten}`.trim();
};

const getTenSach = (maSach) => {
  if (!maSach) return "";
  const s = dsSach.value.find(
    (item) => getVal(item, "maSach", "MaSach") === maSach,
  );
  return s ? getVal(s, "tenSach", "TenSach") || "" : "";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "---";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("vi-VN");
};

onMounted(() => {
  layDanhSachDocGia();
  layDanhSachSach();
  layDanhSachMuonSach();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

.borrow-wrapper {
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

.border-warm-light {
  border-color: #e8e2d8 !important;
}

.bg-warm-code {
  background-color: #f5f0e6;
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
  transition: all 0.2s ease;
}

.btn-warm-primary:hover {
  background: linear-gradient(135deg, #743e20 0%, #572d14 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(140, 78, 42, 0.25);
}

.btn-warm-outline {
  border: 1px solid #8c4e2a;
  color: #8c4e2a;
  background-color: transparent;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-warm-outline:hover {
  background-color: #8c4e2a;
  color: #ffffff;
}

.btn-warm-danger {
  color: #9a3412;
  background-color: transparent;
  transition: all 0.2s ease;
}

.btn-warm-danger:hover {
  background-color: #fbebe6;
  color: #7c2d12;
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
.badge-status-borrowing {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.badge-status-returned {
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
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
