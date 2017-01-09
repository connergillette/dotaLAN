export class EventsController {
	constructor($http, $stateParams) {
		'ngInject'
		this.$http = $http;

		this.getEventInfo($stateParams);
	}

	addEvent() {
		this.$http.post('http://localhost:5000/api/event', {
			event: this.event
		});
	}

	getEventInfo(params) {
		var vm = this;

		this.$http.get('http://localhost:5000/api/event/', {
			id: params.id
		}).then(function(result) {
			vm.event = result.data;
			console.log(result.data + "!!!!!!!!!!!!");
		});
	}
}
