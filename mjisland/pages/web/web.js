// pages/web/web.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'https://shr.yfway.com/index.php?s=/WX/GuideManage/index/v/5.html'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let url = wx.getStorageSync('url');
    if (url) {
      this.setData({
        url: url
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
    wx.removeStorageSync('url');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.removeStorageSync('url');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('url');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})