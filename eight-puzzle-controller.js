angular.module('eightPuzzle', [])
  .controller('eightPuzzleCtrl', function($scope) {
    $scope.board = [1, 2, 3,
                    4, 5, 6,
                    7, 8, 0];
    $scope.moves = 0;
    $scope.priorityQueue = [];


    $scope.hammingPriority = function() {
      var wrongPositions = 0;

      $scope.board.forEach(function(position, index) {
        if (position != 0 && position != index + 1) {
          wrongPositions++;
        }
      })

      return { board: $scope.board, priority: wrongPositions + $scope.moves };
    }

    $scope.pushNeighboringStates = function() {
      var zeroIndex = $scope.board.indexOf(0);
      var zeroNeighboringPositions = [];

      switch (zeroIndex) {
        case 0:
          zeroNeighboringPositions = [1, 3];
          break;
        case 1:
          zeroNeighboringPositions = [0, 2, 4];
          break;
        case 2:
          zeroNeighboringPositions = [1, 5];
          break;
        case 3:
          zeroNeighboringPositions = [0, 4, 5];
          break;
        case 4:
          zeroNeighboringPositions = [1, 3, 5, 7];
          break;
        case 5:
          zeroNeighboringPositions = [2, 4, 8];
          break;
        case 6:
          zeroNeighboringPositions = [3, 7];
          break;
        case 7:
          zeroNeighboringPositions = [4, 6, 8];
          break;
        case 8:
          zeroNeighboringPositions = [5, 7];
          break;
      }
    }

    $scope.solve = function() {
      $scope.priorityQueue.push($scope.hammingPriority()); // push current state into priority queue
      $scope.pushNeighboringStates();

    }

    // how-to (A*)

    // the game starts with random positions, 0 moves and next state null
    // inserts the current state in the priority queue
    // delete the minimum priority state from the queue (? on game start)
    // inserts all states that can be reached in one move onto the priority queue
    // repeat this until the removed state from the queue is the state goal
  });