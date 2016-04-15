angular.module('ambrosia').service('seMedia',
['$http', '$q',
function ($http, $q)
{
  var self = this
  self.logName = 'seMedia'
  self.cache = {}

  self.getSearchFormatted = function (meta) {
    //These are just for checking so I dont have to recurse twice
    titles = []
    genres = []

    formattedMeta = []
    _.each(meta, function(dat){
      if (!_.contains(titles, dat.name) ) {
        titles.push(dat.name)
        formattedMeta.push({ value : dat.name, type : 'title' })
      }
      _.each(dat.genre, function(type){
        if (!_.contains(genres, type) ) {
          genres.push(type)
          formattedMeta.push({ value : type, type : 'genre' })
        }
      })
    })
    return formattedMeta
  }

  self.getMediaStatic = function () {
    if ('getMediaStatic' in self.cache) {
      var deferred = $q.defer()
        deferred.resolve(self.cache.getMediaStatic)
        return deferred.promise
    } else {
      return $http({
        url: '/cast/media/static',
        method: 'GET'
      }).then(function (response) {
        console.log(response)
        self.cache.getMediaStatic = response.data
        return response.data
      })
    }
  }

  self.getMedia = function () {
    if ('getMedia' in self.cache) {
      var deferred = $q.defer()
      deferred.resolve(self.cache.getMedia)
      return deferred.promise
    } else {
        return $http({
          url: '/cast/media',
          method: 'GET'
        }).then(function (response) {
          console.log(response)
          self.cache.getMedia = response.data
          return _.map(response.data, function(meta) {
            if (meta.episodes.length == 0) {
                meta.type = 'movie'
            } else {
                meta.type = 'tv'
            }
            return meta
          })
        })
    }
  }

  self.updateMedia = function () {
    return $http({
      url: '/cast/update',
      method: 'GET',
    }).then(function (response) {
      console.log(response)
      return response.data
    })
  }

}])