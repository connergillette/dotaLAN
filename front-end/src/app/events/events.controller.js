export class EventsController {
	constructor($http, $stateParams) {
		'ngInject'
		this.$http = $http;
		this.players = [];
		this.params = $stateParams;

		this.getEventInfo($stateParams);
		this.getTeamInfo();
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
			console.log(event.data);
			vm.event = event.data;
			vm.players = event.data.players;
		});
		return vm.event;
	}

	getTeamInfo() {
		var vm = this;
		this.$http.get('http://localhost:5000/api/teams/').then(function(teams) {
			if (!teams) {
				console.log("SOMETHING IS WRONG. No teams found.");
			}
			// console.log(teams.data);
			vm.teams = teams.data;
		});
	}

	createTeams() {
		var vm = this;
		this.$http.post('http://localhost:5000/api/team/add', {
			players: vm.players,
			event: vm.event
		});
		this.getEventInfo(this.params);
	}

	createSchedule() {
		var vm = this;
		var event = this.getEventInfo(this.params);
		this.$http.post('http://localhost:5000/api/schedule/add/' + this.params.id, {
			event: event
		}).then(this.getEventInfo(this.params));
	}
}
