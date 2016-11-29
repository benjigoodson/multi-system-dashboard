var UserModule = angular.module('UserModule');

UserModule.controller('RegisterController', RegisterController);

RegisterController.$inject = ['$location', 'FileUploader', 'UserService'];
function RegisterController($location, FileUploader, UserService) { 
    
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
                        item.url = "/api/user/" + self.result.user._id;

                        item.upload();

                        //FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    
                    });

                } else {
                    // FlashService.Error(response.message);
                }
            }, function errorHandler (error) {
                // FlashService.Error(response.message);
            });
    }
};