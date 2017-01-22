export class EventsController {
	constructor($http, $stateParams) {
		'ngInject'
		this.$http = $http;

		this.getEventInfo($stateParams);
	}

	addEvent() {
		this.$http.post('http://localhost:5000/api/event/', {
			event: this.event
		});
	}

	getEventInfo(params) {
		var vm = this;

		this.$http.get('http://localhost:5000/api/event/' + params.id).then(function(event) {
			if (!event) {
				console.log('SOMETHING IS WRONG ' + event.name);
			}
			vm.event = event.data;
		});
	}
}
