'use strict'

define(['services'], function(services) {
    services.service('ExportSvc', [

        function() {
            this.exportData = function(data, callBack) {
                $.ajax({
                    type: "POST",
                    url: "export",
                    data: data,
                    success: callBack
                });
            }
        }
    ]);
});