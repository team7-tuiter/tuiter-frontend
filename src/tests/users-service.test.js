import {
  createUser,
  deleteUsersByUsername, findAllUsers,
  findUserById
} from "../services/users-service";

describe('createUser', () => {
  // sample user to insert
  const ripley = {
    _username: 'ellenripley',
    _password: 'lv426',
    _email: 'ellenripley@aliens.com'
  };

  // setup test before running test
  beforeAll(() => {
    // remove any/all users to make sure we create it in the test
    return deleteUsersByUsername(ripley._username);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteUsersByUsername(ripley._username)
  })

  test('can insert new users with REST API', async () => {
    // insert new user in the database
    const newUser = await createUser(ripley);

    // verify inserted user's properties match parameter user
    expect(newUser._username).toEqual(ripley._username);
    expect(newUser._password).toEqual(ripley._password);
    expect(newUser._email).toEqual(ripley._email);
  });
});

describe('deleteUsersByUsername', () => {

  // sample user to delete
  const sowell = {
    _username: 'thommas_sowell',
    _password: 'compromise',
    _email: 'compromise@solutions.com'
  };

  // setup the tests before verification
  beforeAll(() => {
    // insert the sample user we then try to remove
    return createUser(sowell);
  });

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteUsersByUsername(sowell._username);
  })

  test('can delete users from REST API by username', async () => {
    // delete a user by their username. Assumes user already exists
    const status = await deleteUsersByUsername(sowell._username);

    // verify we deleted at least one user by their username
    expect(status.deletedCount).toBeGreaterThanOrEqual(1);
  });
});

describe('findUserById',  () => {
  // sample user we want to retrieve
  const adam = {
    _username: 'adam_smith',
    _password: 'not0sum',
    _email: 'wealth@nations.com'
  };

  // setup before running test
  beforeAll(() => {
    // clean up before the test making sure the user doesn't already exist
    return deleteUsersByUsername(adam._username)
  });

  // clean up after ourselves
  afterAll(() => {
    // remove any data we inserted
    return deleteUsersByUsername(adam._username);
  });

  test('can retrieve user from REST API by primary key', async () => {
    // insert the user in the database
    const newUser = await createUser(adam);

    // verify new user matches the parameter user
    expect(newUser._username).toEqual(adam._username);
    expect(newUser._password).toEqual(adam._password);
    expect(newUser._email).toEqual(adam._email);

    // retrieve the user from the database by its primary key
    const existingUser = await findUserById(newUser._id);

    // verify retrieved user matches parameter user
    expect(existingUser._username).toEqual(adam._username);
    expect(existingUser._password).toEqual(adam._password);
    expect(existingUser._email).toEqual(adam._email);
  });
});


describe('findAllUsers',  () => {

  // sample users we'll insert to then retrieve
  const usernames = [
    "larry", "curley", "moe"
  ];

  // setup data before test
  beforeAll(() =>
    // insert several known users
    Promise.all(usernames.map((_username) =>
      createUser({
        _username,
        _password: `${_username}123`,
        _email: `${_username}@stooges.com`
      })
    )
  ))

  // clean up after ourselves
  afterAll(() =>
    // delete the users we inserted
    Promise.all(usernames.map((_username) =>
      deleteUsersByUsername(_username)
    )
  ))

  test('can retrieve all users from REST API', async () => {
    // retrieve all the users
    const users = await findAllUsers();

    // there should be a minimum number of users
    expect(users.length).toBeGreaterThanOrEqual(usernames.length);

    // let's check each user we inserted
    const usersWeInserted = users.filter(
      user => usernames.indexOf(user._username) >= 0);

    // compare the actual users in database with the ones we sent
    usersWeInserted.forEach(user => {
      const username = usernames.find(username => username === user._username);
      expect(user._username).toEqual(username);
      expect(user._password).toEqual(`${username}123`);
      expect(user._email).toEqual(`${username}@stooges.com`);
    });
  });
});
