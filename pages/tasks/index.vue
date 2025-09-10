<script setup>
// import { tasks } from '~/data/tasks';
// const { $swal } = useNuxtApp();

const tasks = ref(null);
const fetchTasks = async () => {
  try {
    const res = await $fetch('/tasks/db', {
      baseURL: process.env.API_BASE_URL,
    });
    tasks.value = res;
  } catch (error) {
    const { message } = error?.response?.data || {};
    $swal.fire({
      position: 'center',
      icon: 'error',
      title: message || '發生未知錯誤，請稍後重試',
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
onMounted(() => fetchTasks());
</script>

<template>
  <div class="container-fluid pt-4 height-100vh">
    <!-- Page Heading -->
    <div class="container px-0 px-sm-4">
      <h1 class="h3 mb-2 text-gray-800">Task List</h1>
      <div class="table-responsive mt-4">
        <table
          class="table table-bordered table-hover"
          id="dataTable"
          width="100%"
          cellspacing="0"
        >
          <thead class="table-light">
            <tr>
              <th class="fw-medium date-col">日期</th>
              <th class="fw-medium">連結</th>
            </tr>
          </thead>
          <tbody v-if="tasks">
            <tr
              v-for="{ id, date, task_name, link } in tasks?.sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )"
              :key="id"
            >
              <td>{{ date }}</td>
              <td>
                <a :href="link" target="_blank">{{ task_name }}</a>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="2" class="text-center">載入中 ...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.date-col {
  width: 120px;
  min-width: 100px;
  max-width: 150px;
}
</style>
