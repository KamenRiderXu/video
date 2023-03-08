var videoList = [];
var page = 1;
var flag = 0;
var mySwiper = new Swiper('.swiper', {
	initialSlide: 1,
	direction: 'vertical', // 垂直切换选项 
	loop: true, // 循环模式选项
	// slidesPerView: 'auto',
	//init: false, //创建Swiper时是否立即初始化
	on: {
		//切换结束时触发的事件
		slideChangeTransitionEnd: function(){			
			// 让所有play按钮处于暂停状态
			$(".play").removeClass("playing")
			// 触发当前slide的play按钮的点击事件
			$(".play").eq(this.activeIndex).trigger("click")
		},
		reachEnd: function(){
			flag += 1;
			if(flag == 0 || flag == 1) return
			page++;
			getVideoList(page, 10, function(data) {
				//videoList = videoList.splice(0,10,[...data.result.list])
				// videoList = videoList.concat(data.result.list);
				// console.log(videoList);
				//videoList = data.result.list;
				// 遍历videoList ,创建swiper-slide,将创建好的arr添加到swiper_w中
				data.result.list.forEach(function(item, index, arr) {
					var swiperSlide = $(
						`<div class="swiper-slide">
							<div class="video_box">
								<div class="video_title">${item.title}</div>
								<div class="video_warp"><video src="${item.playurl}" poster="${item.picurl}"></video></div>
								<div class="video_name">${item.alias}</div>
								<div class="play" ></div>
							</div>
						</div>`)
					//$(".swiper-wrapper").append(swiperSlide)
					mySwiper.appendSlide(swiperSlide)
					console.log(mySwiper,'mySwiper');
				})	
				//当swiperSlide添加到页面完毕后，初始化swiper
				//mySwiper.init()
			})
		},
	}
})

//1.发送请求，将请求到的数据动态创建出来，渲染到页面上。
getVideoList(page, 10, function(data) {
	flag++
	//console.log(data,'data'); 
	// videoList = data.result.list
	// 遍历videoList ,创建swiper-slide,将创建好的arr添加到swiper_w中
	data.result.list.forEach(function(item, index, arr) {
		var swiperSlide = $(
			`<div class="swiper-slide">
				<div class="video_box">
					<div class="video_title">${item.title}</div>
					<div class="video_warp"><video src="${item.playurl}" poster="${item.picurl}" loop="loop" autoplay="false"></video></div>
					<div class="video_name">${item.alias}</div>
					<div class="play" ></div>
				</div>
			</div>`)	
		//$(".swiper-wrapper").append(swiperSlide)
		mySwiper.appendSlide(swiperSlide)
	})
	//当swiperSlide添加到页面完毕后，初始化swiper
	//mySwiper.init()
})

//2.通过事件委托，给播放按钮绑定点击事件
$(".swiper-wrapper").on("click",".play",function() {
	// 0.让其他视频暂停
	$("video").each(function(index,video) {
		video.pause()
	})
	// 1.隐藏play按钮
	$(this).toggleClass("playing")
	// 2.找到play按钮对应的video标签 让视频进行播放
	var video = $(this).prevAll(".video_warp").children("video").get(0)
	if($(this).hasClass("playing")){
		video.play()
	}else{
		video.pause()
		// 显示play按钮
	}

	var _this = this

	// 监听当前视频播放结束的事件
	$(video).on("ended",function() {
		$(_this).trigger("click")
	})
})

//封装发送ajax请求方法
function getVideoList(page, size, callback) {
	//创建xhr对象
	var xhr = new XMLHttpRequest()
	//配置请求参数
	xhr.open("GET", `https://api.apiopen.top/api/getMiniVideo?page=${page}&size=${size}`)
	//发送请求
	xhr.send()
	//监听事件 拿到返回数据
	xhr.onload = () => {
		if (xhr.status >= 200 && xhr.status < 300) {
			var data = JSON.parse(xhr.responseText)
			//判断callback是否存在 然后返回
			callback && callback(data)
		}
	}
}
