'use strict';

define(['angular', 'directives', 'jquery', 'lodash', 'services/ArrayFinderSvc', 'services/Match1567', 'services/PropertyReapeatCounter'], function (angualar, directives, $, _) {
    directives.directive('inputAnalizer', ['config', 'ArrayFinderSvc', 'Match1567', 'PropertyReapeatCounter',
        function (config, ArrayFinderSvc, Match1567, PropertyReapeatCounter) {
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {
                    var rangMatchRegExp = /[0-9\s]+(\s)?[!=><≤>≥]+(\s)?[a-zA-Z,]([a-zA-Z0-9,\s]+)?(\s)?([!=><≤>≥]+(\s)?[0-9\s]+)?/g,
                        // usefull split(/and|,|integers|doubles|strings|integer|double|string| /g)
                        //typeMatchRegExp = /integer(s)?\s[A-Za-z]([A-Za-z\d])+((,(\s)?[A-Za-z]([A-Za-z\d])+)+)?(\sand\s[A-Za-z]([A-Za-z\d])+)?/g,
                        //typeMatchRegExp = /integer(s)?\s[A-Za-z]([^,.]+)?((,(\s)?[A-Za-z]([^,.]+)?)+)?(\sand\s[A-Za-z]([A-Za-z\d]+)?)?/g,
                        //typeMatchRegExp = "(s)?\\s[A-Za-z]([^,.]+)?((,(\\s)?[A-Za-z]([^,.]+)?)+)?(\\sand\\s[A-Za-z]([A-Za-z\\d]+)?)?",
                        //typeMatchRegExp = "(s)?\\s[A-Za-z]([^,.]+)?((,(\\s)?[A-Za-z]([^,.]+)?)+)?(\\sand\\s[A-Za-z]([A-Za-z\\d]+)?)?",
                        typeMatchRegExpForSpecialCases = "vars\\s[^.]+",
                        typeMatchRegExp = "var\\s[A-Za-z]([A-Za-z\\d]+)?|vars\\s[A-Za-z]([^,.]+)?((,(\\s)?[A-Za-z]([^,.]+)?)+)?(\\sand\\s[A-Za-z]([A-Za-z\\d]+)?)?",
                        resultJson,
                        input;

                    function initResultJson() {
                        resultJson = {
                            typeMatchForSpecialCases: {},
                            integer: {},
                            double: {},
                            string: {},
                            range: {
                                spacialCases: []
                            },
                            variables: {}
                        };
                    }

                    function matchAllRangies(txt) {
                        var arr = txt.match(rangMatchRegExp),
                            fromDigit,
                            toDigit,
                            varName;

                        _.each(arr, function (element, index) {
                            // remove all line breaks
                            element = element.replace(/(\r\n|\n|\r)/gm,"");

                            element.match(/([A-Za-z](\d+)?(,)?(\s)?)+/)[0].split(',')

                            varName = element.match(/([A-Za-z](\d+)?(,)?(\s)?)+/);
                            fromDigit = element.match(/^\d+/);
                            toDigit = element.match(/(\d(\s)?)+$/);

                            fromDigit = fromDigit && fromDigit[0] && fromDigit[0].replace(/\s+/g, "");
                            toDigit = toDigit && toDigit[0] && toDigit[0].replace(/\s+/g, "");

                            varName = varName && varName[0].split(',');
                            if (varName) {
                                _.each(varName, function (element) {
                                    resultJson.range[element.replace(/\s+/g, "")] = {
                                        from: fromDigit,
                                        to: toDigit
                                    }
                                });
                            }

                        });
                    }

                    function matchTypesForSpecialCases(txt, type) {
                        var result = txt.match(new RegExp(typeMatchRegExpForSpecialCases.replace(/var/g, type), 'g'));
                        _.each(result, function (element) {
                            _.each(element.match(/[A-Z]([a-z\\d]+)?/g), function (el) {
                                resultJson['typeMatchForSpecialCases'][el] = {
                                    name: el,
                                    type: type
                                };
                            });
                        });

                    }

                    function matchAllTypes(txt, type) {
                        matchTypesForSpecialCases(txt, type);
                        var result = txt.match(new RegExp(typeMatchRegExp.replace(/var/g, type), 'g'));

                        if (result) {
                            _.each(result, function (element) {
                                if (element.indexOf(type + 's') >= 0) {
                                    //removing staff inside ();
                                    element = element.replace(/\([^)]+\)/g, '');
                                    //to match such structor  'x,y and z'  'or a ,x' or  'y and z' etc.
                                    element = element.match(/([A-Za-z]([A-Za-z\d]+)?)((\s)?(,|and)((\s)?[A-Za-z]([A-Za-z\d]+)?))+/g);

                                    _.each(element, function (el) {
                                        el = el.match(/[A-Za-z]([A-Za-z\d]+)?/g);
                                        _.each(el, function (variable) {
                                            if (variable !== 'and') {
                                                resultJson[type][variable] = variable;
                                            }
                                        });
                                    });
                                } else {
                                    element = element.replace(new RegExp("\\s|" + type, 'g'), '');
                                    resultJson[type][element] = element
                                }

                            });
                        }
                    }

                    function joinTypeWithRange() {
                        var makeObjectAddToVariables = function (type, index, value) {
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
                        _.forEach(resultJson.range, function (value, index) {
                            if (resultJson['integer'][index]) {
                                makeObjectAddToVariables('integer', index, value);
                            } else if (resultJson['double'][index]) {
                                makeObjectAddToVariables('double', index, value);
                            } else if (resultJson['string'][index]) {
                                makeObjectAddToVariables('string', index, value);
                            }
                        });
                    }

                    // Scope functions
                    scope.$watch('resp', function () {
                        input = $(scope.resp).find('h3:contains("Input")').next();

                        if (input.length) {

                            input = input.text().trim();
                            scope.inputText = input;

                            initResultJson();


                            matchAllRangies(input);

                            matchAllTypes(input, 'integer');
                            matchAllTypes(input, 'double');
                            matchAllTypes(input, 'string');


                            joinTypeWithRange();


                            ArrayFinderSvc.find(resultJson);

                            Match1567.find(resultJson, input);

                            scope.resultJson = resultJson;

                        }
                    });

                },
                templateUrl: 'app/directives/input/input-analizer.html'
            };
        }
    ]);
});