// components/Slidelines/slidelines.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lines: {
      type: Array,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 处理文字输入
     */
    bindKeyInput: function (lineNumber) {

      return function (event) {
        console.log("keyInput");
        var value = event.detail.value;
        this.setData({
          'lines[lineNumber].text': value,
        })
        console.log("lines", this.data.lines);
      }
    }
  }
})
