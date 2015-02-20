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
                },
                templateUrl: 'app/directives/sentances/sentance-container.html'
            };
        }
    ]);
});