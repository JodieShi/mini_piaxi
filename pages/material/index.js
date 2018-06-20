// pages/material/index.js
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    faceNum: 3,
    materialNum: 0,
    videoSrc: "",
    workUrl: "",
    video_id: 1,
    vedio_length: 0,
    role_id: 1,
    imgArray: [{
      imgIndex: 0,
      imgSrc: '../../src/role.png'
    }, {
      imgIndex: 1,
      imgSrc: '../../src/role.png'
    }, {
      imgIndex: 2,
      imgSrc: '../../src/role.png'
    }],
    files: [],
    web_root: 'https://piaxi-filer.resetbypear.com/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      video_id: options.src,
      video_length: options.length,
    })
    console.log(this.data.video_id)
    console.log(this.data.video_length)
    var video_url = this.data.web_root + "videos/" + this.data.video_id + "/silent.mp4 ";
    console.log(video_url);
    this.setData({
      videoSrc: video_url
    })
    utils.httpRequest('https://piaxi.resetbypear.com/api/videos/'+this.data.video_id,{
      method: 'GET',
      success: (res)=>{
        let roles = res.data.data.roles;
        let temp = [];
        //获取视频中的roles
        for (let i = 0; i < roles.length; i++) {
          temp.push({
            img_id: roles[i]["role_id"],
            checked: "false",
            imgSrc: this.data.webroot + 'videos/' + this.data.video_id + '/role' + img_id + '.jpg'
            })
        }
        this.setData({
          imgArray: temp 
        });
      }
    })    
    // wx.downloadFile({
    //   url: video_url,
    //   success: function(res){
    //     if(res.statusCode === 200){
    //       console.log(res.data);
    //       for(var i = 0; i < res.data.roles.length; i++){
    //         this.setData({
    //           imgArray: imgArray.concat([{imgSrc: this.data.webroot + 'videos/' + this.data.video_id + '/role' + res.data.roles[i].role_id + '.jpg', checked: false, img_id: res.data.roles[i].role_id}])
    //         })
    //       }
    //     }
    //   }
    // })
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

  authorizeCamera: function(e) {
    var that = this;
    wx.authorize({
      scope: 'scope.camera',
      success: function(res) {
        wx.chooseImage({
          sourceType: ['album', 'camera'],
          success: function (res) {
            that.setData({
              files: that.data.files.concat(res.tempFilePaths)
            });
          }
        });
      }
    });
  },

  faceAndSound: function(){
    var that = this;
    wx.request({
      url: this.data.web_root,
    });
    wx.uploadFile({
      url: that.data.workUrl,
      filePath: that.data.files[0],
      name: 'user-image',
      formData: {
      }
    });
    wx.navigateTo({
      url: '../edit/edit?src=' + that.data.video_id + '&length=' + that.data.video_length,
    })
  },

  enterSound: function() { 
    let that = this;
    wx.navigateTo({
      url: '../edit/edit?src=' + that.data.video_id + '&length=' + that.data.video_length,
    })
  },

  radioChange: function(e) {
    var that = this;
    that.setData({
      role_id: e.detail.img_id
    })
  }
})

