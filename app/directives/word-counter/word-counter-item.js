'use strict';

define(['angular', 'directives', 'lodash', 'services/PropertyReapeatCounter'], function (angualar, directives, _) {
    directives.directive('wordCounterItem', ['config', 'PropertyReapeatCounter',
        function (config, PropertyReapeatCounter) {
            return {
                restrict: 'E',
                scope: {
                    data: '=',
                    mode: '@'
                },
                link: function (scope, element, attrs) {

                    scope.$watch('data', function (newKey, oldKey) {
                        if (newKey !== oldKey) {
                            scope.countedWords = new PropertyReapeatCounter(scope.data, config.wordsToIgnore);
                            scope.countedWords.filterByKey(1);
                        }
                    });

                    
                    scope.$watch('filterKey', function (newKey, oldKey) {
                        if (newKey !== oldKey) {
                            scope.countedWords.filterByKey(newKey);
                        }
                    });

                },
                templateUrl: 'app/directives/word-counter/word-counter-item.html'
            };
        }
    ]);
});