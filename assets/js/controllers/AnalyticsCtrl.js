angular.module('ambrosia').controller('AnalyticsCtrl',
['$scope', '$http', '$rootScope', '$state', '$timeout', '$q', '$mdDialog', 'sePrincipal', 'seLedger', 'seQuotes',
function ($scope, $http, $rootScope, $state, $timeout, $q, $mdDialog, sePrincipal, seLedger, seQuotes)
{

    $rootScope.loading = true

      $scope.ctrl = { 
        titlePending : 'Pending Transactions',
        purchaseTime : moment().day(3).unix(),
        totalCost : 0,
        pending : [],
    }

    console.log(moment().unix())
    console.log($scope.ctrl.purchaseTime)

    $scope.modal = {
        showConfirm : function(ev, index) {
            var tContent = "Are you sure you want to delete your order with " + $scope.ctrl.pending[index].sym + "?"

            console.log(tContent)

            var confirm = $mdDialog.confirm()
              .title('Please confirm pending deletion')
              .content(tContent)
              .ariaLabel('Delete')
              .targetEvent(ev)
              .ok('Delete')
              .cancel('Cancel')

            $mdDialog.show(confirm).then(function() {
              console.log('deleting')
              seLedger.removePending($scope.ctrl.pending[index].sym, function(deleted){
                console.log('removed!')
                $scope.ctrl.pending.splice(index,1)
                updateChart($scope.ctrl.pending)
              }, function(err){
                console.log(err)
                console.log('error purchasing shit')
              })
            }, function() {
              console.log('cancelled!')
            })
        }
    }

    $scope.chartPending = {
        exporting: { enabled: false },
        chart: { backgroundColor: null, plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, type: 'pie' },
        title: { text: '' },
        tooltip: { pointFormat: '{series.name}: <b>${point.y}</b> ({point.percentage:.1f}%)' },
        plotOptions: {
            pie: { allowPointSelect: true, cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: ${point.y} ({point.percentage:.1f}%)',
                    style: { color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black' }
                }
            }
        }
    }

    function updateChart(update){
        $scope.ctrl.pending = update
        var series = {
          name: 'Stocks',
          colorByPoint: true,
          data: _.map($scope.ctrl.pending, function(data){
            return { name : data.sym, y : data.cost }
          })
        }
        $scope.chartPending['series'] = [series]
        $('#container').highcharts($scope.chartPending)
    }

      seLedger.getPending(function(response){ 
        console.log(response) 

        $rootScope.loading = false

        updateChart(response)

        var promises = []
        _.each(response, function(stock){
          promises.push(seQuotes.getCompany(stock.sym).then(function(result){
            var deferred = $q.defer()
            var newStock = JSON.parse(JSON.stringify(stock))
            newStock.info = result
            if (newStock.info.change === null) {
                newStock.info.change = 0
            }
            if (newStock.info.name) {
              newStock.name = newStock.info.name
            }
            deferred.resolve(newStock)
            return deferred.promise
          }))
        })

        $q.all(promises).then(
          function(results){
            console.log("Finished!")
            console.log(results)

              $scope.ctrl.totalCost = _.reduce(results, function(memo, result){ return memo + result.cost }, 0)

            $scope.ctrl.pending = results

          },function(err){
            console.log(err)
        })
     })

}])