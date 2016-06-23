var app = angular.module('app', ['ngRoute', 'toolsServiceModule', 'uiDirectiveModule', 'uiGmapgoogle-maps',
    'geoLocationServiceModule', 'ngSanitize', 'ngAnimate', 'gaServiceModule']);

app.constant('APP_CONSTANT', {
    GET_CITYS_WITH_COMPANY_COUNT_ACTION: 'ajax/Home/getCitysWithCompanyCountAction',
    GET_SLIDERS_ACTION: 'ajax/Home/getSlidersAction',
    GET_COMPANYS_ACTION: 'ajax/Home/getCompanysAction',
    GET_RECRUIT_JOBS_ACTION: 'ajax/Home/getRecruitJobsAction',
    GET_RECRUIT_JOB_COMPANYS_ACTION: 'ajax/Home/getRecruitJobCompanysAction',
    GOOGLE_ANALYTICS_CODE: 'UA-26952180-19',
    TAIWAN_CITY_PREFIX: '台灣',
    DEFAULT_CITY_ID: 1,     //預設地圖中心點為台北市
    DEFAULT_GMAP_ZOOM: { WEB: 12, MOBILE: 11 },       //預設地圖縮放大小
    SYSTEM_UNKNOWN_ERROR: '系統發生未知的錯誤，請稍後再試'
});

//模組設定區
app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {

        //$locationProvider.hashPrefix('!');

        //開啟 Html5 模式
        $locationProvider.html5Mode(true);

        //設定路由
        $routeProvider.when('/', {      //首頁
            templateUrl: '/Html/index.html',
            controller: 'indexCtrl',
            //reloadOnSearch: false
        }).when('/intro', {      //什麼是萌學園
            templateUrl: '/Html/intro.html',
            //reloadOnSearch: false
        }).when('/plan', {      //萌學園教學規劃
            templateUrl: '/Html/plan.html',
            //reloadOnSearch: false
        }).when('/location', {      //據點分佈
            templateUrl: '/Html/location.html',
            controller: 'locationCtrl',
            //reloadOnSearch: false
        }).when('/recruit', {      //人才招募
            templateUrl: '/Html/recruit.html',
            controller: 'recruitCtrl',
            //reloadOnSearch: false
        }).when('/recruit/:job_kind_id', {      //職務招募園所
            templateUrl: '/Html/recruit-list.html',
            controller: 'recruitListCtrl',
            //reloadOnSearch: false
        }).otherwise({      //預設
            redirectTo: '/'
        });
    }]);

app.run(['$rootScope', 'appService', '$animate', 'tool', '$location', 'APP_CONSTANT', 'ga',
    function ($rootScope, appService, $animate, tool, $location, APP_CONSTANT, ga) {

        //#region *** 全域公用資料模型 ***

        //是否需要自動隱藏上方區塊判斷變數
        $rootScope.autoHideTopBar = true;

        //是否為行動裝置瀏覽
        $rootScope.isMobileDevice = tool.isMobileDevice();

        //目前的 url 路徑
        $rootScope.currentUrlPath = null;

        //各頁面標題
        $rootScope.pageTitle = null;

        //ajax 是否完成註記
        $rootScope.bodyAjaxStatus = 'wait';

        //#endregion

        //#region *** 全域公用函式 ***

        //利用縣市編號取得縣市名稱
        $rootScope.getCityNameById = function (id) {
            var cityName = '';
            if ($rootScope.citysWithCompanyCount) {
                for (var idx in $rootScope.citysWithCompanyCount) {
                    if ($rootScope.citysWithCompanyCount[idx].id === id) {
                        cityName = $rootScope.citysWithCompanyCount[idx].name;
                        break;
                    }
                }
            }

            return cityName;
        }

        //#endregion

        //#region *** 應用程式首次啟動載入 ***

        //啟動 google analytics 追蹤
        ga.openTracking(APP_CONSTANT.GOOGLE_ANALYTICS_CODE);

        //預先載入所有縣市資料
        appService.getCitysWithCompanyCount()
            .then(function (response) {
                $rootScope.citysWithCompanyCount = response;
            }, function (response) {
                alert(response);
            });

        //路由改變完成事件
        //$rootScope.$on('$routeChangeStart', function (angularEvent, next, current) {

        //});

        //路由改變完成事件
        $rootScope.$on('$routeChangeSuccess', function (angularEvent, current, previous) {

            //目前 url 路徑
            $rootScope.currentUrlPath = $location.path();
            
            //切換頁面後先將 ajax 註記初始化(除了什麼是萌學園、萌學園幼兒園頁面除外，這兩個頁面沒有使用 ajax)
            $rootScope.bodyAjaxStatus = (($rootScope.currentUrlPath.toLowerCase() != '/intro' &&
                                          $rootScope.currentUrlPath.toLowerCase() != '/plan') ? 'wait' : 'success');

            //移動畫面至頂
            angular.element('html, body').scrollTop(0);
            
            switch ($rootScope.currentUrlPath) {
                case '/':
                    $rootScope.pageTitle = '萌學園幼兒園';
                    break;
                case '/intro':
                    $rootScope.pageTitle = '萌學園幼兒園 - 什麼是萌學園';
                    break;
                case '/plan':
                    $rootScope.pageTitle = '萌學園幼兒園 - 萌學園幼兒園';
                    break;
                case '/location':
                    $rootScope.pageTitle = '萌學園幼兒園 - 據點分佈';
                    break;
                case '/recruit':
                    $rootScope.pageTitle = '萌學園幼兒園 - 人才招募';
                    break;
            }
        });

        //#endregion
    }]);
