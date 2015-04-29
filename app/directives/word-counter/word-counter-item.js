'use strict';

define(['angular', 'directives', 'lodash', 'services/PropertyReapeatCounter'], function(angualar, directives, _) {
    directives.directive('wordCounterItem', ['config', 'PropertyReapeatCounter', 
        function(config, PropertyReapeatCounter) {
            
            function matchSentanceForEachWord(text, wordsArr) {
                // Make lower case and replace newlines/line breaks and multy spaces with 1 spaces
                text = text.toLowerCase().replace(/\n/g, " ").replace(/\s{2,}/g, ' ');
                
                var obj = {}, property;
                var splitedSentances = text.split('.');
                
                for (property in wordsArr) {
                    if (wordsArr.hasOwnProperty(property)) {
                        obj[property] = [];
                        _.each(splitedSentances, function(sentance) {
                            // Start with Exact match end with not strict
                            if (' ' + sentance.indexOf(' ' + property) >= 0) {
                                obj[property].push(sentance);
                            }
                        });
                    }
                }
                /*
                _.each(wordsArr, function(word, index) {
                    obj[index] = [];
                    _.each(splitedSentances, function(sentance) {
                        // Start with Exact match end with not strict
                        if (' ' + sentance.indexOf(' ' + index) >= 0) {
                            obj[index].push(sentance);
                        }
                    });
                });*/
                
                return obj;
            }

            // Check for similar sentances
            function isEqualSentances(sentance1, sentance2) {
                var s1, s2;
                if (sentance1 && sentance2) {
                    s1 = _.cloneDeep(sentance1);
                    s2 = _.cloneDeep(sentance2);
                    
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
            function findIndexPair(extractedWord, tableData, sentances) {
                var indexPair;
                var isIndexFound = !_.every(tableData.names, function(data, index) {
                    if (sentances[index] && sentances[index].length === sentances[extractedWord.name].length && isEqualSentances(sentances[index], sentances[extractedWord.name])) {
                        // To break the iteration since index is found
                        indexPair = {
                            location: 'names',
                            name: index
                        }
                        return false;
                    } else {
                        // To continue the iteration        
                        return true;
                    }
                });

                // Iterate over Indexes to mutch the carrent as an index 
                if (!isIndexFound) {
                    isIndexFound = !_.every(tableData.indexes, function(data, index) {
                        if (sentances[index].length === sentances[extractedWord.name].length && isEqualSentances(sentances[index], sentances[extractedWord.name])) {
                            indexPair = {
                                location: 'indexes',
                                name: index
                            }
                            // To break the iteration since index is found
                            return false;
                        } else {
                            // To continue the iteration        
                            return true;
                        }
                    });
                }
                return indexPair;
            }
            
            function formatData(tableData) {
                var arrOfNames = [], arrOfIndexes = [], maxIndex, currentName, currentIndex;
                _.each(tableData.names, function(el) {
                    arrOfNames.push(el);
                });
                _.each(tableData.indexes, function(el) {
                    arrOfIndexes.push(el);
                });
                if (arrOfNames.length > arrOfIndexes.length) {
                    maxIndex = arrOfNames.length;
                } else {
                    maxIndex = arrOfIndexes.length;
                }
                for (var i = 0; i < maxIndex; i++) {
                    if (arrOfNames.length > i) {
                        currentName = arrOfNames[i];
                    } else {
                        currentName = {};
                    }
                    if (arrOfIndexes.length > i) {
                        currentIndex = arrOfIndexes[i];
                    } else {
                        currentIndex = {};
                    }
                    tableData.formatedData.push({name: currentName,index: currentIndex});
                }
            
            
            }

            // constract Table from Indexes and Names
            function constractArrayIndexNameTable(words, sentances) {
                var sortedWords = [], i = 0, numberOfIteration, extractedWord, 
                tableData = {
                    names: {},
                    indexes: {},
                    formatedData: []
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
                
                if (sortedWords.length > config.INDEXES_NAMES) {
                    numberOfIteration = config.INDEXES_NAMES;
                } else {
                    numberOfIteration = sortedWords.length;
                }
                
                while (i < numberOfIteration) {
                    extractedWord = sortedWords.pop();
                    var pair = findIndexPair(extractedWord, tableData, sentances);
                    if (pair) {
                        tableData.indexes[extractedWord.name] = extractedWord;
                        if (pair.location === 'names') {
                            // Move pair from names into the indexes.
                            tableData.indexes[pair.name] = tableData.names[pair.name];
                            delete tableData.names[pair.name];
                        }
                    } else {
                        tableData.names[extractedWord.name] = extractedWord;
                    }
                    
                    i++;
                }

                // Format Data inside formated Data
                formatData(tableData);
                
                return tableData;
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
                        if (newKey) {
                            scope.countedWords = new PropertyReapeatCounter(scope.data, config.wordsToIgnore, scope.mode);
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
                    
                    scope.toggleTable = function() {
                        scope.visible = !scope.visible;
                    }
                    
                    scope.changeCounter = function(index) {
                        if (scope.filterKey + index >= 0) {
                            scope.filterKey = scope.filterKey + index;
                        }
                    };

                // Constract table  Find Name and index
                
                
                },
                templateUrl: 'app/directives/word-counter/word-counter-item.html'
            };
        }
    ]);
});