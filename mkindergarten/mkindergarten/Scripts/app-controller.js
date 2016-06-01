/**
 * @description 外層框架控制器
 */
app.controller('homeCtrl', ['$scope', '$location', '$timeout', '$rootScope',
    function ($scope, $location, $timeout, $rootScope) {

        //選單按鈕
        $scope.menuClick = function (path) {
            $location.url(path);
        }
    }]);

/**
 * @description 首頁控制器
 */
app.controller('indexCtrl', ['$scope', 'ajax', 'APP_CONSTANT', '$rootScope',
    function ($scope, ajax, APP_CONSTANT, $rootScope) {

        //是否隱藏上方 header bar
        $rootScope.autoHideTopBar = true;

        //存放輪播圖片資訊陣列
        $scope.sliders = [];

        //取得所有輪播資訊
        var getAllSliders = function () {
            ajax.get(APP_CONSTANT.GET_SLIDERS_ACTION)
                .then(function (response) {
                    if (response.status === 200) {
                        if (response.data.result >= 0) {
                            $scope.sliders = response.data.data;
                        } else {        //存取資料庫發生錯誤
                            //alert('【取得輪播資訊發生錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                            alert('【取得輪播資訊發生錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + APP_CONSTANT.SYSTEM_UNKNOWN_ERROR);
                        }
                    } else {        //網路傳輸失敗
                        //alert('【取得輪播資訊發生錯誤！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                        alert('【取得輪播資訊發生錯誤！】\r\nresult: ' + response.status + '\r\nmessage: ' + APP_CONSTANT.SYSTEM_UNKNOWN_ERROR);
                    }
                });
        }

        //flickity 輪播 UI 設定參數
        $scope.flickitySettings = {
            autoPlay: true,
            wrapAround: true,
            lazyLoad: true
        };

        //#region *** 預先執行 ***

        getAllSliders();

        //#endregion

    }]);

/**
 * @description 據點分佈控制器
 */
app.controller('locationCtrl', ['$scope', 'APP_CONSTANT', 'geoService', '$rootScope', 'appService', '$timeout', 'gMapService', '$window',
function ($scope, APP_CONSTANT, geoService, $rootScope, appService, $timeout, gMapService, $window) {

    //判斷來源裝置取得地圖縮放比例
    var getMapZoomByDevice = function () {
        return (($rootScope.isMobileDevice) ? APP_CONSTANT.DEFAULT_GMAP_ZOOM.MOBILE : APP_CONSTANT.DEFAULT_GMAP_ZOOM.WEB);
    }

    //設定地圖標記緯經度資訊
    var setMarkers = function (sourceArray) {

        //儲存所屬縣市園所標記資訊陣列
        $scope.markers = [];

        //重新設定地圖縮放比例(電腦與行動裝置縮放級距不同)
        $scope.gMap.zoom = getMapZoomByDevice();

        if (sourceArray) {
            for (var i in sourceArray) {
                var marker = {
                    template_html: 'map-window.html',
                    id: sourceArray[i].id,      //園所編號
                    latitude: sourceArray[i].lat,       //緯度
                    longitude: sourceArray[i].lng,       //經度
                    name: sourceArray[i].name,      //園所名稱
                    link: sourceArray[i].link,      //園所連結
                    tel: sourceArray[i].tel,        //園所電話
                    address: $rootScope.getCityNameById(sourceArray[i].city_id) + sourceArray[i].add,       //園所地址
                    intro_image: sourceArray[i].intro_image,        //環境介紹圖片
                    is_mobile: (($rootScope.isMobileDevice) ? true : false),
                    show: false,        //園所資訊視窗顯示開關,
                    events: {       //標記事件
                        mouseover: function (marker, eventName, model) {
                            if (!$rootScope.isMobileDevice) {
                                $timeout(function () {
                                    model.show = true;
                                });
                            }
                        },
                        mouseout: function (marker, eventName, model) {
                            if (!$rootScope.isMobileDevice) {
                                $timeout(function () {
                                    model.show = false;
                                });
                            }
                        },
                        click: function (marker, eventName, model) {
                            if (!$rootScope.isMobileDevice) {       //電腦
                                $window.open(model.link, '_blank');
                            } else {        //行動裝置

                                //關閉目前點擊標記以外的視窗資訊
                                for (var idx in $scope.markers) {
                                    var m = $scope.markers[idx];
                                    if (m.id !== model.id) {
                                        m.show = false;
                                    }
                                }
                            }
                        }
                    }
                };

                $scope.markers.push(marker);
            }

            //若該縣市園所數量只有一間，拉近地圖預設值4級距縮放比例，並將該園所位置移至地圖中心點
            if ($scope.markers.length === 1) {
                $scope.gMap.zoom += 4;
                $scope.gMap.center = {
                    latitude: $scope.markers[0].latitude,
                    longitude: $scope.markers[0].longitude
                };
            }
        }
    }

    //依據縣市名稱取得相對應的縣市編號
    var getCityIdByName = function (city_name) {
        var cityId;
        if ($rootScope.citysWithCompanyCount) {
            for (var idx in $rootScope.citysWithCompanyCount) {
                if ($rootScope.citysWithCompanyCount[idx].name === city_name) {
                    cityId = $rootScope.citysWithCompanyCount[idx].id;
                    break;
                }
            }
        }

        return cityId;
    }

    //依據傳入的地址尋找縣市名稱
    var getCityNameByAddress = function (address) {
        var cityName;
        for (var i in $rootScope.citysWithCompanyCount) {
            if (address.indexOf(APP_CONSTANT.TAIWAN_CITY_PREFIX + $rootScope.citysWithCompanyCount[i].name) > -1) {
                cityName = $rootScope.citysWithCompanyCount[i].name;
                break;
            }
        }

        return cityName;
    }

    //取得使用者所在位置縣市資料，並依據縣市取得相對應的園所資訊
    var getUserPosition = function () {

        //取得使用者目前緯經度
        geoService.getGeoLatLng().then(function (response) {

            //緯經度轉換為地址資訊
            gMapService.latlng2GeoInfo(response.lat, response.lng)
            .then(function (response) {

                //取得地址內的縣市名稱
                var cityName = getCityNameByAddress(response[0].formatted_address);
                if (cityName) {

                    //依據縣市名稱取得縣市編號
                    var cityId = getCityIdByName(cityName);

                    //若使用者所在縣市與預設縣市不相同才進行地圖處理
                    if (cityId && cityId !== $scope.citySelectId) {
                        $scope.citySelectId = cityId;

                        //要求所屬縣市園所資訊並進行地圖處理
                        $scope.cityChange();
                    }
                }
            }, function (error) {
                //alert('【轉換使用者所在位置發生錯誤！】\r\nmessage: ' + error);
            });
        });
    }

    //是否隱藏上方 header bar
    $rootScope.autoHideTopBar = false;

    //儲存所屬縣市園所標記資訊陣列
    $scope.markers = [];

    //使用者所選擇的縣市編號
    $scope.citySelectId = APP_CONSTANT.DEFAULT_CITY_ID;

    //初始化地圖縮放比例(電腦與行動裝置縮放級距不同)
    $scope.gMap = {
        zoom: getMapZoomByDevice()
    };

    //載入選擇的縣市園所資料
    $scope.cityChange = function () {

        //地址轉換緯經度移動地圖中心至所選擇的縣市(縣市名稱需加入台灣省，以免查詢錯誤)
        var cityName = APP_CONSTANT.TAIWAN_CITY_PREFIX + $rootScope.getCityNameById($scope.citySelectId);
        if (cityName) {
            gMapService.addr2GeoInfo(cityName).then(function (response) {
                $scope.gMap.center = {
                    latitude: response.geometry.location.lat(),
                    longitude: response.geometry.location.lng()
                };

                //利用選擇的縣市編號取得所屬區域園所資訊並設置標記
                appService.getCompanysByCity($scope.citySelectId)
                .then(function (response) {
                    setMarkers(response);
                }, function (error) {
                    alert(error);
                });

            }, function (error) {
                alert('【查詢園所據點發生錯誤！】\r\nmessage: ' + error);
            });
        } else {
            alert('【查詢園所據點發生錯誤！】\r\nmessage: 縣市編號無對應縣市名稱');
        }

        //移動畫面至頂
        angular.element('html, body').scrollTop(0);
    }

    //#region *** 預先執行 ***

    $timeout(function () {
        //預先載入一次預設縣市分園資訊
        $scope.cityChange();

        //取得使用者所在位置
        getUserPosition();
    }, 500);

    //#endregion

}]);

/**
 * @description 人才招募控制器
 */
app.controller('recruitCtrl', ['$scope', 'ajax', 'APP_CONSTANT', '$rootScope',
    function ($scope, ajax, APP_CONSTANT, $rootScope) {

        //是否隱藏上方 header bar
        $rootScope.autoHideTopBar = false;

        //存放招募職務資訊陣列
        $scope.recruitJobs = [];

        //取得招募職務資訊
        var getRecruitJobs = function () {
            ajax.get(APP_CONSTANT.GET_RECRUIT_JOBS_ACTION)
                .then(function (response) {
                    if (response.status === 200) {
                        if (response.data.result === 1) {
                            $scope.recruitJobs = response.data.data;
                        } else if (response.data.result === 0) {
                            alert('【取得招募職務資訊發生錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: 無招募職務資訊');
                        } else {        //存取資料庫發生錯誤
                            //alert('【取得招募職務資訊發生錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                            alert('【取得招募職務資訊發生錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + APP_CONSTANT.SYSTEM_UNKNOWN_ERROR);
                        }
                    } else {        //網路傳輸失敗
                        //alert('【取得招募職務資訊發生錯誤！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                        alert('【取得招募職務資訊發生錯誤！】\r\nresult: ' + response.status + '\r\nmessage: ' + APP_CONSTANT.SYSTEM_UNKNOWN_ERROR);
                    }
                });
        }

        //#region *** 預先執行 ***

        getRecruitJobs();

        //#endregion

    }]);

/**
 * @description 職務招募園所控制器
 */
app.controller('recruitListCtrl', ['$scope', 'ajax', 'APP_CONSTANT', '$routeParams', '$rootScope',
    function ($scope, ajax, APP_CONSTANT, $routeParams, $rootScope) {

        //是否隱藏上方 header bar
        $rootScope.autoHideTopBar = false;

        //存放招募職務園所資訊陣列
        $scope.recruitJobCompanys = [];

        //存放招募職務名稱
        $scope.recruitJobName = '目前尚無園所招募此職缺';

        //取得招募職務資訊
        var getRecruitJobCompanys = function () {

            //預防職務編號非數字的錯誤
            if (!isNaN(parseInt($routeParams.job_kind_id, 10))) {
                ajax.get(APP_CONSTANT.GET_RECRUIT_JOB_COMPANYS_ACTION, { job_kind_id: $routeParams.job_kind_id })
                .then(function (response) {
                    if (response.status === 200) {
                        if (response.data.result >= 0) {
                            if (response.data.result === 1) {
                                $scope.recruitJobCompanys = response.data.data;

                                //取得第一筆招募職務名稱(手機版用)
                                $scope.recruitJobName = $scope.recruitJobCompanys[0].job_kind_name;
                            }

                        } else {        //存取資料庫發生錯誤
                            //alert('【取得招募職務園所資訊發生錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                            alert('【取得招募職務園所資訊發生錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + APP_CONSTANT.SYSTEM_UNKNOWN_ERROR);
                        }
                    } else {        //網路傳輸失敗
                        //alert('【取得招募職務園所資訊發生錯誤！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                        alert('【取得招募職務園所資訊發生錯誤！】\r\nresult: ' + response.status + '\r\nmessage: ' + APP_CONSTANT.SYSTEM_UNKNOWN_ERROR);
                    }
                });
            }
        }

        //#region *** 預先執行 ***

        getRecruitJobCompanys();

        //#endregion

    }]);