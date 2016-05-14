'use strict';

google.load('visualization', '1', {
    packages: ['corechart', 'bar']
});

google.setOnLoadCallback(function () {
    angular.bootstrap(document.body, ['myApp']);
});


angular.module("myApp", ['ui.router', 'ng-fusioncharts'])

    .controller("MainCtrl", function ($http, $scope, $rootScope, $state) {

        console.log("am here");
        $http.get('/getData').success(function (data) {
            $rootScope.userId = data.userId;
            $rootScope.type = data.type;
            console.log(data);
        }).error(function (error) {
            alert("Something went wrong, please try again");
        })

        $scope.logOut = function () {
            window.location.assign("/");
        }

        $state.go("HomeState");
    })

    .config(function ($stateProvider, $urlRouterProvider) {


        $stateProvider
            .state("HomeState", {
                views: {
                    "home": {

                        templateUrl: "/home",
                        controller: function ($scope, $http, $state, $rootScope) {
                            var params =  $rootScope.userId;
                            $scope.values = ["Genre-based", "User-based"];
                            $scope.current = "Genre-based";
                            $http.post("http://localhost:8080/genre", params).success(function (data) {
                                $scope.data = data;
                                console.log(data);
                                var genreName = [];
                                $scope.finalData = [];

                                for (var i = 0; i < $scope.data.length; i++) {
                                    console.log(genreName.indexOf($scope.data[i].genreName));
                                    if (genreName.indexOf($scope.data[i].genreName) == -1) {
                                        genreName.push($scope.data[i].genreName);

                                    }
                                }

                                for (var i = 0; i < genreName.length; i++) {
                                    $scope.finalData.push({"genreName": genreName[i], "movies": []});
                                    var here = $scope.finalMenu;
                                    console.log(here);
                                }


                                for (var i = 0; i < $scope.data.length; i++) {
                                    for (var j = 0; j < $scope.finalData.length; j++) {
                                        if ($scope.data[i].genreName == $scope.finalData[j].genreName) {
                                            $scope.finalData[j].movies.push($scope.data[i]);
                                        }
                                    }
                                }

                                console.log($scope.finalData);
                            }).error(function (error) {
                                alert("Something Went Wrong.Please Try Again");
                            });


                            $scope.redirect = function (value) {
                                if (value == "User-based") {
                                    $state.go("homeUserBased");
                                }
                                if (value == "Tag-based") {
                                    $state.go("homeTagBased");
                                }
                            }

                            $scope.getDetail = function (name) {

                                if (name.indexOf('(') >= 0) {
                                    var name = name.substr(0, name.indexOf('('));
                                    $rootScope.movieName = name;
                                }
                                else {
                                    $rootScope.movieName = name;
                                }

                                $state.go('movieDetail');

                            };


                            console.log("am in home controllee");


                        }

                    }
                }

            }).state("movieDetail", {
            views: {
                "detail": {

                    templateUrl: "/detail",
                    controller: function ($scope, $http, $state, $rootScope) {


                        console.log("am in detail controllee");
                        var name = $rootScope.movieName;
                        console.log(name);
                        $http.get("http://www.omdbapi.com/?t=" + name + "&y=&plot=full&r=json").success(function (data) {
                            console.log(data);
                            $scope.data = data;
                        });


                    }

                }
            }

        }).state("homeUserBased", {
            views: {
                "homeUser": {

                    templateUrl: "/homeUser",
                    controller: function ($scope, $http, $state, $rootScope) {

                        console.log("am in home user");
                        console.log($rootScope.userId);
                        $scope.current = "User-based";
                        $scope.values = ["Genre-based", "User-based"];

                        var params = {"userId": $rootScope.userId, "type": $rootScope.type}
                        console.log(params);
                        $http.post("http://localhost:8080/user", params).success(function (data) {
                            console.log(data);
                            $scope.reco = data;
                        })


                        $scope.redirect = function (value) {

                            if (value == "Genre-based") {
                                $state.go("HomeState");
                            }
                            if (value == "Tag-based") {
                                $state.go("homeTagBased");
                            }
                        }

                        $scope.getDetail = function (name) {

                            if (name.indexOf('(') >= 0) {
                                var name = name.substr(0, name.indexOf('('));
                                $rootScope.movieName = name;
                            }
                            else {
                                $rootScope.movieName = name;
                            }

                            $state.go('movieDetail');

                        };


                    }

                }
            }
        }).state("homeTagBased", {
            views: {
                "homeTag": {

                    templateUrl: "/homeTag",
                    controller: function ($scope, $http, $state, $rootScope) {

                        $scope.values = ["Genre-based", "User-based", "Tag-based"];
                        $scope.current = "Tag-based";
                    }

                }
            }
        }).state("Graphs", {
            views: {
                "graphView": {

                    templateUrl: "/graphView",
                    controller: function ($scope, $http, $state, $rootScope) {
                        var params = {"userId": $rootScope.userId, "type": $rootScope.type}
                        $http.post("http://localhost:8080/user", params).success(function (data) {
                            console.log(data);
                            $scope.reco = data;

                            var r = $scope.reco;
                            var data = new google.visualization.DataTable();
                            data.addRows($scope.reco.length);
                            data.addColumn('string', 'Movie');
                            data.addColumn('number', 'Recommendation Value');
                            $.each(r, function (i, v) {
                                // set the values for both the name and the population
                                data.setValue(i, 0, v.movieName);
                                data.setValue(i, 1, v.rating);
                            });

                            var options = {

                                width: 800,
                                height: 400,

                                hAxis: {

                                    viewWindowMode: 'explicit',
                                    viewWindow: {
                                        max: 5,
                                        min: 0
                                    }
                                },
                                vAxis: {
                                    title: 'City'
                                },
                                bars: 'horizontal',
                                axes: {
                                    y: {
                                        0: {side: 'left'}
                                    }
                                }
                            };
                            var material = new google.charts.Bar(document.getElementById('chart_div'));
                            material.draw(data, options);

                        })

                    }
                }
            }
        }).state("pieGraphs", {
            views: {
                "pieGraphView": {

                    templateUrl: "/pieGraphView",
                    controller: function ($scope, $http, $state, $rootScope) {
                        $scope.reco = [{"genre": "Action", "value": 7}, {
                            "genre": "Thriller",
                            "value": 8
                        }, {"genre": "Comedy", "value": 11}];
                        var r = $scope.reco;
                        var data = new google.visualization.DataTable();
                        data.addRows(r.length);
                        data.addColumn('string', 'Genre');
                        data.addColumn('number', 'value');
                        $.each(r, function (i, v) {
                            // set the values for both the name and the population
                            data.setValue(i, 0, v.genre);
                            data.setValue(i, 1, v.value);
                        });

                        var options = {
                            width: 1200,
                            height: 400,
                            is3D: true,
                        };

                        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
                        chart.draw(data, options);


                    }

                }
            }
        })

    });







