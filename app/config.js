'use strict';
//2001
define([], function () {
    return {
        DEVELOPMENT: {
            timus_base_url: 'http://acm.timus.ru/problem.aspx?space=1&num=',
            timus_default: 1409, //1567, //1401, 1409
            possibleTypes: ['string', 'integer', 'double', 'word'],
            wordsToIgnore: ['and ', ' or ', 'of ', 'a ', 'the ', 'can ', ' be ', '<', '>', '=', '!=', '==', '≥', '≤', 'is ', 'in ', 'are ', 'all ', 'to ']
        },

        PRODUCTION: {
            base_url: ''
        }
    };
});