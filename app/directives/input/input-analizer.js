'use strict';

define(['angular', 'directives', 'jquery', 'lodash'], function(angualar, directives, $, _) {
    directives.directive('inputAnalizer', function() {
        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                var rangMatchRegExp = /[0-9\s]+(\s)?[!=><≤>≥]+(\s)?[a-zA-Z,]([a-zA-Z0-9,\s]+)?(\s)?([!=><≤>≥]+(\s)?[0-9\s]+)?/g,
                    // usefull split(/and|,|integers|doubles|strings|integer|double|string| /g)
                    //typeMatchRegExp = /integer(s)?\s[A-Za-z]([A-Za-z\d])+((,(\s)?[A-Za-z]([A-Za-z\d])+)+)?(\sand\s[A-Za-z]([A-Za-z\d])+)?/g,
                    //typeMatchRegExp = /integer(s)?\s[A-Za-z]([^,.]+)?((,(\s)?[A-Za-z]([^,.]+)?)+)?(\sand\s[A-Za-z]([A-Za-z\d]+)?)?/g,
                    //typeMatchRegExp = "(s)?\\s[A-Za-z]([^,.]+)?((,(\\s)?[A-Za-z]([^,.]+)?)+)?(\\sand\\s[A-Za-z]([A-Za-z\\d]+)?)?",
                    typeMatchRegExp = "(s)?\\s[A-Za-z]([^,.]+)?((,(\\s)?[A-Za-z]([^,.]+)?)+)?(\\sand\\s[A-Za-z]([A-Za-z\\d]+)?)?",
                    resultJson;

                function initResultJson() {
                    resultJson = {
                        integer: {},
                        double: {},
                        string: {},
                        range: {},
                        variables: {}
                    };
                }

                function matchAllRangies(txt) {
                    var arr = txt.match(rangMatchRegExp),
                        fromDigit,
                        toDigit,
                        varName;

                    _.each(arr, function(element, index) {
                        / /
                        element.match(/([A-Za-z](\d+)?(,)?(\s)?)+/)[0].split(',')

                        varName = element.match(/([A-Za-z](\d+)?(,)?(\s)?)+/);
                        fromDigit = element.match(/^\d+/);
                        toDigit = element.match(/(\d(\s)?)+$/);

                        fromDigit = fromDigit && fromDigit[0] && fromDigit[0].replace(/\s+/g, "");
                        toDigit = toDigit && toDigit[0] && toDigit[0].replace(/\s+/g, "");

                        varName = varName && varName[0].split(',');
                        if (varName) {
                            _.each(varName, function(element) {
                                resultJson.range[element.replace(/\s+/g, "")] = {
                                    from: fromDigit,
                                    to: toDigit
                                }
                            });
                        }

                    });
                }

                function matchAllTypes(txt, type) {
                    var result = txt.match(new RegExp(type + typeMatchRegExp, 'g'));
                    console.log('matched', result)

                    if (result) {
                        _.each(result, function(element) {
                            var el = element.replace(/and|integers|doubles|strings|integer|double|string|/g, '');
                            el = el.match(/[A-Za-z]([A-Za-z\d]+)?/g);
                            if (el) {
                                _.each(el, function(variable) {
                                    resultJson[type][variable] = variable;
                                });
                            }
                        });
                    }
                    //console.log('kkk', result);

                }

                function joinTypeWithRange() {
                    var makeObjectAddToVariables = function(type, index, value) {
                        resultJson['variables'][index] = {
                            name: index,
                            type: type,
                            range: {
                                from: value.from,
                                to: value.to
                            }
                        }
                        delete resultJson['range'][index];
                        delete resultJson[type][index];
                    };
                    _.forEach(resultJson.range, function(value, index) {
                        if (resultJson['integer'][index]) {
                            makeObjectAddToVariables('integer', index, value);
                        } else if (resultJson['double'][index]) {
                            makeObjectAddToVariables('double', index, value);
                        } else if (resultJson['string'][index]) {
                            makeObjectAddToVariables('string', index, value);
                        }
                    });
                }


                /*
                var index = 0;
                var uperCaseStart = new RegExp("^[A-Z][a-z]*");
                var characters = new RegExp("^[a-z]$");
                var matchRoundBrakets = new RegExp(/\(([^)]+)\)/g);
                var range = /[0-9]+(\s)?[!=><]+(\s)?[0-9]+/g;
*/

                /*
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

*/

                scope.$watch('resp', function() {
                    var input = $(scope.resp).find('h3:contains("Input")').next();

                    $("#input").html(input);
                    initResultJson();

                    //Geting the text
                    input = input.text().trim();
                    matchAllRangies(input);

                    matchAllTypes(input, 'integer');
                    matchAllTypes(input, 'double');
                    matchAllTypes(input, 'string');


                    joinTypeWithRange();






                    /*
                    var inputArr = input.split(" ");
                    _.each(inputArr, function(token, index, array) {
                        if (uperCaseStart.exec(token) != null || characters.exec(token) != null) {
                            resultJson[token] = token;
                        }

                        token = token.toLowerCase();
                        typeAnalizer[token] && typeAnalizer[token](index, array);

                    });
                    */

                    //getRanges(input);
                    scope.resultJson = resultJson;
                });
            },
            templateUrl: 'app/directives/input/input-analizer.html'
        };
    });
});