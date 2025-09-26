<script setup>
import { formatDate } from '@/utils/dateFormatter';

const { $swal } = useNuxtApp();

// 搜尋和每頁筆數變數
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const debounceTimer = ref(null);

// 資料狀態
const rawData = ref(null);
const isLoading = ref(true);

// 計算屬性 - 處理後的資料
const processedData = computed(() => {
  if (!rawData.value) return null;

  const { users = [], stats = [], updated_at } = rawData.value;

  // 從 stats 取得日期列表並排序
  const dateList = stats.map((stat) => stat.date).sort();

  // 處理使用者資料
  const processedUsers = users.map((user) => {
    const days = dateList.map((date) => user.presence?.[date] || false);

    return {
      ...user,
      days,
    };
  });

  return {
    users: processedUsers,
    dateList,
    updatedAt: updated_at,
    pagination: rawData.value.pagination,
  };
});

// 獲取資料
const fetchData = async () => {
  try {
    isLoading.value = true;
    const search = searchQuery.value.trim();

    const url = `/dashboard/?page=${currentPage.value}&page_size=${pageSize.value}&search=${search}&sort_by=completed_count&sort_order=desc`;

    const res = await $fetch(url, {
      baseURL: process.env.API_BASE_URL,
    });

    rawData.value = res;
  } catch (error) {
    $swal.fire({
      icon: 'error',
      title: error?.data || '發生錯誤，請稍後再試',
      showConfirmButton: false,
      timer: 1500,
    });
  } finally {
    isLoading.value = false;
  }
};

// 頁碼處理
const getVisiblePages = (totalPages) => {
  if (!totalPages) return [];

  const pages = [];
  const maxVisiblePages = 3;

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage.value <= 3) {
      for (let i = 1; i <= maxVisiblePages + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage.value >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      pages.push(currentPage.value - 1);
      pages.push(currentPage.value);
      pages.push(currentPage.value + 1);
      pages.push('...');
      pages.push(totalPages);
    }
  }

  return pages;
};

const changePage = (page) => {
  currentPage.value = page;
};

// 搜尋處理
const debouncedSearch = () => {
  clearTimeout(debounceTimer.value);
  debounceTimer.value = setTimeout(() => {
    currentPage.value = 1;
    fetchData();
  }, 300);
};

// 監聽器
watch(searchQuery, debouncedSearch);
watch([currentPage, pageSize], fetchData);

// 生命週期
onMounted(fetchData);
</script>

<template>
  <div class="w-100 px-4 px-md-5 py-4 height-100vh">
    <!-- Page Heading -->
    <h1 class="h3 mb-2 text-gray-800">Tables</h1>

    <!-- DataTales Example -->
    <div class="card shadow mt-4">
      <div class="card-header py-3">
        <h2 class="fs-5 m-0 text-primary">每日任務打卡狀況</h2>
      </div>
      <div class="card-body container-fluid pt-3">
        <div class="row">
          <div class="col">
            <ol class="p-0">
              <li>
                <p class="m-0">
                  *只要在該日打卡討論串留言就算打卡成功，該日的每日任務提交的截止時間是在隔天中午
                  12:00，超過時間的留言將不計入打卡成功。
                </p>
              </li>
              <li>
                <p class="m-0">
                  最後更新時間： {{ processedData?.updatedAt || '--' }}
                </p>
              </li>
            </ol>
          </div>
        </div>

        <div class="row f-between-center">
          <div class="col-sm-6 col-xxl-2">
            <div class="dataTables_length">
              <label class="f-center gap-2">
                Show
                <select
                  class="form-control form-control-sm"
                  v-model="pageSize"
                  @change="currentPage = 1"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                entries
              </label>
            </div>
          </div>
          <div class="col-sm-6 col-xxl-3 mt-2 mt-sm-0">
            <div class="dataTables_filter text-end">
              <label class="f-center gap-2">
                Search:
                <input
                  type="search"
                  class="form-control form-control-sm"
                  placeholder="請輸入顯示名稱"
                  v-model="searchQuery"
                />
              </label>
            </div>
          </div>
        </div>

        <div class="table-responsive mt-3">
          <!-- 載入中 -->
          <div v-if="isLoading" class="py-4">
            <h2 class="fs-5 fs-lg-2">載入中 ...</h2>
          </div>

          <!-- 無資料 -->
          <div v-else-if="!processedData?.users?.length" class="py-4">
            <h2 class="fs-5 fs-lg-2">無符合搜尋結果的資料</h2>
          </div>

          <!-- 資料表格 -->
          <table
            v-else
            class="table table-bordered table-hover"
            width="100%"
            cellspacing="0"
          >
            <thead class="table-light">
              <tr>
                <th class="sticky-col">使用者</th>
                <th>累積打卡天數</th>
                <th
                  v-for="(date, index) in processedData.dateList"
                  :key="date"
                  :title="formatDate(date)"
                >
                  Day {{ index + 1 }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in processedData.users" :key="user.author_id">
                <td class="sticky-col">
                  <NuxtImg
                    :src="user.avatar_url"
                    alt="avatar-image"
                    width="30"
                    height="30"
                    class="rounded-circle me-2"
                  />
                  {{ user.global_name }} ({{ user.username }})
                </td>
                <td class="text-center">
                  {{ user.completed_count }}
                </td>
                <td
                  v-for="(checked, index) in user.days"
                  :key="index"
                  class="text-center"
                >
                  <i
                    v-if="checked"
                    class="fas fa-solid fa-check text-success"
                  ></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分頁 -->
        <div v-if="processedData?.pagination" class="row f-between-center mt-2">
          <div class="col-sm-6">
            <div class="dataTables_info">
              Showing
              {{
                (processedData.pagination.current_page - 1) *
                  processedData.pagination.page_size +
                1
              }}
              to
              {{
                Math.min(
                  processedData.pagination.current_page *
                    processedData.pagination.page_size,
                  processedData.pagination.total_count
                )
              }}
              of {{ processedData.pagination.total_count }} entries
            </div>
          </div>
          <div class="col-sm-6 mt-2 mt-sm-0">
            <div class="f-md-end-center">
              <ul class="pagination">
                <li
                  class="paginate_button page-item previous"
                  :class="{ disabled: currentPage === 1 }"
                >
                  <a
                    href="#"
                    class="page-link"
                    @click.prevent="
                      currentPage > 1 && changePage(currentPage - 1)
                    "
                  >
                    <i class="fas fa-solid fa-angle-left"></i>
                  </a>
                </li>
                <li
                  class="paginate_button page-item"
                  :class="{
                    active: page === currentPage,
                    disabled: page === '...',
                  }"
                  v-for="(page, index) in getVisiblePages(
                    processedData.pagination.total_pages
                  )"
                  :key="index"
                >
                  <a
                    v-if="page !== '...'"
                    href="#"
                    class="page-link"
                    @click.prevent="changePage(page)"
                  >
                    {{ page }}
                  </a>
                  <span v-else class="page-link">...</span>
                </li>
                <li
                  class="paginate_button page-item next"
                  :class="{
                    disabled:
                      currentPage === processedData.pagination.total_pages,
                  }"
                >
                  <a
                    href="#"
                    class="page-link"
                    @click.prevent="
                      currentPage < processedData.pagination.total_pages &&
                        changePage(currentPage + 1)
                    "
                  >
                    <i class="fas fa-solid fa-angle-right"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table tbody tr {
  transition: all 0.3s;

  /* 表格中 hover 後整排會有底色 */
  &:hover td {
    background-color: #f5f5f5;
  }
}
.table-responsive {
  height: 480px;

  @include mobile {
    height: 100%;
  }
}
th {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 2;
  border-top: 1px solid #dee2e6;
}
th,
td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8px;
  box-shadow: inset 0 -1px #dee2e6;
}

/* 凍結左側使用者欄位 */
.sticky-col {
  position: sticky;
  left: 0;
  z-index: 3;
  background-color: $white;
  white-space: nowrap;

  @include mobile {
    position: static;
  }
}
.table thead th.sticky-col {
  z-index: 4;
}

/* 解決邊框因凍結而破版的問題 */
.table {
  border-collapse: separate;
  border-spacing: 0;
}
</style>
