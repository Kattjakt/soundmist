angular.module('soundmist').controller('stream', function ($scope, Handler, API) {

  API.getStream().then(stream => {
    $scope.stream = stream.collection
    console.log(stream.collection)
    $scope.queue = stream.collection.map(item => item.track)
  })
})
