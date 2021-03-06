app.controller("GameController",  function($scope, $firebase, $location, firebaseFactory){
	// game related variables
  $scope.game = firebaseFactory.getObject('game');
  $scope.player = firebaseFactory.getObject('player');
  $scope.players = firebaseFactory.getFirebaseRef('players');

  $scope.setDefaultValues = function(){
    // This function is to reset the game and set all the variables values to default at 
    // the start of the game and in case the players reload their browsers in the middle of 
    // the game.
    $scope.game.grid =["","","","","","","","",""];
    $scope.game.turn = true ;
    $scope.game.outcome = "" ;
    $scope.game.colorSwitch = {red: true, blue: false};
    $scope.game.count = 0 ;
    $scope.game.initiate = false ;
    $scope.game.playAgainFlag = false;
    $scope.game.gameStart = false ;
    $scope.game.playButtonFlag = false;
    $scope.game.leaveButtonFlag = false ;
    $scope.game.redWinFlag = false;
    $scope.game.blueWinFlag = false;
    $scope.game.drawFlag = false;
    $scope.game.redWinGame = false;
    $scope.game.blueWinGame = false;
    $scope.game.redWinBlueQuit = false;
    $scope.game.blueWinRedQuit = false;  
    $scope.game.$save();

    // player related variables
    //$scope.player = getPlayer(); // data initialization
    $scope.player.redScore = ["","","","",""];
    $scope.player.blueScore = ["","","","",""] ;
    $scope.player.redTeam = ["","","","",""];
    $scope.player.blueTeam = ["","","","",""];
    $scope.player.redPosition = ["","","","","","","","",""];
    $scope.player.bluePosition = ["","","","","","","","",""];

    $scope.player.redTotalScores = 0 ;
    $scope.player.blueTotalScores = 0 ;
    $scope.player.redCount = 0;
    $scope.player.blueCount = 0 ;
    $scope.player.$save();

    $scope.players.$update('red', { occupied: false });
    $scope.players.$update('red', { player: "" });
    $scope.players.$update('blue', { occupied: false });
    $scope.players.$update('blue', { player: "" });
    $scope.mark = "";

    // blue and red string join
    $scope.blueJointStr = "";
    $scope.redJointStr = "";
  }// End of setDefaultValues function

 $scope.setDefaultValues();

 // The primary task of this function is to switch the turn of the players,
 // mark the space on the grid and save the player's option to firebase database.
 $scope.gamePlay = function(g, p){
  $scope.game.count++;
  $scope.game.outcome = "" ;
  $scope.game.$save();
            
  if($scope.game.grid[g] == ""){    // function to disable the space after being chosen.   
		if ($scope.game.turn){
			$scope.mark ="X";
			$scope.player.redPosition[g] = p ;
			$scope.player.redTeam.push(p);
			$scope.player.$save();
			$scope.game.grid[g] = $scope.mark ;
			$scope.game.$save();
			$scope.colorSwitch($scope.game.turn);
      $scope.game.turn = false;
      $scope.game.$save();
		} else {
			$scope.mark ="O";
			$scope.player.bluePosition[g] = p ;
			$scope.player.blueTeam.push(p);
			$scope.player.$save();
			$scope.game.grid[g]= $scope.mark;
			$scope.game.$save();
			$scope.colorSwitch($scope.game.turn);
			$scope.game.turn = true;
			$scope.game.$save();
		} // End of if ($scope.game.turn) conditional statement
  	$scope.outcomeCalculate();
   } // End of if($scope.game.grid[g] == "") conditional statement
  }; // End of gamePlay function
	
  // This function is to indicate player's turn by highlighting 
  // border of the scoreboard according to the color of the player
	$scope.colorSwitch = function(t){
		if (t){
			 $scope.game.colorSwitch.red = true;
			 $scope.game.colorSwitch.blue = false;
			 $scope.game.$save();
		} else {
			 $scope.game.colorSwitch.red = false;
			 $scope.game.colorSwitch.blue = true;
			 $scope.game.$save();
		} // End of if (t) conditonal atatement block
	}; // End of $scope.colorSwitch function

  // This function includes logic to decide the winning outcome of the game.
	$scope.outcomeCalculate = function(){
	 var winCombo = ["111","222","333"];
	 // outcome variable
   var redOutcome = null ;
   var blueOutcome = null;
	 var redString = $scope.player.redTeam.join("") ;
	 var blueString = $scope.player.blueTeam.join("");
   $scope.blueJointStr = blueString;
   $scope.redJointStr = redString;

   // outcome determination function
   function stringMatch(a, player, position) {
      var combinedReg = "("+ a.join("|") +")";
      var jointString = player.sort().join("");
      var matchResult = jointString.match(combinedReg);
      var positionArray = [ ( String(position[0]) + String(position[3]) + String(position[6]) ),
    			  ( String(position[1]) + String(position[4]) + String(position[7]) ), 
    			  ( String(position[2]) + String(position[5]) + String(position[8]) ), 
    			  ( String(position[0]) + String(position[4]) + String(position[8]) ), 
    			  ( String(position[2]) + String(position[4]) + String(position[6]) )] ; 

      if (matchResult){
        return matchResult;
      } else {
         for (i=0; i < positionArray.length ; i++ ) {
         	 if (positionArray[i] == "123"){
         	 		  return true ;
         	  } // End of if(postiionArray[i]) conditonal statement
         }; // End of for loop 
      } // End of if(matchResult) conditional statement
			return jointString.match(combinedReg); 
    } // End of stringMatch function

		$scope.redOutcome = stringMatch(winCombo, $scope.player.redTeam, $scope.player.redPosition),
		$scope.blueOutcome = stringMatch(winCombo, $scope.player.blueTeam, $scope.player.bluePosition) ;

		$scope.outcomeDisplay = function(red, blue){
	  	if(red){
        $scope.game.outcome = "Red Team Won This Round" ;
        $scope.game.redWinFlag = true;
        $scope.game.blueWinFlag = false;
        $scope.game.drawFlag = false;
        $scope.game.redWinBlueQuit = false;
        $scope.game.blueWinRedQuit = false; 
        $scope.game.$save();

        $scope.player.redScore[$scope.player.redCount] = true ;
        $scope.player.$save();
        $scope.player.redCount++;

        $scope.reset();
        $scope.gameWinningFunction();
      } else if (blue){
        $scope.game.outcome = "Blue Team Won This Round";
        $scope.game.redWinFlag = false;
        $scope.game.blueWinFlag = true;
        $scope.game.drawFlag = false;
        $scope.game.redWinBlueQuit = false;
        $scope.game.blueWinRedQuit = false; 
        $scope.game.$save();
        	
        $scope.player.blueScore[$scope.player.blueCount] = true ;
        $scope.player.$save();
        $scope.player.blueCount++;
        $scope.reset();
        $scope.gameWinningFunction();
       } else if ($scope.game.count == 9){
        $scope.game.outcome = "Draw";
        $scope.game.drawFlag = false;
        $scope.reset();
       }
	 }; // End of $scope.outcomeDisplay function

	$scope.gameWinningFunction =  function() {  
	  if($scope.player.redCount == 3){
	  	$scope.player.redTotalScores++;
	  	$scope.player.$save();
	  	$scope.game.redWinGame = true;
      $scope.game.blueWinGame = false;			  	
	  	$scope.game.$save();
	  	$scope.afterWinFunction();
	  }else if($scope.player.blueCount == 3){
	  	$scope.player.blueTotalScores++;
	  	$scope.player.$save();
	  	$scope.game.redWinGame = false;
      $scope.game.blueWinGame = true;	
	  	$scope.game.$save();
	  	$scope.afterWinFunction();
	  } // End of if($scope.player.redCount == 3) conditonal statement.
	}; // End of gameWinningFunction function

  $scope.outcomeDisplay($scope.redOutcome, $scope.blueOutcome);

	$scope.reset = function(){
			$scope.game.turn = true;
			$scope.game.grid = ["","","","","","","","",""];
			$scope.game.$save();
			$scope.player.redTeam = ["","","","","",""];
			$scope.player.blueTeam = ["","","","","",""];
			$scope.player.redPosition = ["","","","","","","","",""];
			$scope.player.bluePosition = ["","","","","","","","",""];
			$scope.player.$save();
			$scope.mark = "";
			$scope.game.colorSwitch.red = true;
			$scope.game.colorSwitch.blue = false;
			$scope.game.count = 0;
			$scope.game.$save();
			$scope.redOutcome = null;
			$scope.blueOutcome = null ;
	   } // end of $scope.rest function
	}; // End of reset function

	// Game start function
	$scope.startGame = function(){ 
		$scope.game.gameStart = true ;
		$scope.game.playButtonFlag = false;
		$scope.game.initiate = true ;
		$scope.game.outcome = "";
		$scope.game.redWinGame = false;
    $scope.game.blueWinGame = false;
    $scope.game.blueWinRedQuit = false; 
    $scope.game.redWinBlueQuit = false; 	
		$scope.game.$save();
	}; // End of $sope.startGame function

	// After Win Function
	$scope.afterWinFunction = function(){
		$scope.game.playAgainFlag = true;
		$scope.game.gameStart = false ;
		$scope.game.playButtonFlag = true;
		$scope.game.outcome ="" ;
		$scope.game.$save();

		//After game win additional variable reset

		if($scope.game.playAgainFlag){
			$scope.player.redCount = 0 ;
			$scope.player.blueCount = 0 ;
			$scope.player.redScore = ["","","","",""];
			$scope.player.blueScore = ["","","","",""] ;
		  $scope.player.$save();
		} // End of if($scope.game.playAgainFlag) conditional statement block
	}; // End of $scope.afterWinFunction function block
}); // End of GameController block