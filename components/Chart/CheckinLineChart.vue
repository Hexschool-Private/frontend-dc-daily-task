<script setup>
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

// 數字格式化 function（仿 SB Admin 的 number_format）
function number_format(
  number,
  decimals = 0,
  dec_point = '.',
  thousands_sep = ','
) {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  const n = !isFinite(+number) ? 0 : +number;
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  const sep = thousands_sep;
  const dec = dec_point;

  let s = '';
  const toFixedFix = (n, prec) => {
    return '' + Math.round(n * Math.pow(10, prec)) / Math.pow(10, prec);
  };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// 資料來源由父元件傳入
const props = defineProps({
  stats: {
    type: Object,
    required: true,
  },
});
const labels = Array.from(
  { length: props.stats.length },
  (_, i) => `Day ${i + 1}`
);

// 設定圖表資料與選項
const chartData = {
  labels: labels,
  datasets: [
    {
      label: '每日任務',
      data: props.stats.map((item) => item.count),
      fill: false,
      backgroundColor: 'rgba(78, 115, 223, 0.05)',
      borderColor: 'rgba(78, 115, 223, 1)',
      pointBackgroundColor: 'rgba(78, 115, 223, 1)',
      tension: 0,
    },
  ],
};
console.log('chartData', chartData);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      left: 10,
      right: 25,
      top: 25,
      bottom: 0,
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'right',
      labels: {
        boxWidth: 12,
        padding: 10,
      },
    },
    tooltip: {
      backgroundColor: 'rgb(255,255,255)',
      bodyColor: '#858796',
      titleColor: '#6e707e',
      titleFont: { size: 14 },
      borderColor: '#dddfeb',
      borderWidth: 1,
      padding: 15,
      displayColors: false,
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (context) {
          // 判斷目前是第幾個 dataset
          if (context.datasetIndex === 0) {
            // 第一組（切版）
            return '完成數: ' + number_format(context.raw);
          } else if (context.datasetIndex === 1) {
            // 第二組（JS）
            return '完成數: ' + number_format(context.raw);
          }
          // 預設 fallback
          return number_format(context.raw);
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        maxTicksLimit: 7,
      },
    },
    y: {
      grid: {
        color: 'rgb(234, 236, 244)',
        zeroLineColor: 'rgb(234, 236, 244)',
        drawBorder: false,
        borderDash: [2],
        zeroLineBorderDash: [2],
      },
      ticks: {
        maxTicksLimit: 5,
        padding: 10,
        callback: (value) => number_format(value),
      },
    },
  },
};
</script>

<template>
  <Line :data="chartData" :options="chartOptions" />
</template>
