angular.module('DashboardService', []).factory('Dashboards', ['$http', function($http) {
	
	return {
		get : function() {
			
			return $http.get('/api/widget');
			
		},
		
		get : function(id) {
			
			return $http.get('/api/widget' + id);
			
		},
		
		get : function(dashboardId) {
			
			return $http.get('/api/widget/dashboard' + dashboardId);
			
		},
		
		create : function(widgetData) {
			
			return $http.post('/api/widget', widgetData);
			
		},
		
		delete : function(id) {
			
			return $http.delete('/api/widget/' + id);
			
		},
	};
	
}]);