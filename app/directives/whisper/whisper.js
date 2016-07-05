angular.module('soundmist').directive('whisper', function (Player) {
  return {
    restrict: 'E',
    scope: {
      track: '=track',
      queue: '=queue'
    },
    replace: true,
    transclude: true,
    templateUrl: 'directives/whisper/whisper.html',
    link: function (scope, element, attrs) {
      scope.Player = Player

      let duration = scope.track.duration / 1000
      var minutes = '0' + Math.floor(duration / 60)
      var seconds = '0' + (duration - minutes * 60);
      scope.duration = minutes.substr(-2) + ':' + seconds.substr(-2);
    }
  }
})
