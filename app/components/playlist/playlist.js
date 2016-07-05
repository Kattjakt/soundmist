angular.module('soundmist').controller('playlist', function ($scope, $stateParams, API) {
  if (!cache.playlists) {
    return
  }

  let id = Number($stateParams.id)
  if (!id) console.error('dude')

  let playlists = cache.playlists.filter(playlist => {
    return playlist.id === id
  })

  $scope.playlist = playlists[0]
  console.log($scope.playlist)

  /*API.getPlaylist().then(stream => {
    $scope.stream = stream.collection;
  })*/
})
