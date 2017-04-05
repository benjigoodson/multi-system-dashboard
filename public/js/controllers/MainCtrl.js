var MainModule = angular.module('MainModule');

MainModule.controller('MainController', MainController);

MainController.$inject = ['$scope', '$http', '$location', '$window', 'AuthorisationService', 'DashboardService'];
function MainController($scope, $http, $location, Window, AuthorisationService, DashboardService) { 

    var self = this;

    // Set the menu
    self.menuDashboards = DashboardService.dashboardMenu;

    this.logout = function() {

        // Clear credentials
        AuthorisationService.clearCredentials();

    }; 

    // Used by widgets to allow them to collaspe
    this.collapse = function collapse(ev) {

        // Get the source element of the element being passed
        var element = ev.srcElement ? ev.srcElement : ev.target;

        // Get the nearest x_panel class
        var e = $(element).closest(".x_panel")
          , t = $(element).find("i")
          , n = e.find(".x_content");
        // Slide the contents
        e.attr("style") ? n.slideToggle(200, function() {
            e.removeAttr("style")
        }) : (n.slideToggle(200),
        e.css("height", "auto")),
        // Swap the arrows round
        t.toggleClass("fa-chevron-up fa-chevron-down")
    };

    $scope.update = function() {
        // Update the list of dashboards on the menu
        DashboardService.updateMenu();
    }

    this.init = function() {
        // Update the list of dashboards on the menu
        DashboardService.updateMenu();
    }

};