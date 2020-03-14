// pages/login/login.js
import {
  Tool
} from '../../utils/tool.js';
import {
  Config
} from '../../utils/config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: 0
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
    // _this.autoLogin();
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
    // let login_ok = wx.getStorageSync('login_ok');
    // if (login_ok && login_ok == 1) {
    //   wx.switchTab({
    //     url: '/pages/index/index',
    //   });
    //   return;
    // }
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
  //取消登录
  onCancel() {},
  /**
   * 
   * @param {*} e 
   * @description 登录分为获取session_id,以及获取用户信息这两步，
   * 方法采用点击登录方式，不使用自动登录（wx.getUserInfo授权与否）
   * 
   */
  onGetUserInfo(e) {
    console.log(e);
    let _this = this;
    wx.login({
      success(res) {
        console.log(res);
        let data = {
          code: res.code,
        }
        wx.showToast({
          title: '用户登录中',
          icon: 'none'
        });
        Tool.Post(Config.Index + 'login', data, function (res) {
          if (res.data.status == 'success' && e.detail.errMsg == "getUserInfo:ok") {
            wx.setStorageSync('session_id', res.data.data.session_id);
            // 双重逻辑
            let data = {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv
              },
              rawData = e.detail.rawData;
            if (res.data.data.flag == 1) {
              data = {
                test: 1
              };
            }
            _this.requestLoginSecond(data, rawData);
          } else {
            wx.showToast({
              title: '登录失败',
              icon: 'none'
            })
          }
        }, function (err) {
          wx.showToast({
            title: err,
            icon: 'none'
          })
        })
      },

    });
  },

  // 登录第二步
  requestLoginSecond(data, rawData) {
    rawData = JSON.parse(rawData);
    Tool.Post(Config.Index + 'login_second', data, function (res) {
      if (res.data.status == 'success') {
        wx.setStorageSync('session_id', res.data.data.session_id);
        wx.setStorageSync('login_ok', 1);
        if (!res.data.data.nickname) {
          res.data.data.nickname = rawData.nickName;
        } else {
          res.data.data.nickname = res.data.data.nickname;
        }

        if (!res.data.data.avatarurl) {
          res.data.data.avatarurl = rawData.avatarUrl;
        } else {
          res.data.data.avatarurl = res.data.data.avatarurl;
        }
        let userInfo = {
          id: res.data.data.id,
          nickname: res.data.data.nickname,
          avatarurl: res.data.data.avatarurl
        };
        console.log(userInfo);
        wx.setStorageSync('userInfo', userInfo);
        if (res.data.data.mj_auth == '0') {
          wx.setStorageSync('url', 'https://shr.yfway.com/index.php?s=/WX/GuideManage/index/v/5.html');
          wx.navigateTo({
            url: '/pages/web/web',
          });
          return;
        }
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, function () {
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    })
  },
  // 自动登录
  autoLogin() {
    let _this = this;
    wx.login({
      success(res) {
        console.log(res);
        let data = {
          code: res.code,
        }
        // wx.showToast({
        //   title: '自动登录中',
        //   icon: 'none'
        // });
        Tool.Post(Config.Index + 'login', data, function (res) {
          console.log(res.data);
          if (res.data.status == 'success') {
            wx.setStorageSync('session_id', res.data.data.session_id);
            let flag = parseInt(res.data.data.flag);
            console.log("flag:", flag);
            _this.setData({
              flag: flag
            });

            if (flag !== 1) {
              wx.getUserInfo({
                success: function (res) {
                  console.log(res);
                  let encryptedData = res.encryptedData;
                  let iv = res.iv;
                  let rawData = res.rawData;
                  let data = {
                    encryptedData: encryptedData,
                    iv: iv,
                  }
                  _this.requestLoginSecond(data, rawData);
                },
                fail(err) {
                  wx.showToast({
                    title: '请授权登录',
                    icon: 'none'
                  })
                }
              })
            }

          }
        }, function (err) {
          wx.showToast({
            title: err,
          })
        })
      },

    });
  },


})