'use strict'

define(['services', 'lodash'], function (services, _) {
    services.service('ArrayFinderSvc', [

        function () {
            function isEmpty(obj) {
                return Object.keys(obj).length === 0;
            }

            this.find = function (resultJson) {
                if (!isEmpty(resultJson.range)) {
                    _.each(resultJson.variables, function (element) {
                        var index = element.name.slice(-1);
                        if (resultJson.range[index]) {
                            element.name = element.name.substring(0, element.name.length - 1);
                            element.type = element.type + ' Array';
                            element.index = index;
                        }

                    });
                }
            }
        }
    ]);
});