var UserModule = angular.module('UserModule');

UserModule.controller('RegisterController', RegisterController);

RegisterController.$inject = ['$location', 'FileUploader', 'UserService', 'notificationService'];
function RegisterController($location, FileUploader, UserService, notificationService) { 
    
    this.uploader = new FileUploader();

    this.submit = function () {

        var self = this;

        UserService.create(this.user)
            .then(function (response) {

                if (response.success) {

                    self.response = response;

                    self.uploader.onCompleteAll = function() {
                        if(self.response.success == true) {
                            notificationService.success(self.response.message);
                            $location.path("/");
                        } else {
                            notificationService.error(self.response.message);
                        }
                    };

                    self.uploader.onCompleteItem = function(fileItem, response, status, headers) {
                        self.response.success = response.success;
                        if(response.success == true) {
                            console.info(response.message);                            
                        } else {
                            self.response.message = response.message;
                        }
                    };

                    self.uploader.queue.forEach(function(item, index) {
                        
                        item.method = "PUT";
                        item.url = "/api/user/image/" + response.data._id;

                        item.upload();                    
                    });

                } else {
                    notificationService.error(response.message);
                }
            }, function errorHandler (error) {
                notificationService.error(response.message);
            });
    }
};