// pages/main/main.js
const app = getApp();
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    srcPath: "",
    videoSrc: "https://piaxi-filer.resetbypear.com/videos/1/original.mp4",
    //视频资源 src
    //grids: ["memory.mp4", "memory.mp4", "memory.mp4", "memory.mp4"],
    grids:[{
      id: 1,
      poster: '../../src/smile.jpeg',
      videoLen: 14000
    },{
      id: 1,
      poster: '../../src/chop.jpeg',
      videoLen: 14000
    },{
      id: 1,
      poster: '../../src/happy.jpeg',
      videoLen: 14000
    },{
      id: 1,
      poster: '../../src/panda.jpeg',
      videoLen: 14000
    }]
    //字幕文件
  },

  /**
   * 监听搜索点击
   */
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },

  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  /**
   * 视频点击后跳转至相应页面
   * 需要请求字幕文件
   */
  jumpToEdit: function (event){
    console.log("JumpSrc=>",event.currentTarget.dataset.videoId);
    let dataset = event.currentTarget.dataset;
    console.log(dataset)
    let videoId = dataset.videoId;
    let length = dataset.videoLength;
    console.log("Url=>", '../material/index?src=' + videoId + '&length=' + length);
    wx.navigateTo({
      url: '../material/index?src='+ videoId + '&length=' +  length
      //url: '../material/index?src=1&length=14000'
    });
    this.videoContext && this.videoContext.pause();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let srcPath = getApp().globalData.srcPath;
    let fileServer = getApp().globalData.fileServer;
    this.videoContext = wx.createVideoContext('topVideo');
    this.setData({
      srcPath
    });
    //向后台请求资源, 
    utils.httpRequest('https://piaxi.resetbypear.com/api/videos',{
      method: 'GET',
      success: (res)=>{
        let videos = res.data.data.videos;
        let temp = [];
        //获取首页视频 src 和 poster
        for (let i = 0; i < videos.length; i++) {
          temp.push({
            id: videos[i]["video_id"],
            name: videos[i]["name"],
            poster: fileServer + '/videos/' + videos[i]["video_id"] + '/' + 'poster.jpg',
            videoLen: videos[i]["duration"]*1000
          })
        }
        this.setData({
          videoSrc: fileServer + '/videos/' + videos[0]["video_id"] + '/' + 'original.mp4',
          grids: temp 
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext && this.videoContext.seek(0);
    this.videoContext && this.videoContext.play();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //this.videoContext && this.videoContext.seek(0);
    this.videoContext && this.videoContext.play();
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