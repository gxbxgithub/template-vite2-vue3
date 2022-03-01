/** 提示 */
const toast = (message, type = 'warning', duration = 1500) => {
  ElMessage.closeAll()
  ElMessage({
    message,
    type,
    duration
  })
}

/** loading */
class Loading {
  constructor(immediate = true, text = '加载中...', background = 'rgba(0, 0, 0, 0.5)') {
    this.text = text
    this.background = background
    if (immediate) {
      this.open()
    }
  }
  open() {
    if (this.loading) return
    this.loading = ElLoading.service({
      text: this.text,
      background: this.background
    })
  }
  close() {
    if (this.loading) {
      this.loading.close()
    }
  }
}

export {
  toast,
  Loading
}