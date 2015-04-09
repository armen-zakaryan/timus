'use strict';

define(['angular', 'directives', 'lodash', 'services/ExportSvc'], function(angualar, directives, _) {
    directives.directive('export', ['config', 'ExportSvc', 
        function(config, ExportSvc) {            
            return {
                restrict: 'E',
                link: function(scope, element, attrs) {

                    scope.export = function($event) {
                        $event.stopPropagation();
                        var data = {
                            problem: scope.$parent.$parent.problemNumber,
                            data: scope.wordsInSentance,
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











/*
window.requestFileSystem(type, size, function onInitFs(fs) {
    fs.root.getFile('/log1.txt', {create: true,exclusive: true}, function(fileEntry) {
        debugger
    // fileEntry.isFile === true
    // fileEntry.name == 'log.txt'
    // fileEntry.fullPath == '/log.txt'

    }, errorHandler);


    // Create a FileWriter object for our FileEntry (log.txt).
    fs.root.getFile('log.txt', {create: true}, function(fileEntry) {

        fs.root.getFile('log.txt', {create: false}, function(fileEntry) {

            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function(fileWriter) {

                fileWriter.seek(fileWriter.length); // Start write position at EOF.

                // Create a new Blob and write it to log.txt.
                var blob = new Blob(['Hello World'], {type: 'text/plain'});

                fileWriter.write(blob);

            }, errorHandler);

        }, errorHandler);

    }, errorHandler);
}, errorHandler);

*/