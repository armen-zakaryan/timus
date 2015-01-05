'use strict'

define(['services'], function(services) {
    services.service('PageSvc', [

        function() {
            this.getPage = function(websiteUrl, callBack) {
                $.ajax({
                    type: "GET",
                    url: "pages",
                    data: {
                        url: websiteUrl
                    },
                    success: callBack
                });
            }
        }
    ]);
});