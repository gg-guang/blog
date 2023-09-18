export const data = JSON.parse("{\"key\":\"v-2d0aa3fe\",\"path\":\"/me/\",\"title\":\"关于我\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"关于我\",\"date\":\"2023/9/18\"},\"headers\":[],\"git\":{},\"filePathRelative\":\"me/README.md\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
