var UserModule = angular.module('UserModule');

UserModule.controller('RegisterController', RegisterController);

RegisterController.$inject = ['$location', 'FileUploader', 'UserService', 'notificationService'];
function RegisterController($location, FileUploader, UserService, notificationService) { 
    
    this.uploader = new FileUploader();
 
    this.user = {};
    this.image;

    this.submit = function () {

        var self = this;

        UserService.create(this.user)
            .then(function (response) {

                self.result = response.data; 

                if (self.result.success) {

                    self.uploader.queue.forEach(function(item, index) {
                        
                        item.method = "PUT";
                        item.url = "/api/user/image" + self.result.user._id;

                        item.upload();

                        notificationService.success('Registration successful');
                        $location.path('/login');
                    
                    });

                } else {
                    notificationService.error(response.message);
                }
            }, function errorHandler (error) {
                notificationService.error(response.message);
            });
    }
};