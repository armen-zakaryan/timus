'use strict';

define(['angular', 'directives', 'jquery', 'lodash'], function (angualar, directives, $, _) {
    directives.directive('inputAnalizer', function () {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                var rangMatchRegExp = /[0-9\s]+(\s)?[!=><≤>≥]+(\s)?[a-zA-Z,]([a-zA-Z0-9,\s]+)?(\s)?([!=><≤>≥]+(\s)?[0-9\s]+)?/g,
                    // usefull split(/and|,|integers|doubles|strings|integer|double|string| /g)
                    //typeMatchRegExp = /integer(s)?\s[A-Za-z]([A-Za-z\d])+((,(\s)?[A-Za-z]([A-Za-z\d])+)+)?(\sand\s[A-Za-z]([A-Za-z\d])+)?/g,
                    //typeMatchRegExp = /integer(s)?\s[A-Za-z]([^,.]+)?((,(\s)?[A-Za-z]([^,.]+)?)+)?(\sand\s[A-Za-z]([A-Za-z\d]+)?)?/g,
                    //typeMatchRegExp = "(s)?\\s[A-Za-z]([^,.]+)?((,(\\s)?[A-Za-z]([^,.]+)?)+)?(\\sand\\s[A-Za-z]([A-Za-z\\d]+)?)?",
                    //typeMatchRegExp = "(s)?\\s[A-Za-z]([^,.]+)?((,(\\s)?[A-Za-z]([^,.]+)?)+)?(\\sand\\s[A-Za-z]([A-Za-z\\d]+)?)?",
                    typeMatchRegExp = "var\\s[A-Za-z]([A-Za-z\\d]+)?|vars\\s[A-Za-z]([^,.]+)?((,(\\s)?[A-Za-z]([^,.]+)?)+)?(\\sand\\s[A-Za-z]([A-Za-z\\d]+)?)?",

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

                    _.each(arr, function (element, index) {
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

                function matchAllTypes(txt, type) {
                    var result = txt.match(new RegExp(typeMatchRegExp.replace(/var/g, type), 'g'));
                    console.log('matched', result)

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



                scope.$watch('resp', function () {
                    var input = $(scope.resp).find('h3:contains("Input")').next();

                    if (input.length) {
                        $("#input").html(input);
                        initResultJson();

                        input = input.text().trim();
                        matchAllRangies(input);

                        matchAllTypes(input, 'integer');
                        matchAllTypes(input, 'double');
                        matchAllTypes(input, 'string');


                        joinTypeWithRange();



                        scope.resultJson = resultJson;
                    }








                });
            },
            templateUrl: 'app/directives/input/input-analizer.html'
        };
    });
});