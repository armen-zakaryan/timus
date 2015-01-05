'use strict';
define(['angular', 'mock/mockJSON', 'config', 'angularMocks'], function(angular, mockJSON, config) {
    return angular.module('homeMaster.mockApi', ['ngMockE2E'], function($provide) {
        $provide.constant('config', config.DEVELOPMENT);
    }).run(function($httpBackend) {

        var api_url = config.DEVELOPMENT.base_url;

        $httpBackend.whenGET(new RegExp(api_url + 'categories\\?(.*)')).respond(200, mockJSON.categories);


        var profilesRegexp = api_url + 'profiles\\/([0-9]+)';
        $httpBackend.whenGET(new RegExp(profilesRegexp)).respond(
            function(method, url) {
                var regexp = new RegExp(profilesRegexp);
                var mockId = url.match(regexp)[1];
                var authPersonEmail = getURLParameters(url, '?')['authPersonEmail'];
                return [200, mockJSON.profile(mockId, authPersonEmail)];
            }
        );
        $httpBackend.whenGET(api_url + 'profiles').respond(200, mockJSON.profiles);
        $httpBackend.whenPOST(new RegExp(profilesRegexp)).respond(
            function(method, url, data) {
                var regexp = new RegExp(profilesRegexp);
                data = angular.fromJson(data);
                data.Id = url.match(regexp)[1];
                data.approved = false;
                var date = new Date();
                data.date = date.toUTCString().match(new RegExp('[0-9][0-9] [a-zA-Z]+ [0-9]+')) + ', ' + date.toLocaleTimeString().replace(/:\d+ /, ' ');
                if (mockJSON.addProfileReview(data)) {
                    return [200, {}];
                } else {
                    return [501, {}];
                }
            }
        );

       //Masters
        var masterRegexp = api_url + 'masters\\?(.*)';
        $httpBackend.whenGET(new RegExp(masterRegexp)).respond(
            function(method, url) {
                var params = getURLParameters(url.match(masterRegexp)[1], '&');
                var offset = Number(params.offset);
                var limit = Number(params.limit);
                var result = mockJSON.searchMasters(params);
                var mastersChunk = result.slice(offset, offset + limit);
                return [200, JSON.stringify(mastersChunk)];
            }
        );

        $httpBackend.whenGET(api_url + 'cities').respond(200, mockJSON.cities);

        //Services
        //-----------------------------------------------------------------
        //remove this part to connect to server
        var servicesRegexp = api_url + 'services\\?(.*)';
        $httpBackend.whenGET(new RegExp(servicesRegexp)).respond(
            function(method, url) {
                var params = getURLParameters(url.match(servicesRegexp)[1], '&');
                var category = Number(params.categoryID);
                var serviceList = mockJSON.getServiceList(category);
                return [200, serviceList];
            }
        );

        //----------------------------------------------------------------



        //the rest of requests we need to pass through to backend
        $httpBackend.whenGET(/.*/).passThrough();
        $httpBackend.whenPOST(/.*/).passThrough();
        $httpBackend.whenPUT(/.*/).passThrough();
        $httpBackend.whenDELETE(/.*/).passThrough();

        function getURLParameters(urlStr, simbol) {
            var param = {};
            var urlVariables = urlStr.split(simbol);
            for (var i = 0; i < urlVariables.length; i++) {
                var parameterName = urlVariables[i].split('=');
                param[parameterName[0]] = parameterName[1];
            }
            return param;
        }

    });
});