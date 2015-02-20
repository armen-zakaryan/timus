'use strict';

define(['angular', 'directives', 'lodash', 'services/PropertyReapeatCounter'], function (angualar, directives, _) {
    directives.directive('wordCounterItem', ['config', 'PropertyReapeatCounter',
        function (config, PropertyReapeatCounter) {
            function matchSentanceForEachWord(text, wordsArr){
                text = text.toLowerCase();
                var obj = {};
                var splitedSentances = text.split('.');
                _.each(wordsArr, function(word,index){
                    obj[index] = [];
                    _.each(splitedSentances, function(sentance){
                        if(sentance.indexOf(index)>=0){
                            obj[index].push(sentance);
                        }
                    });
                });
                return obj;
            }

            return {
                restrict: 'E',
                scope: {
                    data: '=',
                    mode: '@'
                },
                link: function (scope, element, attrs) {
                    scope.filterKey = 1;

                    scope.toggle = function () {
                        scope.isVisible = !scope.isVisible;
                    };

                    scope.$watch('data', function (newKey, oldKey) {
                        if (newKey !== oldKey) {
                            scope.countedWords = new PropertyReapeatCounter(scope.data, config.wordsToIgnore);
                            scope.countedWords.filterByKey(1);
                            scope.wordsInSentance = matchSentanceForEachWord(scope.data, scope.countedWords.countFilterByKey(1));
                        }
                    });

                    
                    scope.$watch('filterKey', function (newKey, oldKey) {
                        if (newKey !== oldKey) {
                            scope.countedWords.filterByKey(newKey);
                            scope.wordsInSentance = matchSentanceForEachWord(scope.data, scope.countedWords.countFilterByKey(newKey));
                        }
                    });

                },
                templateUrl: 'app/directives/word-counter/word-counter-item.html'
            };
        }
    ]);
});