window.onload = function () {

    //头部搜索功能
    searchEffect();
    //轮播图效果
    bannerEffect();




}

function searchEffect() {
    var banner = document.querySelector(".jd_banner");
    var bannerH = banner.offsetHeight;
    var search = document.querySelector(".jd_search");
    var opactiy = 0;
    window.onscroll = function () {
        var offsetTop = document.body.scrollTop || document.documentElement.scrollTop;
        console.log(offsetTop);
        console.log(bannerH);

        if (offsetTop < bannerH) {
            opactiy = offsetTop / bannerH;
            if (opactiy > 0.8) {
                opactiy = 0.8;
            }
            search.style.backgroundColor = "rgba(225,30,30," + opactiy + ")";
        } else {
            opactiy = 0.8
        }

    }
}

function bannerEffect() {
    var banner = document.querySelector(".jd_banner");
    var banner_ul = document.querySelector(".jd_banner ul:first-child");
    var lis_first = banner.querySelector("li:first-of-type");
    var lis_last = banner.querySelector("li:last-of-type");
    var bannerW = banner.offsetWidth;
    /* 给ul前后添加li保证轮播完全 */
    banner_ul.insertBefore(lis_last.cloneNode(true), lis_first);
    banner_ul.appendChild(lis_first.cloneNode(true));
    /* 重置banner和li的宽度 */
    var lis = banner_ul.querySelectorAll("li");
    var count_li = lis.length;
    banner_init();

    function banner_init() {
        banner_ul.style.width = bannerW * count_li + "px";
        for (i = 0; i < lis.length; i++) {
            lis[i].style.width = bannerW + "px";
        }
        banner_ul.style.left = -bannerW + "px";
    }

    //窗口变化重置banner宽度
    window.onresize = function () {
        // banner的宽度 覆盖全局的宽度值
        bannerW = banner.offsetWidth;
        banner_init();
    }
    //图片轮播
    var index = 1;
    var timeID;
    startTime();

    function startTime() {
        timeID = setInterval(function () {
            index++;
            banner_ul.style.left = (-index * bannerW) + "px";
            banner_ul.style.transition = "left 0.5s ease-in-out";
            setTimeout(function () {
                if (index >= count_li - 1) {
                    index = 1;
                    banner_ul.style.transition = "none";
                    banner_ul.style.left = (-index * bannerW) + "px";
                }
            }, 500);
        }, 1500);
    }
    //图片控制器轮播


    var setControl = function (index) {
        var jd_bannerControl_lis = document.querySelectorAll(".jd_banner_control>li");
        for (i = 0; i < jd_bannerControl_lis.length; i++) {
            jd_bannerControl_lis[i].classList.remove("current");
        }
        jd_bannerControl_lis[index - 1].classList.add("current");
    }
    //单页轮播动画结束时完成 控制器轮播动画
    banner_ul.addEventListener("webkitTransitionEnd", function () {
        setControl(index);
        clearInterval(timeID);
        startTime();
    });

    //触摸滑动
    var startX, moveX, distanceX, startX_time, moveX_time;
    banner_ul.addEventListener("touchstart", function (event) {
        startX = event.touches[0].clientX;
        startX_time = new Date();
        clearInterval(timeID);
    });
    banner_ul.addEventListener("touchmove", function (event) {
        clearInterval(timeID);
        moveX = event.touches[0].clientX;
        distanceX = moveX - startX;
        moveX_time = new Date() - startX_time;
        banner_ul.style.transition = "none";
        banner_ul.style.left = (-index * bannerW + distanceX) + "px";
    });

   /* 传递参数方法：
    var some;
    element.addEventListener('mouseover', function (event) {
        fn(event, some);
    }, false);

    function fn(event, some) {
        alert(some)
    } */
    banner_ul.addEventListener("touchend", function () {
        //手指向左滑动
        if (distanceX < (-bannerW / 2) || (distanceX < -30 && moveX_time < 200)) {
            index++;
        } else if (distanceX > bannerW / 2 || (distanceX > 30 && moveX_time < 200)) {
            index--;
        } else {
            console.log("滑动失败");
        }
        banner_ul.style.transition = "left 0.5s ease-in-out";
        banner_ul.style.left = (-index * bannerW) + "px";
        console.log(index);
        setTimeout(function () {
            if (index >= count_li - 1) {
                index = 1;
                banner_ul.style.transition = "none";
                banner_ul.style.left = (-index * bannerW) + "px";
                startTime(); //应对联系两次快速滑动，最后一张和第一张因为没有transiton动画而无法触发轮播
            } else if (index < 1) {
                index = 8;
                banner_ul.style.transition = "none";
                banner_ul.style.left = (-index * bannerW) + "px";
                startTime();
            }
        }, 500);
        
    });
}