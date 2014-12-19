app.controller("GameController",  function($scope, $firebase){

	// game related variables
	
	$scope.game = getGameGrid();
	$scope.game.grid =["","","","","","","","",""];
	$scope.game.turn = true ;
	$scope.game.outcome = null ;
	$scope.game.colorSwitch = {red: true, blue: false};
	$scope.game.count = 0 ;
	$scope.game.$save();

	// player related variables
	$scope.player = getPlayer(); // data initialization
	$scope.player.redScore = ["","","","",""];
	$scope.player.blueScore = ["","","","",""] ;
	$scope.player.redTeam = ["","","","",""];
	$scope.player.blueTeam = ["","","","",""];
	$scope.player.redPosition = ["","","","","","","","",""];
	$scope.player.bluePosition = ["","","","","","","","",""];
	$scope.player.redCount = 0;
    $scope.player.blueCount = 0 ;
	$scope.player.$save();


	//$scope.redTeam = [];
	//$scope.blueTeam = [];
	//$scope.redPosition = [];
	//$scope.bluePosition = [];
	$scope.mark = "";
	//$scope.outcome = null ;

	// blue and red string join
	 $scope.blueJointStr = "";
	 $scope.redJointStr = "";

	 //blue and red display related variables
	 //$scope.redCount = 0;
     //$scope.blueCount = 0 ;
     //$scope.redScore  = [];
	 //$scope.blueScore = [];

	 //Plyaer registeration function
	 $scope.redPlayerEmail ="";
	 $scope.redPlayerUserName = "";
	 $scope.bluePlayerEmail ="";
	 $scope.bluePlayerUserName = "";


     // Retrieve data from Firebase;

      // general game related data from Firebase
	 function getGameGrid(){
			var ref = new Firebase('https://sctttapp.firebaseio.com/game')
			var game = $firebase(ref).$asObject();
			return game;
		}

	// player related data from Firebase
	function getPlayer(){
			var ref = new Firebase('https://sctttapp.firebaseio.com/player')			
			var player = $firebase(ref).$asObject();
			return player;
		}



    




	$scope.gamePlay = function(g, p){
            $scope.game.count++;
            $scope.game.$save();
		if ($scope.game.turn){
			$scope.mark ="X"
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


		}

    	$scope.outcomeCalculate();



	};
	
	$scope.colorSwitch = function(t){

		if (t){
			 $scope.game.colorSwitch.red = true;
			 $scope.game.colorSwitch.blue = false;
			 $scope.game.$save();
		} else {
			 $scope.game.colorSwitch.red = false;
			 $scope.game.colorSwitch.blue = true;
			 $scope.game.$save();

		}

	};

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
					  ( String(position[2]) + String(position[4]) + String(position[6]) )
			        ] ; 


         	 if (matchResult){
         	 		return matchResult;
         	 }else {
         	 	for (i=0; i < positionArray.length ; i++ ) {
         	 		if (positionArray[i] == "123"){
         	 		  return true ;
         	 		}
         	 	};
         	 }

    

			return jointString.match(combinedReg); 

         	
         }

		 // create string from player's arrays

		$scope.redOutcome = stringMatch(winCombo, $scope.player.redTeam, $scope.player.redPosition),
		$scope.blueOutcome = stringMatch(winCombo, $scope.player.blueTeam, $scope.player.bluePosition) ;



		  function outcomeDisplay(red, blue){

		  	if(red){
	        	$scope.game.outcome = "Red Team Won" ;
	        	$scope.game.$save();

	        

	        	$scope.player.redScore[$scope.player.redCount] = true ;
	        	$scope.player.$save();

	        	$scope.player.redCount++;
	        	
	        	//$scope.redOutcome = null ;


	        	$scope.reset();
	        	$scope.gameWinningFunction();

	        } else if (blue){

	        	$scope.game.outcome = "Blue Team Won";
	        	$scope.game.$save();
	        	
	        	$scope.player.blueScore[$scope.player.blueCount] = true ;
	        	$scope.player.$save();
	        	
	        	$scope.player.blueCount++;

	        	//$scope.blueOutcome = null ;

	        	$scope.reset();
	        	$scope.gameWinningFunction();

	        }else if ($scope.game.count == 9){
	        	$scope.game.outcome = "Game is a Draw";
	        	$scope.reset();
	        }

		  }

		$scope.gameWinningFunction =  function() {  
			  if($scope.player.redCount == 3){
			  	$scope.game.outcome = "Red Team Won The Game";
			  	$scope.game.$save();
			  }else if($scope.player.blueCount == 3){
			  	$scope.game.outcome  = "Blue Team Won The Game";
			  	$scope.game.$save();
			  }
		};


        
	   outcomeDisplay($scope.redOutcome, $scope.blueOutcome);

	   $scope.reset = function( ){

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

	   }


	};






});