angular.module('eightPuzzle', [])
  .controller('eightPuzzleCtrl', function($scope) {
    $scope.board = [0, 1, 3,
                    4, 2, 5,
                    7, 8, 6];

    $scope.goalBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    $scope.moves = 0;
    $scope.priorityQueue = [];

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


    function getZeroNeighboringPositions(zeroIndex) {
      switch (zeroIndex) {
        case 0:
          return [1, 3];
        case 1:
          return [0, 2, 4];
        case 2:
          return [1, 5];
        case 3:
          return [0, 4, 5];
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

    $scope.pushHammingPriority = function(board) {
      var wrongPositions = 0;

      board.forEach(function(position, index) {
        if (position != 0 && position != index + 1) {
          wrongPositions++;
        }
      })

      return $scope.priorityQueue.push({
        board: board,
        priority: wrongPositions + $scope.moves
      });
    }

    $scope.setMinimumPriorityState = function() {
      var priorities  = $scope.priorityQueue.map(function(state) { state.priority })
      var minPriority =  Math.min(priorities);

      var minPriorityState = $scope.priorityQueue.filter(function(state) {
        return state.priority == minPriority;
      })

      var index = $scope.priorityQueue.indexOf(minPriorityState);
      $scope.board = $scope.priorityQueue.splice(index, 1)[0].board;
    }

    $scope.pushNeighboringStates = function() {
      var zeroIndex = $scope.board.indexOf(0);
      var zeroNeighboringPositions = getZeroNeighboringPositions(zeroIndex);

      console.debug(zeroNeighboringPositions);

      zeroNeighboringPositions.forEach(function(position) {
        var newBoard = $scope.board.slice();

        newBoard[zeroIndex] = newBoard[position];
        newBoard[position]  = 0;
        $scope.pushHammingPriority(newBoard);
      })
    }

    $scope.solvePuzzle = function() {
      $scope.pushHammingPriority($scope.board); // push first state into priority queue
      $scope.setMinimumPriorityState();
      $scope.pushNeighboringStates();

      console.debug($scope.priorityQueue);

      while (!($scope.board.equals($scope.goalBoard))) {
        $scope.setMinimumPriorityState();
        $scope.pushNeighboringStates();
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