// pages/share/share.js
import {
  Tool
} from '../../utils/tool.js';
import {
  Config
} from '../../utils/config.js';
var QR = require("../../utils/qrcode.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips: '资源准备中...',
    // 资源图片会添加一个二维码
    sourceList: [{
      src: "https://cdn-ptimg-oss.yfway.com/crm/invite/909/15439.jpg?x-oss-process=image/auto-orient,1/quality,q_100",
      name: 'bg'
    }, {
      src: "https://cdn-ptimg-oss.yfway.com/crm/invite/909/15437.jpg?x-oss-process=image/auto-orient,1/quality,q_100",
      name: 'call'
    }, {
      src: "https://cdn-ptimg-oss.yfway.com/crm/invite/909/15438.jpg?x-oss-process=image/auto-orient,1/quality,q_100",
      name: 'add'
    }],
    sharePath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let sysInfo = wx.getSystemInfoSync();
    let windowHeight = sysInfo.windowHeight - 46 - sysInfo.statusBarHeight;
    let windowWidth = sysInfo.windowWidth;
    //系统高度
    _this.setData({
      windowHeight: windowHeight,
      windowWidth: windowWidth
    });
    Tool.Post(Config.Index + 'guide_card', {}, function (res) {
      // 数据对接，等待国泰调整接口
      // let guideMsg = res.data;
      _this.data.sourceList.push({
        src: res.data.qrcode,
        name: 'qrcode'
      });
      _this.setData({
        ...res.data,
      });
      console.log(_this.data.sourceList);
      if (res.data.code == 200) {
        _this.downLoadImgList(0, (res) => {
          console.log(_this.data.sourceList);
          _this.drawMain();
        });
      }
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
    let login_ok = wx.getStorageSync('login_ok');
    if (login_ok && login_ok == -1) {
      wx.navigateTo({
        url: '/pages/login/login',
      });
      return;
    }
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
    return {
      title: '您好，我是尚品宅配高级居家顾问' + '欧亚铭' + ',我随时为您提供解答◔◡◔',
      path: '/pages/index/index?',
      imageUrl: '',
    };
  },

  /**
   * 事件处理
   */

  /**
   * 资源准备
   * @params sourceList 预准备的图片资源列表
   */

  downLoadImgList(index, callback) {
    let _this = this;
    index = index ? index : 0;
    let sourceList = this.data.sourceList;
    let src = sourceList[index].src;
    wx.downloadFile({
      url: src,
      success: (result) => {
        if (result.statusCode == 200) {
          sourceList[index].downloadSrc = result.tempFilePath;
          wx.getImageInfo({
            src: result.tempFilePath,
            success(infores) {
              sourceList[index].width = infores.width;
              sourceList[index].height = infores.height;
              index++;
              if (index < sourceList.length) {
                _this.downLoadImgList(index, callback);
              } else {
                console.info('download complete')
                callback && callback();
              }
            }
          });
        }
      },
      fail: (result) => {
        console.log(result);
        index++;
        if (index < sourceList.length) {
          _this.downLoadImgList(index, callback);
        } else {
          console.info('download complete')
          callback && callback();
        }
      },
      complete: () => {}
    });
  },
  /**
   * 画图
   */
  drawMain() {
    let _this = this;
    let scale = 1;
    let ctx = wx.createCanvasContext('main');
    _this.calHeight();
    let defaultLeft = 54;
    // 背景
    ctx.drawImage(_this.data.sourceList[0].downloadSrc, 0, 0, 750, _this.data.cvh);

    // logo
    // let logoMargin = 20;
    // let logoWidth = 220;
    // scale = 200 / _this.data.sourceList[1].width;
    // let logoHeight = _this.data.sourceList[1].height * scale;
    // ctx.drawImage(_this.data.sourceList[1].downloadSrc, defaultLeft, logoMargin, logoWidth, logoHeight);

    //头像
    _this.downLoadFace().then((src) => {
      let faceRadius = 280;
      let faceTop = 200;
      _this.setData({
        facePath: src
      })
      ctx.save();
      ctx.beginPath();
      ctx.arc(defaultLeft + faceRadius / 2, faceTop + faceRadius / 2, faceRadius / 2, 0, Math.PI * 2, false);
      ctx.clip();
      ctx.drawImage(src, defaultLeft, faceTop, faceRadius, faceRadius);
      ctx.restore();

      //名称
      let nameMargin = 64;
      let nameTop = faceTop + faceRadius + nameMargin;
      ctx.setFillStyle('#D51126')
      ctx.fillRect(defaultLeft, nameTop, 40, 40);
      ctx.setFillStyle('black')
      ctx.font = 'normal bold 48px sans-serif';
      // ctx.fillText('欧亚铭', defaultLeft + 60, nameTop + 40);
      ctx.fillText(_this.data.guide_name, defaultLeft + 60, nameTop + 40);
      ctx.font = 'normal normal 28px sans-serif';
      ctx.setFillStyle('#666666')
      ctx.fillText('高级家居顾问', defaultLeft + 60, nameTop + 100);

      // 电话和地址
      let callMargin = 80;
      let callTop = nameTop + callMargin + 80;
      ctx.drawImage(_this.data.sourceList[1].downloadSrc, defaultLeft, callTop, 40, 40);
      ctx.fillText(_this.data.tel, defaultLeft + 60, callTop + 30);
      ctx.drawImage(_this.data.sourceList[2].downloadSrc, defaultLeft, callTop + 60, 40, 40);
      ctx.fillText(_this.data.address, defaultLeft + 60, callTop + 90);

      //二维码
      let QRmarign = 160;
      // let QRtop = callTop + QRmarign + 48;
      let QRtop = _this.data.cvh - 254;

      ctx.drawImage(_this.data.sourceList[3].downloadSrc, defaultLeft, QRtop, 226, 226);
      //     // 画二维码头像
      ctx.drawImage(_this.data.facePath, defaultLeft + 97, QRtop + 97, 40, 40);
      // 渲染
      ctx.draw(false, () => {
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvasId: 'main',
            success: function (res) {
              var tempFilePath = res.tempFilePath;
              console.log('ok');
              _this.setData({
                sharePath: tempFilePath,
              })
            },
            fail: function (res) {
              console.log(res);

            }
          });
        }, 1000);
      });
      // 前端生成二维码，改成后端生成，前端使用
      // _this.createQrCode('https://www.baidu.com', "mycanvas", 200, 200).then(() => {
      //   _this.canvasToTempImage().then(() => {
      //     ctx.drawImage(_this.data.qrcodePath, defaultLeft, QRtop, 400, 400);

      //     // 画二维码头像
      //     ctx.drawImage(_this.data.facePath, defaultLeft + 100, QRtop + 100, 40, 40);
      //     // 渲染
      //     ctx.draw(false, () => {
      //       setTimeout(() => {
      //         wx.canvasToTempFilePath({
      //           canvasId: 'main',
      //           success: function (res) {
      //             var tempFilePath = res.tempFilePath;
      //             console.log('ok');
      //             _this.setData({
      //               sharePath: tempFilePath,
      //             })
      //           },
      //           fail: function (res) {
      //             console.log(res);

      //           }
      //         });
      //       }, 1000);
      //     });
      //   })
      // });
    });

  },
  /**
   * 计算canvas的高度
   */
  calHeight() {
    let height = this.data.sourceList[0].height;
    let width = this.data.sourceList[0].width;
    let cvh = 750 * height / width;
    console.log(cvh);
    this.setData({
      cvh: cvh
    })
  },
  //下载头像
  downLoadFace(callback) {
    let _this = this;
    _this.setData({
      tips: '正在生成头像...'
    })
    return new Promise(function (resolve, reject) {
      wx.downloadFile({
        // url: 'https://pt-images.oss-cn-shenzhen.aliyuncs.com/showhome/2020-01-13/1/157890014198072.png',
        url: _this.data.face,
        success: (result) => {
          resolve(result.tempFilePath);
        },
        fail: () => {
          wx.showToast({
            title: '头像下载失败！',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
            success: (result) => {

            },
            fail: () => {},
            complete: () => {}
          });
        },
        complete: () => {}
      });
    })
  },

  //画二维码
  createQrCode: function (url, canvasId, cavW, cavH) {
    let _this = this;
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    _this.setData({
      tips: '正在生成二维码...'
    })
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        resolve();
      }, 1000);
    })
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var _this = this;
    return new Promise(function (resolve, reject) {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          wx.hideLoading();
          _this.setData({
            qrcodePath: tempFilePath,
          });
          resolve()
        },
        fail: function (res) {
          wx.showToast({
            title: '生成二维码失败！',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
            success: (result) => {

            },
            fail: () => {},
            complete: () => {}
          });
        }
      });
    });
  },

  // 保存到手机
  onSave() {
    let _this = this;
    wx.saveImageToPhotosAlbum({
      filePath: _this.data.sharePath,
      success(res) {
        wx.showToast({
          title: '保存成功',
        })
      },
      fail() {
        wx.showToast({
          title: '保存失败',
        })
      }
    })
  }
})