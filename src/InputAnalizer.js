'use strict'

define(['jquery', 'lodash'], function($, _) {
    var uperCaseStart = new RegExp("^[A-Z][a-z]*");
    var characters = new RegExp("^[a-z]$");
    var matchRoundBrakets = new RegExp(/\(([^)]+)\)/g);
    var range = /[0-9]+(\s)?[!=><]+(\s)?[0-9]+/g;
    //Matches something like tht   1 ≤ n ≤ 9
    var cool = /[0-9]+(\s)?[!=><≤]+(\s)?[a-zA-Z, ]+(\s)?[!=><≤]+(\s)?[0-9]+/g;

    var resultJson = {
        InputIntegers: {},
        InputDoubles: {},
        InputStrings: {},
        range: []
    };
    var index = 0;

    function fillPluralTypes(index, array, type) {
        while (array[++index] !== 'and') {
            resultJson[type][array[index]] = {};
        }
        resultJson[type][array[index + 1]] = {};
    }

    //Get all types described by integer(s), double(s), string(s)
    var typeAnalizer = {
        'integer': function(index, array) {
            resultJson.InputIntegers[array[index + 1]] = {};
        },
        'integers': function(index, array) {
            fillPluralTypes(index, array, 'InputIntegers');
        },
        'double': function(index, array) {
            resultJson.InputDoubles[array[index + 1]] = {};
        },
        'doubles': function(index, array) {
            fillPluralTypes(index, array, 'InputDoubles');
        },
        'string': function(index, array) {
            resultJson.InputStrings[array[index + 1]] = {};
        },
        'strings': function(index, array) {
            fillPluralTypes(index, array, 'InputStrings');
        }
    }

    //Get All ranges of the vars
    function getRanges(input) {
        var arr = [];
        var rg = /[a-zA-z]+/g;
        while ((arr = cool.exec(input)) != null) {
            var splitedArray = arr[0].split(',');
            for (var i = 0; i < splitedArray.length; i++) {
                while ((arr = rg.exec(splitedArray[i])) != null) {
                    resultJson.InputIntegers[arr[0]] && (resultJson.InputIntegers[arr[0]]['range' + index++] = arr.input)
                    resultJson.InputDoubles[arr[0]] && (resultJson.InputDoubles[arr[0]]['range' + index++] = arr.input)
                    resultJson.InputStrings[arr[0]] && (resultJson.InputStrings[arr[0]]['range' + index++] = arr.input)
                }
            }
        }
    }

    return {
        analize: function(input) {
            $("#input").append(input);
            //Geting the text
            input = input.text().trim();

            var inputArr = input.split(" ");
            _.each(inputArr, function(token, index, array) {
                if (uperCaseStart.exec(token) != null || characters.exec(token) != null) {
                    resultJson[token] = token;
                }

                token = token.toLowerCase();
                typeAnalizer[token] && typeAnalizer[token](index, array);

            });

            getRanges(input);

            console.log(resultJson);


        }
    }

});