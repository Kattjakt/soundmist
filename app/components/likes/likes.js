angular.module('soundmist').controller('likes', function ($scope, API) {

  API.getFavorites(true).then(favorites => {
    $scope.likes = favorites
  })

  $scope.fetchPage = function () {
    API.getFavorites().then(favorites => {
      $scope.likes = favorites
    })
  }
})
