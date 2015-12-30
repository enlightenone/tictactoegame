// Factory get data
app.factory('firebaseFactory',function($firebase){
  var factory = {};
  factory.getObject = function(table){
    var url = 'https://sctttapp.firebaseio.com/' + table;
    var ref = new Firebase(url)
    var obj = $firebase(ref).$asObject();
    return obj;
  }; // End of factory.getObject function

  factory.getFirebaseRef = function(table){
    var url = 'https://sctttapp.firebaseio.com/' + table;
    var ref = new Firebase(url)
    var firebase = $firebase(ref);
    return firebase;
  };
 // End of factory.getFirebaseRef function
  factory.test = function(){
    console.log("hello from factory");
  };

  return factory;
});// End of firebaseFactory