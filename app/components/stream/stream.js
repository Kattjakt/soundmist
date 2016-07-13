angular.module('soundmist').controller('stream', function ($scope, API) {

  API.getStream(true).then(stream => {
    $scope.stream = stream
  })

  $scope.fetchPage = function () {
    API.getStream().then(stream => {
      $scope.stream = stream
    })
  }
})
