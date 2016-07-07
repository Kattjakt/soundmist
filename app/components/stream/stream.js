angular.module('soundmist').controller('stream', function ($scope, Handler, API) {

  API.getStream().then(stream => {
    $scope.stream = stream.collection
  })
})
