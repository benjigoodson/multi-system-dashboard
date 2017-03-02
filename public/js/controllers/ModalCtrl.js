angular.module("MainModule").controller("ModalController", function (ModalService, $uibModalInstance) {

    var $ctrl = this;

    $ctrl.ok = function () {
        resetValues();

        $uibModalInstance.close(true);
    };

    $ctrl.cancel = function () {
        resetValues();

        $uibModalInstance.dismiss("cancelled");
    };

    var resetValues = function() {
        ModalService.title = "";
        ModalService.message = "";

        $ctrl.title = "";
        $ctrl.body= "";
    } 

    var init = function() {

      // Set body and title based from service
      $ctrl.title = ModalService.title;
      $ctrl.body = ModalService.message;

    }

    init();

});