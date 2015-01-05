'use strict';

define(['angular', 'directives', 'jquery', 'lodash'], function(angualar, directives, $, _) {
    directives.directive('outputAnalizer', function() {
        return {
            restrict: 'E',
            link: function(scope, element, attrs) {

                scope.$watch('resp', function() {
                    var output = $(scope.resp).find('h3:contains("Output")').next();
                    $("#output").append(output);
                });
            },
            templateUrl: 'app/directives/output/output-analizer.html'
        };
    });
});