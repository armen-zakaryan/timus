'use strict';

define(['angular', 'directives', 'lodash'], function (angualar, directives, _) {
    directives.directive('sentanceContainer', ['config',
        function (config) {
            return {
                restrict: 'E',
                scope: {
                    data: '='  
                },
                link: function (scope, element, attrs) {

                    scope.$watch('data', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            
                        }
                    });

                    scope.onCheck = function(key){
                        scope.data[key].selected = !scope.data[key].selected;  
                    };
                },
                templateUrl: 'app/directives/sentances/sentance-container.html'
            };
        }
    ]);
});