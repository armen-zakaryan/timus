'use strict'

define(['jquery', 'InputAnalizer', 'OutputAnalizer'], function($, InputAnalizer, OutputAnalizer) {
    return {
        loadPage: function(websiteUrl) {
            $.ajax({
                type: "GET",
                url: "pages",
                data: {
                    url: websiteUrl
                },
                success: function(data) {
                    var input = $(data).find('h3:contains("Input")').next();
                    var output = $(data).find('h3:contains("Output")').next();

                    InputAnalizer.analize(input);
                    OutputAnalizer.analize(output);
                }
            });
        }
    }

});