var UserModule = angular.module('UserModule');

UserModule.controller('RegisterController', RegisterController);

RegisterController.$inject = ['$location', 'FileUploader', 'UserService', 'notificationService'];
function RegisterController($location, FileUploader, UserService, notificationService) { 
    
    this.uploader = new FileUploader();

    this.submit = function () {

        var self = this;

        // Create a new user
        UserService.create(this.user)
            .then(function (response) {

                if (response.success) {

                    self.response = response;

                    self.uploader.onCompleteAll = function() {
                        if(self.response.success == true) {
                            // Display message to the user
                            notificationService.success(self.response.message);

                            // Go to home page
                            $location.path("/");
                        } else {
                            // Display an error
                            notificationService.error(self.response.message);
                        }
                    };

                    self.uploader.onCompleteItem = function(fileItem, response, status, headers) {
                        self.response.success = response.success;
                        if(response.success == true) {
                            // Once the item is complete write a message in the console
                            console.info(response.message);                            
                        } else {
                            // Display an error
                            self.response.message = response.message;
                        }
                    };

                    // Try to upload their profile image
                    self.uploader.queue.forEach(function(item, index) {
                        
                        // Set the method
                        item.method = "PUT";

                        // Set the url
                        item.url = "/api/user/image/" + response.data._id;

                        // start uploading
                        item.upload();                    
                    });

                } else {
                    // Display an error
                    notificationService.error(response.message);
                }
            }, function errorHandler (error) {
                // Display an error
                notificationService.error(response.message);
            });
    }
};