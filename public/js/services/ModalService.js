'use strict'

var MainModule = angular.module('MainModule');

MainModule.factory('ModalService', function ($uibModal) {

    var self = {
    
              displayModal : function(parentSelector) {

                var parentElem = parentSelector ? 
                    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;

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