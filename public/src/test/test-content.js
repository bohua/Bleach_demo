/**
 * Created by Bli on 14-2-11.
 */

/* global angular*/
angular.module('test-content', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		"use strict";
		$routeProvider.
			when('/users', {templateUrl: 'src/test/test-content.tpl.html', controller: 'testController'});
	}])
	.controller('testController', ['$scope',  function($scope){
		alert('trigger!');
	}]);
