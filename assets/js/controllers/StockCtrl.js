angular.module('ambrosia').controller('StockCtrl',
['$scope', '$rootScope', '$state', '$stateParams', '$location', '$window', '$mdDialog', '$q', 'seQuotes', 'seLedger',
function ($scope, $rootScope, $state, $stateParams, $location, $window, $mdDialog, $q, seQuotes, seLedger)
{

    $rootScope.loading = true

    $scope.ctrl = {
        chartTab : true,
        period : 'd',
        ask : 0,
        invested : 0,
        cost : 0,
        refresh : function() {
            var self = this
            this.refreshPending().then(function(){
              self.invest(0)
            })
        },
        refreshPending : function() {
            var deferred = $q.defer()
            var self = this
            seLedger.getPending(function(response){ 
                var stock = _.find(response, function(tick){ return tick.sym === $stateParams.ticker })
                if (stock != undefined) {
                    self.cost = stock.cost
                }
                deferred.resolve(stock)
            })
            return deferred.promise
        },
        invest : function (amount) {
            var timesy = this.actions.plus ? 1 : -1

            this.cost += timesy * amount
            if (this.cost < 0) { this.cost = 0 }
            this.invested = (this.cost / this.ask).toFixed(2)

            if ( this.invested > 0 ) {
              this.company.stockUserDetails.invested.value = 1 + this.company.stockUserDetails.invested.cache
            } else {
              this.company.stockUserDetails.invested.value = this.company.stockUserDetails.invested.cache
            }

            this.company.stockUserDetails.adj.cache = this.company.stockUserDetails.adj.calc(
                this.company.stockUserDetails.transaction.cache , this.company.stockUserDetails.invested.value
            )

            this.company.stockUserDetails.adj.value = '$' + this.company.stockUserDetails.adj.cache

            return
        },
        actions : {
            plus: true,
            commentEx : false,
            commentIcon : function (expanded) {
                return expanded ? 'ion-chevron-down' : 'ion-chevron-up'
            },
            commentUserBase : 'assets/img/test/',
            commentUsers : [
                'test_other_01.png',
                'test_other_02.png',
                'test_other_03.png',
                'test_other_04.png',
                'test_other_05.png',
                'test_other_06.png',
                'test_other_07.png',
                'test_other_08.png',
                'test_other_09.png',
                'test_other_10.png',
            ],
        },
        company : {},
        data : [],
    }

    $scope.modal = {
        showConfirm : function(ev) {
            var tContent = "Are you sure you want to purchase " + $scope.ctrl.invested + " shares of " +
                $scope.ctrl.tickerAbbrv + " for $" + $scope.ctrl.cost + "?"

            console.log(tContent)

            var confirm = $mdDialog.confirm()
              .title('Please confirm your purchase')
              .content(tContent)
              .ariaLabel('Purchase')
              .targetEvent(ev)
              .ok('Proceed')
              .cancel('Cancel')

            $mdDialog.show(confirm).then(function() {
              console.log('purchasing')
              seLedger.submitPending($scope.ctrl.company.name, $scope.ctrl.tickerAbbrv, $scope.ctrl.cost, function(data){
                console.log('purchased!')
                $scope.ctrl.refreshPending()
              }, function(err){
                console.log(err)
                console.log('error purchasing')
              })
            }, function() {
              console.log('cancelled!')
            })
        }
    }

    if ('ticker' in $stateParams) {

        $scope.ctrl.tickerAbbrv = $stateParams.ticker

        seQuotes.getCompany($scope.ctrl.tickerAbbrv).then(function(company){
           $scope.ctrl.ask = company.ask
           var newMeta = {}
           _.each(company,function(value,key){
            if (key !== 'meta') {
                newMeta[key] = value
            }
           })
           delete company.meta['_id']
           $scope.ctrl.company = {
            meta : company.meta,
            snapshot : newMeta,
            name : company.name || company.meta.name,
            abbr : company.symbol,
            stockDetails : [
                { key : 'Ask', value : company.ask },
                { key : 'Day Low', value : company.daysLow },
                { key : 'Day High', value : company.daysHigh }
            ],
           }
           console.log($scope.ctrl.company)
           seQuotes.getCompanyLedger($scope.ctrl.tickerAbbrv).then(function(company2){
             $scope.ctrl.company.info = company2
           })
           $scope.ctrl.refreshPending().then(function(resp){
             console.log('refresh', resp)
             seQuotes.getPendingList($scope.ctrl.tickerAbbrv).then(function(list){
               console.log('finished')
               console.log(list)
               var companyList = list
               console.log(companyList)
               $scope.ctrl.company.comments = _.map(companyList.comments,
                 function(comment){ return {
                     photo: $scope.ctrl.actions.commentUserBase + $scope.ctrl.actions.commentUsers[chance.integer({ min: 0, max: companyList.comments.length - 1 })],
                     user: comment.user,
                     text: comment.text,
                 }
               })
               var invested = companyList.invested
               if ($scope.ctrl.cost > 0){
                 invested -= 1
               }
               var transaction = companyList.buyFee
               var calc = function (transaction, invested) {
                 console.log("calc", transaction, invested, (parseFloat(transaction) / parseFloat(invested)).toFixed(2))
                 if (invested <= 0) {
                    return parseFloat(transaction).toFixed(2)
                 }
                 return (parseFloat(transaction) / parseFloat(invested)).toFixed(2)
               }
               var adj = calc(transaction, invested)
               $scope.ctrl.company.stockUserDetails = {
                 invested : { desc: 'The number of users investing in this stock',
                     key : 'Users Invested:', value : invested, cache : invested },
                 transaction : { desc: 'The cost to normally purchase this stock',
                     key : 'Transaction Price:', value : "$" + transaction, cache : transaction },
                 adj : { desc: 'The cost that you pay to purchase this stock',
                     key : 'Adj. Transaction Price:', value : "$" + adj, cache : adj, calc : calc },
               }
               $scope.ctrl.invest(0)
               checkLoaded()
             })
           })
        })

        seQuotes.getOne($scope.ctrl.tickerAbbrv, $scope.ctrl.period).then(function(response){
            $scope.ctrl.data = response
            console.log(seQuotes.convertHighcharts($scope.ctrl.data))

            $('#container').highcharts('StockChart', {
                exporting: { enabled: false },
                chart: { type: 'columnrange', backgroundColor: null },
                rangeSelector: { selected: 2 },
                yAxis: { labels : { enabled : false }},
                title: { text: '' },
                tooltip: { valuePrefix: '$' },
                series: [{ name: 'Prices', data: seQuotes.convertHighcharts($scope.ctrl.data) }]
            });
            checkLoaded()
        })
    }

    function checkLoaded() {
        console.log("Checking loaded")
        if ('stockUserDetails' in $scope.ctrl.company && 'data' in $scope.ctrl && $scope.ctrl.data.length > 0 && Object.keys($scope.ctrl.company.stockUserDetails).length > 0) {
            $rootScope.loading = false
        }
    }
}])