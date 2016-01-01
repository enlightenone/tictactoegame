// User Log in Users Controller
app.controller("UsersController",  function($scope, $firebase, firebaseFactory, gameFactory){
    $scope.uniId  = gameFactory.makeId();
        /*......define database................*/
    var fb = firebaseFactory.getFirebaseRef('players');
    var players = fb.$asObject();
      //var game = fb2.$asObject() ;
          /*........................................*/

    players.$bindTo($scope, 'players');

      $scope.chooseOption = function(option){
        if(option == 'red'){
          fb.$update(option, { occupied: true });
          fb.$update(option, { player: $scope.uniId });
        
          if((players.blue.occupied == true) 
            && (players.blue.player == $scope.uniId)){
            fb.$update('blue', {occupied: false, player: ""});
          } // end of (players.blue.occupied == true) && (players.blue.player == $scope.uniId) conditional statement block

          $scope.game.leaveButtonFlag = true ;
          $scope.game.$save();
          $scope.unseatedDisplay = true ;
        } else if (option == 'blue'){
          fb.$update(option, { occupied: true });
          fb.$update(option, { player: $scope.uniId });
  
          if((players.red.occupied == true) 
            && (players.red.player == $scope.uniId)){
            fb.$update('red', {occupied: false, player: ""});
          } // end of if (players.red.occupied == true) && (players.red.player == $scope.uniId) conditonal statement block

          $scope.game.leaveButtonFlag = true ;
          $scope.game.$save();
          $scope.unseatedDisplay = true ;
        } // End of if(option == 'red') conditional statement

        $scope.game.playButtonFlag = true;
        $scope.game.$save();
      }; // End of $scope.chooseOption function block

      //unseated function.
      $scope.unseated = function(){
        $scope.unseatedDisplay = false ;
        if(players.blue.player == $scope.uniId ){
            fb.$update('blue', {occupied: false, player: ""});
            $scope.abandonGame('blue');
         } else if(players.red.player == $scope.uniId ) {
            fb.$update('red', {occupied: false, player: ""});
            $scope.abandonGame('red');
         }

      }; // End of $scope.unseated function block
  
      $scope.abandonGame = function(s){
         if($scope.game.gameStart == true) {
            var answer = confirm('Steven\'s Tic Tac Toe \n\n\ Are you sure you want to quit the game?');
            if(answer){
             if(s == "blue"){
                $scope.player.redTotalScores = 0;
                $scope.player.$save();
                $scope.game.redWinBlueQuit = true;
                $scope.game.outcome = "";
                $scope.game.$save();
                $scope.resetGrand(); 
              } else if (s == "red") {
                $scope.player.blueTotalScores = 0; 
                $scope.player.$save();
                $scope.game.blueWinRedQuit = true; 
                $scope.game.outcome = "";
                $scope.game.$save();
                $scope.resetGrand(); 
              } // End of if (s== "blue") else if conditional statement block
            } else {
                $scope.unseatedDisplay = true ;
                console.log($scope.unseatedDisplay);
                fb.$update( s, {occupied: true, player: $scope.uniId });

            }// End of if(answer) conditional statement block
         } // End of if($scope.game.gameStart == true) conditonal statement block
      }; // End of $scope.abandonGame function block

      $scope.resetGrand = function( ){
         $scope.game.turn = true;
         $scope.game.grid = ["","","","","","","","",""];
         $scope.game.colorSwitch.red = true;
         $scope.game.colorSwitch.blue = false;
         $scope.game.count = 0;
         $scope.game.playAgainFlag = false ;
         $scope.game.gameStart = false ;
         $scope.game.playButtonFlag = false;
         $scope.game.leaveButtonFlag = false ;
         $scope.game.$save();

         $scope.player.redTeam = ["","","","","",""];
         $scope.player.blueTeam = ["","","","","",""];
         $scope.player.redPosition = ["","","","","","","","",""];
         $scope.player.bluePosition = ["","","","","","","","",""];
         $scope.player.redCount = 0 ;
         $scope.player.blueCount = 0 ;
         $scope.player.redScore = ["","","","",""];
         $scope.player.blueScore = ["","","","",""] ;
         $scope.player.$save();

         $scope.mark = "";
         $scope.unseatedDisplay = false;

        fb.$set({
            red: {occupied: false, player: "", username: ""},
            blue: {occupied: false, player: "", username: ""}
            });
    }; // End of sresetGrand function block
}); // End of UsersController Controller block