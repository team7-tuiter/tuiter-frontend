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
