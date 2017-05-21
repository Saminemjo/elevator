angular.module("elevator", []).
controller("ElevatorCtrl", ["$scope", "$interval", "$timeout", function($scope, $interval, $timeout) {
    var Timer = false;
    // Object representing the car
    var car = $scope.car = {
        active: function(n) {
            return this.floor == n;
        },
        state: function() {
            var r = this.occupied ? "Occpd " : "Empty ";
            switch (this.dir) {
                case -1:
                    r += "↑↑↑↑";
                    break;
                case 1:
                    r += "↓↓↓↓";
                    break;
                case 0:
                    r += this.open ? "OPEN" : "STOP";
            }
            return r;
        },
        canOpen: function(n) {
            if (this.floor === n && this.dir === 0) {
                return true;
            }
        },
        openDoor: function() {
            $scope.panel.stop();
            this.dir = 0;
            this.open = true;
        },
        stepIn: function() {
            if (this.open === true) {
                this.occupied = true;
            }
        },
        stepOut: function() {
            if (this.open === true) {
                this.occupied = false;
            }
        },

        dir: 0,
        floor: 10,
        open: false,
        occupied: false
    };

    // Object representing the control panel in the car
    $scope.panel = {
        btnClass: function(n) {
            // This can be used to emulate a LED light near or inside the button
            // to give feedback to the user.
            return null;
        },
        press: function(n) {
            if (n === "G") {
                n = 0;
            }
            $scope.car.dir = 0;
            $scope.car.open = false;
            var floorCar = 10 - $scope.car.floor;
            $scope.floors[10 - n].press = true;
            if (floorCar > n) {
                Timer = $interval(function() {
                    floorCar = 10 - $scope.car.floor;
                    $scope.car.dir = 1;
                    $scope.car.floor++;
                }, 1000, [floorCar - n]);

            } else {
                Timer = $interval(function() {
                    floorCar = 10 - $scope.car.floor;
                    $scope.car.dir = -1;
                    $scope.car.floor--;
                }, 1000, [n - floorCar]);
            }
            Timer.then(function() {
                $scope.floors[10 - n].press = false;
                $scope.car.dir = 0;
                $scope.car.open = false;
                return false;
            });
        },
        stop: function() {
            $interval.cancel(Timer);
            $scope.car.dir = 0;
            $scope.car.open = false;
            for (var i = 0; i < $scope.floors.length; i++) {
                $scope.floors[i].press = false;
            }
        }
    };


    // Floors

    var floors = $scope.floors = [];
    for (var i = 10; i > 0; i--) floors.push({
        title: i
    });
    floors.push({
        title: "G"
    });

    // Let's have them know their indices. Zero-indexed, from top to bottom.
    // Also let's initialize them.
    floors.forEach(function(floor, n) {
        floor.n = n;
        floor.open = false;
        floor.press = null;
        floor.light = function(n) {
            if (this.press === true) {
                return "green";
            } else if (this.press === false && $scope.car.occupied === true) {
                return "red";
            } else  {
                return "null";
            }
        };

    });


}]);
