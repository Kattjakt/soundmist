angular.module('soundmist').directive('player', function (Player) {
  return {
    restrict: 'E',
    scope: false,
    replace: false,
    templateUrl: 'directives/player/player.html',
    link: function (scope, element) {
      scope.Player = Player
      let slider = angular.element(document.querySelector('#progress'))[0]
      let blocking = false

      scope.$watch('Player.getActive()', function (track) {
        if (track == undefined) return
        scope.track = track

        // Use the high-res artwork instead of the downscaled one provided
        var url = scope.track.artwork_url
        if (url) {
          url = url.replace('large.jpg', 't500x500.jpg')
        }

        scope.wallpaper = {
          'background': 'linear-gradient(rgba(255, 126, 0, 0.90),rgba(255, 119, 0, 0.75)), url(' + url + ')'
        }
      })

      scope.$watch('Player.getProgress(track)', function (progress) {
        if (!blocking) scope.progress = progress * 1000
      })

      slider.addEventListener('mousedown', event => {
        blocking = true
      })

      slider.addEventListener('mouseup', function (event) {
        if (blocking) {
          let x = event.pageX - this.offsetLeft
          let progress = x / slider.offsetWidth

          Player.setProgress(scope.track, progress)
          blocking = false
        }
      })
    }
  }
})
