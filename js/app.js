//var API_URL = 'http://localhost/fino_app/admin/api/'

var API_URL = 'http://cocinamosconfino.com/api/'

//var API_URL = 'http://192.168.43.129/fino_app/admin/api/'
//var API_URL = 'http://172.20.10.5/fino_app/admin/api/'

var module = ons.bootstrap('MyApp', ['services', 'ngSanitize']);

var applicationLanguage = 'es';
var user;
var user_storage_key = 'finoapp_user';

var lang = {
    en: {
        yes: 'Yes',
        no: 'No',
        confirmation: 'Confirmation',
        email_required: 'Email is required',
        email_invalid: 'Email is invalid',
        password_required: 'Password is required',
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
        email_required: 'Email es requerido',
        email_invalid: 'Email es inválido',
        password_required: 'Password es requerido',
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

module.controller('MainNavigatorController', function ($scope) {

    ons.ready(function () {

        localStorage.setItem('lang', applicationLanguage);

        if (getUser()) {

            mainNavigator.pushPage('home.html', {animation: 'none'});

        } else {

            mainNavigator.pushPage('intro.html', {animation: 'none'});
        }

        try {

            StatusBar.hide();

        } catch(error){

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

module.controller('Intro', function ($scope) {

    ons.ready(function () {

        $scope.labels = lang[applicationLanguage];

        $scope.updateLanguage = updateLanguage;

        $scope.login = function () {
            //mainNavigator.popPage();
            mainNavigator.pushPage('login.html');
        };

        $scope.register = function () {
            //mainNavigator.popPage();
            mainNavigator.pushPage('register.html');
        };

        $scope.saltar = function () {
            //mainNavigator.popPage();
            mainNavigator.pushPage('home.html');
        };


        try {
            navigator.splashscreen.hide();
        }catch(error){}

    });
});

module.controller('Login', function ($scope, service) {

    ons.ready(function () {

        $scope.user = {
            email: 'sisjosex@gmail.com',
            password: 'kalindor'
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

                    mainNavigator.pushPage('home.html');

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

module.controller('Register', function ($scope, service) {

    ons.ready(function () {

        $scope.user = {
            /*email: 'sisjosex@gmail.com',
             password: 'kalindor'*/
            email: '',
            password: '',
            token: '',
            app_id: '123',
            device: ''
        };

        $scope.register = function () {

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

            service.registerUser($scope.user, function (result) {

                if (result.status == 'success') {

                    saveUser(result.user);

                    mainNavigator.pushPage('home.html');

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

module.controller('Home', function ($scope, service, $sce) {

    ons.ready(function () {

        $scope.top_menu = true;

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        $scope.goToCategory = function () {
            menuNavigator.pushPage('category.html');
        };

        $scope.goToFavorite = function () {
            menuNavigator.pushPage('favorite.html');
        };

        $scope.goToMenuDetail = function (menu) {
            menuNavigator.pushPage('menu_detail.html', {data: {menu: menu}});
        };

        modal.show();

        service.getMenus({topmenu: 1}, function (result) {

            if (result.status == 'success') {

                modal.hide();

                console.log(result.data);

                $scope.menus = result.data;
                $scope.top_menu = result.top_menu;

                try {
                    navigator.splashscreen.hide();
                }catch(error){}

            } else {

                modal.hide();

                alert(result.message);

                try {
                    navigator.splashscreen.hide();
                }catch(error){}
            }

        }, function () {

            modal.hide();

            alert('No se pudo conectar con el servidor');
        });

    });
});

module.controller('MenuDetail', function ($scope, service, $sce) {

    ons.ready(function () {

        $scope.menu = menuNavigator.pages[menuNavigator.pages.length - 1].data.menu;

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        setTimeout(function () {
            $('.preview').each(function () {

                new ImageLoader($(this), new Image());

            });
        }, 100);

        initCommonFunctions($scope, {
            service: service
        });

        service.getMenu({id: $scope.menu.id}, function (result) {

            if (result.status == 'success') {

                modal.hide();

                $scope.menu = result.data;

            } else {

                modal.hide();

                alert(result.message);
            }

        }, function (error) {

            modal.hide();

            alert('No se pudo conectar con el servidor');
        });
    });
});

module.controller('Favorite', function ($scope, service, $sce) {

    ons.ready(function () {

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        initSearch($scope);

        $scope.normal = [];
        $scope.videos = [];
        $scope.total_menus = 0;
        $scope.total_videos = 0;
        $scope.search = '';

        setTimeout(function () {
            $('.preview').each(function () {

                new ImageLoader($(this), new Image());

            });
        }, 100);

        $scope.goToMenuDetail = function (menu) {
            menuNavigator.pushPage('menu_detail.html', {data: {menu: menu}});
        };


        modal.show();

        $('.menus .normal').show();
        $('.menus .video').hide();


        $scope.buscar = function () {
            $scope.toggleSearch();
            $scope.getFavorites({user_id: getUser().id, search: $scope.search});
        };

        $scope.filter = function (filter) {

            console.log(filter);

            $('.menus .normal').hide();
            $('.menus .video').hide();

            $('.menus .' + filter).show();
        };

        $scope.getFavorites = function () {

            service.getFavorites({user_id: getUser().id, search: $scope.search}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.normal = result.normal;
                    $scope.videos = result.videos;
                    $scope.total_menus = result.total_menus;
                    $scope.total_videos = result.total_videos;

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

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        $scope.search = '';

        $scope.buscar = function () {
            $scope.toggleSearch();
            $scope.getCategories();
        };

        $scope.goToMenuDetail = function (menu) {
            menuNavigator.pushPage('menu_detail.html', {data: {menu: menu}});
        };

        $scope.getCategories = function () {

            modal.show();
            service.getCategories({search: $scope.search}, function (result) {

                if (result.status == 'success') {

                    modal.hide();

                    $scope.categories = result.data;

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

        setTimeout(function () {
            $('.preview').each(function () {

                new ImageLoader($(this), new Image());

            });
        }, 100);
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
        }, 100);

        initCommonFunctions($scope, {
            service: service
        });
    });
});

module.controller('Calculator', function ($scope) {

    ons.ready(function () {

        $scope.goToPage = function (page) {

            calculatorNavigator.pushPage(page, {});
        };

        setTimeout(function () {
            $('.preview').each(function () {

                new ImageLoader($(this), new Image());

            });
        }, 100);
    });
});

module.controller('Counsel', function ($scope, service) {

    ons.ready(function () {

        $scope.tip_categories = [];

        modal.show();

        $scope.goToTipList = function (tip_category) {

            counselNavigator.pushPage('tip_list.html', {data: {category: tip_category}});
        };

        service.getTipCategories({}, function (result) {

            if (result.status == 'success') {

                modal.hide();

                $scope.tip_categories = result.data;

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

module.controller('TipList', function ($scope, service) {

    ons.ready(function () {

        $scope.tips = [];

        $scope.category = counselNavigator.pages[counselNavigator.pages.length - 1].data.category;

        modal.show();

        $scope.goToTip = function (tip) {

            console.log(tip);

            counselNavigator.pushPage('tip.html', {data: {tip: tip, category: $scope.category}});
        };

        service.getTips({tip_category_id: $scope.category.id}, function (result) {

            if (result.status == 'success') {

                modal.hide();

                $scope.tips = result.data;

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

module.controller('MyShopping', function ($scope) {

    ons.ready(function () {

    });
});

module.controller('Invite', function ($scope) {

    ons.ready(function () {

    });
});


function initCommonFunctions($scope, services) {

    $scope.makeFavorite = function (item) {

        modal.show();

        services.service.addToFavorite({user_id: getUser().id, food_id: item.id}, function (result) {

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

    return user;
}

function saveUser(user) {

    localStorage.setItem(user_storage_key, JSON.stringify(user));
}

function deleteUser() {

    localStorage.setItem(user_storage_key, undefined);
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
        title: t('message'),
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
        title: t('confirmation'),
        buttonLabels: [t('yes'), t('no')],
        animation: 'default', // or 'none'
        primaryButtonIndex: 1,
        cancelable: true,
        callback: function (index) {
            // -1: Cancel
            // 0-: Button index from the left
            callback ? callback(index) : '';
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
