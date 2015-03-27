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

  // curated image library 
  var images = {
    'Chipotle Mexican Grill': 'http://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Chipotle_Mexican_Grill_logo.svg/1024px-Chipotle_Mexican_Grill_logo.svg.png',
    'In-N-Out': 'http://upload.wikimedia.org/wikipedia/en/thumb/f/f2/InNOut.svg/1280px-InNOut.svg.png',
    'California Pizza Kitchen': 'http://upload.wikimedia.org/wikipedia/en/thumb/7/73/California_Pizza_Kitchen.svg/1277px-California_Pizza_Kitchen.svg.png',
    'Subway': 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Subway_restaurant.svg/1024px-Subway_restaurant.svg.png',
    'McDonald\'s': 'http://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1000px-McDonald%27s_Golden_Arches.svg.png',
    'Burger King': 'http://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Burger_King_Logo.svg/768px-Burger_King_Logo.svg.png',
    'zpizza': 'http://zpizza.5291304.attractionsbook.com/parse/image.php?image_id=98674',
    'Super Duper Burger': 'http://www.superdupersf.com/images/superduper_logos-1.gif'
  };

  $scope.refresh = function(){
    $http.get('/api/going').then(function(res){
      // assign that data to var list
      var list = res.data;

     // iterate over restaurants to replace default images
     for(var i = 0; i < list.length; i++) {
      // replace images with curated images if they exist
      if(images[list[i].name]) {
        list[i].photo_url = images[list[i].name];
      // otherwise just create the url using the default image (google only supplies the photo id, we build the full url)
      } else {
        var photoKey = list[i].photo_url;
        list[i].photo_url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=' + photoKey + '&key=AIzaSyDUYAAHTfuH1FhBacOWtF01FZGjF7Sd3mc';
      }
     }
     // assigned curated restuarant list with new images to $scope.data
     $scope.data = list;
     console.log($scope.data);
    });
  
  }

  $scope.refresh();

  // query the sqlite db for restaurant data
  
  $scope.logout = function (){
    $scope.isLogged = !$scope.isLogged;
  };

  $scope.going = function(place){
    $http.post('/api/going/create', {id: place.id}).then(function(res){
      $scope.refresh();
    });
  }

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
