import {
  Tool
} from './tool.js';
import {
  Config
} from './config.js';
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const autoLogin = () => {
  let _this = this;
  wx.login({
    success(res) {
      console.log(res);
      let data = {
        code: res.code,
      }
      wx.showToast({
        title: '自动登录中',
        icon: 'none'
      });
      Tool.Post(Config.Index + 'login', data, function (res) {
        // console.log('55545615'.res.data);
        if (res.data.status == 'success') {
          wx.setStorageSync('session_id', res.data.data.session_id);
          let flag = parseInt(res.data.data.flag);
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
                requestLoginSecond(data, rawData);
              },
              fail(err) {
                wx.showToast({
                  title: '请授权登录',
                  icon: 'none'
                });
                wx.navigateTo({
                  url: '/pages/login/login',
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
}
// 登录第二步
const requestLoginSecond = (data, rawData) => {
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
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      // 重新拉数据，
      // currentPage.onLoad();
      currentPage.onShow();

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
}

module.exports = {
  formatTime: formatTime,
  autoLogin: autoLogin
}