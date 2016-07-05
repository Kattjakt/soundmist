'use strict'

angular.module('soundmist').service('Player', class {
  constructor ($rootScope, $http, ngAudio, API) {
    this.scope = $rootScope
    this.Audio = ngAudio
    this.API = API

    this.Player = null
    this.currentItem = null
    this.volume = 100
    this.paused = false
    this.repeat = false
    this.shuffle = false
    this.queue = []

    this.scope.$watch(() => {
      if (this.Player) return this.Player.progress || 0
    }, progress => {
      if (progress === 1) {
        if (this.repeat) {
          console.log('repeat song')
          this.play(this.currentItem)
        } else {
          console.log('next song')
          this.next()
        }
      }
    })
  }

  next () {
    console.warn(this.currentItem, this.queue)
    let index = this.queue.indexOf(this.currentItem)
    var max = this.queue.length
    if (index + 1 === max) {
      console.log('> max of queue')
      return
    }

    this.play(this.queue[index + 1], this.queue)
  }

  previous () {
    let index = this.queue.indexOf(this.currentItem)
    if (index === 0) {
      console.log('< 0 of queue')
      return
    }

    this.play(this.queue[index - 1], this.queue)
  }

  play (item, queue) {
    this.queue = queue || []

    if (item === undefined) {
      this.Player.play()
      this.paused = false
      return
    }

    if (item === this.currentItem && !this.isPlaying(item)) {
      this.Player.play()
    } else {
      this.currentItem = item
      console.log('set currentItem')

      if (this.Player) {
        this.Player.stop()
      }

      this.Player = this.Audio.load(this.API.getStreamURL(item))
      this.Player.play()

      this.scope.$emit('SHOW_HEADER')
    }

    this.paused = false
  }

  pause (item) {
    if (this.Player) {
      this.Player.pause()
      this.paused = true
    }
  }

  isActive (item) {
    return item === this.currentItem
  }

  getActive () {
    return this.currentItem
  }

  isPlaying (item) {
    return this.isActive(item) && this.paused === false
  }

  setProgress (item, progress) {
    if (this.isActive (item)) {
      this.Player.setProgress(progress)
    }
  }

  getProgress (item) {
    if (item !== this.currentItem) return 0
    return this.Player.progress || 0
  }

  setVolume (volume) {
    this.volume = volume
    this.Player.volume = volume / 100
  }

  getVolume () {
    return this.volume
  }

  toggleRepeat () {
    this.repeat = !this.repeat;
  }

  isRepeat () {
    return this.repeat;
  }

  toggleShuffle () {
    this.shuffle = !this.shuffle;
  }

  isShuffle () {
    return this.shuffle;
  }

  toggleFavorite () {
    this.favorite = !this.favorite;
  }

  isFavorite (item) {
    return this.API.isFavorite(item || this.currentItem)
  }

  setFavorite (item) {
    this.API.setFavorite(item || this.currentItem)
  }

  removeFavorite (item) {
    this.API.removeFavorite(item || this.currentItem)
  }

})
