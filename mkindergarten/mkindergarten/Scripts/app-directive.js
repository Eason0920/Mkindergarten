/**
 * @description 判斷目前頁面是否需要自動隱藏上方區塊
 */
app.directive('autoHideTopBar', ['$location', function ($location) {
    var obj = {};
    obj.scope = {
        autoHideTopBar: '='
    };

    obj.link = function ($scope, $element, $attr) {
        var $win = angular.element(window);

        var scrollTopAnimate = function (topPosition) {
            $element.stop().animate({ top: topPosition });
        }

        //路由改變完成
        $scope.$on('$routeChangeSuccess', function () {
            $win.on('scroll resize', function () {
                var scrollTop = $win.scrollTop();
                scrollTopAnimate(0);

                //只有首頁才需要自動顯示隱藏上方區塊
                if ($location.path() === '/') {

                    //當高度小於100時，關閉區塊	
                    if (scrollTop < 100) {
                        scrollTopAnimate(-85);
                    }
                    if (scrollTop > 100) {
                        scrollTopAnimate(0);
                    }
                }
            }).scroll();
        });
    }

    return obj;
}]);

/**
 * 行動裝置版本導覽選單
 */
app.directive('mobileNavMenu', function () {
    var obj = {};
    obj.restrict = 'AE';
    obj.transclude = true;
    obj.template = '<div class="icon" style="cursor: pointer;">\
                        <ng-transclude></ng-transclude>\
                    </div>';

    obj.link = function ($scope, $element, $attr) {

        //關閉導覽選單函式
        var closeNavMenu = function () {
            angular.element(".mobilenav").fadeOut(500);
            angular.element(".top-menu").removeClass("top-animate");
            angular.element("body").removeClass("noscroll");
            angular.element(".mid-menu").removeClass("mid-animate");
            angular.element(".bottom-menu").removeClass("bottom-animate");
        }

        //點擊選單按鈕切換導覽選單顯示與關閉
        angular.element(".icon").on('click', function (e) {
            angular.element(".mobilenav").fadeToggle(500);
            angular.element(".top-menu").toggleClass("top-animate");
            angular.element("body").toggleClass("noscroll");
            angular.element(".mid-menu").toggleClass("mid-animate");
            angular.element(".bottom-menu").toggleClass("bottom-animate");
        });

        //esc 強制關閉導覽選單
        angular.element(document).on('keydown', function (e) {
            if (e.keyCode === 27 && angular.element('body').hasClass('noscroll')) {
                closeNavMenu();
            }
        });

        //導覽選項點擊後關閉導覽選單
        angular.element('.mobilenav a').on('click', function () {
            if (angular.element('body').hasClass('noscroll')) {
                closeNavMenu();
            }
        });

        //導覽選單出現時關閉畫面的觸碰移動
        angular.element(document).on('touchmove', function (e) {
            if (angular.element('body').hasClass('noscroll')) {
                e.preventDefault();
            }
        });
    }

    return obj;
});

/**
 * @description 網站 footer 區塊
 */
//app.directive('appFooter', [function () {
//    var obj = {};
//    obj.replace = true;
//    obj.restrict = 'AE';
//    obj.template = '<section class="footer">\
//                        <p style="font-size: 1.8em; margin-bottom: 15px; line-height: 1.3em; color: #e40000;">萌學園幼兒園將打造2~12歲教育王國</p>\
//                        <p style="max-width: 1024px; margin: 0 auto 15px; auto; padding: 0 20px; font-size: 1.2em; text-align: left;">萌學園幼兒園10年一貫的教育計劃，萌學園幼兒園2～6歲的學前教育，培養寶貝生活能力自理，認知與語言、表達能力，建立正確品格發展，開發全方位藝術潛能，培養同理心，合作態度。萌學園幼兒園延伸7～12歲的小學課後教育，培養寶貝主動關懷與尊重他人，愛護自己與肯定自己，增進人際關係，萌學園幼兒園培養您寶貝獨一無二的領袖氣質。</p>\
//                        <p>萌學園招生專線：(02)2311-8000 分機：5112</p>\
//                        <p>\
//                            <a href="https://www.facebook.com/mkindergarten" target="_blank">\
//                                <img src="/Images/footer-fb.png" />\
//                            </a>\
//                            <a href="https://www.youtube.com/channel/UCV2QFy2968_IoMsFsnpkAVA" target="_blank">\
//                                <img src="/Images/footer-yt.png" />\
//                            </a>\
//                        </p>\
//                    </section>';

//    return obj;
//}]);

app.directive('appFooter', [function () {
    var obj = {};
    obj.replace = true;
    obj.restrict = 'AE';
    obj.template = '<section class="footer">\
                        <p style="font-size: 1.9em; margin-bottom: 15px; line-height: 1.3em; color: #e40000;">萌學園幼兒園將打造2~12歲教育王國</p>\
                        <div style="max-width: 1024px; margin: 0 auto 15px auto; padding: 0 20px;">\
                            <img src="/Images/topper-logo_01.png" style="float: left; margin-right: 10px;" />\
                            <p style="font-size: 1.2em; text-align: left;">萌學園幼兒園10年一貫的教育計劃，萌學園幼兒園2～6歲的學前教育，培養寶貝生活能力自理，認知與語言、表達能力，建立正確品格發展，開發全方位藝術潛能，培養同理心，合作態度。萌學園幼兒園延伸7～12歲的小學課後教育，培養寶貝主動關懷與尊重他人，愛護自己與肯定自己，增進人際關係，萌學園幼兒園培養您寶貝獨一無二的領袖氣質。</p>\
                        </div>\
                        <p>萌學園招生專線：(02)2311-8000 分機：5112</p>\
                        <p>\
                            <a href="https://www.facebook.com/mkindergarten" target="_blank">\
                                <img src="/Images/footer-fb.png" />\
                            </a>\
                            <a href="https://www.youtube.com/channel/UCV2QFy2968_IoMsFsnpkAVA" target="_blank">\
                                <img src="/Images/footer-yt.png" />\
                            </a>\
                        </p>\
                    </section>';

    return obj;
}]);