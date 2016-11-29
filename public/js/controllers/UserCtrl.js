var UserModule = angular.module('UserModule');

UserModule.controller('UserController', function($scope, UserService) { 

    this.getCurrentUser = function() {
         
         var promise = UserService.getCurrentUser()
         
            if(promise) {
                promise.then(function(user) {
                    $scope.user = user;
                });
            }
    }

    this.getCurrentUser();

});