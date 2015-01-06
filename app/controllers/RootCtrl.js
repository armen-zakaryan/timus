define(['controllers', 'services/PageSvc'], function(controllers) {
    controllers.controller('RootCtrl', ['$scope', 'PageSvc', 'config',
        function($scope, PageSvc, config) {


            $scope.loadPage = function(url) {
                if (url) {
                    url = url.match(/\d{4}/g);
                    if (!url) {
                        alert("INVALID URL");
                        return;
                    }
                    url = config.timus_base_url + url[0];
                } else {
                    url = config.timus_base_url + config.timus_default;
                }
                $scope.loading = true;
                PageSvc.getPage(url, function(response) {
                    $scope.loading = false;
                    $scope.resp = response;
                    $scope.$apply(function() {
                        $scope.resp = response;
                    });
                });
            };

            $scope.loadPage();

        }
    ]);
});