'use strict';

define(['angular', 'directives', 'jquery', 'lodash', 'services/PropertyReapeatCounter'], function (angualar, directives, $, _) {
    directives.directive('problemStatement', ['config', 'PropertyReapeatCounter',
        function (config, PropertyReapeatCounter) {
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {
                    var problemStatement = '',
                        text;

                    scope.$watch('resp', function (newVal, oldVal) {
                        debugger
                        if (newVal !== oldVal) {

                            text = $(scope.resp).find('h3:contains("Input")').prev();
                            while (text.length) {
                                if (!problemStatement) {
                                    problemStatement = text[0].innerText.trim();
                                } else {
                                    problemStatement = problemStatement.insert(0, text[0].innerText.trim());
                                }
                                text = text.prev();
                            }



                            //$("#problem-statement").html(problemStatement);
                        }
                    });

                },
                templateUrl: 'app/directives/problem-statement/problem-statement.html'
            };
        }
    ]);
});