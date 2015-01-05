'use strict';

define(['angular', 'directives', 'jquery', 'lodash'], function(angualar, directives, $, _) {
    directives.directive('inputAnalizer', function() {
        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                var uperCaseStart = new RegExp("^[A-Z][a-z]*");
                var characters = new RegExp("^[a-z]$");
                var matchRoundBrakets = new RegExp(/\(([^)]+)\)/g);
                var range = /[0-9]+(\s)?[!=><]+(\s)?[0-9]+/g;
                //Matches something like that   1 ≤ n ≤ 9
                var cool = /[0-9]+(\s)?[!=><≤]+(\s)?[a-zA-Z, ]+(\s)?[!=><≤]+(\s)?[0-9]+/g;
                var resultJson;
                var index = 0;

                function initResultJson() {
                    resultJson = {
                        int: {},
                        double: {},
                        string: {},
                        range: []
                    };
                }

                function fillPluralTypes(index, array, type) {
                    while (array[++index] !== 'and') {
                        resultJson[type][array[index]] = {};
                    }
                    resultJson[type][array[index + 1]] = {};
                }

                //Get all types described by integer(s), double(s), string(s)
                var typeAnalizer = {
                    'integer': function(index, array) {
                        resultJson.int[array[index + 1]] = {};
                    },
                    'integers': function(index, array) {
                        fillPluralTypes(index, array, 'int');
                    },
                    'double': function(index, array) {
                        resultJson.double[array[index + 1]] = {};
                    },
                    'doubles': function(index, array) {
                        fillPluralTypes(index, array, 'double');
                    },
                    'string': function(index, array) {
                        resultJson.string[array[index + 1]] = {};
                    },
                    'strings': function(index, array) {
                        fillPluralTypes(index, array, 'string');
                    }
                }

                //Get All ranges of the vars
                function getRanges(input) {
                    var arr = [];
                    var rg = /[a-zA-z]+/g;
                    while ((arr = cool.exec(input)) != null) {
                        var splitedArray = arr[0].split(',');
                        for (var i = 0; i < splitedArray.length; i++) {
                            while ((arr = rg.exec(splitedArray[i])) != null) {
                                resultJson.int[arr[0]] && (resultJson.int[arr[0]]['range' + index++] = arr.input)
                                resultJson.double[arr[0]] && (resultJson.double[arr[0]]['range' + index++] = arr.input)
                                resultJson.string[arr[0]] && (resultJson.string[arr[0]]['range' + index++] = arr.input)
                            }
                        }
                    }
                }


                scope.$watch('resp', function() {
                    var input = $(scope.resp).find('h3:contains("Input")').next();
                    $("#input").append(input);
                    initResultJson();

                    //Geting the text
                    input = input.text().trim();

                    var inputArr = input.split(" ");
                    _.each(inputArr, function(token, index, array) {
                        if (uperCaseStart.exec(token) != null || characters.exec(token) != null) {
                            resultJson[token] = token;
                        }

                        token = token.toLowerCase();
                        typeAnalizer[token] && typeAnalizer[token](index, array);

                    });

                    getRanges(input);
                    scope.resultJson = resultJson;
                });
            },
            templateUrl: 'app/directives/input/input-analizer.html'
        };
    });
});