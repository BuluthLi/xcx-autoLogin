import {
  autoLogin
} from './util.js';
class Tool {


  /**
   * 发送请求
   * @param {*} url 地址 
   * @param {*} data 发送数据
   * @param {*} method 发送方法
   * @param {*} success 成功会掉
   * @param {*} fail 失败回调
   *
   */
  // static ceshiCount = 1;
  static MjRequest(url, data, method, success, fail) {
    method = method ? method : 'POST';
    let session_id = wx.getStorageSync("session_id");
    let header = {};
    if ('POST' == method) {
      header = {
        'content-type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'xmlhttprequest',
      }
    } else {
      header = {
        "content-type": "json",
      };
    }
    session_id && (header['Cookie'] = 'PHPSESSID=' + session_id);
    wx.request({
      url: url,
      method: method,
      header: header,
      data: data,
      success: function (res) {
        // 登录失效
        // if (url.indexOf('my_fans') != -1 && Tool.ceshiCount == 1) {
        //   res.data.code = -1;
        //   Tool.ceshiCount += 1;
        // }
        if (res.data.code == -1) {
          // wx.showToast({
          //   title: '登录过期,请重新登录',
          //   icon: 'none'
          // });
          wx.setStorageSync('login_ok', -1);
          autoLogin();
          return;
        }
        success && success(res);
      },
      fail(err) {
        fail && fail(err);
      },
      complete() {
        wx.hideLoading();
      }
    })
  }


  /**
   * 发送POST请求
   * @param {*} url 地址 
   * @param {*} data 发送数据
   * @param {*} method 发送方法 POST
   * @param {*} success 成功会掉
   * @param {*} fail 失败回调
   *
   */
  static Post(url, data, success, fail) {
    Tool.MjRequest(url, data, 'POST', success, fail);
  }

  /**
   * 发送GET请求
   * @param {*} url 地址 
   * @param {*} data 发送数据
   * @param {*} method 发送方法 GET
   * @param {*} success 成功会掉
   * @param {*} fail 失败回调
   *
   */
  static Get(url, data, success, fail) {
    Tool.MjRequest(url, data, 'GET', success, fail);
  }
}
export {
  Tool
};