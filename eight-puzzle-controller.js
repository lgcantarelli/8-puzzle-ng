angular.module('eightPuzzle', [])
  .controller('eightPuzzleCtrl', function($scope) {
    Array.prototype.equals = function(array) {
      // if the other array is a falsy value, return
      if (!array)
        return false;

      // compare lengths - can save a lot of time 
      if (this.length != array.length)
        return false;

      for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
          // recurse into the nested arrays
          if (!this[i].equals(array[i]))
            return false;       
        }           
        else if (this[i] != array[i]) { 
          // Warning - two different object instances will never be equal: {x:20} != {x:20}
          return false;   
        }           
      }       
      return true;
    }

    $scope.getMinimumPriorityState = function() {
      var minPriorityStateIndex;

      var minPriority = Math.min.apply(null,
        $scope.priorityQueue.map(function(state) {
          return state.priority
        })
      );

      $scope.priorityQueue.forEach(function(state, index) {
        if (state.priority == minPriority) {
          minPriorityStateIndex = index;
        }
      })

      return $scope.priorityQueue.splice(minPriorityStateIndex, 1)[0];
    }

    $scope.move = function() {
      $scope.lastMove  = $scope.board.indexOf(0);
      $scope.board     = $scope.getMinimumPriorityState().board;
      $scope.zeroIndex = $scope.board.indexOf(0); 
      $scope.moves++;
    }

    $scope.pushHammingPriority = function(board) {
      var wrongPositions = 0;

      board.forEach(function(value, index) {
        if (value != 0 && value != index + 1) {
          wrongPositions++;
        } else if (value == 0 && index != 8) {
          wrongPositions++;
        }
      })

      // console.info(board, wrongPositions, $scope.moves)

      return $scope.priorityQueue.push({
        board: board,
        priority: wrongPositions + $scope.moves,
      });
    }

    $scope.getNeighboringPositions = function() {
      switch ($scope.zeroIndex) {
        case 0:
          return [1, 3];
        case 1:
          return [0, 2, 4];
        case 2:
          return [1, 5];
        case 3:
          return [0, 4, 6];
        case 4:
          return [1, 3, 5, 7];
        case 5:
          return [2, 4, 8];
        case 6:
          return [3, 7];
        case 7:
          return [4, 6, 8];
        case 8:
          return [5, 7];
      }
    }

    $scope.pushNeighboringStates = function() {
      var neighboringPositions = $scope.getNeighboringPositions();
      var lastZeroIndex = neighboringPositions.indexOf($scope.lastZeroIndex);

      if (lastZeroIndex > -1) { // if previous state is neighboring, exclude it
       neighboringPositions.splice(lastZeroIndex, 1);
      }

      console.info(neighboringPositions);
      console.info($scope.board);

      neighboringPositions.forEach(function(position) {
        var newBoard = $scope.board.slice();

        newBoard[$scope.zeroIndex] = newBoard[position];
        newBoard[position] = 0;
        $scope.pushHammingPriority(newBoard);
      })
    }

    $scope.solvePuzzle = function() {
      $scope.board = [0, 2, 3,
                      4, 5, 6,
                      8, 7, 1];

      $scope.goalBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];
      $scope.moves = 0;
      $scope.priorityQueue = [];
      $scope.zeroIndex     = $scope.board.indexOf(0);
      $scope.lastZeroIndex = $scope.zeroIndex;

      while (!($scope.board.equals($scope.goalBoard))) {
        $scope.pushNeighboringStates();
        $scope.move();

        if ($scope.moves == 100) { return null }
      }
    }

    $scope.solvePuzzle();

    // how-to (A*)

    // the game starts with random positions, 0 moves and next state null
    // inserts the current state in the priority queue
    // delete the minimum priority state from the queue (? on game start)
    // inserts all states that can be reached in one move onto the priority queue
    // repeat this until the removed state from the queue is the state goal
  });