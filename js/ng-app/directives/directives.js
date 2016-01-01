app.directive('gameTemplate', function($location){
   return {
      restrict: 'E',
      templateUrl: function(elem, attr){
        console.log(attr.type);
        return  'templates/'+ attr.type + '.html';
      }
   }
});