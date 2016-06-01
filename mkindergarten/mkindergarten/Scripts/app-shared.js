/**
 * @description 美術編輯建立的 Javascript 程式碼
 */
$(function () {

    //Smooth Page Scroll to Top
    $(window).scroll(function () {
        setTimeout(function () {
            if ($(this).scrollTop() > 150) {
                $('.scrollup').fadeIn();
            } else {
                $('.scrollup').fadeOut();
            }
        }, 500);
    });

    $('.scrollup').click(function () {
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });

    //動態
    $('#party_avatar1').sprite({ fps: 4, no_of_frames: 2 });
});

// 說明 ：用 Javascript 實現錨點(Anchor)間平滑跳轉 
// 來源 ：ThickBox 2.1 
// 整理 ：Yanfu Xie [xieyanfu@yahoo.com.cn] 
// 日期 ：07.01.17 
// 轉換為數字 
function intval(v) {
    v = parseInt(v);
    return isNaN(v) ? 0 : v;
}
// 獲取元素信息 
function getPos(e) {
    var l = 0;
    var t = 0;
    var w = intval(e.style.width);
    var h = intval(e.style.height);
    var wb = e.offsetWidth;
    var hb = e.offsetHeight;
    while (e.offsetParent) {
        l += e.offsetLeft + (e.currentStyle ? intval(e.currentStyle.borderLeftWidth) : 0);
        t += e.offsetTop + (e.currentStyle ? intval(e.currentStyle.borderTopWidth) : 0);
        e = e.offsetParent;
    }
    l += e.offsetLeft + (e.currentStyle ? intval(e.currentStyle.borderLeftWidth) : 0);
    t += e.offsetTop + (e.currentStyle ? intval(e.currentStyle.borderTopWidth) : 0);
    return { x: l, y: t, w: w, h: h, wb: wb, hb: hb };
}
// 獲取滾動條信息 
function getScroll() {
    var t, l, w, h;
    if (document.documentElement && document.documentElement.scrollTop) {
        t = document.documentElement.scrollTop;
        l = document.documentElement.scrollLeft;
        w = document.documentElement.scrollWidth;
        h = document.documentElement.scrollHeight;
    } else if (document.body) {
        t = document.body.scrollTop;
        l = document.body.scrollLeft;
        w = document.body.scrollWidth;
        h = document.body.scrollHeight;
    }
    return { t: t, l: l, w: w, h: h };
}
// 錨點(Anchor)間平滑跳轉 
function scroller(el, duration) {
    if (typeof el != 'object') { el = document.getElementById(el); }
    if (!el) return;
    var z = this;
    z.el = el;
    z.p = getPos(el);
    z.s = getScroll();
    z.clear = function () { window.clearInterval(z.timer); z.timer = null };
    z.t = (new Date).getTime();
    z.step = function () {
        var t = (new Date).getTime();
        var p = (t - z.t) / duration;
        if (t >= duration + z.t) {
            z.clear();
            window.setTimeout(function () { z.scroll(z.p.y, z.p.x) }, 13);
        } else {
            st = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (z.p.y - z.s.t) + z.s.t;
            sl = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (z.p.x - z.s.l) + z.s.l;
            z.scroll(st, sl);
        }
    };
    z.scroll = function (t, l) { window.scrollTo(l, t) };
    z.timer = window.setInterval(function () { z.step(); }, 13);
}

//v3.0
function MM_jumpMenu(targ, selObj, restore) { //v3.0
    eval(targ + ".location='" + selObj.options[selObj.selectedIndex].value + "'");
    if (restore) selObj.selectedIndex = 0;
}