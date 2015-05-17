define(['controllers', 'angular', 'services/PageSvc', 'services/ArrayProblemListSvc'], function(controllers) {
    controllers.controller('RootCtrl', ['$rootScope', '$scope', 'PageSvc', 'config', 'ArrayProblemListSvc', '$q', 
        function($rootScope, $scope, PageSvc, config, ArrayProblemListSvc, $q) {
            //debugger
            
            $scope.loadPage = function(url) {


                   
                if (url) {
                    if (angular.isNumber(url)) {
                        url = url+'';
                    }

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
                PageSvc.getPage(url, function(response) {
                    $scope.loading = false;
                    $scope.resp = response;
                    $scope.$apply(function() {
                        $scope.resp = response;
                    });
                });
            };
            
            $scope.loadPage();
            
            
            $scope.constructListOfArrayProblems = function(from, to) {
                //debugger
                var i = from, currentProblem = {}, deferred = $q.defer();
                
                $scope.loadPage(i);
                
                deferred.promise.then(function() {
                }, function() {
                }, function(data) {
                    // Sava into services
                    ArrayProblemListSvc.setList({problemNumber: i,data: data});
                    i++;
                    if (i <= to) {
                        //send request
                        $scope.loadPage(i);
                    } else {
                        i;
                        $scope.arrayProblemList = ArrayProblemListSvc.getOnlyArrayProblems();
                        //debugger
                        ArrayProblemListSvc.reset();
                        cleanUpFunc_1(); cleanUpFunc_2();
                    }
                });
                
                var cleanUpFunc_1 = $rootScope.$on('problemStatementDone', function($event, data) {
                    currentProblem['P_S'] = data.groupOfIndexes;
                });
                var cleanUpFunc_2 = $rootScope.$on('allDone', function($event, data) {
                    currentProblem['all'] = data.groupOfIndexes;
                    deferred.notify(currentProblem);
                    currentProblem = {};
                });
            }








            // String Prototype
            String.prototype.insert = function(index, string) {
                string = string.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g, '');
                string = string.replace(/^\s*[\r\n]/gm, '');
                if (index > 0) {
                    return this.substring(0, index) + string + this.substring(index, this.length);
                } 
                else {
                    var txt = string + ' ' + this;
                    return txt;
                }
            };
        
        
        
        }
    ]);
});
