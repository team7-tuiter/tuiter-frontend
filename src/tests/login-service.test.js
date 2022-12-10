import * as firebase from "../firebase/index";
import * as authService from '../services/auth-service';
import * as userService from '../services/users-service';

describe('Login auth service test', () => {
  test('Can login into newly created account', async () => {
    //create new user, test by login with the newly created account, then delete it.
    let newUser = await authService.registerUsingUsername("test", "qw123456x");
    const loggedIn = await authService.signInUsingUsername("test", "qw123456x");
    expect(loggedIn.uid).toEqual(newUser.uid);
    await userService.deleteUser(loggedIn.uid);
  });

  test('Cannot login when user does not exist', async () => {
    let newUser = await authService.registerUsingUsername("test", "qw123456x");
    await userService.deleteUser(newUser.uid);
    const loginPromise = authService.signInUsingUsername("test", "qw123456x");
    expect(loginPromise).rejects.toThrow(Error('Firebase: Error (auth/user-not-found).'));
  });

  test('Cannot login because of wrong password', async () => {
    let newUser = await authService.registerUsingUsername("test", "qw123456x");
    const loginPromise = authService.signInUsingUsername("test", "WRONG_PASSWORD");
    expect(loginPromise).rejects.toThrow();
    await userService.deleteUser(newUser.uid);
  });

  test('Cannot login because of wrong username', async () => {
    let newUser = await authService.registerUsingUsername("test", "qw123456x");
    const loginPromise = authService.signInUsingUsername("WRONG", "qw123456x");
    expect(loginPromise).rejects.toThrow();
    await userService.deleteUser(newUser.uid);
  });
});