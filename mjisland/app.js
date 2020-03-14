//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    wx.setStorageSync('url', 'https://shr.yfway.com/index.php?s=/WX/GuideManage/index/v/5.html');
    if (!wx.getStorageSync('login_ok')) {
      wx.setStorageSync('login_ok', -1);
    }
  },
  onShow() {
    let _this = this;

    // 隐藏底部tabbar
    wx.hideTabBar();

    //系统信息
    let system = wx.getSystemInfoSync();
    let name = 'iPhone X';
    wx.setStorageSync('system', system);
    if (system.model.indexOf(name) > -1) {
      _this.globalData.isIpx = true;
    }

    // 版本更新
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },
  globalData: {
    userInfo: null
  }
})