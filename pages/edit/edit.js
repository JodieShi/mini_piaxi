var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentVideo:"https://piaxi-filer.resetbypear.com/videos/1/original.mp4",
    src: "",
    timer: [],
    //对应于每一行的类名,控制样式
    currentShowLine:[],
    //视频的时长
    videoLength:14000,
    currentLine:"",
    //记录所有的字幕开始结束时间 index%2 判奇偶
    lineTimes:[],
    startTime:"",
    playedTime:"",
    lastTime:"",
    currentTime:"",
    //录音按钮状态
    btnStatus:"pause",
    editBtn: false,
    btnSrc: "", 
    //3s的提示时间
    prepareTime: 0,
    cachedLines:[],
    lines: [
      {
        "startTime": 1000
        , "endTime": 2000
        , "text": "When you are old and grey and full of sleep,"
        , "number": 0
      }
      , {
        "startTime": 3000
        , "endTime": 3500
        , "text": "And nodding by the fire，take down this book."
        , "number": 1
      }
      , {
        "startTime": 4000
        , "endTime": 4500
        , "text": "And slowly read,and dream of the soft look."
        , "number": 2
      }
      , {
        "startTime": 50000
        , "endTime": 58000
        , "text": "Your eyes had once,and of their shadows deep;"
        , "number": 3
      }
      , {
        "startTime": 6000
        , "endTime": 6500
        , "text": "How many loved your moments of glad grace, "
        , "number": 4
      }
      , {
        "startTime": 7000
        , "endTime": 7100
        , "text": "And loved your beauty with love false or true,"
        , "number": 5
      }
      , {
        "startTime": 8000
        , "endTime": 8500
        , "text": "But one man loved the pilgrim Soul in you"
        , "number": 5
      }
      , {
        "startTime": 9000
        , "endTime": 95000
        , "text": "And loved the sorrows of your changing face;"
        , "number": 6
      }
      , {
        "startTime": 10000
        , "endTime": 10500
        , "text": "And bending down beside the glowing bars, "
        , "number": 7
      }
      , {
        "startTime": 11000
        , "endTime": 12000
        , "text": "Murmur,a little sadly,how Love fled;"
        , "number": 8
      }
    ],
    editable: false,
    edited: false,
    videoMuted: false,
    pause: true,
    jumpBtn: false,
    bgmList: [
      { name: '默认', id: 0, checked: 'true'},
      { name: 'bgm1.wav', id: 1 },
      { name: 'bgm2.wav', id: 2 },
      { name: 'bgm3.wav', id: 3 },
      { name: 'bgm2.wav', id: 4 },
      { name: 'bgm1.wav', id: 5 },
      { name: 'bgm3.wav', id: 6 },
    ],
    bgm:"bgm1.wav",
    popPanel: "invisible-panel"
  },

  jumpToNext: function (event) {
    console.log("final");
    //如果不录音直接跳转
    let playedTime = this.data.playedTime;
    let ctx = this;
    if(playedTime == 0){
      //告知后台没有新的信息需要传递
      utils.httpRequest('https://piaxi.resetbypear.com/api/bgms',{
        method:'GET',
        data: {
          "video_id": ctx.data.currentVideo ,
          "bgm_id": ctx.data.bgm ,
          //subtitle
        },
        success: (res)=>{
        let data = res.data
        console.log("success");
        //do something
        wx.navigateTo({
          url: '/pages/final/final?src=' + data.works_id
        })
        },
        fail:(res)=>{
          console.log("fail");
        }});
    }
    // wx.navigateTo({
    //   url: '../final/final',
    // });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let srcPath = getApp().globalData.srcPath;  
    let fileServer = getApp().globalData.fileServer;
    let btnSrc = getApp().globalData.btnSrc[0];
    this.setData({
      currentVideo:options.src,
      src:fileServer + 'videos/' +options.src + '/original.mp4',
      videoLength: options.length,
      btnSrc
    });
    this.getBgm();
    // console.log("videoLength=>".this.data);
    for(let i=0; i< this.data.lines.length; i++){
      this.data.lineTimes.push(this.data.lines[i].startTime);
      this.data.lineTimes.push(this.data.lines[i].endTime);
      this.data.timer.push(null);
      this.data.currentShowLine.push(null);
      this.data.cachedLines.push(JSON.parse(JSON.stringify(this.data.lines[i])));
    }
  },

  /**
   * 获取 bgm 列表
   */
  getBgm: function(){
    let ctx = this;
    utils.httpRequest(
      'https://piaxi.resetbypear.com/api/bgms',{
        method: 'GET',
        success: (res)=>{
          let bgms = res.data.data.bgms;
          let temp = [{
            id: 0,
            name: "默认"
          }];
          for (let i = 0; i < bgms.length; i++) {
            temp.push({
              id: bgms[i]["bgm_id"],
              name: bgms[i]["name"],
              duration: bgms[i]['duration']*1000
            })
          }
          console.log(temp)
          ctx.setData({
            bgmList: temp
          })
        }
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('currentVideo');
    this.audioContext = wx.getRecorderManager();
    this.bgmManager = wx.getBackgroundAudioManager();

    this.audioContext && this.audioContext.onStop((res)=>{
      const { tempFilePath } = res;
      console.log("file upload=>");
      let userInfo = getApp().globalData.userInfo;
      let ctx = this;
      //上传音频文件
      wx.uploadFile({
        url: 'https://piaxi-filer.resetbypear.com/videos/1/', //仅为示例，非真实的接口地址
        filePath: tempFilePath,
        name: userInfo+"audio",
        //上传字幕 用户信息 , 音频 id
        formData: {
          'lyrics': ctx.data.lines,
          'user': userInfo,
          'video_id': ctx.data.currentVideo,
          'bgm_id': ctx.data.bgm
        },
        success: function (res) {
          let data = res.data
          console.log("success");
          //do something
          wx.navigateTo({
            url: '/pages/final/final?src=' + data.works_id
          })
        },
        fail: function (res) {
          console.log("fail");
        }
      })
    });
  },

  /**
   * 在页面上点击播放,再点击暂停 需要有一个图标指示,思考如何放上去
   * 开始录音则不允许点击......
   */
  clickToPause: function (event) {
    console.log("pause", this.videoContext);
    //console.log("lines=>",this.data.lines[0].text);
    if (this.data.pause ){
      this.videoContext.play();
      this.setData({ pause: false });
    } else {
      this.videoContext.pause();
      this.setData({ pause: true });
    }
  },

  /**
   * 点击开始录音则
   * 1. mute & 不允许修改台词
   * 2. 字幕滚动
   * 3. 计时器
   * 4. 开始计时
   */
  startRecord: function (event) {
    //mute & 不允许修改台词
    let ctx = this;
    let data = ctx.data;
    let src = getApp().globalData.btnSrc;
    /**
     * playedTime >= videoLength
     * 跳转下一页面
     */
    if(ctx.data.playedTime>=ctx.data.videoLength){
      console.log("finished");
      //用户再次点击,询问是否放弃配音
      let start = new Date();
      ctx.setData({
        startTime: start,
        //playedTime: 0,
        lastTime: start,
        currentTime: start,
        muted: true,
        editable: false,
        btnStatus: 'play',
        btnSrc: src[2],
        jumpBtn: false
      });

      //录音结束,上传文件
      ctx.audioContext && ctx.audioContext.stop();
    }else{
      /**
      * startTime 空 初始化
      */
      if (!data.startTime) {
        let start = new Date();
        ctx.setData({
          startTime: start,
          playedTime: 0,
          lastTime: start,
          currentTime: start,
          muted: true,
          editable: false,
          btnStatus: 'play',
          srcBtn: false,
          editBtn: true,
          btnSrc: src[1],
          jumpBtn: true
        });
        ctx.videoContext.play();
        ctx.linesControl();
        // 录音开始
        ctx.audioContext && ctx.audioContext.start();
      } else {
        //判断按钮状态
        //play --> pause
        if (data.btnStatus == 'play') {
          let currentTime = new Date();
          let playedTime = data.playedTime + (currentTime - data.lastTime);
          ctx.setData({
            btnStatus: 'pause',
            btnSrc: src[0],
            currentTime,
            playedTime,
            lastTime: currentTime,
            editBtn: false,
          });
          ctx.videoContext.pause();
          ctx.clearAllTimers();

          //录音暂停
          this.audioContext && this.audioContext.pause();
          //console.log("btn status=>",ctx.data.btnSrc);
        } else if (data.btnStatus == 'pause') { // pause --> play
          ctx.setData({
            btnStatus: 'play',
            btnSrc: src[1],
            editBtn: true,
            editable: false,
            lastTime: new Date()
          });
          ctx.clearAllTimers();
          console.log("playedTime=>", data.playedTime);
          //ctx.videoContext.seek(data.playedTime/1000);
          ctx.videoContext.play();
          ctx.linesControl();

          //录音恢复
          ctx.audioContext && ctx.audioContext.resume();
        }
      }
      console.log("lineTimes=>", this.data.lineTimes);
      console.log("timer=>", ctx.data.timer);
    }
  },

  /**
   * 暂停时需要清除定时器
   */
  clearAllTimers: function(){
    console.log("clear");
    let ctx = this;
    let timer = ctx.data.timer.slice();
    timer.forEach((val) => {
      clearTimeout(val);
    });
    timer.forEach((val,index)=>{
      timer[index]=null;
    });
    this.setData({
      timer
    });
  },

  /**
   * 字幕时间调整
   */
  linesControl: function () {
    //需要 playedTime lineTimes
    let ctx = this;
    let data = ctx.data;
    let playedTime = data.playedTime;
    let timer = data.timer.slice();
    let lineTimes = data.lineTimes.slice();
    
    for(let i=0; i<lineTimes.length; i++){
      if(playedTime <= lineTimes[i]){
        ctx.clearAllTimers();
        if(i%2){ //奇数--endTime
          let gap = lineTimes[i+1] - playedTime;
          timer[(i+1)/2] = setTimeout(ctx.timerFun(i+1,ctx),gap);
          for(let j=((i+1)/2)+1; j<timer.length; j++){
              timer[j] = setTimeout(
                ctx.timerFun(j*2,ctx)
                ,ctx.data.lineTimes[j*2]-playedTime)
          }
        }else{//偶数
          let gap = lineTimes[i] - playedTime;
          timer[i/2] = setTimeout(ctx.timerFun(i,ctx), gap);
          for (let j = i/2 + 1; j < timer.length; j++) {
            timer[j] = setTimeout(
              ctx.timerFun(j*2,ctx)
              ,ctx.data.lineTimes[j*2]-playedTime);
          } 
        }
        ctx.setData({
          timer
        });
        break;
      }
    }
  },

  /**
   * 定时器函数
   * idx 是 lineTimes 的 index
   */
  timerFun: function (idx,ctx) {
    return function(){
      console.log("current time=>",new Date());
      let current = ctx.data.currentShowLine.slice();
      current.forEach((ele, index) => {
        if (index == idx / 2) {
          current[index] = "currentShowLine";
        } else {
          current[index] = null;
        }
        ctx.setData({
          currentLine: "line" + ctx.data.lineTimes[idx],
          currentShowLine: current,
        });
      });
    }
  },

  /**
   * 视频结束事件
   */
  videoEnded: function(event){
    console.log("ended=>", event.detail);
    //字幕回到初始位置
    let current = ctx.data.currentShowLine.slice();
    current.forEach((ele, index) => {
        current[index] = null;
    });
    ctx.setData({
      currentLine: "line" + ctx.data.lineTimes[0],
      currentShowLine: current
    });
    //清空 timer
    let timers = this.data.timer.slice();
    timer.forEach((val, index) => {
      clearTimeout(val);
    });
  },

  /**
   * 编辑字幕文件
   */
  editLines: function (event) {
    this.setData({ editable: !this.data.editable});
    console.log("edit=>",this.data.editable);
  },

  cancelEdit: function(event){
    this.setData({
      lines: this.data.cachedLines,
      editable: false
    });
  },

  confirmEdit: function(event){
    console.log("confirm");
    let temp = JSON.parse(JSON.stringify(this.data.lines));
    this.setData({
      editable: false,
      cachedLines: temp,
      edited: true
    });
  },

  /**
   * 处理文字输入
   */
  bindKeyInput: function (event) {
    let ctx = this;
    let index = event.currentTarget.dataset.linenumber;
    let text = event.detail.value;
    console.log("keyInput", event.currentTarget.dataset.linenumber);
    let temp = [];
    for(let i=0; i<ctx.data.lines.length; i++){
      temp.push(JSON.parse(JSON.stringify(ctx.data.lines[i])));
    }
    temp[index].text = text;
    this.setData({
      lines: temp
    });
  },

  showPanel: function(){
    this.setData({
      popPanel: (this.data.popPanel == 'invisible-panel') ? 'visible-panel' :'invisible-panel'
    });
    //停止背景音乐
    this.bgmManager && this.bgmManager.stop();
    console.log("showPanel",this.data.popPanel);
  },

  radioChange: function(event){
    let bgm = event.detail.value;
    console.log("bgm=>",bgm);
    let fileServer = getApp().globalData.fileServer;
    if(this.bgmManager){
      this.bgmManager.src=fileServer + 'bgms/' + bgm + '/bgm.mp3'
    }
    //选择 bgm
    this.setData({
      bgm
    });

    
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