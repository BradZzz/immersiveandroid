angular.module('ambrosia').controller('AnalyticsCtrl',
['$scope', '$http', '$rootScope', '$state', '$timeout', '$q', '$mdDialog', '$window', 'sePrincipal', 'seLedger', 'seQuotes',
function ($scope, $http, $rootScope, $state, $timeout, $q, $mdDialog, $window, sePrincipal, seLedger, seQuotes)
{

    $rootScope.loading = true

      $scope.ctrl = { 
        bigChart : ($('#breakdown-container').width() >= 600),
        titlePending : 'Pending Transactions',
        purchaseTime : moment().day() > 3 ? moment().tz("America/Los_Angeles").add(1, 'weeks').day(3).endOf('day').format()
            : moment().tz("America/Los_Angeles").day(3).endOf('day').format(),
        totalCost : 0,
        totalUtility : 0,
        pending : [],
    }

    console.log(moment().unix() * 1000)
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
                    enabled: ($('#breakdown-container').width() >= 600),
                    format: '<b>{point.name}</b>: ${point.y} ({point.percentage:.1f}%)',
                    style: { color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black' }
                }
            }
        }
    }

    angular.element($window).bind('resize', function () {
        var big = ($('#breakdown-container').width() >= 600)
        console.log('resize', $scope.ctrl.bigChart, big)
        if (  $scope.ctrl.bigChart && !big ||   !$scope.ctrl.bigChart && big) {
            console.log('refresh')
            $scope.ctrl.bigChart = big
            $scope.chartPending.plotOptions.pie.dataLabels.enabled = big
            $('#breakdown-container').highcharts($scope.chartPending)
        }
    })

    function updateChart(update){
        console.log('updating', update)
        $scope.ctrl.pending = update
        var series = {
          name: 'Stocks',
          colorByPoint: true,
          data: _.map($scope.ctrl.pending, function(data){
            return { name : data.sym, y : data.cost }
          })
        }
        $scope.chartPending['series'] = [series]
        $('#breakdown-container').highcharts($scope.chartPending)

        $scope.ctrl.totalUtility = parseFloat(_.reduce($scope.ctrl.pending,
            function(memo, result){ return memo + result.totalFee }, 0).toFixed(2))
          $scope.ctrl.totalCost = parseFloat(_.reduce($scope.ctrl.pending,
            function(memo, result){ return memo + result.cost }, 0).toFixed(2))
    }

      seLedger.getPending(function(response){ 
        console.log(response) 

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
            //var pending = []

            seQuotes.getBuyPendingList(results).then(function(list){
               /*_.each(list, function(tick){
                 var loc = _.find(results, function(entry){ return entry.sym === tick.ticker })
                 if (loc !== undefined) {
                    loc.invested = tick.invested
                    loc.buyFee = tick.buyFee
                    loc.totalFee = parseFloat((parseFloat(loc.buyFee) / parseFloat(loc.invested)).toFixed(2))
                    pending.push(loc)
                    console.log('pushing', loc)
                 }
               })*/
               console.log("returned", list)
               updateChart(list)
               $rootScope.loading = false
            })
          },function(err){
            console.log(err)
        })
     })

}])