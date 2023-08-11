var page = {
  fullscreen: false,
  timer: null,
  gradation:1,
  showSidebar:true,
  canPress: true,
  time:{
    sub:300,
    section1:60,
    section2:240,
   // section3:60
  },
  init: function(){
    this.tab($('.sidebar ul li:first-child'));
    this.bindEvent();
  },
  // 时间绑定
  bindEvent: function(){
    var _this = this;
    // 全屏切换
    var oTscreen = document.getElementById('tab-screen');
    oTscreen.onclick = function (){
      _this.fullScreen(oTscreen);
    };
    // 点击切换版本
    $(document).on('click','.sidebar ul li',function(){
      var $version = $(this).attr('version');
      var $ele = $(this);
      _this.tab($ele,$version);
    });
    // 按空格开始倒计时，按回车重制时间
    $(document).keyup(function(e){
      e.preventDefault();
      if(e.keyCode===32&&_this.canPress){
        if(_this.gradation>3){
          _this.gradation=1;
          _this.play($('.start').get(0));
          _this.canPress = false;
          setTimeout(function(){
            _this.startTime();
          },3500) 
        }else{
          _this.play($('.start').get(0));
          _this.canPress = false;
          setTimeout(function(){
            _this.startTime();
          },3500)
        } 
      };
       if(e.keyCode===13){
        _this.gradation=1;
         $('.section-title').text('')
         clearInterval(_this.timer)
         _this.canPress = true;
         $('.time-item,.sub-itme').text('00')
       };
      //if(e.keyCode===83){
       // if(_this.showSidebar){
       //   $('.sidebar').show();
       //   _this.showSidebar = false;
       // }else{
       //   $('.sidebar').hide();
       //   _this.showSidebar = true;
        //}
      //}
    });
  },
  // 全屏
  fullScreen: function(ele){
    var element = document.documentElement;
    if (this.fullscreen) {
      ele.style.backgroundPosition = '0 0';
      ele.title = "全屏显示";
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
      }
    } else {
      ele.style.backgroundPosition = '0 -30px';
      ele.title = "退出全屏"
      if (element.requestFullscreen) {
         element.requestFullscreen()
      } else if (element.webkitRequestFullScreen) {
         element.webkitRequestFullScreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        // IE11
        element.msRequestFullscreen()
      }
    }
    this.fullscreen = !this.fullscreen;
  },
  // 切换版本
  tab: function(ele,v){
    this.gradation = 1;
    ele.addClass('tab');
    ele.siblings().removeClass('tab');
    if(v==1){
      $('.main').attr('class','main');
      this.time = {
        sub:360,
        section1:60,
        section2:300,
        //section3:60
      };
    }else if(v==2){
      $('.main').attr('class','main lyxj');
      this.time = {
        sub:240,
        section1:60,
        section2:120,
        section3:60
      };
    }else if(v==3){
      $('.main').attr('class','main jmzqs');
      this.time = {
        sub:240,
        section1:60,
        section2:120,
        section3:60
      };
    }else if(v==4){
      $('.main').attr('class','main jmzqs');
      this.time = {
        sub:480,
        section1:120,
        section2:240,
        section3:120
      };
    }
  },
  // 重置时间
  reSetTime: function(){
    var subM = parseInt(this.time.sub/60).toString().replace(/^(\d)$/,'0$1');
    var subS = (this.time.sub%60).toString().replace(/^(\d)$/,'0$1');
    var sectionM = parseInt((this.time.section1)/60).toString().replace(/^(\d)$/,'0$1');
    var sectionS = (this.time.section1%60).toString().replace(/^(\d)$/,'0$1');
    $('.sub-time .sub-min').text(subM);
    $('.sub-time .sub-s').text(subS);
    $('.count-down .minute').text(sectionM);
    $('.count-down .second').text(sectionS);
  },
  // 设置阶段时间
  setSectionTime: function(time){
    var sectionM = parseInt(time/60).toString().replace(/^(\d)$/,'0$1');
    var sectionS = (time%60).toString().replace(/^(\d)$/,'0$1');
    $('.count-down .minute').text(sectionM);
    $('.count-down .second').text(sectionS);
  },
  // 开始倒计时{
  startTime: function(){
    var _this = this;
    if(_this.gradation===1){
      _this.reSetTime()
      $('.section-title').text('灾后救援阶段')
      $('.end-audio').attr('src','./static/section1&2.mp3')
    }else if(_this.gradation===2){
      _this.setSectionTime(_this.time.section2)
      $('.section-title').text('信号发射阶段')
      $('.end-audio').attr('src','./static/section3.mp3')
    }
	//else if(_this.gradation===3){
    //  _this.setSectionTime(_this.time.section3)
    //  $('.section-title').text('全力冲刺')
     // $('.end-audio').attr('src','./static/section3.mp3')
    //}
    var sectionM = $('.minute');
    var sectionS = $('.second');
    var subM = $('.sub-min');
    var subS = $('.sub-s');
    clearInterval(this.timer);
    this.timer = setInterval(function(){
      _this.changeTime(subM,subS);
      _this.changeTime(sectionM,sectionS);
    },1000);
  },
  // 倒计时
  changeTime: function(m,s){
    var subTime = parseInt(m.text().replace(/^0/,'')) * 60 + parseInt(s.text().replace(/^0/,''));
    var ruleTime = parseInt($('.minute').text().replace(/^0/,'')) * 60 + parseInt($('.second').text().replace(/^0/,''));
    if(ruleTime==9){
      this.play($('.end-audio').get(0))
    }
    if(ruleTime<=0){
      clearInterval(this.timer);
      this.canPress = true;
      if(subTime<=0){ // 此处需用通用的总时间做判断，否则阶段计时和总时间计时皆会执行gradation递增一次，造成增加两次。
        this.gradation++;
      }      
    }else{
      subTime--;
      var minute = parseInt(subTime / 60).toString().replace(/^(\d)$/,'0$1');
      m.text(minute);
      var second = parseInt(subTime % 60).toString().replace(/^(\d)$/,'0$1');
      s.text(second);
    }
  },
  // 播放音频
  play: function(au){
    if(au){
      au.play();
    } 
  }
};

$(function(){
  console.log('按S键切换版本选择按钮的显示和隐藏，按空格键开始计时，按回车键重置时间。在倒计时进行中按空格键将无效，在倒计时进行中按回车键将重置时间并回到第一阶段。')
  page.init();
})