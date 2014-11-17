requirejs.config({
    paths: {
        'jquery': 'lib/jquery-1.11.0.min'
    }
});

require(['jquery', 'API'], function($, API) {

    //If Not specified input field then loads the first page of the Timus website
    var websiteUrl = $('#url').val() || 'http://acm.timus.ru/problem.aspx?space=1&num=1401'
    API.loadPage(websiteUrl);

    /*
    $('#load').on('click', function() {
        API.loadPage(websiteUrl);
    });
    */


});