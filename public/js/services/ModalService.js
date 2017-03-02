'use strict'

var MainModule = angular.module('MainModule');

MainModule.factory('ModalService', function ($uibModal) {

    var self = {
    
        title : "",
        message : "",

        displayModal : function(message, title, parentSelector) {

            if(!message) {
                self.message = "Are you sure you wish to delete this item?";
            } else {
                self.message = message;
            }

            if(!title) {
                self.title = "Please confirm."
            } else {
                self.title = title;
            }

            var parentElem = parentSelector ? 
                angular.element($document[0].querySelector('.right-col ' + parentSelector)) : undefined;

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modal-html',
                controller: 'ModalController',
                controllerAs: '$ctrl',
                size: 'sm',
                appendTo: parentElem,
                resolve: {
                    response: function () {
                        return self.response;
                    }
                }
            });

            return modalInstance;
        }
    };

    return self;

});