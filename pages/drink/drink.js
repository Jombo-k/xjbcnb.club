// pages/drink/drink.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    listData: [],
    addName: '',
    addAddress: '',
    addWithNum: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    let _self = this
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
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
        _self.addList()
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
  // 获取列表
  getList() {
    wx.request({
      url: 'http://118.25.16.199:8688/get_vistor/',
      method: 'GET',
      data: {
        listData: []
      },
      success: (res) => {
        this.setData({
          listData: res.data
        })
      }
    })
  },
  // 新增人员
  setName(e) {
    this.setData({
      addName: e.detail.value
    })
  },
  setAddress(e) {
    this.setData({
      addAddress: e.detail.value
    })
  },
  setWithNum(e) {
    this.setData({
      addWithNum: e.detail.value
    })
  },
  addList() {
    let data = {
      "username": this.data.addName,
      "address": this.data.addAddress,
      "withnum": this.data.addWithNum
    }
    wx.request({
      url: 'http://118.25.16.199:8688/add_vistor/',
      method: 'POST',
      data: data,
      success: (res) => {
        console.log(res)
        if (res.data.result === "success") {
          this.getList()
          this.toastSuccess('添加成功')
        }
      }
    })
  },
  //点击删除按钮
  showDeleteModal: function (e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.showModal({
      title: '真的鸽了嘛？',
      content: '就这么狠心放下孤孤单单的兄弟姐们鸽了么?',
      confirmColor: '#1296db',
      cancelText: '回心转意',
      confirmText: '鸽意已决',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          this.deleteList(id)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //删除
  deleteList(id) {
    wx.request({
      url: 'http://118.25.16.199:8688/del_vistor/',
      method: 'POST',
      data: {
        'id': id
      },
      success: (res) => {
        if (res.data.result === "success") {
          this.getList()
          this.toastSuccess('再见🕊鸽王')
        }
      }
    })
  }
})