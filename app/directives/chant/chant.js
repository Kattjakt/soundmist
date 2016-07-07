angular.module('soundmist').directive('chant', function ($http, $rootScope, API, Player) {
  return {
    restrict: 'E',
    scope: {
      item: '=item',
      queue: '=queue'
    },
    replace: true,
    transclude: true,
    templateUrl: 'directives/chant/chant.html',
    link: function (scope, element, attrs) {
      scope.Player = Player
      scope.API = API

      scope.tracks = []
      let tracks = []

      // Remove tracks from playlists that doesn't have an uri (invalid)
      scope.queue.map(item => {
        let valid_tracks = []
        if (item.type === 'playlist' || item.type === 'playlist-repost') {
          valid_tracks = item.playlist.tracks = item.playlist.tracks.filter(track => track.uri !== undefined)
        }

        tracks = tracks.concat(item.type === 'playlist' || item.type === 'playlist-repost' ? valid_tracks || [] : item.track || [])
      })
      scope.queue = tracks


      // Focus the first item in the playlist
      if (scope.item.type === 'playlist' || scope.item.type === 'playlist-repost') {
        scope.item.track = scope.item.playlist.tracks[0]
        scope.tracks = scope.item.playlist.tracks

        // Watch for track change and set focus to new index in playlist
        scope.$watch('Player.getActive()', function (active) {
          let index = scope.tracks.indexOf(Player.getActive())
            scope.item.track = scope.tracks[index] || scope.tracks[0]
        }, true)
      }


      // Show human-friendly text
      switch (scope.item.type) {
        case 'playlist':
          scope.annotation = 'reposted a playlist'
          break
        case 'playlist':
          scope.annotation = 'posted a playlist'
          break
        case 'track-repost':
          scope.annotation = 'reposted a track'
          break
        case 'track':
          scope.annotation = 'posted a track'
          break
      }

      // Request high-res song artwork
      if (scope.item.track == undefined) return
      var url = scope.item.track.artwork_url
      if (url) {
        scope.item.track.artwork_url_larger = url.replace('large.jpg', 't500x500.jpg')
      }


      class Waveform {
        constructor (sample) {
          this.canvas   = element.find('canvas')[0]
          this.context  = this.canvas.getContext("2d")
          this.parent   = this.canvas.parentElement
          this.sample   = sample
          this.width    = 0

          this.canvas.addEventListener('click', event => {
            this.click(event.offsetX)
          }, false)
        }

        draw (progress) {
          this.width = this.parent.offsetWidth
          let height = this.parent.offsetHeight
          let middle = height / 2
          let barWidth = 1

          progress = this.width * progress

          this.canvas.style.width   = this.width + 'px'
          this.canvas.style.height  = height + 'px'
          this.canvas.width         = this.width
          this.canvas.height        = height

          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

          // Normalize height
          let samples_max = Math.max.apply(Math, this.sample)
          let ratio = height / samples_max

          for (var i = 0; i < this.width; i++) {
            let offset = Math.round((this.sample.length / this.width) * i * barWidth)

            let hasElapsed = progress && i * barWidth < progress

            // Top half
            this.context.fillStyle = hasElapsed ? "#ff8820" : "#cbcbcb"
            this.context.fillRect(i * barWidth, middle, 2, (-this.sample[offset] * ratio) / 2)

            // Bottom half
            this.context.fillStyle = hasElapsed ? "#ff9f4c" : "#dcdcdc"
            this.context.fillRect(i * barWidth, middle, 2, (this.sample[offset] * ratio) / 3)
          }
        }

        click (position) {
          if (!Player.isPlaying(scope.item.track)) {
            console.log('starting song ...')
            Player.play(scope.item.track, scope.queue)
          }

          Player.setProgress(scope.item.track, position / this.width)
        }
      }

      $http.get(scope.item.track.waveform_url).then(data => {
        let samples = data.data.samples
        let waveform = new Waveform(samples)

        $rootScope.$on('WINDOW_RESIZE', event => {
          waveform.draw()
        })

        $rootScope.$on('SITE_LOADED', event => {
          waveform.draw()
        })

        scope.$watch('Player.getProgress(item.track)', function (progress) {
          waveform.draw(progress)
        }, true)
      })
    }
  }
})
