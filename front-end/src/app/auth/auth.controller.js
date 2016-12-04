export class AuthController {
  constructor() {

  }

  loginAttempt(user, pass) {
    $http.post('/api/login', {
      'user': user,
      'pass': pass
    });
  }
}
