'use strict';

define(['mock/mockCategories', 'mock/mockProfiles', 'mock/mockCities', 'mock/mockServices', 'mock/csWrapper', 'lodash'],
function (categories, profiles, cities, services, csWrapper, _) {
    var mockJSON = {};

    mockJSON.categories = categories;

    /*
     * updates profiles with required data
     */
    (function (profiles) {
        profiles.forEach(function(profile) {
            profile.professionNames = profile.professions.map(function(professionID) {
                return categories[professionID].key;
            });
        });
        profiles.forEach(function(profile) {
            profile.services = profile.services.map(function(masterService) {
                services.map(function(service){
                    if(service.id === masterService.id){
                        masterService.key = service.key;
                    }
                })
                return masterService;
            });
        });
    })(profiles);

    /*
     * Get services corresponding to category
     */
    mockJSON.getServiceList = function (category) {
        return mockJSON.services.filter(function(service) {
            for (var i = 0; i < mockJSON.csWrapper.length; ++i) {
                if (mockJSON.csWrapper[i].serviceID === service.id &&
                    mockJSON.csWrapper[i].categoryID === category)
                {
                    return true;
                }
            }
            return false;
        });
    };

    mockJSON.profiles = profiles;
    mockJSON.cities = cities;
    mockJSON.services = services;
    mockJSON.csWrapper = csWrapper;

    mockJSON.profile = function(id, authPersonEmail) {
        if (id)
            for (var i = 0; i < mockJSON.profiles.length; i++) {
                // Make sure both are numbers
                if (+mockJSON.profiles[i].id === +id) {
                    mockJSON.profiles[i].reviews = mockJSON.profiles[i].reviews.filter(function(element, index, array) {
                        if(element.approved){
                            return true;
                        }
                        if (authPersonEmail) {
                            if (element.authPersonEmail === authPersonEmail) {
                                return true;
                            }
                        }
                    });
                    return mockJSON.profiles[i];
                }
            }
        return {};
    };

    /*
     * Generating list of masters from profiles
     * we need many musters to test infinite scroll, but we don't
     * heve so much profiles
     */
    mockJSON.masters = (function(profiles, requiredMasters) {
        var result = [];
        var i = 0;
        while(requiredMasters) {
            if(i === profiles.length) {
                i = 0;
            }
            var master = {
                id: profiles[i]['id'],
                first_name: profiles[i]['firstName'],
                last_name: profiles[i]['lastName'],
                profession: profiles[i]['professions'].map(function(professionID) {
                    return categories[professionID].key;
                }),
                cat: profiles[i]['professions'],
                dob: profiles[i]['dob'],
                city_key: profiles[i]['location'],
                country_key: profiles[i]['country'],
                master_phones: profiles[i]['phones'].join(','),
                rating: profiles[i]['rating'],
                tags: profiles[i]['tags'],
                description: profiles[i]['description'].substring(0, 30) + ' ...',
                type: profiles[i]['type'].toLowerCase(),
                avatar: profiles[i]['avatar']
            };
            result.push(master);
            ++i;
            --requiredMasters;
        }
        return result;
    })(mockJSON.profiles, 500);

    /*
     * counting quantity for each category
     */
    mockJSON.categories.forEach(function(cat) {
        cat.count = 0;
        if(cat.key === "all"){
            cat.count = mockJSON.masters.length;
            return
        }
        mockJSON.masters.forEach(function(master) {
            if(master.profession.indexOf(cat.key) !== -1) {
                ++cat.count;
            }
        });
    });

    mockJSON.searchMasters = function (params) {
        var masters = mockJSON.masters;
        var result = [];
        if (params.city) {
            result = [];
            cities = params.city.split(',');
            _.each(masters, function (master) {
                _.each(cities, function (city) {
                    if (master.city_key.toLowerCase().indexOf(city) > -1) {
                        result.push(master);
                        return false;
                    }
                });
            });
            masters = result;
        }

        if (params.cat && params.cat !== "0") {//as param.cat is string I compare also with "0"
            result = [];
            _.each(masters, function (master) {
                if (master.cat.indexOf(parseInt(params.cat, 10)) > -1) {
                    result.push(master);
                }
            });
            masters = result;
        }
        if (params.type) {
            result = [];
            _.each(masters, function (master) {
                if (master.type == params.type) {
                    result.push(master);
                }
            });
            masters = result;
        }
        if (params.term) {
            result = [];
            var tokens = params.term.toLowerCase().split("+");
            _.each(tokens, function (token) {
                result = [];
                _.each(masters, function (master) {
                    if (master.city_key.toLowerCase().indexOf(token) > -1 ||
                        master.first_name.toLowerCase().indexOf(token) > -1 ||
                        master.last_name.toLowerCase().indexOf(token) > -1 ||
                        master.tags.join(' ').toLowerCase().indexOf(token) > -1) {
                        result.push(master);
                    }
                });
                masters = result;
            });
        }

        if (params.service) {
            var min = params.priceMin ? parseInt(params.priceMin) : 0;
            var max = params.priceMax ? parseInt(params.priceMax) : Infinity;
            var ids = mockJSON.profiles.filter(function(prof) {
                for(var i = 0; i < prof.services.length; ++i) {
                    /*
                     * TODO
                     * Must take into consideration different currencies
                     */
                    if(prof.services[i].id == params.service &&
                       min <= prof.services[i].price &&
                       max >= prof.services[i].price)
                    {
                        return true;
                    }
                }
                return false;
            }).map(function(master) {
                return master.id;
            });

            masters = masters.filter(function(master) {
                return ids.some(function(id) {
                    return master.id === id;
                });
            });
        }
        return masters;
    };

    mockJSON.addProfileReview = function(data) {
        if (data && data.Id)
            for (var i = 0; i < mockJSON.profiles.length; ++i) {
                if (mockJSON.profiles[i].id == data.Id) {
                    mockJSON.profiles[i].rating = ((mockJSON.profiles[i].rating * mockJSON.profiles[i].reviews.length + data.rating) / (mockJSON.profiles[i].reviews.length + 1)).toFixed(1);
                    mockJSON.profiles[i].reviews.push(data);
                    return true;
                }
            }
        return false;
    };

    var exports = Object.create(mockJSON);
    exports.profiles = JSON.stringify(mockJSON.profiles);
    exports.cities = JSON.stringify(mockJSON.cities);
    exports.services = JSON.stringify(mockJSON.services);
    exports.categories = JSON.stringify(mockJSON.categories);
    exports.masters = JSON.stringify(mockJSON.masters);

    return exports;
    /*
     * This function is used to generate services based on profile's professions
     */

    /*
    mockJSON.profiles.forEach(function(profile) {
        var ser = [];
        profile.professions.forEach(function(category) {
            var serviceList = mockJSON.getServiceList(category);
            serviceList.forEach(function(s) {
                var tmp = {};
                var r = Math.floor(Math.random() * 7);
                tmp['id'] = s['id'];
                tmp['price'] = Math.floor(Math.random() * (1000 + (r * 100000)) - (10 + r * 1000) + 1) + (10 + r * 1000);
                tmp['currency'] = r === 0 ? 'USD' : 'AMD';
                if(r === 1) {
                    tmp['currency'] = null;
                    tmp['price'] = 'conventional';
                }
                ser.push(tmp);
            });
        });
        // removing duplicates
        for(var i = 0; i < ser.length; ++i) {
            for(var j = i + 1; j < ser.length; ++j) {
                if(ser[i]['id'] == ser[j]['id']) {
                    ser.splice(j, 1);
                    break;
                }
            }
        }
        console.log(JSON.stringify(ser), '\n');
    });
    */
});
