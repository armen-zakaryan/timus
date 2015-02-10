define(['controllers', 'services/PageSvc'], function (controllers) {
    controllers.controller('RootCtrl', ['$scope', 'PageSvc', 'config',
        function ($scope, PageSvc, config) {

            String.prototype.insert = function (index, string) {
                string = string.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,'');
                string = string.replace(/^\s*[\r\n]/gm, '');
                if (index > 0) {
                    return this.substring(0, index) + string + this.substring(index, this.length);
                }
                else {
                    var txt = string + ' ' + this;
                    return txt;   
                }
            };

            $scope.loadPage = function (url) {
                if (url) {
                    url = url.match(/^\d{4}$/);
                    if (!url) {
                        alert("INVALID URL");
                        return;
                    }
                    $scope.problemNumber = url[0];
                    url = config.timus_base_url + url[0];
                } else {
                    $scope.problemNumber = config.timus_default;
                    url = config.timus_base_url + config.timus_default;
                }
                $scope.loading = true;
                PageSvc.getPage(url, function (response) {
                    $scope.loading = false;
                    $scope.resp = response;
                    $scope.$apply(function () {
                        $scope.resp = response;
                    });
                });
            };

            $scope.loadPage();

        }
    ]);
});