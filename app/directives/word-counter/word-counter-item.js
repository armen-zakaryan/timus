'use strict';

define(['angular', 'directives', 'lodash', 'services/PropertyReapeatCounter'], function(angualar, directives, _) {
    directives.directive('wordCounterItem', ['config', 'PropertyReapeatCounter', 
        function(config, PropertyReapeatCounter) {
            function matchSentanceForEachWord(text, wordsArr) {
                // Make lower case and replace newlines/line breaks and multy spaces with 1 spaces
                text = text.toLowerCase().replace(/\n/g, " ").replace(/\s{2,}/g, ' ');
                ;
                var obj = {};
                var splitedSentances = text.split('.');
                _.each(wordsArr, function(word, index) {
                    obj[index] = [];
                    _.each(splitedSentances, function(sentance) {
                        // Start with Exact match end with not strict
                        if (' ' + sentance.indexOf(' ' + index) >= 0) {
                            obj[index].push(sentance);
                        }
                    });
                });
                
                return obj;
            }

            // Check for similar sentances
            function isEqualSentances(s1, s2) {
                if (s1 && s2) {
                            ////debugger
                    for (var i = 0; i < s1.length; i++) {
                        var isFound;
                        for (var j = 0; j < s2.length; j++) {
                            if (s1[i] === s2[j]) {
                                s2.splice(j, 1);
                                isFound = true;
                                break;
                            }
                        }
                        if (!isFound) {
                            return false;
                        }
                    }
                    return !(s2.length);
                }
            }

            // Check if it as Index or name
            function isIndex(extractedWord, tableData, sentances) {
                _.each(tableData.names, function(data, index) {
                            var t = sentances[index].length;
                            var b = sentances[extractedWord.name].length;
                            var f = isEqualSentances(sentances[index], sentances[extractedWord.name]);
                    if (sentances[index].length === sentances[extractedWord.name].length && isEqualSentances(sentances[index], sentances[extractedWord.name])) {
                        debugger
                    }
                });
                _.each(tableData.indexes, function(data) {
                    if (data) {
                    
                    }
                });
            }

            // constract Table from Indexes and Names
            function constractArrayIndexNameTable(words, sentances) {
                var sortedWords = [], i = 0, 
                extractedWord, 
                tableData = {
                    names: {},
                    indexes: {}
                };
                _.each(words.data, function(el, index) {
                    sortedWords.push({
                        name: index,
                        count: el
                    })
                });
                // Sort in incresing order. the las is the greatest.
                sortedWords = sortedWords.sort(function(a, b) {
                    return a.count - b.count;
                });

                // Put the first value inside Table Data
                extractedWord = sortedWords.pop();
                tableData.names[extractedWord.name] = extractedWord;
                
                while (i < 5) {
                    extractedWord = sortedWords.pop();
                    
                    isIndex(extractedWord, tableData, sentances);
                    
                    i++;
                }
                //debugger
            }
            
            
            return {
                restrict: 'E',
                scope: {
                    data: '=',
                    mode: '@'
                },
                link: function(scope, element, attrs) {
                    
                    scope.toggle = function() {
                        scope.isVisible = !scope.isVisible;
                    };
                    
                    scope.$watch('data', function(newKey, oldKey) {
                        scope.filterKey = 1;
                        if (newKey !== oldKey) {
                            scope.countedWords = new PropertyReapeatCounter(scope.data, config.wordsToIgnore);
                            scope.countedWords.filterByKey(1);
                            scope.wordsInSentance = matchSentanceForEachWord(scope.data, scope.countedWords.countFilterByKey(1));
                            scope.arayNameAndIndexAnalizedData = constractArrayIndexNameTable(scope.countedWords, scope.wordsInSentance);
                        }
                    });
                    
                    scope.$watch('filterKey', function(newKey, oldKey) {
                        if (newKey !== oldKey) {
                            scope.countedWords.filterByKey(newKey);
                            scope.wordsInSentance = matchSentanceForEachWord(scope.data, scope.countedWords.countFilterByKey(newKey));
                        }
                    });

                // Constract table  Find Name and index
                
                
                },
                templateUrl: 'app/directives/word-counter/word-counter-item.html'
            };
        }
    ]);
});
