export default defineNuxtPlugin((nuxtApp) => {
  // 從環境變數取得 Google Analytics 測量 ID
  const config = useRuntimeConfig();
  const GA_MEASUREMENT_ID = config.public.gaMeasurementId;

  // 如果沒有設定測量 ID，則不載入 GA
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    console.warn(
      'Google Analytics 測量 ID 尚未設定，請在環境變數中設定 NUXT_PUBLIC_GA_MEASUREMENT_ID'
    );
    return;
  }

  // 僅在生產環境中載入 Google Analytics
  if (process.env.NODE_ENV === 'production') {
    // 動態載入 Google Analytics 腳本
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // 初始化 gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // 監聽路由變化以追蹤頁面瀏覽
    nuxtApp.$router.afterEach((to) => {
      gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: to.fullPath,
      });
    });
  }
});
