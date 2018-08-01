// pages/metal/metal.js
let dateTimePicker = require('../../lib/dateTimePicker.js')
let app = getApp

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    dateTimeArray1: null,
    dateTime1: null, 
    userInfo: {
      avatarUrl: "",//用户头像
      nickName: "",//用户昵称
    },
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTime()
    this.getAvatar()
    this.getList()
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


  //点击添加
  powerDrawer: function (e) {
    let currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    let _self = this
    /* 动画部分 */
    // 第1步：创建动画实例   
    let animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    })
    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation
    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step()
    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })
      //关闭  
      if (currentStatu == "close") {
        // _self.addList()
        this.setData(
          {
            showModalStatus: false
          }
        )
      }
    }.bind(this), 200)
    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      )
    }
  },
  //弹出框
  toastSuccess(title) {
    wx.showToast({
      title: title,
      icon: 'success',
      duration: 2000
    })
  },
  //上传图片
  addImage () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // let tempFilePaths = res.tempFilePaths;
        // wx.uploadFile({
        //   url: 'https://...',      //此处换上你的接口地址
        //   filePath: tempFilePaths[0],
        //   name: 'img',
        //   header: {
        //     "Content-Type": "multipart/form-data",
        //     'accept': 'application/json',
        //     'Authorization': 'Bearer ..'    //若有token，此处换上你的token，没有的话省略
        //   },
        //   formData: {
        //     'user': 'test'  //其他额外的formdata，可不写
        //   },
        //   success: function (res) {
        //     let data = res.data;
        //     console.log('data');
        //   },
        //   fail: function (res) {
        //     console.log('fail');

        //   },
        // })
      }
    })
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn1(e) {
    let arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    })
  },
  //获取时间
  getTime() {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    let obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    let obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    let lastArray = obj1.dateTimeArray.pop();
    let lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    })
  }, 
  //获取用户信息
  getAvatar() {
    wx.getUserInfo({
      success: (res) => {
        console.log(res);
        let avatarUrl = 'userInfo.avatarUrl';
        let nickName = 'userInfo.nickName';
        this.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]: res.userInfo.nickName,
        })
      }
    })
  },
  //获取演出列表
  getList () {
    wx.request({
      url: 'http://118.25.16.199:8688/get_show/',
      method: 'GET',
      success: (res) => {
        console.log(res.data)
        let partake = ''
        let list = []
        let number = 0
        res.data.map((item, index)=>{
          let data = {}
          let number = item.partake.length
          partake = item.partake.join(',')
          Object.assign(data, item, { number: number},{ partake: partake })
          list.push(data)
        })
        console.log(list)
        this.setData({
          listData: list
        })
      }
    })
  },
  //日期格式转时间

  stampToTime: (date) => {
    var date = new Date(date);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    //var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m;
  }
})