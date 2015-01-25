'use strict'

define(['services', 'lodash'], function (services, _) {
    services.service('Match1567', ['config',
        function (config) {

            function isEmpty(obj) {
                return Object.keys(obj).length === 0;
            }

            function buildRegExpForPossibleTypes() {
                var result = '';
                _.each(config.possibleTypes, function (element) {
                    result += "(\\s" + element + "(s)?[\\s.])|";
                });
                return result.substring(0, result.length - 1);
            }

            this.find = function (resultJson, txt) {
                //var type = txt.match(/(\sword(s)?\s)|(\sinteger(s)?\s)|(\sdouble(s)?\s)|(\sstring(s)?\s)/g);
                var ttt = buildRegExpForPossibleTypes();
                var type = txt.match(new RegExp(ttt, 'g'));

                //debugger
                _.each(txt.match(/\s[^\s]+\sthan\s\d+/g), function (element) {
                    resultJson.range.spacialCases.push({
                        type: type.toString(),
                        range: element
                    });
                });
            }
        }
    ]);
});