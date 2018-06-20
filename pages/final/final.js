Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentVideoSrc:""
    
  },

  onShareAppMessage: function(res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  },

  saveToLocal: function(event){
    console.log("save")
    wx.downloadFile({
      url: 'https://piaxi-filer.resetbypear.com/videos/1/original.mp4', //仅为示例，并非真实的资源
      success: function (res) {
        console.log("temp=>", res.tempFilePath);
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success: function(res){
              wx.showToast({
                title: '已完成',
                icon: 'success',
                duration: 3000
              });
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let fileServer = getApp().globalData.fileServer;
    this.setData({
      currentVideoSrc: decodeURIComponent(options.src),     
      currentVideo: decodeURIComponent(options.src),
      videoSrc: fileServer + '/works/' + options.src + '/product.mp4'
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (res) {
    
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

  }
})