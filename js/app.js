var API_URL = 'http://localhost/fino/admin/api/';
var API_URL = 'http://localhost/fino/admin/api/';
var WEB_URL = 'http://cocinamosconfino.com/';

//var API_URL = 'http://cocinamosconfino.com/api/'

//var API_URL = 'http://192.168.43.129/fino_app/admin/api/'
//var API_URL = 'http://172.20.10.5/fino_app/admin/api/'

var module = ons.bootstrap('MyApp', ['services', 'ngSanitize']);

var applicationLanguage = 'es';
var user;
var user_storage_key = 'finoapp_user';

var app_id = 123456;
var recipe_share_text = 'Te invito a participar';
var currentNavigator = undefined;
var MyShoppingScope;
var device_name = 'iphone';

var lang = {
    en: {
        yes: 'Yes',
        no: 'No',
        confirmation: 'Confirmation',
        name_required: 'Name is required',
        email_required: 'Email is required',
        email_invalid: 'Email is invalid',
        password_required: 'Password is required',
        password_old_required: 'Old password is required',
        message: 'Message',
        login: 'Login',
        email: 'Email',
        password: 'Password',
        there_was_an_error: 'There was an error when loading data',
        are_sure_to_logout: 'Are you sure that want logout ?',
        today: 'Today',
        all: 'All',
        welcome: 'Welcome',
        meetings: 'My Meetings',
        profile: 'Profile',
        back: 'Back',
        call_to: 'Call',
        send_email: 'Send email'
    },
    es: {
        yes: 'Si',
        no: 'No',
        confirmation: 'Confirmación',
        name_required: 'Nombre es requerido',
        email_required: 'Email es requerido',
        email_invalid: 'Email es inválido',
        password_required: 'Password es requerido',
        password_old_required: 'Contraseña anterior es requerida',
        message: 'Mensage',
        login: 'Ingresar',
        email: 'Email',
        password: 'Contraseña',
        there_was_an_error: 'Ocurrio un problema al cargar los datos',
        are_sure_to_logout: 'Esta seguro que quieres salir ?',
        today: 'Hoy',
        all: 'Todas',
        welcome: 'Bienvenido',
        meetings: 'Mis Reuniones',
        profile: 'Perfil',
        back: 'Atras',
        call_to: 'Llamar',
        send_email: 'Enviar email'
    }
};

module.controller('MainNavigatorController', function ($scope, $rootScope, service, $sce) {

    ons.ready(function () {

        $rootScope.playVideo = function (video_id) {

            YoutubeVideoPlayer.openVideo(video_id);
        };

        $rootScope.showImage = function (url) {

            PhotoViewer.show(url);
        };

        $rootScope.shareByEmail = function (message) {

            shareByEmail(message, function () {
            });
        };

        $rootScope.shareBySMS = function (message) {
            shareBySMS(message, function () {
            });
        };

        $rootScope.shareByWhatsApp = function (message) {
            shareByWhatsApp(message, function () {
            });
        };

        $rootScope.shareByFacebook = function (message) {
            shareByFacebook(message, function () {
            });
        };

        $rootScope.shareBy = function (message, url) {
            shareBy(message, url);
        };

        $scope.goToFavorite = function () {
            currentNavigator = mainNavigator;
            mainNavigator.pushPage('favorite.html');
        };

        $scope.goToSearch = function () {
            currentNavigator = mainNavigator;
            mainNavigator.pushPage('search.html');
        };

        $rootScope.calculator_params = {};

        $rootScope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        $rootScope.reloadPreviews = function () {

            $('.preview').each(function () {

                new ImageLoader($(this), new Image());

            });
        };

        $rootScope.back = function () {

            mainNavigator.popPage();
        };


        $rootScope.goToSearchRecipes = function (userMainNavigator) {


            if (userMainNavigator) {

                mainNavigator.pushPage('recipes_search.html');

            } else {

                currentNavigator.pushPage('recipes_search.html');
            }

        };


        $rootScope.ingredient = 'Elige tu alimento...';
        $rootScope.porcion = 'Elige la cantidad de porciones...';
        $rootScope.categoria = 'Elige tu categoria...';
        $rootScope.nivel_de_actividad = 'Elige tu nivel...';

        $rootScope.getCalculadoraInformation = function (table) {

            modal.show();

            service.getCalculadoraInformation({app_id: getUserOrAppId(), table: table}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $rootScope.calculator_params = result.data;

                    /*
                     $rootScope.ingredient = $rootScope.calculator_params.alimentos[0].name;
                     $rootScope.porcion = $rootScope.calculator_params.porciones[0].name;
                     $rootScope.categoria = $rootScope.calculator_params.categorias[0].name;

                     console.log($rootScope.ingredient);*/

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        $scope.deviceReady = false;

        if (document.location.protocol == 'http:') {

            //API_URL = 'http://localhost/fino/admin/api/';
            API_URL = 'http://cocinamosconfino.com/api/';
            //API_URL = 'http://cocinamosconfino.com/api/';
            //API_URL = 'http://cocinamosconfino.com/api/';
            //API_URL = 'http://cocinamosconfino.com/api/';

            //API_URL = 'http://cocinamosconfino.com/api/';

            setTimeout(onDeviceReady, 500);

        } else {

            API_URL = 'http://cocinamosconfino.com/api/';

            document.addEventListener("deviceready", onDeviceReady, false);
        }

        function onDeviceReady() {

            $scope.$apply(function () {

                try {

                    if (device.platform === 'android' || device.platform === 'Android') {

                        device_name = 'android';

                    } else {

                        device_name = 'iphone';
                    }

                    app_id = device.uuid;

                } catch (error) {
                    device_name = 'iphone';
                }

                document.addEventListener("online", onOnline, false);
                document.addEventListener("offline", onOffline, false);

                $scope.deviceReady = true;

                localStorage.setItem('lang', applicationLanguage);


                //try { StatusBar.hide(); } catch(error) {}


                if (getUser()) {

                    mainNavigator.pushPage('dashboard.html', {animation: 'none'});

                } else {

                    mainNavigator.pushPage('intro.html', {animation: 'none'});
                }

                try {

                    StatusBar.hide();

                } catch (error) {

                }

            });
        }

        function onOnline() {
            $rootScope.online = true;
        }

        function onOffline() {
            $rootScope.online = false;
        }

        /*
         if ( getUser() != undefined ) {

         mainNavigator.pushPage('home.html', {animation:'none'});

         } else {

         mainNavigator.pushPage('intro.html', {animation: 'none'});
         }*/


        //window.addEventListener('rezise', onResize);

    });
});

function onResize() {

    /*if( window.innerHeight > $('#intro-section').outerHeight() ) {
     $('.intro .page__background').css('background-size', '100% auto');
     } else {
     $('.intro .page__background').css('background-size', 'auto 100%');
     }*/

    if (window.innerHeight > $('#intro-section').outerHeight()) {

        $('#intro-section').css('margin-top', (window.innerHeight / 2 - $('#intro-section').height() / 2));

    } else {

        $('#intro-section').css('margin-top', 0);

    }
}

module.controller('Intro', function ($scope, service) {

    ons.ready(function () {

        $scope.labels = lang[applicationLanguage];

        $scope.updateLanguage = updateLanguage;

        $scope.login = function () {
            //mainNavigator.popPage();
            mainNavigator.pushPage('login.html');
        };

        /*$scope.register = function () {
         //mainNavigator.popPage();
         mainNavigator.pushPage('register.html');
         };*/

        $scope.saltar = function () {
            //mainNavigator.popPage();
            mainNavigator.pushPage('dashboard.html');
        };

        $scope.forgot = function () {

            mainNavigator.pushPage('forgot.html');
        };


        $scope.register = function () {

            $scope.fbLoginSuccess = function (userData) {

                facebookConnectPlugin.api("me/?fields=id,first_name,last_name,email", ["email"],

                    function onSuccess(result) {

                        console.log(result);

                        //alert(JSON.stringify(result));

                        $scope.user = {
                            name: result.first_name + ' ' + result.last_name,
                            email: result.email,
                            password: '',
                            token: '',
                            app_id: app_id,
                            device: device_name
                        };

                        service.registerUser($scope.user, function (result) {

                            if (result.status == 'success') {

                                //alert('El registro se realizó exitosamente')

                                saveUser(result.user);

                                setTimeout(function () {

                                    modal.hide();
                                    mainNavigator.pushPage('dashboard.html');

                                }, 500);

                            } else {

                                modal.hide();

                                alert(result.message);
                            }
                        });

                    }, function onError(error) {
                        console.error("Failed: ", error);
                    }
                );

                //var token;

                /*facebookConnectPlugin.getAccessToken(function(token) {

                 token = token;

                 console.log("Token: " + token);
                 });*/

                //alert("UserInfo: " + JSON.stringify(userData));
            };

            facebookConnectPlugin.login(["public_profile", "email"],
                $scope.fbLoginSuccess,
                function (error) {
                    alert("" + error)
                }
            );

        };


        try {
            navigator.splashscreen.hide();
        } catch (error) {
        }

    });
});

module.controller('Login', function ($scope, service) {

    ons.ready(function () {

        $scope.user = {
            email: '',
            password: '',
            device: device_name,
            app_id: app_id
        };

        $scope.forgot = function () {

            mainNavigator.pushPage('forgot.html');
        };

        $scope.login = function () {

            if ($scope.user.email == '') {
                alert(t('email_required'));
                return;
            } else if (!$.trim($scope.user.email).match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
                alert(t('email_invalid'));
                return;
            } else if ($scope.user.password == '') {
                alert(t('password_required'));
                return;
            }

            modal.show();

            service.authenticate($scope.user, function (result) {

                if (result.status == 'success') {

                    saveUser(result.user);

                    modal.hide();

                    mainNavigator.pushPage('dashboard.html');

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

    });
});

module.controller('Forgot', function ($scope, service) {

    ons.ready(function () {

        $scope.user = {
            email: ''
        };

        $scope.retrieve_password = function () {

            if ($scope.user.email == '') {
                alert(t('email_required'));
                return;
            } else if (!$.trim($scope.user.email).match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
                alert(t('email_invalid'));
                return;
            }

            modal.show();

            service.retrievePassword($scope.user, function (result) {

                if (result.status == 'success') {

                    saveUser(result.user);

                    modal.hide();

                    $scope.user.email = '';

                    alert(result.message);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

    });
});

module.controller('Dashboard', function ($scope, service) {

    ons.ready(function () {

        $scope.user = getUser();

        $scope.gotoPerfil = function () {
            mainNavigator.pushPage('perfil.html');

            setTimeout(function () {
                currentNavigator = mainNavigator;
            }, 800);
        };

        $scope.gotoRecetas = function () {
            mainNavigator.pushPage('home_recipes.html');

            setTimeout(function () {
                currentNavigator = categoryNavigator;
            }, 800);
        };

        $scope.gotoCalculadora = function () {
            mainNavigator.pushPage('home_calculator.html', {
                onTransitionEnd: function () {
                    console.log('asignado');
                    currentNavigator = calculatorNavigator;
                }
            });

            /*
             setTimeout(function () {
             currentNavigator = calculatorNavigator;
             }, 800);*/
        };

        $scope.gotoCompras = function () {
            mainNavigator.pushPage('home_myshopping.html');

            setTimeout(function () {
                currentNavigator = myshoppingNavigator;
            }, 800);
        };

        $scope.gotoConsejos = function () {
            mainNavigator.pushPage('home_counsel.html');

            setTimeout(function () {
                currentNavigator = counselNavigator;
            }, 800);
        };

        $scope.gotoTutorials = function () {
            mainNavigator.pushPage('home_tutorials.html');

            setTimeout(function () {
                currentNavigator = tutorialsNavigator;
            }, 800);
        };


        try {
            navigator.splashscreen.hide();
        } catch (error) {
        }

    });
});

module.controller('Register', function ($scope, service) {

    ons.ready(function () {

        $scope.user = {
            name: '',
            email: '',
            password: '',
            token: '',
            app_id: app_id,
            device: device_name
        };

        $scope.register = function () {

            if ($scope.user.name == '') {
                alert(t('name_required'));
                return;
            } else if ($scope.user.email == '') {
                alert(t('email_required'));
                return;
            } else if (!$.trim($scope.user.email).match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
                alert(t('email_invalid'));
                return;
            } else if ($scope.user.password == '') {
                alert(t('password_required'));
                return;
            }

            modal.show();

            service.registerUser($scope.user, function (result) {

                if (result.status == 'success') {

                    if (!result.message) {

                        saveUser(result.user);

                        mainNavigator.pushPage('home.html');

                    } else {

                        alert(result.message);
                    }

                    modal.hide();

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        $scope.login = function () {
            mainNavigator.pushPage('login.html');
        };

    });
});

module.controller('Perfil', function ($scope, service) {

    ons.ready(function () {

        $scope.user = getUser();

        if (!$scope.user) {

            $scope.user = {
                name: '',
                email: '',
                password: '',
                password_old: '',
                token: '',
                app_id: app_id,
                device: device_name
            };
        }

        $scope.goToFavorite = function () {
            currentNavigator.pushPage('favorite.html');
        };

        $scope.goToMyShopping = function () {
            currentNavigator.pushPage('myshopping.html');
        };

        $scope.logout = function () {

            deleteUser();

            mainNavigator.resetToPage('intro.html', {animation: 'slide'});
        };

        $scope.getProfile = function () {

            modal.show();

            service.getProfile({user_id: getUser().id}, function (result) {

                if (result.status == 'success') {

                    if (!result.message) {

                        $scope.user = result.user;

                    } else {

                        //alert(result.message);
                    }

                    modal.hide();

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        $scope.getProfile();

    });
});

module.controller('Home', function ($scope, service, $sce) {

    ons.ready(function () {

        $scope.top_menu = true;

        $scope.changeNavigator = function (navigator) {

            eval('currentNavigator = ' + navigator + ';');

            if (navigator == 'myshoppingNavigator') {

                if (MyShoppingScope) {
                    MyShoppingScope.getMyShopping();
                }
            }

            $scope.reloadPreviews();
        };

        setTimeout(function () {
            currentNavigator = categoryNavigator;
        }, 100);

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        $scope.goToCategory = function () {
            currentNavigator.pushPage('category.html');
        };

        $scope.goToFavorite = function () {
            currentNavigator.pushPage('favorite.html');
        };

        $scope.goToMenuDetail = function (menu) {
            currentNavigator.pushPage('menu_detail.html', {data: {menu: menu}});
        };

        modal.show();

        service.getMenus({}, function (result) {

            if (result.status == 'success') {

                modal.hide();

                console.log(result.data);

                $scope.menus = result.data;
                $scope.top_menu = result.top_menu;

                setTimeout(function () {

                    try {
                        navigator.splashscreen.hide();
                    } catch (error) {
                    }

                    $('.preview').each(function () {

                        new ImageLoader($(this), new Image());

                    });
                }, 500);

            } else {

                modal.hide();

                //alert(result.message);

                try {
                    navigator.splashscreen.hide();
                } catch (error) {
                }
            }

        }, function () {

            modal.hide();

            alert('No se pudo conectar con el servidor');
        });

    });
});

module.controller('MenuDetail', function ($scope, service, $sce) {

    ons.ready(function () {

        $scope.porciones = 1;

        try {
            $scope.menu = currentNavigator.pages[currentNavigator.pages.length - 1].data.menu;
        } catch (error) {
            $scope.menu = mainNavigator.pages[mainNavigator.pages.length - 1].data.menu;
            currentNavigator = mainNavigator;
        }

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        initCommonFunctions($scope, {
            service: service
        });

        $scope.addToRecipes = function () {

            if (getUser()) {

                service.addToRecipes({
                    food_id: $scope.menu.id,
                    app_id: getUserOrAppId(),
                    portions: $scope.porciones,
                    menu: $scope.menu
                }, function (result) {

                    if (result.status == 'success') {

                        modal.hide();

                        alert(result.message);

                    } else {

                        modal.hide();

                        alert(result.message);
                    }

                }, function (error) {

                    modal.hide();

                    alert('No se pudo conectar con el servidor');
                });

            } else {

                mainNavigator.pushPage('register_fb.html');
            }


        };

        $scope.goToUnits = function () {

            currentNavigator.pushPage('units.html', {data: {}});
        };

        $scope.increasePortions = function () {

            $scope.porciones++;

            $scope.recalculate_portions();
        };

        $scope.decreasePortions = function () {

            if ($scope.porciones > 1) {
                $scope.porciones--;
                $scope.recalculate_portions();
            }
        };

        $scope.recalculate_portions = function () {
            for (var i in  $scope.menu.ingredients) {

                if ($scope.menu.ingredients[i]['has_quantity']) {

                    eval("var quantity = " + $scope.menu.ingredients[i].has_quantity + ";");

                    if ($scope.menu.ingredients[i].has_quantity) {

                        quantity = quantity * $scope.porciones;

                        quantity = new Fraction(quantity).toString();

                        $scope.menu.ingredients[i].name = quantity + ' ' + $scope.menu.ingredients[i].unit_name + ' de ' + $scope.menu.ingredients[i].original_name;

                    } else {

                        $scope.menu.ingredients[i].name = $scope.menu.ingredients[i].original_name + ' ' + $scope.menu.ingredients[i].unit_name;
                    }

                    console.log($scope.menu.ingredients[i].name);

                    $scope.menu.ingredients[i].quantity_calculated = '';

                    //$scope.menu.ingredients[i].quantity_calculated = quantity * $scope.porciones;
                }
            }
        };

        service.getMenu({id: $scope.menu.id}, function (result) {

            if (result.status == 'success') {

                setTimeout(function () {
                    $('.preview').each(function () {

                        new ImageLoader($(this), new Image());

                    });
                }, 500);

                modal.hide();

                $scope.menu = result.data;
                $scope.porciones = result.data.portions;
                $scope.recalculate_portions();

            } else {

                modal.hide();

                //alert(result.message);
            }

        }, function (error) {

            modal.hide();

            alert('No se pudo conectar con el servidor');
        });
    });
});

module.controller('Favorite', function ($scope, service, $sce) {

    ons.ready(function () {

        if (currentNavigator == undefined) {
            currentNavigator = mainNavigator;
        }

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        initSearch($scope);

        $scope.menus = [];
        $scope.normal = [];
        $scope.videos = [];
        $scope.total_menus = 0;
        $scope.total_videos = 0;
        $scope.search = '';

        $scope.goToMenuDetail = function (menu) {
            currentNavigator.pushPage('menu_detail.html', {data: {menu: menu}});
        };


        modal.show();

        $(currentNavigator.topPage).find('.menus .normal').hide();
        $(currentNavigator.topPage).find('.menus .video').hide();
        $(currentNavigator.topPage).find('.menus .todos').show();


        $scope.buscar = function () {
            $scope.toggleSearch();
            $scope.getFavorites({app_id: getUserOrAppId(), search: $scope.search});
        };

        $scope.filter = function (filter) {

            $(currentNavigator.topPage).find('.menus .todos').hide();
            $(currentNavigator.topPage).find('.menus .normal').hide();
            $(currentNavigator.topPage).find('.menus .video').hide();

            $(currentNavigator.topPage).find('.menus .' + filter).show();
        };

        $scope.getFavorites = function () {

            service.getFavorites({app_id: getUserOrAppId(), search: $scope.search}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.menus = result.menus;
                    $scope.normal = result.normal;
                    $scope.videos = result.videos;

                    $scope.total = result.total;
                    $scope.total_menus = result.total_menus;
                    $scope.total_videos = result.total_videos;

                    console.log($scope);

                    setTimeout(function () {
                        $('.preview').each(function () {

                            new ImageLoader($(this), new Image());

                        });
                    }, 500);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function (error) {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };
        $scope.getFavorites();

    });
});

module.controller('Category', function ($scope, service, $sce) {

    ons.ready(function () {

        initSearch($scope);

        $scope.subcategories = [];

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        $scope.search = '';

        $scope.buscar = function () {
            $scope.toggleSearch();
            $scope.getCategories();
        };

        $scope.goToMenuDetail = function (item) {
            currentNavigator.pushPage('subcategory.html', {data: {subcategory: item}});
        };

        $scope.getCategories = function () {

            modal.show();
            service.getCategories({search: $scope.search}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.subcategories = result.data;

                    setTimeout(function () {
                        $('.preview').each(function () {

                            new ImageLoader($(this), new Image());

                        });
                    }, 500);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function (error) {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        $scope.getCategories();
    });
});

module.controller('Subcategory', function ($scope, service, $sce) {

    ons.ready(function () {

        $scope.subcategory = currentNavigator.pages[currentNavigator.pages.length - 1].data.subcategory;

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        initSearch($scope);

        $scope.normal = [];
        $scope.videos = [];
        $scope.menus = [];
        $scope.total = 0;
        $scope.total_menus = 0;
        $scope.total_videos = 0;
        $scope.search = '';

        $scope.goToMenuDetail = function (menu) {
            currentNavigator.pushPage('menu_detail.html', {data: {menu: menu}});
        };


        modal.show();

        $('.menus .normal').hide();
        $('.menus .video').hide();
        $('.menus .todos').show();


        $scope.buscar = function () {
            $scope.toggleSearch();
            $scope.getSubcategory();
        };

        $scope.filter = function (filter) {

            console.log(filter);

            $('.menus .normal').hide();
            $('.menus .video').hide();
            $('.menus .todos').hide();

            $('.menus .' + filter).show();

            setTimeout(function () {
                $('.preview').each(function () {

                    new ImageLoader($(this), new Image());

                });
            }, 500);
        };

        $scope.getSubcategory = function () {

            service.getSubcategory({
                app_id: getUserOrAppId(),
                search: $scope.search,
                subcategory_id: $scope.subcategory.id
            }, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.normal = result.normal;
                    $scope.videos = result.videos;
                    $scope.menus = result.menus;
                    $scope.total = result.total;
                    $scope.total_menus = result.total_menus;
                    $scope.total_videos = result.total_videos;

                    setTimeout(function () {
                        $('.preview').each(function () {

                            new ImageLoader($(this), new Image());

                        });
                    }, 500);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function (error) {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };
        $scope.getSubcategory();

    });
});

module.controller('RecipesSearch', function ($scope, service, $sce) {

    ons.ready(function () {

        $scope.text = '';

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        initSearch($scope);

        $scope.normal = [];
        $scope.videos = [];
        $scope.menus = [];
        $scope.total = 0;
        $scope.total_menus = 0;
        $scope.total_videos = 0;

        $scope.goToMenuDetail = function (menu) {
            currentNavigator.pushPage('menu_detail.html', {data: {menu: menu}});
        };

        $('.menus .normal').hide();
        $('.menus .video').hide();
        $('.menus .todos').show();


        $scope.buscar = function () {
            $scope.toggleSearch();
            $scope.getSubcategory();
        };

        $scope.filter = function (filter) {

            console.log(filter);

            $('.menus .normal').hide();
            $('.menus .video').hide();
            $('.menus .todos').hide();

            $('.menus .' + filter).show();

            setTimeout(function () {
                $('.preview').each(function () {

                    new ImageLoader($(this), new Image());

                });
            }, 500);
        };

        $scope.search = function () {

            modal.show();

            service.getSubcategory({
                app_id: getUserOrAppId(),
                search: $scope.text//,
                //subcategory_id: $scope.subcategory.id
            }, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.normal = result.normal;
                    $scope.videos = result.videos;
                    $scope.menus = result.menus;
                    $scope.total = result.total;
                    $scope.total_menus = result.total_menus;
                    $scope.total_videos = result.total_videos;

                    setTimeout(function () {
                        $('.preview').each(function () {

                            new ImageLoader($(this), new Image());

                        });
                    }, 500);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function (error) {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

    });
});

module.controller('Recipes', function ($scope, service, $sce) {

    ons.ready(function () {

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        setTimeout(function () {
            $('.preview').each(function () {

                new ImageLoader($(this), new Image());

            });

        }, 500);

        initCommonFunctions($scope, {
            service: service
        });
    });
});

module.controller('Calculator', function ($scope) {

    ons.ready(function () {

        //currentNavigator = calculatorNavigator;

        console.log(currentNavigator);

        $scope.goToPage = function (page) {

            calculatorNavigator.pushPage(page, {});
        };

        setTimeout(function () {

            $('.preview').each(function () {

                new ImageLoader($(this), new Image());

            });
        }, 500);
    });
});

module.controller('CalNutrientes', function ($scope, service) {

    ons.ready(function () {

        calNutrientesScope = $scope;

        $scope.ingredient_id = '';
        $scope.porcion_id = '';
        $scope.table = 'calculadora_nutrientes';

        $scope.goToPage = function (page) {

            calculatorNavigator.pushPage(page, {});
        };

        $scope.updateIngredient = function () {
            for (var i in $scope.calculator_params.alimentos) {
                if ($scope.calculator_params.alimentos[i].id == $scope.ingredient_id) {
                    $scope.ingredient = $scope.calculator_params.alimentos[i].name;
                }
            }

            $scope.getCalculatorDetails();
        };

        $scope.updatePorcion = function () {
            for (var i in $scope.calculator_params.porciones) {
                if ($scope.calculator_params.porciones[i].id == $scope.porcion_id) {
                    $scope.porcion = $scope.calculator_params.porciones[i].name;
                }
            }

            $scope.getCalculatorDetails();
        };


        $scope.getCalculatorDetails = function () {

            if ($scope.ingredient_id != '' && $scope.porcion_id != '') {

                $scope.calculator_params.porciones = [];

                modal.show();

                service.getCalculadoraDetalle({
                    ingredient_id: $scope.ingredient_id,
                    porcion: $scope.porcion_id,
                    table: $scope.table
                }, function (result) {

                    if (result.status == 'success') {

                        modal.hide();

                        $scope.result = result.data;

                        $scope.calculator_params.porciones = result.porciones;

                    } else {

                        modal.hide();

                        alert(result.message);
                    }

                }, function (err) {

                    modal.hide();

                    alert('No se pudo conectar con el servidor');
                });

            } else {

                $scope.calculator_params.porciones = [];

                modal.show();

                service.getCalculadoraDetalle({
                    ingredient_id: $scope.ingredient_id,
                    porcion: $scope.porcion_id,
                    table: $scope.table
                }, function (result) {

                    if (result.status == 'success') {

                        modal.hide();

                        $scope.calculator_params.porciones = result.porciones;

                    } else {

                        modal.hide();

                        alert(result.message);
                    }

                }, function (err) {

                    modal.hide();

                    alert('No se pudo conectar con el servidor');
                });
            }
        };

        setTimeout(function () {
            $('.preview').each(function () {

                new ImageLoader($(this), new Image());

            });
        }, 500);

        $scope.getCalculadoraInformation($scope.table);

    });
});

module.controller('CalcProteinas', function ($scope, service) {

    ons.ready(function () {

        calNutrientesScope = $scope;

        $scope.categoria_id = '';
        $scope.ingredient_id = '';
        $scope.porcion_id = '';
        $scope.table = 'calculadora_proteinas';

        $scope.goToPage = function (page) {

            calculatorNavigator.pushPage(page, {});
        };

        $scope.updateIngredient = function () {
            for (var i in $scope.calculator_params.alimentos) {
                if ($scope.calculator_params.alimentos[i].id == $scope.ingredient_id) {
                    $scope.ingredient = $scope.calculator_params.alimentos[i].name;
                }
            }

            $scope.getCalculatorDetails();
        };

        $scope.updateCategoria = function () {
            for (var i in $scope.calculator_params.categorias) {
                if ($scope.calculator_params.categorias[i].id == $scope.categoria_id) {
                    $scope.categoria = $scope.calculator_params.categorias[i].name;
                }
            }

            $scope.getCalculatorDetails();
        };


        $scope.getCalculatorDetails = function () {

            if ($scope.categoria_id != '' && $scope.ingredient_id != '') {

                $scope.result = {};
                $scope.calculator_params.alimentos = [];

                modal.show();

                service.getCalculadoraDetalle({
                    categoria_id: $scope.categoria_id,
                    ingredient_id: $scope.ingredient_id,
                    table: $scope.table
                }, function (result) {

                    if (result.status == 'success') {

                        modal.hide();

                        $scope.result = result.data;

                        $scope.calculator_params.alimentos = result.alimentos;

                    } else {

                        modal.hide();

                        alert(result.message);
                    }

                }, function (err) {

                    modal.hide();

                    alert('No se pudo conectar con el servidor');
                });

            } else {

                $scope.result = {};
                $scope.calculator_params.alimentos = [];

                modal.show();

                service.getCalculadoraDetalle({
                    categoria_id: $scope.categoria_id,
                    ingredient_id: $scope.ingredient_id,
                    table: $scope.table
                }, function (result) {

                    if (result.status == 'success') {

                        modal.hide();

                        $scope.calculator_params.alimentos = result.alimentos;

                    } else {

                        modal.hide();

                        alert(result.message);
                    }

                }, function (err) {

                    modal.hide();

                    alert('No se pudo conectar con el servidor');
                });
            }
        };

        setTimeout(function () {
            $('.preview').each(function () {

                new ImageLoader($(this), new Image());

            });
        }, 500);

        $scope.getCalculadoraInformation($scope.table);

    });
});

module.controller('CalcCalorias', function ($scope, service) {

    ons.ready(function () {

        calNutrientesScope = $scope;

        $scope.categoria_id = '';
        $scope.ingredient_id = '';
        $scope.porcion_id = '';
        $scope.table = 'calculadora_calorias';

        $scope.goToPage = function (page) {

            calculatorNavigator.pushPage(page, {});
        };

        $scope.updateIngredient = function () {
            for (var i in $scope.calculator_params.alimentos) {
                if ($scope.calculator_params.alimentos[i].id == $scope.ingredient_id) {
                    $scope.ingredient = $scope.calculator_params.alimentos[i].name;
                }
            }

            $scope.getCalculatorDetails();
        };

        $scope.updateCategoria = function () {
            for (var i in $scope.calculator_params.categorias) {
                if ($scope.calculator_params.categorias[i].id == $scope.categoria_id) {
                    $scope.categoria = $scope.calculator_params.categorias[i].name;
                }
            }

            $scope.getCalculatorDetails();
        };


        $scope.getCalculatorDetails = function () {

            if ($scope.categoria_id != '' && $scope.ingredient_id != '') {

                $scope.result = {};
                $scope.calculator_params.alimentos = [];
                $scope.ingredient_id = '';

                modal.show();

                service.getCalculadoraDetalle({
                    categoria_id: $scope.categoria_id,
                    ingredient_id: $scope.ingredient_id,
                    table: $scope.table
                }, function (result) {

                    if (result.status == 'success') {

                        modal.hide();

                        $scope.result = result.data;

                        $scope.calculator_params.alimentos = result.alimentos;

                    } else {

                        modal.hide();

                        alert(result.message);
                    }

                }, function (err) {

                    modal.hide();

                    alert('No se pudo conectar con el servidor');
                });

            } else {

                $scope.result = {};
                $scope.calculator_params.alimentos = [];
                $scope.ingredient_id = '';

                modal.show();

                service.getCalculadoraDetalle({
                    categoria_id: $scope.categoria_id,
                    ingredient_id: $scope.ingredient_id,
                    table: $scope.table
                }, function (result) {

                    if (result.status == 'success') {

                        modal.hide();

                        $scope.calculator_params.alimentos = result.alimentos;

                    } else {

                        modal.hide();

                        alert(result.message);
                    }

                }, function (err) {

                    modal.hide();

                    alert('No se pudo conectar con el servidor');
                });

            }
        };

        setTimeout(function () {
            $('.preview').each(function () {

                new ImageLoader($(this), new Image());

            });
        }, 500);

        $scope.getCalculadoraInformation($scope.table);

    });
});

module.controller('CalCaloriasDiarias', function ($scope, service) {

    ons.ready(function () {

        calNutrientesScope = $scope;

        $scope.peso_corporal = '';
        $scope.nivel_de_actividad_id = '';
        $scope.table = 'calculadora_calorias_diarias';

        $scope.goToPage = function (page) {

            calculatorNavigator.pushPage(page, {});
        };

        $scope.updatePesoCorporal = function () {

            $scope.getCalculatorDetails(false);
        };

        $scope.updateNivelDeActividad = function () {
            for (var i in $scope.calculator_params.nivel_de_actividad) {
                if ($scope.calculator_params.nivel_de_actividad[i].id == $scope.nivel_de_actividad_id) {
                    $scope.nivel_de_actividad = $scope.calculator_params.nivel_de_actividad[i].name;
                }
            }

            $scope.getCalculatorDetails(true);
        };


        $scope.getCalculatorDetails = function (showLoader) {

            if ($scope.categoria_id != '' && $scope.ingredient_id != '') {

                if (showLoader) {

                    modal.show();
                }

                service.getCalculadoraDetalle({
                    nivel_de_actividad_id: $scope.nivel_de_actividad_id,
                    peso_corporal: $scope.peso_corporal,
                    table: $scope.table
                }, function (result) {

                    if (result.status == 'success') {

                        modal.hide();

                        $scope.result = result.data;

                    } else {

                        modal.hide();

                        alert(result.message);
                    }

                }, function (err) {

                    modal.hide();

                    alert('No se pudo conectar con el servidor');
                });
            }
        };

        setTimeout(function () {
            $('.preview').each(function () {

                new ImageLoader($(this), new Image());

            });
        }, 500);

        $scope.getCalculadoraInformation($scope.table);

    });
});

module.controller('Counsel', function ($scope, service) {

    ons.ready(function () {

        $scope.tip_categories = [];

        modal.show();

        $scope.goToTipList = function (tip_category) {

            counselNavigator.pushPage('tip_list.html', {data: {category: tip_category}});
        };

        $scope.goToSearchCounsel = function (category) {

            counselNavigator.pushPage('tip_list_search.html');
        };

        service.getTipCategories({}, function (result) {

            if (result.status == 'success') {

                modal.hide();

                $scope.tip_categories = result.data;

                setTimeout(function () {
                    $('.preview').each(function () {

                        new ImageLoader($(this), new Image());

                    });

                }, 500);

            } else {

                modal.hide();

                //alert(result.message);
            }

        }, function () {

            modal.hide();

            alert('No se pudo conectar con el servidor');
        });

    });
});

module.controller('TipList', function ($scope, service) {

    ons.ready(function () {

        $scope.tips = [];

        $scope.category = counselNavigator.pages[counselNavigator.pages.length - 1].data.category;

        modal.show();

        $scope.goToTip = function (tip) {

            console.log(tip);

            counselNavigator.pushPage('tip.html', {data: {tip: tip, category: $scope.category}});
        };

        $scope.goToSearchCounsel = function (category) {

            counselNavigator.pushPage('tip_list_search.html', {data: {category: $scope.category}});
        };

        service.getTips({tip_category_id: $scope.category.id}, function (result) {

            if (result.status == 'success') {

                modal.hide();

                $scope.tips = result.data;

                setTimeout(function () {
                    $('.preview').each(function () {

                        new ImageLoader($(this), new Image());

                    });

                }, 500);

            } else {

                modal.hide();

                //alert(result.message);
            }

        }, function () {

            modal.hide();

            alert('No se pudo conectar con el servidor');
        });
    });
});

module.controller('TipListSearch', function ($scope, service) {

    ons.ready(function () {

        $scope.tips = [];

        //$scope.category = counselNavigator.pages[counselNavigator.pages.length - 1].data.category;

        $scope.text = '';

        $scope.total_tips = 0;

        $scope.goToTip = function (tip) {

            console.log(tip);

            counselNavigator.pushPage('tip.html', {data: {tip: tip, category: $scope.category}});
        };

        $scope.search = function () {

            modal.show();

            service.getTips({search: $scope.text}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.tips = result.data;

                    $scope.total_tips = result.total;

                    setTimeout(function () {
                        $('.preview').each(function () {

                            new ImageLoader($(this), new Image());

                        });

                    }, 500);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        }
    });
});

module.controller('Tip', function ($scope, service) {

    ons.ready(function () {

        $scope.tips = [];

        $scope.tip = counselNavigator.pages[counselNavigator.pages.length - 1].data.tip;
        $scope.category = counselNavigator.pages[counselNavigator.pages.length - 1].data.category;

        modal.show();

        service.getTip({id: $scope.tip.id}, function (result) {

            if (result.status == 'success') {

                modal.hide();

                $scope.tip = result.data;

                $scope.tip.content = $('<div>' + $scope.tip.content + '</div>').html();

                setTimeout(function () {
                    $('.preview').each(function () {

                        new ImageLoader($(this), new Image());

                    });

                }, 500);

            } else {

                modal.hide();

                alert(result.message);
            }

        }, function () {

            modal.hide();

            alert('No se pudo conectar con el servidor');
        });
    });
});

module.controller('MyShopping', function ($scope, service, $sce) {

    ons.ready(function () {

        MyShoppingScope = $scope;

        $scope.search = '';

        initSearch($scope);

        $scope.buscar = function () {
            $scope.toggleSearch();
            $scope.getMyShopping();
        };

        $scope.goToShoppingDetail = function (item) {

            currentNavigator.pushPage('myshopping_detail.html', {data: {menu: item}});
        };

        $scope.goToShoppingDetailCustom = function (item) {

            currentNavigator.pushPage('myshopping_detail_custom.html', {data: {menu: item}});
        };

        $scope.getMyShopping = function () {

            modal.show();

            service.getMyShopping({app_id: getUserOrAppId(), search: $scope.search}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.recipes = result.data;
                    $scope.custom = result.custom;

                    setTimeout(function () {

                        $('.preview').each(function () {

                            new ImageLoader($(this), new Image());

                        });

                    }, 500);

                } else {

                    $scope.recipes = [];

                    modal.hide();

                    //alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        $scope.getMyShopping();

    });
});

module.controller('MyshoppingDetail', function ($scope, service, $sce) {

    ons.ready(function () {

        $scope.menu = currentNavigator.pages[currentNavigator.pages.length - 1].data.menu;

        /*
         $scope.recalculate_portions = function () {
         for (var i in  $scope.menu.ingredients) {

         eval("var quantity = " + $scope.menu.ingredients[i].quantity + ";");

         $scope.menu.ingredients[i].quantity_calculated = quantity * $scope.menu.portions;
         }
         };*/

        $scope.recalculate_portions = function () {
            for (var i in  $scope.menu.ingredients) {

                console.log($scope.menu.ingredients[i]);

                if ($scope.menu.ingredients[i]['has_quantity']) {

                    eval("var quantity = " + $scope.menu.ingredients[i].has_quantity + ";");

                    if ($scope.menu.ingredients[i].has_quantity) {

                        quantity = quantity * $scope.menu.portions;

                        quantity = new Fraction(quantity).toString();

                        $scope.menu.ingredients[i].name = quantity + ' ' + $scope.menu.ingredients[i].unit_name + ' de ' + $scope.menu.ingredients[i].original_name;

                    } else {

                        $scope.menu.ingredients[i].name = $scope.menu.ingredients[i].original_name + ' ' + $scope.menu.ingredients[i].unit_name;
                    }

                    console.log($scope.menu.ingredients[i].name);

                    $scope.menu.ingredients[i].quantity_calculated = '';

                    //$scope.menu.ingredients[i].quantity_calculated = quantity * $scope.porciones;
                }
            }
        };

        $scope.getMyShoppingDetail = function () {

            modal.show();

            service.getMyShoppingDetail({app_id: getUserOrAppId(), id: $scope.menu.id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.menu = result.data;

                    $scope.menu.portions = parseInt($scope.menu.portions);

                    $scope.recalculate_portions();

                    setTimeout(function () {
                        $('.preview').each(function () {

                            new ImageLoader($(this), new Image());

                        });

                    }, 500);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        $scope.deleteShopping = function () {

            confirm('Esta seguro de eliminar esta compra?', function () {

                modal.show();

                service.deleteShopping({app_id: getUserOrAppId(), id: $scope.menu.id}, function (result) {

                    if (result.status == 'success') {

                        modal.hide();

                        //alert(result.message);

                        currentNavigator.popPage();

                        setTimeout(function () {
                            MyShoppingScope.getMyShopping();
                        }, 200);

                    } else {

                        modal.hide();

                        alert(result.message);
                    }

                }, function () {

                    modal.hide();

                    alert('No se pudo conectar con el servidor');
                });
            });
        };

        $scope.showAddItemDialog = function () {
            ons.notification.prompt({
                title: 'Agregar Item',
                message: 'Nombre:',
                buttonLabel: 'Agregar',
                cancelable: true,
                callback: function (value) {

                    if (value != null) {

                        if (!$scope.menu.extras) {
                            $scope.menu.extras = [];
                        }

                        $scope.menu.extras.push({
                            name: value
                        });

                        service.addToRecipes({
                            food_id: $scope.menu.id,
                            app_id: getUserOrAppId(),
                            portions: $scope.menu.portions,
                            menu: $scope.menu
                        }, function (result) {

                            if (result.status == 'success') {

                                modal.hide();

                                //alert(result.message);

                            } else {

                                modal.hide();

                                alert(result.message);
                            }

                        }, function (error) {

                            modal.hide();

                            alert('No se pudo conectar con el servidor');
                        });

                        $scope.$digest();
                    }
                }
            });
        };

        $scope.addExtra = function () {

            if (getUser()) {

                service.addToRecipes({
                    food_id: $scope.menu.id,
                    app_id: getUserOrAppId(),
                    portions: $scope.menu.portions,
                    menu: $scope.menu
                }, function (result) {

                    if (result.status == 'success') {

                        modal.hide();

                        alert(result.message);

                    } else {

                        modal.hide();

                        alert(result.message);
                    }

                }, function (error) {

                    modal.hide();

                    alert('No se pudo conectar con el servidor');
                });

            } else {

                mainNavigator.pushPage('register_fb.html');
            }


        };

        $scope.getMyShoppingDetail();

    });
});

module.controller('MyshoppingDetailCustom', function ($scope, service, $sce) {

    ons.ready(function () {

        $scope.menu = currentNavigator.pages[currentNavigator.pages.length - 1].data.menu;

        $scope.getMyShoppingDetailCustom = function () {

            modal.show();

            service.getMyShoppingDetailCustom({app_id: getUserOrAppId(), id: $scope.menu.id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.menu = result.data;

                    setTimeout(function () {
                        $('.preview').each(function () {

                            new ImageLoader($(this), new Image());

                        });

                    }, 500);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                //alert('No se pudo conectar con el servidor');
            });
        };

        $scope.deleteShoppingCustom = function () {

            confirm('Esta seguro de eliminar esta compra?', function () {

                modal.show();

                service.deleteShoppingCustom({app_id: getUserOrAppId(), id: $scope.menu.id}, function (result) {

                    if (result.status == 'success') {

                        modal.hide();

                        //alert(result.message);

                        currentNavigator.popPage();

                        setTimeout(function () {
                            MyShoppingScope.getMyShopping();
                        }, 200);

                    } else {

                        modal.hide();

                        alert(result.message);
                    }

                }, function () {

                    modal.hide();

                    alert('No se pudo conectar con el servidor');
                });
            });
        };

        $scope.showAddItemDialog = function () {
            ons.notification.prompt({
                title: '',
                message: 'Escriba un ítem para agregar a sus compras adicionales',
                buttonLabel: 'Agregar',
                cancelable: true,
                callback: function (value) {

                    if (value != null) {

                        if (!$scope.menu.extras) {
                            $scope.menu.extras = [];
                        }

                        $scope.menu.extras.push({
                            name: value
                        });

                        service.addToRecipesCustom({
                            food_id: $scope.menu.id,
                            app_id: getUserOrAppId(),
                            portions: $scope.menu.portions,
                            menu: $scope.menu
                        }, function (result) {

                            if (result.status == 'success') {

                                modal.hide();

                                //alert(result.message);

                            } else {

                                modal.hide();

                                alert(result.message);
                            }

                        }, function (error) {

                            modal.hide();

                            alert('No se pudo conectar con el servidor');
                        });

                        $scope.$digest();
                    }
                }
            });
        };

        $scope.addExtra = function () {

            if (getUser()) {

                service.addToRecipesCustom({
                    food_id: $scope.menu.id,
                    app_id: getUserOrAppId(),
                    portions: $scope.menu.portions,
                    menu: $scope.menu
                }, function (result) {

                    if (result.status == 'success') {

                        modal.hide();

                        alert(result.message);

                    } else {

                        modal.hide();

                        alert(result.message);
                    }

                }, function (error) {

                    modal.hide();

                    alert('No se pudo conectar con el servidor');
                });

            } else {

                mainNavigator.pushPage('register_fb.html');
            }


        };

        $scope.getMyShoppingDetailCustom();

    });
});

module.controller('Invite', function ($scope, service, $sce) {

    ons.ready(function () {

        $scope.search = '';

        initSearch($scope);

        $scope.buscar = function () {
            $scope.toggleSearch();
            $scope.getInvites();
        };

        $scope.goToShoppingDetail = function (item) {

            currentNavigator.pushPage('invite_detail.html', {data: {menu: item}});
        };

        $scope.getInvites = function () {

            modal.show();

            service.getInvites({app_id: getUserOrAppId(), search: $scope.search}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.recipes = result.data;

                    setTimeout(function () {
                        $('.preview').each(function () {

                            new ImageLoader($(this), new Image());

                        });

                    }, 500);

                } else {

                    $scope.recipes = [];

                    modal.hide();

                    //alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        $scope.getInvites();

    });
});

module.controller('InviteDetail', function ($scope, service, $sce) {

    ons.ready(function () {

        $scope.fecha = new Date();
        $scope.hora = new Date();
        $scope.direccion = '';

        $scope.invitados = 0;

        $scope.menu = currentNavigator.pages[currentNavigator.pages.length - 1].data.menu;

        $scope.recalculate_portions = function () {
            for (var i in  $scope.menu.ingredients) {

                eval("var quantity = " + $scope.menu.ingredients[i].quantity + ";");

                $scope.menu.ingredients[i].quantity_calculated = quantity * $scope.menu.portions;
            }
        };


        $scope.shareByEmail = function () {

            if ($scope.invitados > 0) {
                $scope.invitados--;
            }

            message = 'Te invito para las: ' + $scope.fecha + ', ' + $scope.hora + ' en la direccion: ' + $scope.direccion;

            shareByEmail(message, function () {
            });
        };

        $scope.shareBySMS = function () {

            if ($scope.invitados > 0) {
                $scope.invitados--;
            }

            message = 'Te invito para las: ' + $scope.fecha + ', ' + $scope.hora + ' en la direccion: ' + $scope.direccion;

            shareBySMS(message, function () {
            });
        };

        $scope.shareByWhatsApp = function () {

            if ($scope.invitados > 0) {
                $scope.invitados--;
            }

            message = 'Te invito para las: ' + $scope.fecha + ', ' + $scope.hora + ' en la direccion: ' + $scope.direccion;

            shareByWhatsApp(message, function () {
            });
        };

        $scope.shareByFacebook = function () {

            if ($scope.invitados > 0) {
                $scope.invitados--;
            }

            message = 'Te invito para las: ' + $scope.fecha + ', ' + $scope.hora + ' en la direccion: ' + $scope.direccion;

            shareByFacebook(message, function () {
            });
        };

        $scope.getInviteDetail = function () {

            modal.show();

            service.getInviteDetail({app_id: getUserOrAppId(), id: $scope.menu.id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.menu = result.data;

                    $scope.menu.portions = parseInt($scope.menu.portions);

                    $scope.invitados = $scope.menu.portions;

                    setTimeout(function () {
                        $('.preview').each(function () {

                            new ImageLoader($(this), new Image());

                        });

                    }, 500);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        $scope.getInviteDetail();

    });
});

module.controller('Units', function ($scope, service, $sce) {

    ons.ready(function () {

        $scope.search = '';

        initSearch($scope);

        $scope.buscar = function () {
            $scope.toggleSearch();
            $scope.getUnitsType();
        };

        $scope.goToUnit = function (item) {

            console.log(item);

            currentNavigator.pushPage('unit.html', {data: {unit: item}});
        };

        $scope.getUnitsType = function () {

            modal.show();

            service.getUnitsType({search: $scope.search}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.units = result.data;

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        $scope.getUnitsType();

    });
});

module.controller('Unit', function ($scope, service, $sce) {

    ons.ready(function () {

        $scope.unitType = currentNavigator.pages[currentNavigator.pages.length - 1].data.unit;

        $scope.search = '';

        initSearch($scope);

        $scope.buscar = function () {
            $scope.toggleSearch();
            $scope.getUnits();
        };

        $scope.showUnit = function (item) {

            alert(item.text);
        };

        $scope.getUnits = function () {

            modal.show();

            service.getUnits({type: $scope.unitType.id, search: $scope.search}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.units = result.data;

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function () {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });
        };

        $scope.getUnits();

    });
});

module.controller('Tutorials', function ($scope, service) {

    ons.ready(function () {

        $scope.tutorials = [];


        modal.show();

        $scope.goToTutorial = function (tutorial) {


            tutorialsNavigator.pushPage('tutorial.html', {data: {tutorial: tutorial}});
        };

        service.getTutorials({}, function (result) {

            if (result.status == 'success') {

                modal.hide();

                $scope.tutorials = result.data;

                setTimeout(function () {
                    $('.preview').each(function () {

                        new ImageLoader($(this), new Image());

                    });

                }, 500);

            } else {

                modal.hide();

                //alert(result.message);
            }

        }, function () {

            modal.hide();

            alert('No se pudo conectar con el servidor');
        });
    });
});

module.controller('Tutorial', function ($scope, service) {

    ons.ready(function () {

        $scope.tips = [];

        $scope.tutorial = tutorialsNavigator.pages[tutorialsNavigator.pages.length - 1].data.tutorial;

        setTimeout(function () {
            $('.preview').each(function () {

                new ImageLoader($(this), new Image());

            });

        }, 100);
    });

});

module.controller('RegisterFB', function ($scope, service) {

    ons.ready(function () {


        if (!document.location.protocol == 'http:') {

            $scope.register = function () {

                $scope.fbLoginSuccess = function (userData) {

                    facebookConnectPlugin.api("me/?fields=id,first_name,last_name,email", ["email"],

                        function onSuccess(result) {

                            //alert(JSON.stringify(result));

                            $scope.user = {
                                name: result.first_name + ' ' + result.last_name,
                                email: result.email,
                                password: '',
                                token: '',
                                app_id: app_id,
                                device: device_name
                            };

                            service.registerUser($scope.user, function (result) {

                                if (result.status == 'success') {

                                    alert('El registro se realizó exitosamente')

                                    saveUser(result.user);

                                    modal.hide();
                                    mainNavigator.popPage();

                                } else {

                                    modal.hide();

                                    alert(result.message);
                                }
                            });

                        }, function onError(error) {
                            console.error("Failed: ", error);
                        }
                    );

                    //var token;

                    /*facebookConnectPlugin.getAccessToken(function(token) {

                     token = token;

                     console.log("Token: " + token);
                     });*/

                    //alert("UserInfo: " + JSON.stringify(userData));
                };

                facebookConnectPlugin.login(["public_profile", "email"],
                    $scope.fbLoginSuccess,
                    function (error) {
                        alert("" + error)
                    }
                );

            };

        } else {

            $scope.register = function () {

                modal.show();
                setTimeout(function () {

                    $scope.user = {
                        name: '',
                        email: '',
                        password: '',
                        token: '',
                        app_id: app_id,
                        device: device_name
                    };

                    service.registerUser($scope.user, function (result) {

                        if (result.status == 'success') {

                            saveUser(result.user);

                            modal.hide();
                            mainNavigator.popPage();

                        } else {

                            modal.hide();

                            alert(result.message);
                        }

                    });


                }, 200);
            }
        }

    });

});


/* Common function*/

function initCommonFunctions($scope, services) {

    $scope.makeFavorite = function (item) {

        if (getUser()) {

            modal.show();

            services.service.addToFavorite({app_id: getUserOrAppId(), food_id: item.id}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    alert(result.message);

                } else {

                    modal.hide();

                    alert(result.message);
                }

            }, function (error) {

                modal.hide();

                alert('No se pudo conectar con el servidor');
            });

        } else {

            mainNavigator.pushPage('register_fb.html');
        }
    }
}

function initSearch($scope) {

    $scope.showingSearch = false;

    $scope.toggleSearch = function () {

        if (!$scope.showingSearch) {

            $scope.showingSearch = true;

            setTimeout(function () {
                $('search-input').focus();
            }, 500);

        } else {

            $scope.showingSearch = false;
        }
    }
}

function formatMeetings(meetings) {

    var meetings_array = [];
    var current_expo_id = true;

    for (var i in meetings) {

        meeting = meetings[i];

        scheduled_start = moment(meeting['scheduled_start'], 'YYYY-MM-DD h:mm');

        meeting['scheduled_hour'] = scheduled_start.format('h:mm a');

        if (current_expo_id != meeting['expo_id']) {
            meeting['first_expo'] = true;
            current_expo_id = meeting['expo_id'];
        } else {
            meeting['first_expo'] = false;
        }

        meetings_array.push(meeting);
    }

    return meetings_array;
}

function getUser() {

    if (user == undefined) {

        if (localStorage.getItem(user_storage_key) != null && localStorage.getItem(user_storage_key) != undefined && localStorage.getItem(user_storage_key) != '' && localStorage.getItem(user_storage_key) != 'undefined') {

            user = JSON.parse(localStorage.getItem(user_storage_key));

        } else {

            user = undefined;
        }
    }

    if (user && (user.app_id == undefined || user.app_id == null || user.app_id == '')) {
        user = undefined;
    }

    return user;
}

function saveUser(user) {

    localStorage.setItem(user_storage_key, JSON.stringify(user));
}

function deleteUser() {

    localStorage.removeItem(user_storage_key);
    user = undefined;
}

function updateLanguage(l) {

    applicationLanguage = l;

    if (scopeLogin != undefined) {

        scopeLogin.labels = lang[applicationLanguage];
        scopeLogin.$apply();
    }

    if (scopeMeetings != undefined) {

        scopeMeetings.labels = lang[applicationLanguage];
        scopeMeetings.$apply();
    }

    moment.locale(applicationLanguage);

    localStorage.setItem('lang', applicationLanguage);
}

function alert(message, callback) {
    ons.notification.alert({
        message: message,
        // or messageHTML: '<div>Message in HTML</div>',
        title: 'Mensaje',
        buttonLabel: 'OK',
        animation: 'default', // or 'none'
        // modifier: 'optional-modifier'
        callback: function () {
            callback ? callback() : '';
        }
    });
}

function confirm(message, callback) {
    ons.notification.confirm({
        message: message,
        // or messageHTML: '<div>Message in HTML</div>',
        title: ('Confirmación'),
        buttonLabels: [t('yes'), t('no')],
        animation: 'default', // or 'none'
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            // -1: Cancel
            // 0-: Button index from the left
            if (index == 0) {
                callback ? callback(index) : '';
            }
        }
    });
}

function t(label) {

    if (lang[applicationLanguage][label] == undefined) {
        return label;
    } else {
        return lang[applicationLanguage][label]
    }
}

function getUserOrAppId() {

    user = getUser();

    if (!user) {

        return app_id;

    } else {

        return user.app_id;
    }
}

function shareByEmail(message, callback) {

    window.plugins.socialsharing.shareViaEmail(
        message, // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
        '¿Cocinamos?',
        null, // TO: must be null or an array
        null, // CC: must be null or an array
        null, // BCC: must be null or an array
        [], // FILES: can be null, a string, or an array
        callback, // called when sharing worked, but also when the user cancelled sharing via email (I've found no way to detect the difference)
        function (error) {
            alert(error)
        } // called when sh*t hits the fan
    );
}

function shareBySMS(message, callback) {
    window.plugins.socialsharing.shareViaSMS(message, null /* see the note below */, callback, function (msg) {
        alert('error: ' + msg)
    });
}

function shareByWhatsApp(message, callback) {
    window.plugins.socialsharing.shareViaWhatsApp(message, null /* img */, null /* url */, callback, function (errormsg) {
        alert(errormsg)
    });
}

function shareByFacebook(message, callback) {
    window.plugins.socialsharing.shareViaFacebook(message, null /* img */, null /* url */, callback, function (errormsg) {
        alert(errormsg)
    })
}

function shareBy(message, img) {
    window.plugins.socialsharing.share(
        message,
        'Compartir',
        [img],
        WEB_URL);
}
