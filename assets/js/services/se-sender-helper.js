angular.module('ambrosia').service('seSenderHelper',
['$rootScope', 'seMedia', function ($rootScope, seMedia) {

    var self = this

    self.print = function (response) {
      console.log(self.logName + " response: ", response)
    }

    seMedia.getMedia().then(function(meta){

    })

}]);