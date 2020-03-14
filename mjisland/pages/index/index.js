import {
  Tool
} from '../../utils/tool.js';
import {
  Config
} from '../../utils/config.js';
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    tabbar: 'index',
    //导航栏数据
    navList: [{
      id: 0,
      value: '我的粉丝'
    }, {
      id: 1,
      value: '线上报名'
    }, {
      id: 2,
      value: '建单客户'
    }],
    //状态栏数据
    statusList: [{
      id: 0,
      value: '待量尺'
    }, {
      id: 1,
      value: '已量尺'
    }, {
      id: 2,
      value: '已安装'
    }],
    // 粉丝状态栏
    fansStatusList: [{
        id: 0,
        value: '未登记'
      },
      {
        id: 1,
        value: '已登记'
      }
    ],
    currentNav: 0, //当前选中的导航栏
    currentStatus: 0, //当前选中的派尺状态,
    fansStatus: 0, //粉丝列表状态
    value: '', //搜索的文本

    //数据列表
    fansList: [],
    contantList: [],
    buildList: [],
    page: 1, //粉丝列表当前页数
    today_num: 0,
    total_num: 0,
    not_deal_num: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let sysInfo = wx.getSystemInfoSync();
    let windowHeight = sysInfo.windowHeight - 46 - sysInfo.statusBarHeight;
    let headerHeight = 46 + sysInfo.statusBarHeight;
    //系统高度
    _this.setData({
      windowHeight: windowHeight,
      headerHeight: headerHeight
    })
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

    _this.doMain();
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
    let _this = this;
    _this.doMain();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 事件处理
   */

  /**
   * 跳转到小程序助手
   * @param {} e 
   */
  onIntoChat(e) {
    // let path = e.currentTarget.dataset.path || 'pages/list/list?user_openid=o90kKj8V57d-wqCMhZi4emwmb-TQ';
    let path = e.currentTarget.dataset.path;
    // wx.showToast({
    //   icon: 'none',
    //   duration: 3000,
    //   title: path,
    // });
    // console.log(e);
    if (!path) return;
    wx.navigateToMiniProgram({
      appId: 'wx72eee61e991e65a1',
      path: path,
      extraData: {},
      success(res) {
        // 打开成功
        console.log('跳转成功：');
      },
      fail(res) {
        console.log('跳转失败：' + res.errMsg);
      }
    })

  },

  /**
   * 
   * @param {跟进链接} e 
   */
  onStep(e) {
    let url = e.currentTarget.dataset.url;
    wx.setStorageSync('url', url);
    wx.navigateTo({
      url: '/pages/web/web',
    })
  },


  onChangeNav(e) {
    let _this = this;
    let currentNav = e.currentTarget.dataset.index;
    if (currentNav == _this.data.currentNav) return;
    _this.setData({
      currentNav: currentNav,
      fansList: [],
      contantList: [],
      buildList: [],
      page: 1,
      value: ''
    })
    _this.doMain();
  },

  onChangeStatus(e) {
    let _this = this;
    let status = e.currentTarget.dataset.index;
    _this.setData({
      currentStatus: status,
      page: 1,
      buildList: [],
      value: ''
    });
    _this.getBuildList();
  },
  onChangeFansStatus(e) {
    let _this = this;
    let status = e.currentTarget.dataset.index;
    _this.setData({
      fansStatus: status,
      page: 1,
      fansList: [],
      value: ''
    });
    _this.getFansList();
  },
  onInput(e) {
    let value = e.detail.value;
    this.setData({
      value: value
    })
  },
  onSearch() {
    let _this = this;
    if (_this.data.value == '') {
      wx.showToast({
        title: '关键字不能为空',
        icon: 'none'
      });
      return;
    }
    _this.setData({
      fansList: [],
      contantList: [],
      buildList: [],
      page: 1,
    })
    console.log('搜索关键字为：' + _this.data.value);
    _this.doMain();

  },

  /**
   * 唤起打电话
   */
  onCall(e) {
    let phone = e.currentTarget.dataset.phone;
    if (!phone) return;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  /**
   * 函数分发
   */
  doMain() {
    let _this = this;
    let currentNav = _this.data.currentNav;
    if (currentNav == 0) {
      _this.getFansList();
    } else if (currentNav == 1) {
      _this.getContantList();
    } else {
      console.log(currentNav);
      _this.getBuildList();
    }
  },
  /**
   *获取粉丝列表 
   */
  getFansList() {
    wx.showLoading({
      title: '加载中',
    });
    let _this = this;
    let data = {
      page: _this.data.page,
      username: _this.data.value,
      is_register: _this.data.fansStatus,
      // test: 1
    };
    Tool.Post(Config.Index + 'my_fans', data, function (res) {
      if (res.data.code == 200) {
        if (res.data.data.length == 0) {
          wx.showToast({
            title: '暂无更多',
            icon: 'none'
          });
          return;
        }
        let data = _this.data.fansList.concat(res.data.data);
        _this.setData({
          fansList: data,
          today_num: res.data.today_num,
          total_num: res.data.total_num,
          page: _this.data.page + 1
        })
      }
    })
  },

  /**
   * 获取预约列表
   * 
   */

  getContantList() {
    wx.showLoading({
      title: '加载中',
    });
    let _this = this;
    let data = {
      page: _this.data.page,
      username: _this.data.value,
      // test: 1
    };
    Tool.Post(Config.Index + 'get_contact', data, function (res) {
      if (res.data.code == 200) {
        if (res.data.data.length == 0) {
          wx.showToast({
            title: '暂无更多',
            icon: 'none'
          });
          return;
        }
        let data = _this.data.contantList.concat(res.data.data);
        console.log(data);
        _this.setData({
          contantList: data,
          today_num: res.data.today_num,
          not_deal_num: res.data.not_deal_num,
          page: _this.data.page + 1
        })
      }
    })
  },
  /**
   * 获取建单列表
   * 
   */

  getBuildList() {
    wx.showLoading({
      title: '加载中',
    });
    let _this = this;
    let data = {
      page: _this.data.page,
      username: _this.data.value,
      status: _this.data.currentStatus + 1,
      // test: 1
    };
    Tool.Post(Config.Index + 'build', data, function (res) {
      if (res.data.code == 200) {
        if (res.data.data.length == 0) {
          wx.showToast({
            title: '暂无更多',
            icon: 'none'
          });
          return;
        }
        let data = _this.data.buildList.concat(res.data.data);
        console.log(data);
        _this.setData({
          buildList: data,
          total_num: res.data.total_num,
          page: _this.data.page + 1
        })
      }
    })
  }
})