

angular.module("services", []).factory("service", [ "$http", "$q", function($http, $q) {
    return {
        authenticate: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'authenticate?callback=JSON_CALLBACK', params: params}).success(success).error(error);
        },
        retrievePassword: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'retrievePassword?callback=JSON_CALLBACK', params: params}).success(success).error(error);
        },
        registerUser: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'registerUser?callback=JSON_CALLBACK', params: params}).success(success).error(error);
        },
        getCategories: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getCategories?callback=JSON_CALLBACK', params: params}).success(success).error(error);
        },
        getMenus: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getMenus?callback=JSON_CALLBACK', params: params}).success(success).error(error);
        },
        getTipCategories: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getTipCategories?callback=JSON_CALLBACK', params: params}).success(success).error(error);
        },
        getTips: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getTips?callback=JSON_CALLBACK', params: params}).success(success).error(error);
        },
        getTip: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getTip?callback=JSON_CALLBACK', params: params}).success(success).error(error);
        },
        addToFavorite: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'addToFavorite?callback=JSON_CALLBACK', params: params}).success(success).error(error);
        },
        addToRecipes: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getMenus?callback=JSON_CALLBACK', params: params}).success(success).error(error);
        },
        getMenu: function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getMenu?callback=JSON_CALLBACK', params: params}).success(success).error(error);
        },
        getFavorites:  function(params, success, error) {
            $http({method: 'JSONP', url: API_URL + 'getFavorites?callback=JSON_CALLBACK', params: params}).success(success).error(error);
        }
    };
} ]);