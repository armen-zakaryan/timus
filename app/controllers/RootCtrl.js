define(['controllers', 'services/PageSvc'], function(controllers) {
    controllers.controller('RootCtrl', ['$scope', 'PageSvc',
        function($scope, PageSvc) {


            $scope.loadPage = function(url) {
                $scope.loading = true;
                var url = url || 'http://acm.timus.ru/problem.aspx?space=1&num=1401';
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