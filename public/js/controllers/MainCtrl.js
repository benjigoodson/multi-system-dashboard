var MainModule = angular.module('MainModule');

MainModule.controller('MainController', MainController);

MainController.$inject = ['$location', '$window', 'AuthorizationService'];
function MainController($scope, $location, AuthorizationService) { 

    this.logout = function() {

        // Clear credentials
        AuthorizationService.ClearCredentials();

    }; 

    this.collapse = function collapse(ev) {

        var element = ev.srcElement ? ev.srcElement : ev.target;

        var e = $(element).closest(".x_panel")
          , t = $(element).find("i")
          , n = e.find(".x_content");
        e.attr("style") ? n.slideToggle(200, function() {
            e.removeAttr("style")
        }) : (n.slideToggle(200),
        e.css("height", "auto")),
        t.toggleClass("fa-chevron-up fa-chevron-down")
    };

    $(".close-link").click(function() {
        var e = $(this).closest(".x_panel");
        e.remove()
    })

};