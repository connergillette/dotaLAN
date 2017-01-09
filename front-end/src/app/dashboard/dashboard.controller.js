export class DashboardController {
	constructor($http) {
		'ngInject';

		this.$http = $http;
		this.getUserInfo();

	}

	// getMessages() {
	// 	var vm = this;
	// 	this.$http.get('http://localhost:5000/api/message').then(function(result) {
	// 		vm.messages = result.data;
	// 	});
	// }

	getUserInfo() {
		var vm = this;
		this.$http.get('http://localhost:5000/dashboard/').then(function(result) {
			if (!result.data) {
				window.location = "/#/login";
			} else {
				vm.user = result.data;
			}
		});
	}
}
