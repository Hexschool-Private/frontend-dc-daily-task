<script setup>
const props = defineProps({
  stats: {
    type: Object,
    required: true,
  },
  checkInNum: {
    required: true,
  },
  studentCheckInNum: {
    required: true,
  },
});

// 任務進度條計算
const taskProgress = computed(() => {
  const completed = props?.stats?.css?.length ?? 0;
  return ((completed / 25) * 100).toFixed(0);
});
</script>

<template>
  <div class="row">
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-left-primary shadow h-100 p-2">
        <div class="card-body">
          <div class="row no-gutters align-items-center h-100">
            <div class="col">
              <div class="font-weight-bold text-primary mb-1">
                每日任務總打卡次數
              </div>
              <div class="fs-3 mb-0 fw-bold">
                {{ checkInNum }} <span class="fs-6 fw-light">次</span>
              </div>
            </div>
            <div class="col-auto">
              <i class="fas fa-check fa-2x text-gray-300"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-left-info shadow h-100 p-2">
        <div class="card-body">
          <div class="row no-gutters align-items-center h-100">
            <div class="col mr-2">
              <div
                class="text-xs font-weight-bold text-info text-uppercase mb-1"
              >
                參與打卡人數
              </div>
              <div class="row no-gutters align-items-center">
                <div class="col-auto">
                  <div class="fs-3 mb-0 fw-bold">
                    {{ studentCheckInNum }}
                    人
                  </div>
                </div>
              </div>
            </div>
            <div class="col-auto">
              <i class="fas fa-user-check fa-2x text-gray-300"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-left-warning shadow h-100 p-2">
        <div class="card-body">
          <div class="row no-gutters align-items-center h-100">
            <div class="col">
              <div class="font-weight-bold text-warning mb-1">
                每日任務已經累積
              </div>
              <div class="fs-3 mb-0 fw-bold">
                {{ props?.stats?.length }}
                <span class="fs-6 fw-light">天</span>
              </div>
            </div>
            <div class="col-auto">
              <i class="fas fa-calendar fa-2x text-gray-300"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-left-success shadow h-100 p-2">
        <div class="card-body">
          <div class="row no-gutters align-items-center h-100">
            <div class="col">
              <div class="font-weight-bold text-success mb-1">
                查看每日任務打卡回報區
              </div>
              <div class="fs-5 mb-0">
                <a
                  href="https://discord.com/channels/801807326054055996/1399326317136314482"
                  target="_blank"
                  rel="noopener noreferrer"
                  >點此前往 Discord
                </a>
              </div>
            </div>
            <div class="col-auto">
              <i class="fas fa-arrow-right fa-2x text-gray-300"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
