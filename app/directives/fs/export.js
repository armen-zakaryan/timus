'use strict';

define(['angular', 'directives', 'lodash', 'services/ExportSvc'], function(angualar, directives, _) {
    directives.directive('export', ['config', 'ExportSvc', 
        function(config, ExportSvc) {            
            return {
                restrict: 'E',
                link: function(scope, element, attrs) {

                    scope.export = function($event) {
                        var selectedData = {};
                        $event.stopPropagation();
                        
                        _.each(scope.wordsInSentance, function(el, key){
                           if (el.selected){
                               selectedData[key] = el;        
                           }  
                        });

                        if (!Object.getOwnPropertyNames(selectedData).length) {
                            selectedData = scope.wordsInSentance;
                        }

                        var data = {
                            problem: scope.$parent.$parent.problemNumber,
                            data: selectedData,
                            fileName: (scope.$parent.$parent.problemNumber + '_' + scope.filterKey + '_' + scope.mode).replace(/ /g, "_")        
                        }

                        ExportSvc.exportData(data, function(msg){
                           alert(msg);        
                        });
                    
                    };
                },
                templateUrl: 'app/directives/fs/export.html'
            };
        }
    ]);
});