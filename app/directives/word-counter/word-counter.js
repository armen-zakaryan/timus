'use strict';

define(['angular', 'directives', 'lodash'], function (angualar, directives, _) {
    directives.directive('wordCounter', ['config',
        function (config) {
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {
                    var problemStatement = '',
                        input,
                        output,
                        sample,
                        $text;

                    scope.makeWordsCountSectionVisible = function () {
                        scope.isWordsCountVisible = !scope.isWordsCountVisible;
                    };

                    scope.$watch('resp', function () {

                        input = $(scope.resp).find('h3:contains("Input")').next();
                        output = $(scope.resp).find('h3:contains("Output")').next();
                        sample = $(scope.resp).find('h3:contains("Sample")').next();
                        $text = $(scope.resp).find('h3:contains("Input")').prev();

                        if ($text.length) {
                            while ($text.length) {

                                problemStatement = problemStatement.insert(0, $text[0].innerText.trim());

                                $text = $text.prev();
                            }
                            scope.problemStatement = problemStatement;
                        }

                        if (sample.length) {
                        scope.sampleText = sample.text().trim();
                        }
                        if (input.length) {
                            scope.inputText = input.text().trim();
                        }
                        if (output.length) {
                            scope.outputText = output.text().trim();
                        }


                    });
                },
                templateUrl: 'app/directives/word-counter/word-counter.html'
            };
        }
    ]);
});