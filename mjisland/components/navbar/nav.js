// pages/components/navbar/navigationbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: Number,
      value: 0 // 默认值
    },
    // navbar的标题
    title: {
      type: String,
      value: '美家岛' // 默认值
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: 65,
  },
  /**
   * 组件的生命周期
   */
  ready() {
    let _this = this;
    let showTip = wx.getStorageSync('showTip');
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          height: res.statusBarHeight + 46
        })
      },
    });
    _this.setData({
      showTip: false
    });
    wx.setStorageSync('showTip', false)
  },
  /**
   * 组件所在页面的生命周期
   */
  pageLifetimes: {
    show() {
      // 页面被展示
    },
    hide() {
      // 页面被隐藏
    },
    resize(size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onBack: () => {
      let pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    },
    onIndex: () => {
      wx.switchTab({
        url: '/pages/index/index'
      })
    },
    onGoToSearch() {
      wx.navigateTo({
        url: '../search/search'
      })
    },
  }
})