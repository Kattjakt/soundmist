'use strict'

angular.module('soundmist').service('API', class {
  constructor ($http, $q, $rootScope) {
    this.API_V1 = 'https://api.soundcloud.com/';
    this.API_V2 = 'https://api-v2.soundcloud.com/';
    this.$http = $http;
    this.$q = $q;


    window.cache = {}
    cache.stream = {}
    cache.IDs = {}

    this.getFavoritesByID().then(ids => window.cache.favorites = ids)
    this.getUser().then(user => window.cache.user = user)
    this.getPlaylists().then(playlists => {
      window.cache.playlists = playlists

      cache.IDs.playlists = playlists.map(item => {
        return {
          id: item.id,
          title: item.title
        }
      })
    })

    // Check if we've loaded enough data to display the page
    this.ready = $q.defer()
    $rootScope.$watch(() => {
      return cache.playlists && cache.user
    }, finished => {
      if (!finished) return
      this.ready.resolve()
    })
  }

  getUser (force) {
    if (cache.user && !force) {
      console.log('got user from cache')
      return cache.user
    }

    let config = {
      method: 'GET',
      url: this.API_V2 + 'me',
      params: {
        oauth_token: token
      }
    }

    return this.$http(config).then(response => {
      return cache.user = response.data
    })
  }

  getPlaylists (force) {
    if (cache.playlists && !force) {
      console.log('got playlists from cache')
      return this.$q.resolve(cache.playlists)
    }

    let config = {
      method: 'GET',
      url: this.API_V1 + 'me/playlists',
      params: {
        oauth_token: token
      }
    }

    return this.$http(config).then(response => {
      return cache.playlists = response.data
    })
  }

  getStream (clear) {
    if (clear) {
      this.streamURL = undefined
    }

    let config = {
      method: 'GET',
      url: this.streamURL || this.API_V2 + 'stream',
      params: {
        oauth_token: token,
        limit: 20
      }
    }

    return this.$http(config).then(response => {
      let data = response.data

      if (this.streamURL) {
        this.streamURL = data.next_href
        return cache.stream = cache.stream.concat(data.collection)
      } else {
        this.streamURL = data.next_href
        return cache.stream = data.collection
      }
    })
  }

  getFavoritesByID () {
    let self = this;
    let deferred = this.$q.defer();
    let ids = [];

    (function fetch (page) {
      let url = page || 'https://api.soundcloud.com/me/favorites/ids.json'

      let config = {
        method: 'GET',
        url: url,
        params: {
          oauth_token: token,
          linked_partitioning: 1,
          limit: 100
        }
      }

      return self.$http(config).then(response => {
        let data = response.data;
        if (!data) deferred.reject();

        ids = ids.concat(data.collection)

        if (data.hasOwnProperty('next_href')) {
          return fetch(data.next_href)
        } else {
          deferred.resolve(ids)
        }
      }, response => {
        deferred.reject();
      })
    })()

    return deferred.promise
  }

  getFavorites (clear) {
    if (clear) {
      this.next_href = undefined
    }

    let config = {
      method: 'GET',
      url: this.next_href || this.API_V1 + 'me/favorites',
      params: {
        oauth_token: token,
        linked_partitioning: 1,
        limit: 20
      }
    }

    return this.$http(config).then(response => {
      let data = response.data

      if (this.next_href) {
        this.next_href = data.next_href
        return cache.likes = cache.likes.concat(data.collection)
      } else {
        this.next_href = data.next_href
        return cache.likes = data.collection
      }
    })
  }

  isFavorite (track) {
    if ('favorites' in window.cache && track) {
      return cache.favorites.indexOf(track.id) > -1
    }
  }

  setFavorite (track) {
    console.log(track)
    let config = {
      method: 'PUT',
      url: this.API_V1 + 'users/' + cache.user.id + '/favorites/' + track.id + '.json',
      params: {
        oauth_token: token
      }
    }

    return this.$http(config).then(response => {
      if (cache.favorites.indexOf(track.id) == -1) {
        cache.favorites.push(track.id)
      }

      return true
    })
  }

  removeFavorite (track) {
    let config = {
      method: 'DELETE',
      url: this.API_V1 + 'users/' + cache.user.id + '/favorites/' + track.id + '.json',
      params: {
        oauth_token: token
      }
    }

    return this.$http(config).then(response => {
      if (cache.favorites.indexOf(track.id) > -1) {
        cache.favorites.splice(cache.favorites.indexOf(track.id), 1)
      }

      return true
    })
  }

  getStreamURL (track) {
    return track.uri + '/stream?oauth_token=' + token
  }
})
