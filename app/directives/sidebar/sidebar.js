angular.module('soundmist').directive('sidebar', function (API) {
  return {
    restrict: 'E',
    scope: false,
    replace: false,
    templateUrl: 'directives/sidebar/sidebar.html',
    controller: function ($scope, $q, API, Handler) {
      API.ready.promise.then(() => {
        $scope.user = cache.user
        $scope.playlists = cache.playlists
        
        Handler.setLoaded()
      })
    }
  }
})
