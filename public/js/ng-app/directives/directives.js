// Angular Directives
app.directive('gameTemplate', function($location){
  //This is reusable directive to render template for each section on main index.html page
   return {
      restrict: 'E',
      templateUrl: function(elem, attr){
        console.log(attr.type);
        return  'templates/'+ attr.type + '.html';
      }
   }
});