'use strict'

var MainModule = angular.module('MainModule');

MainModule.factory('ModalService', function ($uibModal) {

    var self = {

        // Default the title and message to blank
        title : "",
        message : "",

        displayModal : function(message, title, parentSelector) {

            // If no message is set use a default
            if(!message) {
                self.message = "Are you sure you wish to delete this item?";
            } else {
                self.message = message;
            }

            // If no title is set use a default
            if(!title) {
                self.title = "Please confirm."
            } else {
                self.title = title;
            }

            // Select an element in the right column to anchor the modal to
            var parentElem = parentSelector ? 
                angular.element($document[0].querySelector('.right-col ' + parentSelector)) : undefined;

            // Open the modal using the configuration options below
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

            // Return the instance of the modal
            return modalInstance;
        }
    };

    return self;

});