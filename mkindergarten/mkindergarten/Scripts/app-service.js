app.factory('appService', ['$q', 'ajax', 'APP_CONSTANT',
    function ($q, ajax, APP_CONSTANT) {

        /**
         * @description 取得所有縣市資料
         */
        var getCitysWithCompanyCount = function () {
            var defer = $q.defer();

            ajax.get(APP_CONSTANT.GET_CITYS_WITH_COMPANY_COUNT_ACTION)
                .then(function (response) {
                    if (response.status === 200) {
                        if (response.data.result === 1) {
                            defer.resolve(response.data.data);
                        } else if (response.data.result === 0) {
                            defer.reject('【初始化縣市資訊錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: 無縣市資訊');
                        } else {
                            //defer.reject('【初始化縣市資訊錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                            defer.reject('【初始化縣市資訊錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + APP_CONSTANT.SYSTEM_UNKNOWN_ERROR);
                        }
                    } else {
                        //defer.reject('【初始化縣市資訊錯誤！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                        defer.reject('【初始化縣市資訊錯誤！】\r\nresult: ' + response.status + '\r\nmessage: ' + APP_CONSTANT.SYSTEM_UNKNOWN_ERROR);
                    }
                });

            return defer.promise;
        }

        /**
         * @description 依據縣市編號取得分園資訊
         * @param city_id - 縣市編號
         */
        var getCompanysByCity = function (city_id) {
            var defer = $q.defer();

            ajax.get(APP_CONSTANT.GET_COMPANYS_ACTION, { city_id: city_id })
                .then(function (response) {
                    if (response.status === 200) {
                        if (response.data.result >= 0 ) {
                            defer.resolve(response.data.data);
                        } else {        //存取資料庫發生錯誤
                            //defer.reject('【查詢園所資訊發生錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                            defer.reject('【查詢園所資訊發生錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + APP_CONSTANT.SYSTEM_UNKNOWN_ERROR);
                        }
                    } else {        //網路傳輸失敗
                        //defer.reject('【查詢園所資訊發生錯誤！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                        defer.reject('【查詢園所資訊發生錯誤！】\r\nresult: ' + response.status + '\r\nmessage: ' + APP_CONSTANT.SYSTEM_UNKNOWN_ERROR);
                    }
                });

            return defer.promise;
        }

        return {
            getCitysWithCompanyCount: getCitysWithCompanyCount,
            getCompanysByCity: getCompanysByCity
        }
    }]);