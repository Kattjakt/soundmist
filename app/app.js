angular.module('soundmist', ['ui.router', 'ngMaterial', 'ngAnimate', 'ngAudio']);

angular.module('soundmist').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(false);

  $urlRouterProvider.otherwise('/stream')

  $stateProvider
    .state('stream', {
      url: '/stream',
      templateUrl: 'components/stream/stream.html',
      controller: 'stream'
    })
    .state('charts', {
      url: '/charts',
      templateUrl: 'components/charts/charts.html',
      controller: 'charts'
    })
    .state('playlist', {
      url: '/playlist/:id',
      templateUrl: 'components/playlist/playlist.html',
      controller: 'playlist'
    })
    .state('likes', {
      url: '/likes',
      templateUrl: 'components/likes/likes.html',
      controller: 'likes'
    })
});

angular.module('soundmist').run(function ($rootScope, Handler) {
  $rootScope.Handler = Handler
  $rootScope.hideHeader = true

  $rootScope.$watch('Handler.isLoaded', function (value) {
    $rootScope.$emit('SITE_LOADED')
  }, true)

  angular.element(window).on('resize', () => {
    $rootScope.$emit('WINDOW_RESIZE')
  })

  $rootScope.$on('SHOW_HEADER', () => {
    $rootScope.hideHeader = false;
  })
})
