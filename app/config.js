'use strict';
//2001
define([], function() {
    return {
        DEVELOPMENT: {
            timus_base_url: 'http://acm.timus.ru/problem.aspx?space=1&num=',
            timus_default: 1409, //1567, //1401, 1409
            possibleTypes: ['string', 'integer', 'double', 'word'],
            wordsToIgnore: [
                '<', '>', '=', '!=', '==', '≥', '≤', '-', ' — ', ' _ ', ' is ', ' are ', ' has ', ' have ', ' had ', ' was ', ' were ', ' in ',
                ' are ', ' all ', ' to ', ' and ', ' or ', ' of ', ' a ', ' the ', 'the ', ' can ', ' can.', ' be ', ' by ', ' that ',
                ' on ', ' than ', ' then ', ' from ', ' get ', ' got ', ' how ', ' many ', ' some ', ' at ' 
            ]
        },
        
        PRODUCTION: {
            base_url: ''
        }
    };
});
