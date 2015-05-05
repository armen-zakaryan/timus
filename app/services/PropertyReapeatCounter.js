'use strict'

define(['factories', 'lodash'], function(factories, _) {
    factories.factory('PropertyReapeatCounter', [
        
        function() {
            function PropertyReapeatCounter(txt, ignoredElements, mode) {

                // remove line breaks and uppercase characters make lower case
                var text = txt.toLowerCase().replace(/(\r\n|\n|\r)/gm, " "), 
                splitedText, 
                self = this;
                this.data = {};
                this.filteredData = {};
                
                function existWithout(value) {
                    // handle  x's and xs cases
                    if (/'s$/.test(value) && self.data[value.substring(0, value.length - 2)]) {
                        return value.substring(0, value.length - 2);
                    } else if (/\Ss$/.test(value) && self.data[value.substring(0, value.length - 1)]) {
                        return value.substring(0, value.length - 1);
                    } else {
                        return false;
                    }
                }
                
                function existWith(value) {
                    if (self.data[value + "'s"]) {
                        return value + "'s";
                    } else if (self.data[value + "s"]) {
                        return value + "s";
                    } else {
                        return false;
                    }
                }
                
                this.insert = function(value) {
                    var existed;
                    if (!value) {
                        return;
                    }
                    
                    if (self.data[value]) {
                        self.data[value]++;
                    } else if (existed = existWithout(value)) {
                        self.data[existed]++;
                    } else if (existed = existWith(value)) {
                        self.data[value] = self.data[existed] + 1;
                        delete self.data[existed];
                    } else
                        self.data[value] = 1;
                }
                this.filterByKey = function(key) {
                    this.filteredData = {};
                    /*
                    for (var property in self.data) {
                        if (self.data.hasOwnProperty(property)) {
                        // do stuff
                        }
                    }*/
                    _.each(self.data, function(element, index) {
                        if (element >= key) {
                            self.filteredData[index] = element;
                        }
                    });
                };
                this.countFilterByKey = function(key) {
                    var filteredData = {}, property;
                    
                    for (property in self.data) {
                        if (self.data.hasOwnProperty(property)) {
                            if (self.data[property] >= key) {
                                filteredData[property] = self.data[property];
                            }
                        }
                    }
                    
                    return filteredData;
                }

                //******* for problem 2001   *****************
                //text = text.replace(/a1|b1|a2|b2|a3|b3/g, 'ai');
                //********************************************


                // If in mode Sample remove words "input" "output"                     
                if (mode === "Sample") {
                    text = text.replace(/input|output/g, '');
                }

                // If ignoredElements are provided then would be replaced by space
                _.each(ignoredElements, function(ignoredElement) {
                    text = text.replace(new RegExp(ignoredElement, 'g'), ' ');
                });
                
                splitedText = text.split(/[\s\.\"\(\),]+/);
                _.each(splitedText, function(element) {
                    self.insert(element);
                });
            
            }
            
            return PropertyReapeatCounter;
        }
    ]);
});
