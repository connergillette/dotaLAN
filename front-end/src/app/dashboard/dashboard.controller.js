var OpenDotaAPI = 'https://api.opendota.com/api/';
var heroList = [];

export class DashboardController {
	constructor($http) {
		'ngInject';

		this.$http = $http;

		this.getUserInfo();

		var vm = this;
		this.$http.get(OpenDotaAPI + '/heroes').then(function(heroes) {
			heroList = heroes;
		}).then(function() {
			var topHero;
			// MOST PLAYED HERO
			$http.get(OpenDotaAPI + "players/" + vm.user.steam_id + "/heroes").then(function(result) {
				// var heroID = result.data[0].hero_id - 2;
				// topHero = heroList.data[heroID];
				// vm.topHero = topHero;
				var heroID = result.data[0].hero_id;
				topHero = heroList.data[heroID - 2];
				vm.topHero = topHero;
			});
			// WIN / LOSS / TOTAL GAMES
			$http.get(OpenDotaAPI + '/players/' + vm.user.steam_id + '/wl').then(function(result) {
				vm.wins = result.data.win;
				vm.losses = result.data.lose;
				vm.total_games = result.data.win + result.data.lose;
			});
			// MMR
			$http.get(OpenDotaAPI + '/players/' + vm.user.steam_id).then(function(result) {
				vm.mmr = result.data.solo_competitive_rank;
				vm.mmr_est = result.data.mmr_estimate.estimate;
			});
			// LANE ROLE
			// $http.get(OpenDotaAPI + '/players/' + vm.user.steam_id + '/counts').then(function(result) {
			// 	vm.lane_role = result.data.lane_role;
			// });

		});
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
