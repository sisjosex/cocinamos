angular.module("services", []).factory("service", ["$http", "$q", function ($http, $q) {
    return {
        authenticate: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'authenticate?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getProfile: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getProfile?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        retrievePassword: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'retrievePassword?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        registerUser: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'registerUser?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getCategories: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getCategories?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getMenus: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getMenus?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getTipCategories: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getTipCategories?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getTips: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getTips?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getTip: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getTip?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        addToFavorite: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'addToFavorite?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getSubcategory: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getSubcategory?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getMenu: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getMenu?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getFavorites: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getFavorites?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getInvites: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getInvites?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getInviteDetail: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getInviteDetail?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getUnitsType: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getUnitsType?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getUnits: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getUnits?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getCalculadoraInformation: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getCalculadoraInformation?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getCalculadoraDetalle: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getCalculadoraDetalle?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        getTutorials: function (params, success, error) {
            $http({
                method: 'JSONP',
                url: API_URL + 'getTutorials?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);
        },
        addToRecipes: function (params, success, error) {

            var my_shopping = getItem('my_shopping');

            if(!my_shopping) {

                my_shopping = [];
            }

            var position = false;
            var menu = params.menu;
            menu.portions = params.portions;
            
            for(var i in my_shopping) {

                if(menu.id == my_shopping[i].id) {

                    position = i;
                    break;
                }
            }

            if(!position) {

                my_shopping.push(menu);

            } else {

                my_shopping[position] = menu;
            }

            setItem('my_shopping', my_shopping);

            success({
                status: 'success',
                message: 'Se agregó la receta exitosamente a tu lista de compras.'
            });

            /*$http({
                method: 'JSONP',
                url: API_URL + 'addToRecipes?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);*/
        },
        addToRecipesCustom: function (params, success, error) {

            var my_shopping = getItem('my_shopping_custom');

            if(!my_shopping) {

                my_shopping = [];
            }

            var position = false;
            var menu = params.menu;
            menu.portions = params.portions;

            for(var i in my_shopping) {

                if(menu.id == my_shopping[i].id) {

                    position = i;
                    break;
                }
            }

            if(!position) {

                my_shopping.push(menu);

            } else {

                my_shopping[position] = menu;
            }

            setItem('my_shopping_custom', my_shopping);

            success({
                status: 'success',
                message: 'Se agregó la receta exitosamente a tu lista de compras.'
            });

            /*$http({
             method: 'JSONP',
             url: API_URL + 'addToRecipes?callback=JSON_CALLBACK',
             params: params
             }).success(success).error(error);*/
        },
        getMyShopping: function (params, success, error) {

            var my_shopping = getItem('my_shopping');
            var custom = getItem('my_shopping_custom');

            if(!my_shopping) {

                my_shopping = [];
            }

            if(!custom) {

                custom = [{
                    id: '-1',
                    name: 'Compras personalizadas por el usuario',
                    photo: 'img/new/custom.jpg',
                    extra: [],
                    quantity: 0,
                    items: []
                }];
            }

            success({
                status: 'success',
                data: my_shopping,
                custom: custom
            });

            /*$http({
                method: 'JSONP',
                url: API_URL + 'getMyShopping?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);*/
        },
        getMyShoppingDetail: function (params, success, error) {

            var my_shopping = getItem('my_shopping');

            if(!my_shopping) {

                error();

            } else {

                var menu = false;

                for(var i in my_shopping) {

                    if(params.id == my_shopping[i].id) {

                        menu = my_shopping[i];
                        break;
                    }
                }

                if(menu) {

                    success({
                        status: 'success',
                        data: menu
                    });

                } else {

                    error();
                }
            }

            /*$http({
                method: 'JSONP',
                url: API_URL + 'getMyShoppingDetail?callback=JSON_CALLBACK',
                params: params
            }).success(success).error(error);*/
        },
        getMyShoppingDetailCustom: function (params, success, error) {

            var my_shopping = getItem('my_shopping_custom');

            if(!my_shopping) {

                success({
                    status: 'success',
                    data: {
                        id: '-1',
                        name: 'Compras personalizadas por el usuario',
                        photo: 'img/new/custom.jpg',
                        extra: [],
                        quantity: 0,
                        items: []
                    }
                });

            } else {

                var menu = false;

                for(var i in my_shopping) {

                    if(params.id == my_shopping[i].id) {

                        menu = my_shopping[i];
                        break;
                    }
                }

                if(menu) {

                    success({
                        status: 'success',
                        data: menu
                    });

                } else {

                    error();
                }
            }

            /*$http({
             method: 'JSONP',
             url: API_URL + 'getMyShoppingDetail?callback=JSON_CALLBACK',
             params: params
             }).success(success).error(error);*/
        },
        deleteShopping: function (params, success, error) {

            var my_shopping = getItem('my_shopping');

            if(!my_shopping) {

                my_shopping = [];
            }

            var position = false;

            for (var i in my_shopping) {

                if (params.id == my_shopping[i].id) {

                    position = i;
                    break;
                }
            }

            if(position) {

                my_shopping.splice(position, 1);

                setItem('my_shopping', my_shopping);

                success({
                    status:'success'
                });
            }

            /*$http({
             method: 'JSONP',
             url: API_URL + 'deleteShopping?callback=JSON_CALLBACK',
             params: params
             }).success(success).error(error);*/

        },
        deleteShoppingCustom: function (params, success, error) {

            var my_shopping = getItem('my_shopping_custom');

            if(!my_shopping) {

                my_shopping = [];
            }

            var position = false;

            for (var i in my_shopping) {

                if (params.id == my_shopping[i].id) {

                    position = i;
                    break;
                }
            }

            if(position) {

                //my_shopping.splice(position, 1);

                my_shopping[position].extras = [];

                setItem('my_shopping_custom', my_shopping);

                success({
                    status:'success'
                });
            }

            /*$http({
             method: 'JSONP',
             url: API_URL + 'deleteShopping?callback=JSON_CALLBACK',
             params: params
             }).success(success).error(error);*/

        },
        trackVisit: function (params, success, error) {

            var device_enabled = false;

            try {

                device_enabled = device != null;

            } catch(error){}

            params.device_name = device_name;
            params.device_version = device_enabled ? device.version : '';
            params.app_id = app_id;

            $http({
                method: 'JSONP',
                url: API_URL + 'trackVisit?callback=JSON_CALLBACK',
                params: params
            }).success(function(){

            }).error(function(){

            });
        },
    };
}]);

function getItem(key) {

    var json = localStorage.getItem(key);

    if( json && json != undefined && json != '' ) {

        return JSON.parse(json);

    } else {

        false;
    }

}

function setItem(key, value) {

    localStorage.setItem( key, JSON.stringify(value) );
}
