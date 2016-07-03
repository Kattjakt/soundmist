'use strict'

angular.module('soundmist').service('API', class {
  constructor ($http, $q) {
    this.API_BASE = 'https://api-v2.soundcloud.com/';
    this.$http = $http;
    this.$q = $q;

    this.getFavorites().then(ids => {
      window.favorites = ids;
      console.log(window.favorites)
    })
  }

  getStream () {
    let config = {
      method: 'GET',
      url: this.API_BASE + 'stream',
      params: {
        oauth_token: token,
        limit: 50
      }
    }

    return this.$http(config)
  }

  getFavorites () {
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

  isFavorite (item) {
    if ('favorites' in window && item.track) {
      return favorites.indexOf(item.track.id) > -1
    }
  }

  getStreamURL (item) {
    return item.track.uri + '/stream?oauth_token=' + token
  }
})
