export class EventsController {
	constructor($http, $stateParams) {
		'ngInject'
		this.$http = $http;
		this.players = [];

		this.getEventInfo($stateParams);
		this.getTeamInfo();
	}

	addEvent() {
		this.$http.post('http://localhost:5000/api/event/', {
			event: this.event
		});
		// .then(function(result) {
		// 	console.log(result);
		// });
	}

	getEventInfo(params) {
		var vm = this;
		this.$http.get('http://localhost:5000/api/event/' + params.id).then(function(event) {
			if (!event) {
				console.log('SOMETHING IS WRONG ' + event.name);
			}
			vm.event = event.data;
			console.log(event.data.players);
			vm.players = event.data.players;
			// console.log(event.data.user.name);
		});
	}

	getTeamInfo() {
		var vm = this;
		this.$http.get('http://localhost:5000/api/teams/').then(function(teams) {
			if (!teams) {
				console.log("SOMETHING IS WRONG. No teams found.");
			}
			// console.log(teams.data);
			vm.teams = teams.data;
		})
	}

	createTeams() {
		var vm = this;
		this.$http.post('http://localhost:5000/api/team/add', {
			players: vm.players
		});
	}

}
