(function() {
'use strict';

angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController',NarrowItDownController)
        .service('MenuSearchService',MenuSearchService)
      //  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
        .directive('foundItems', FoundItems);

        function FoundItems() {
          var ddo = {
            templateUrl: 'items.thtml',
            scope: {
              items: '<',
              onRemove: '&'
            }
          };

          return ddo;
        }

NarrowItDownController.$inject=['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrowItDown = this;
  narrowItDown.found=[];

  //Implementaion for Filtering Items based on searchTerm
      narrowItDown.getMatchedMenuItems = function () {
        narrowItDown.found = []

          if(narrowItDown.searchTerm){
          var promise = MenuSearchService.getMatchedMenuItems(narrowItDown.searchTerm);
                  promise.then(function (response) {
                    narrowItDown.found = response;
                    console.log(  narrowItDown.found);
                  })
                  .catch(function (error) {
                    console.log("Something went terribly wrong.");
                  });
              }
          };

//testing functionality

// Implementaion for removing item at given index
   narrowItDown.removeItem = function (index) {
     narrowItDown.found.splice(index, 1);
     if (narrowItDown.found.length == 0) {
       narrowItDown.error = "Nothing found";
     }
   }

};




MenuSearchService.$inject=['$http'];
function MenuSearchService($http) {
var service = this;



  service.getMatchedMenuItems = function(searchTerm){
            return $http({
              method: "GET",
              url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
            })
            .then(function(result){
              // process result and only keep items that match
                  var items = result.data.menu_items;
                  var foundItems = []
                  for (var index = 0; index < items.length; index++) {
                    if (items[index].description.indexOf(searchTerm) != -1) {
                      foundItems.push(items[index]);
                    }
                  }
                  // return processed items
            return foundItems;
          });
  };
};


})();
