var system = require('system');
var url = system.args[1] || '';     //�ǤJ�ѼƤ@�G �n��� html �����}�Ѽ�
var defaultValue = system.args[2] || '';     //�ǤJ�ѼƤG�G �w�]�S����� html �ɪ��^�Ǧr��
var count = 100;        //setInterval �����榸�� 100*100 = 10��

if (url.length > 0) {
    var page = require('webpage').create();
    page.open(url, function (status) {
        if (status === 'success') {

            //���o�^��HTML���˴�AJAX(JS)�O�_�w���� 
            var interval, checker = (function () {
                var html = page.evaluate(function () {
                    var bodys = document.getElementsByTagName('body');
                    if (bodys.length > 0) {
                        var body = bodys[0];

                        //�p�G <body> �� data-ajax-status �ݩʭȬO "success" ��� AJAX(JS) �w���� (angular controller ���g�^������) 
                        if (body.getAttribute('data-ajax-status') === 'success') {
                            return document.getElementsByTagName('html')[0].outerHTML;
                        }
                    }
                });

                if (html) {     //�����o html ���
                    clearInterval(interval);
                    system.stdout.write(html);      //��X html ���e stream
                    phantom.exit();
                } else {        //�L���o html ��ơA���s���� setInterval

                    //���榸�ƻ���1
                    count--;
                    if (count <= 0) {       //�p�G�����榸�� <= 0
                        clearInterval(interval);
                        system.stdout.write(defaultValue);      //�L�k���o html ���e�A��X�ǤJ�w�]�ȰѼ�
                        phantom.exit();
                    }
                }
            });

            interval = setInterval(checker, 100);  //����^��HTML,�]������AJAX�����ҥH�w�@�����@���^��
        }
    });
}
