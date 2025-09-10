<script setup>
// import { tasks, taskStats } from '~/data/tasks';
// import { dashboardData } from "~/data/dashboardData";

const { $swal } = useNuxtApp();

const tasks = ref(null);
const taskStats = computed(() => {
  return tasks.value ? tasks.value.tasks : null;
});
const dashboard = ref(null);

const checkInNum = ref(0);
const studentCheckInNum = ref(0);
const todayTask = computed(() => {
  if (!tasks.value) return null;
  const today = new Date().toISOString().split('T')[0];
  return tasks.value.tasks.find((task) => task.date === today) || null;
});
// const checkInNum =
//   dashboardData?.stats
//     ?.filter((item) => new Date(item.date) >= new Date("2025-05-01"))
//     ?.reduce((sum, item) => sum + item.count, 0) || 0;

const handleFetchError = (response) => {
  const { message } = response?.data || {};
  $swal.fire({
    position: 'center',
    icon: 'error',
    title: message || '發生未知錯誤，請稍後重試',
    showConfirmButton: false,
    timer: 1500,
  });
};

const fetchData = async () => {
  try {
    const [taskData, dashboardData] = await Promise.all([
      $fetch('/tasks/', {
        baseURL: process.env.API_BASE_URL,
      }),
      $fetch('/dashboard/', {
        baseURL: process.env.API_BASE_URL,
      }),
    ]);
    tasks.value = taskData;
    dashboard.value = dashboardData;
    // 處理 checkInNum 的統計
    checkInNum.value =
      dashboardData?.stats
        ?.filter((item) => new Date(item.date) >= new Date('2025-05-01'))
        ?.reduce((sum, item) => sum + item.count, 0) || 0;
    // 處理 studentCheckInNum 的統計
    studentCheckInNum.value = dashboardData?.users?.length || 0;
  } catch (error) {
    handleFetchError(error.response || {});
  }
};
onMounted(() => fetchData());
</script>

<template>
  <div id="content-wrapper" class="d-flex flex-column height-100vh pt-4">
    <!-- Main Content -->
    <div id="content">
      <!-- Begin Page Content -->
      <div class="container-fluid">
        <!-- Page Heading -->
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 class="h3 mb-0 text-gray-800">Dashboard</h1>
        </div>

        <!-- Content Row -->
        <HomeContentRow
          v-if="taskStats"
          :stats="taskStats"
          :checkInNum="checkInNum"
          :studentCheckInNum="studentCheckInNum"
        />
        <!-- Content Row -->

        <div class="row">
          <!-- Chart -->
          <div class="col-xl-8 col-lg-7 mb-4">
            <div class="card shadow h-100">
              <!-- Card Header - Dropdown -->
              <div
                class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
              >
                <h6 class="m-0 font-weight-bold text-primary">
                  每日任務完成累積數量
                </h6>
              </div>
              <!-- Card Body -->
              <div class="card-body" v-if="dashboard">
                <div class="chart-area">
                  <ChartCheckinLineChart :stats="dashboard.stats || []" />
                </div>
              </div>
            </div>
          </div>

          <!-- today task -->
          <div class="col-xl-4 col-lg-5 mb-4">
            <div class="card shadow h-100">
              <!-- Card Header - Dropdown -->
              <div
                class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
              >
                <h6 class="m-0 font-weight-bold text-primary">今日任務</h6>
              </div>
              <!-- Card Body -->
              <div class="card-body px-4">
                <div class="f-center">
                  <img
                    src="/img/undraw_learning_2jue.svg"
                    alt="learning-image"
                    class="img-fluid"
                    style="width: 16rem"
                  />
                </div>
                <div class="my-4 text-center">
                  <a
                    :href="
                      todayTask?.url ||
                      'https://discord.com/channels/801807326054055996/1399326317136314482'
                    "
                    target="_blank"
                    class="fs-5 text-decoration-none slide-right-hover"
                  >
                    {{
                      todayTask?.task_name ||
                      '今日無任務，前往 Discord 查看歷史任務'
                    }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /.container-fluid -->
    </div>
    <!-- End of Main Content -->
  </div>
</template>

<style lang="scss" scoped></style>
