// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/image-edge'],
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/hex2025-EduTrack/' : '/',
    buildAssetsDir: '/static/',
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: 'favicon.svg' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
        },
      ],
      title: '2025 JS 直播班 - 每日任務打卡追蹤儀表板',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        {
          name: 'description',
          content:
            '這是一個專為 2025 JS 直播班學員設計的每日任務打卡追蹤儀表板，可以追蹤每日任務的打卡狀況。',
        },
        {
          property: 'og:title',
          content: '2025 JS 直播班 - 每日任務打卡追蹤儀表板',
        },
        {
          property: 'og:description',
          content:
            '這是一個專為 2025 JS 直播班學員設計的每日任務打卡追蹤儀表板，可以追蹤每日任務的打卡狀況。',
        },
      ],
    },
  },
  css: ['@/assets/stylesheets/all.scss'],
  vite: {
    define: {
      'process.env': process.env,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @import "bootstrap/scss/functions"; 
          @import "@/assets/stylesheets/scss/utils/variables";
          @import "@/assets/stylesheets/scss/utils/mixin";`,
        },
      },
    },
  },
  plugins: ['~/plugins/chart.js', '~/plugins/bootstrap.client.js'],
});
