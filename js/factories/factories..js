// Factory get data
app.factory('firebaseFactory',function($firebase){
  var factory = {};
  factory.getObject = function(table){
    var url = 'https://sctttapp.firebaseio.com/' + table;
    var ref = new Firebase(url)
    var obj = $firebase(ref).$asObject();
    return obj;
  };

  factory.getFirebaseRef = function(table){
    var url = 'https://sctttapp.firebaseio.com/' + table;
    var ref = new Firebase(url)
    var firebase = $firebase(ref);
    return firebase;
  };

  return factory;
});// End of firebaseFactory