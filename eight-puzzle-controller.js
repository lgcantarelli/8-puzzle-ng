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
      $scope.lastZeroIndex = $scope.board.indexOf(0);
      $scope.board     = $scope.getMinimumPriorityState().board;
      $scope.zeroIndex = $scope.board.indexOf(0); 
      $scope.moves++;
    }

    $scope.pushManhattanPriority = function(board) {
      var manhattanSum = 0;
      var manhattanCoordinates = {
        0: [0, 0], 1: [1, 0], 2: [2, 0],
        3: [0, 1], 4: [1, 1], 5: [2, 1],
        6: [0, 2], 7: [1, 2], 8: [2, 2]
      }

      board.forEach(function(value, index) {
        if (value != 0) {
          var x1 = manhattanCoordinates[index][0];
          var y1 = manhattanCoordinates[index][1];
          var x2 = manhattanCoordinates[value - 1][0];
          var y2 = manhattanCoordinates[value - 1][1];

          manhattanSum += Math.abs(x1 - x2) + Math.abs(y1 - y2);
        }
      })

      var state = {
        board: board,
        priority: manhattanSum + $scope.moves
      }

      $scope.priorityQueue.push(state);
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

      neighboringPositions.forEach(function(position) {
        var newBoard = $scope.board.slice();

        newBoard[$scope.zeroIndex] = newBoard[position];
        newBoard[position] = 0;
        $scope.pushManhattanPriority(newBoard);
      })
    }

    $scope.solvePuzzle = function() {
      $scope.board = [5, 2, 1,
                      0, 6, 4,
                      8, 3, 7];

      $scope.moves = 0;
      $scope.priorityQueue = [];
      $scope.zeroIndex     = $scope.board.indexOf(0);
      $scope.lastZeroIndex = $scope.zeroIndex;

      while (!($scope.board.equals([1, 2, 3, 4, 5, 6, 7, 8, 0]))) {
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