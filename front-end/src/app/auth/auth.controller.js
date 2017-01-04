export class AuthController {
	constructor($auth) {
		'ngInject';
		this.$auth = $auth;
	}

	loginAttempt() {
		this.$http.post('http://localhost:5000/api/login', {
			email: this.username,
			pass: this.pass
		});
	}

	getUsers() {
		var vm = this;
		this.$http.get('http://localhost:5000/api/login').then(function(result) {
			vm.users = result.data;
		});
	}

	register() {
		var vm = this;
		this.$auth.signup(this.user).then(function(token) {
			vm.$auth.setToken(token);
		});
	}
}
