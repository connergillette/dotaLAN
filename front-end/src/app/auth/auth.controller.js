export class AuthController {
	constructor($auth) {
		'ngInject';

		this.$auth = $auth;
	}

	register() {
		var vm = this;
		this.$auth.signup(this.user).then(function(token) {
			vm.$auth.setToken(token);
			window.location = "/#/dashboard";
		});
	}

	login() {
		var vm = this;
		this.$auth.login(this.login.user).then(function(token) {
			vm.$auth.setToken(token);
			window.location = "/#/dashboard";
		});
	}
}
