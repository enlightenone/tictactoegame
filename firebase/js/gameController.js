app.controller("GameController",  function($scope, $firebase){

	// game related variables
	$scope.turn = true;
	$scope.game = getGameGrid();
	$scope.game.grid =["","","","","","","","",""];
	$scope.game.colorSwitch = {red: true, blue: false};
	$scope.game.$save();

	// player related variables
	$scope.player = getPlayer(); // data initialization
	$scope.player.redScore = ["1","2","3","4","5"];
	$scope.player.blueScore = ["2","3","4","5","6"] ;
	$scope.player.$save();


	$scope.redTeam = [];
	$scope.blueTeam = [];
	$scope.redPosition = [];
	$scope.bluePosition = [];
	$scope.mark = "";
	$scope.count = 0;
	$scope.outcome = null ;

	// blue and red string join
	 $scope.blueJointStr = "";
	 $scope.redJointStr = "";

	 //blue and red display related variables
	 $scope.redCount = 0;
     $scope.blueCount = 0 ;
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

//firebase test

    




	$scope.gamePlay = function(g, p){
            $scope.count++;
		if ($scope.turn){
			$scope.mark ="X"
			$scope.redPosition[g] = p ;
			$scope.redTeam.push(p);
			$scope.game.grid[g] = $scope.mark ;
			$scope.game.$save();
			$scope.colorSwitch($scope.turn);
            $scope.turn = false;

		} else {
			$scope.mark ="O";
			$scope.bluePosition[g] = p ;
			$scope.blueTeam.push(p);
			$scope.game.grid[g]= $scope.mark;
			$scope.game.$save();
			$scope.colorSwitch($scope.turn);
			$scope.turn = true;


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
		 var redString = $scope.redTeam.join("") ;
		 var blueString = $scope.blueTeam.join("");
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

		$scope.redOutcome = stringMatch(winCombo, $scope.redTeam, $scope.redPosition),
		$scope.blueOutcome = stringMatch(winCombo, $scope.blueTeam, $scope.bluePosition) ;



		  function outcomeDisplay(red, blue){

		  	if(red){
	        	$scope.outcome = "Red Team Won" ;
	        	

	        	$scope.player.redScore[$scope.redCount](true);
	        	$scope.player.$save();
	        	$scope.redCount++;
	        	
	        	$scope.redOutcome = null ;
	        	$scope.reset();
	        } else if (blue){
	        	$scope.outcome = "Blue Team Won";
	        	
	        	
	        	$scope.player.blueScore.$add(true);
	        	$scope.player.$save();
	        	
	        	$scope.blueCount++;
	        	
	        	$scope.blueOutcome = null ;
	        	$scope.reset();
	        }else if ($scope.count == 9){
	        	$scope.outcome = "Game is a Draw";
	        	$scope.reset();
	        }

		  }

		  if($scope.redCount == 3){
		  	$scope.outcome = "Red Team Won The Game";
		  }else if($scope.blueCount == 3){
		  	$scope.outcome  = "Blue Team Won The Game";
		  }


        
	   outcomeDisplay($scope.redOutcome, $scope.blueOutcome);

	   $scope.reset = function( ){

			$scope.turn = true;
			$scope.game.grid = ["","","","","","","","",""];
			$scope.game.$save();
			$scope.redTeam = [];
			$scope.blueTeam = [] ;
			$scope.redPosition = [];
			$scope.bluePosition = [] ;
			$scope.mark = "";
			$scope.game.colorSwitch.red = true;
			$scope.game.colorSwitch.blue = false;
			$scope.count = 0;
			$scope.redOutcome = null;
			$scope.blueOutcome = null ;

	   }


	};






});