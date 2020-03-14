// pages/user/user.js
import {
  Tool
} from '../../utils/tool.js';
import {
  Config
} from '../../utils/config.js';

// 获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    tabbar: 'user',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let sysInfo = wx.getSystemInfoSync();
    let windowHeight = sysInfo.windowHeight - 46 - sysInfo.statusBarHeight;
    //系统高度
    _this.setData({
      windowHeight: windowHeight
    });
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
    let _this = this;
    // let login_ok = wx.getStorageSync('login_ok');
    // if (login_ok && login_ok == -1) {
    //   wx.navigateTo({
    //     url: '/pages/login/login',
    //   });
    //   return;
    // }
    _this.getGuideMsg();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  },
  onIntoWeb(e) {
    let type = parseInt(e.currentTarget.dataset.type);
    let _this = this;
    switch (type) {
      case 0:
        let openid = _this.data.guideMsg.openid;
        wx.setStorageSync('url', 'https://shr.yfway.com/index.php?s=/WX/Bind/modify/openid/' + openid + '.html');
        wx.navigateTo({
          url: '/pages/web/web',
        });
        break;
      case 1:
        wx.navigateTo({
          url: '/pages/share/share',
        });
        break;
      case 2:
        wx.setStorageSync('url', 'https://shr.yfway.com/index.php?s=/WX/ClientBoss/reception.html');
        wx.navigateTo({
          url: '/pages/web/web',
        });
        break;
      case 3:
        wx.setStorageSync('url', 'https://shr.yfway.com/index.php?s=/WX/GuideManage/index/v/2');
        wx.navigateTo({
          url: '/pages/web/web',
        });
        break;
    }
  },
  /**
   * 获取用户个人信息
   */
  getGuideMsg() {
    let _this = this;
    let data = {
      // test: 1
    };
    Tool.Post(Config.Index + 'guide_info', data, function (res) {
      if (res.statusCode == 200) {
        console.log(res.data);
        // if (res.data.code == -1 || !res.data.id) {
        //   wx.setStorageSync('login_ok', -1);
        //   wx.navigateTo({
        //     url: '/pages/login/login',
        //   });
        //   return;
        // }
        _this.setData({
          guideMsg: res.data
        })
      }
    })
  }
})