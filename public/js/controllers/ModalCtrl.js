angular.module("MainModule").controller("ModalController", function (ModalService, $uibModalInstance) {

    var self = this;

    // User clicked ok
    self.ok = function () {
        // Reset the title and message
        resetValues();

        // Return true to the calling function
        $uibModalInstance.close(true);
    };

    // User clicked cancel
    self.cancel = function () {
        // Reset the title and message
        resetValues();

        // Return the reason for the cancel to the calling function
        $uibModalInstance.dismiss("cancelled");
    };

    var resetValues = function() {
        // Reset the title and message on the service
        ModalService.title = "";
        ModalService.message = "";

        // Reset the title and body
        self.title = "";
        self.body= "";
    } 

    var init = function() {

      // Set body and title based from service
      self.title = ModalService.title;
      self.body = ModalService.message;

    }

    // Each time a new instance is made call the init function
    init();

});