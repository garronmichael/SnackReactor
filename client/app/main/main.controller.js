'use strict';

var app = angular.module('snackReactorApp');
//refactor to services
app.controller('MainCtrl', function ($scope, $http, $log, $document, ModalService, $location, SearchRestaurants, SharedData) {

  $scope.isLogged = false;
  $scope.priceClick = false;
  $scope.is1healthClick = false;
  $scope.is2healthClick = false;
  $scope.is3healthClick = false;
  $scope.is1priceClick = false;
  $scope.is2priceClick = false;
  $scope.is3priceClick = false;
  $scope.healthRank=1;
  $scope.priceRank=1;
  $scope.searching = false;
  $scope.noResults = false;

  //empty array that will store three random objects.
  //used in our search function to generate results page.
  $scope.places = [];

  // $scope.data = [
  //  {"name": "Chipotle",
  //   "imageUrl": "http://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Chipotle_Mexican_Grill_logo.svg/1024px-Chipotle_Mexican_Grill_logo.svg.png",
  //   "count": 12},
  //  {"name": "In-N-Out",
  //   "imageUrl": "http://upload.wikimedia.org/wikipedia/en/thumb/f/f2/InNOut.svg/1280px-InNOut.svg.png"  ,
  //   "count": 5},
  //  {"name": "California Pizza Kitchen",
  //   "imageUrl": "http://upload.wikimedia.org/wikipedia/en/thumb/7/73/California_Pizza_Kitchen.svg/1277px-California_Pizza_Kitchen.svg.png",
  //   "count": 3}
  // ];

  // sends a request to obtain the dummy venue data from the data/data.js file commented out because I 
  // made the data the array directly
  $http.get('/api/going').then(function(res){
    // assign that data to $scope.data
    $scope.data = res.data;
    console.log($scope.data); 
  });

  $scope.logout = function (){
    $scope.isLogged = !$scope.isLogged;
  };

  $scope.search = function (view){
    $scope.noResults = false;
    $scope.searching = true;

    //save data in case we need to search again

    SharedData.set('health', $scope.healthRank);
    SharedData.set('price', $scope.priceRank);

    SearchRestaurants($scope.healthRank,$scope.priceRank)
    .success(function(data, status, headers, config){
      $scope.searching = false;
      SharedData.set('results', data);
      // SharedData.set('results', dummyData);
      $location.path(view);
    })
    .error(function(data,status, headers, config){
      $scope.searching = false;
      $scope.noResults = true;
      console.log(data);
    }); 

  }

  //Pardon the naive logic, just wanted to get this done.
  // $scope.healthClick1 = function (){
  //   if ($scope.is1healthClick && ($scope.is2healthClick || $scope.is3healthClick)){
  //     $scope.is2healthClick = false;
  //     $scope.is3healthClick = false;
  //     $scope.is1healthClick = false;
  //   }
  //   $scope.is1healthClick = !$scope.is1healthClick;
  //   if ($scope.is1healthClick){
  //     SearchRestaurants.health = $scope.healthRank=1;

  //   }else{
  //     SearchRestaurants.health = $scope.healthRank=1;
  //   }
  // }
  // $scope.healthClick2 = function (){
  //   SearchRestaurants.health = $scope.healthRank=2;
  //   if ($scope.is3healthClick){
  //     $scope.is3healthClick = false;
  //     return;
  //   }
  //   if ($scope.is2healthClick && $scope.is1healthClick){
  //     $scope.is1healthClick = $scope.is2healthClick = false;
  //     SearchRestaurants.health = $scope.healthRank=1;
  //     return;
  //   }
  //   $scope.is1healthClick = true;
  //   $scope.is2healthClick = true;
  // }
  // $scope.healthClick3 = function (){
  //   SearchRestaurants.health = $scope.healthRank=3;
  //   if ($scope.is1healthClick && $scope.is2healthClick && $scope.is3healthClick){
  //     $scope.is1healthClick = false;
  //     $scope.is2healthClick = false;
  //     $scope.is3healthClick = false;
  //     $scope.healthRank = 1;
  //     console.log($scope.healthRank);
  //     return;
  //   }
  //   $scope.is3healthClick = !$scope.is3healthClick;
  //   if ($scope.is1healthClick || $scope.is2healthClick || (!$scope.is1healthClick && !$scope.is2healthClick)){
  //     $scope.is1healthClick = true;
  //     $scope.is2healthClick = true;
  //     console.log($scope.healthRank);
  //     return;
  //   }
  // }
  // $scope.priceClick1 = function (){
  //   if ($scope.is1priceClick && ($scope.is2priceClick || $scope.is3priceClick)){
  //     $scope.is2priceClick = false;
  //     $scope.is3priceClick = false;
  //     $scope.is1priceClick = false;
  //   }
  //   $scope.is1priceClick = !$scope.is1priceClick;
  //   if ($scope.is1priceClick){
  //     SearchRestaurants.price= $scope.priceRank=1;
  //   }else{
  //     SearchRestaurants.price= $scope.priceRank=1;
  //   }
  // }
  // $scope.priceClick2 = function (){
  //   SearchRestaurants.price= $scope.priceRank=2;
  //   if ($scope.is3priceClick){
  //     $scope.is3priceClick = false;
  //     return;
  //   }
  //   if ($scope.is2priceClick && $scope.is1priceClick){
  //     $scope.is1priceClick = $scope.is2priceClick = false;
  //     $scope.priceRank=1;
  //     return;
  //   }
  //   $scope.is1priceClick = true;
  //   $scope.is2priceClick = true;
  // }
  // $scope.priceClick3 = function (){
  //   SearchRestaurants.price= $scope.priceRank=3;
  //   if ($scope.is1priceClick && $scope.is2priceClick && $scope.is3priceClick){
  //     $scope.is1priceClick = false;
  //     $scope.is2priceClick = false;
  //     $scope.is3priceClick = false;
  //     $scope.priceRank = 1;
  //     console.log($scope.priceRank);
  //     return;
  //   }
  //   $scope.is3priceClick = !$scope.is3priceClick;
  //   if ($scope.is1priceClick || $scope.is2priceClick || (!$scope.is1priceClick && !$scope.is2priceClick)){
  //     $scope.is1priceClick = true;
  //     $scope.is2priceClick = true;
  //     console.log($scope.priceRank);
  //     return;
  //   }
  // }
});

app.controller('ModalCtrl', function ($scope, $modal, $log, CheckLoggedIn) {
  $scope.items = [];
  $scope.open = function (size) {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      backdrop: 'static',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    });
  };

 CheckLoggedIn().then(function(result){

  if (!result.data){
    $scope.logout();
    $scope.open();
  }
 });

});

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, CheckLoggedIn) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
