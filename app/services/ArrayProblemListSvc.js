'use strict'

define(['services', 'lodash'], function(services, _) {
    services.service('ArrayProblemListSvc', [
        function() {
            var listResult = [];

            this.getList = function(){
                return listResult;
            }

            this.setList = function(data){
                listResult.push(data);
            }

            this.getOnlyArrayProblems = function(){
                var arrayProblems = [];
                _.each(listResult, function(el, index){
                    if(el.data.P_S.length || el.data.all.length){
                        //arrayProblems.push(el.data);
                        arrayProblems.push(el)
                    }
                });
                return arrayProblems;
            }

            this.reset = function(){
                listResult = [];
            }
        }
    ]);
});