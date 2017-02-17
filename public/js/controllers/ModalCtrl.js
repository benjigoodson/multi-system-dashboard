angular.module("MainModule").controller("ModalController", function ($uibModalInstance) {
  var $ctrl = this;

  this.title = "Please confirm";
  this.body = "Are you sure you wish to delete this item?";

  $ctrl.ok = function () {
    $uibModalInstance.close(true);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss("cancelled");
  };
});