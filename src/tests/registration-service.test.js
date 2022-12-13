import * as firebase from "../firebase/index";
import * as authService from '../services/auth-service';
import * as userService from '../services/users-service';

describe('Registraion service test', () => {
  test('Can create a new account', async () => {
    //create new user, test by login with the newly created account, then delete it.
    let newUser = await authService.registerUsingUsername("testnew", "qw123456x");
    const loggedIn = await authService.signInUsingUsername("testnew", "qw123456x");
    expect(loggedIn.uid).toEqual(newUser.uid);
    await userService.deleteUser(loggedIn.uid);
  });

  test('Cannot create account with same username', async () => {
    let newUserPromise = authService.registerUsingUsername("testnew", "qw123456x");
    expect(newUserPromise).rejects.toThrow();
  });
});