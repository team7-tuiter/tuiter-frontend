import {
  createUser,
  deleteUsersByUsername,
  findAllUsers,
  findUserById,
} from "../services/users-service";

describe("createUser", () => {
  // sample user to insert
  const ripley = {
    _username: "ellenripley",
    _password: "lv426",
    _email: "ellenripley@aliens.com",
  };

  // setup test before running test
  beforeAll(() => {
    // remove any/all users to make sure we create it in the test
    return deleteUsersByUsername(ripley._username);
  });

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteUsersByUsername(ripley._username);
  });

  test("can insert new users with REST API", async () => {
    // insert new user in the database
    const newUser = await createUser(ripley);

    // verify inserted user's properties match parameter user
    expect(newUser._username).toEqual(ripley._username);
    expect(newUser._password).toEqual(ripley._password);
    expect(newUser._email).toEqual(ripley._email);
  });
});

describe("deleteUsersByUsername", () => {
  // sample user to delete
  const sowell = {
    _username: "thommas_sowell",
    _password: "compromise",
    _email: "compromise@solutions.com",
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
  });

  test("can delete users from REST API by username", async () => {
    // delete a user by their username. Assumes user already exists
    const status = await deleteUsersByUsername(sowell._username);

    // verify we deleted at least one user by their username
    expect(status.deletedCount).toBeGreaterThanOrEqual(1);
  });
});

describe("findUserById", () => {
  // sample user we want to retrieve
  const adam = {
    _username: "adam_smith",
    _password: "not0sum",
    _email: "wealth@nations.com",
  };

  // setup before running test
  beforeAll(() => {
    // clean up before the test making sure the user doesn't already exist
    return deleteUsersByUsername(adam._username);
  });
});
