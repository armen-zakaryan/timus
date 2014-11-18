'use strict'

define(['jquery', 'lodash'], function($, _) {
    var uperCaseStart = new RegExp("^[A-Z][a-z]*");
    var characters = new RegExp("^[a-z]$");
    var matchRoundBrakets = new RegExp(/\(([^)]+)\)/)
    var resultJson = {
        InputIntegers: {},
        InputDoubles: {},
        InputStrings: {}
    };
    var index = 0;

    function fillPluralTypes(index, array, type) {
        while (array[++index] !== 'and') {
            resultJson[type][array[index]] = '';
        }
        resultJson[type][array[index + 1]] = '';
    }

    //Get all types described by integer(s), double(s), string(s)
    var typeAnalizer = {
        'integer': function(index, array) {
            resultJson.InputIntegers[array[index + 1]] = '';
        },
        'integers': function(index, array) {
            fillPluralTypes(index, array, 'InputIntegers');
        },
        'double': function(index, array) {
            resultJson.InputDoubles[array[index + 1]] = '';
        },
        'doubles': function(index, array) {
            fillPluralTypes(index, array, 'InputDoubles');
        },
        'string': function(index, array) {
            resultJson.InputStrings[array[index + 1]] = '';
        },
        'strings': function(index, array) {
            fillPluralTypes(index, array, 'InputStrings');
        }
    }

    //Get All ranges of the vars


    return {
        analize: function(input) {
            $("#input").append(input);
            //Geting the text
            input = input.text().trim();

            var braketMatchArray = matchRoundBrakets.exec(input);
            braketMatchArray && _.each(braketMatchArray, function(token) {
                var key = 'type' + index++;
                resultJson[key] = token;
            });


            var inputArr = input.split(" ");
            _.each(inputArr, function(token, index, array) {
                if (uperCaseStart.exec(token) != null || characters.exec(token) != null) {
                    resultJson[token] = token;
                }

                token = token.toLowerCase();
                typeAnalizer[token] && typeAnalizer[token](index, array);

            });
            console.log(resultJson);
        }
    }

});