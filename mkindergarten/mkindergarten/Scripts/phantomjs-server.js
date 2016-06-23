var system = require('system');
var url = system.args[1] || '';     //傳入參數一： 要抓取 html 的網址參數
var defaultValue = system.args[2] || '';     //傳入參數二： 預設沒有抓到 html 時的回傳字串
var count = 100;        //setInterval 限執行次數 100*100 = 10秒

if (url.length > 0) {
    var page = require('webpage').create();
    page.open(url, function (status) {
        if (status === 'success') {

            //取得回應HTML並檢測AJAX(JS)是否已完成 
            var interval, checker = (function () {
                var html = page.evaluate(function () {
                    var bodys = document.getElementsByTagName('body');
                    if (bodys.length > 0) {
                        var body = bodys[0];

                        //如果 <body> 的 data-ajax-status 屬性值是 "success" 表示 AJAX(JS) 已完成 (angular controller 須寫回應完成) 
                        if (body.getAttribute('data-ajax-status') === 'success') {
                            return document.getElementsByTagName('html')[0].outerHTML;
                        }
                    }
                });

                if (html) {     //有取得 html 資料
                    clearInterval(interval);
                    system.stdout.write(html);      //輸出 html 內容 stream
                    phantom.exit();
                } else {        //無取得 html 資料，重新執行 setInterval

                    //執行次數遞減1
                    count--;
                    if (count <= 0) {       //如果限執行次數 <= 0
                        clearInterval(interval);
                        system.stdout.write(defaultValue);      //無法取得 html 內容，輸出傳入預設值參數
                        phantom.exit();
                    }
                }
            });

            interval = setInterval(checker, 100);  //抓取回應HTML,因為須等AJAX完成所以定毫秒抓取一次回應
        }
    });
}
