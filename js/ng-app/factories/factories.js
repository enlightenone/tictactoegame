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
  }; // End of factory.getFirebaseRef function
  return factory;
});// End of firebaseFactory

app.factory('gameFactory',function(){
  var factory = {};

  factory.makeId = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }; // End of factory.makeId function

  return factory;
});// End of firebas