import {UserList} from "../components/profile/user-list";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllUsers} from "../services/users-service";
import axios from "axios";

const MOCKED_USERS = [
  {_username: 'ellen_ripley', _password: 'lv426', _email: 'repley@weyland.com', _id: "123"},
  {_username: 'sarah_conor', _password: 'illbeback', _email: 'sarah@bigjeff.com', _id: "234"},
]

test('user list renders static user array', () => {
  render(
    <HashRouter>
      <UserList users={MOCKED_USERS}/>
    </HashRouter>);
  const linkElement = screen.getByText(/ellen_ripley/i);
  expect(linkElement).toBeInTheDocument();
});

test('user list renders async', async () => {
  const users = await findAllUsers();
  render(
    <HashRouter>
      <UserList users={users}/>
    </HashRouter>);
  const linkElement = screen.getByText(/javier/i);
  expect(linkElement).toBeInTheDocument();
})



test('user list renders mocked', async () => {
  
  // jest.mock('axios');

  axios.get = jest.fn()

  // axios.get.mockResolvedValueOnce({ data: {users: MOCKED_USERS}})
  axios.get.mockImplementation(() =>
    Promise.resolve({ data: {users: MOCKED_USERS} }));

  const response = await findAllUsers();
  const users = response.users;

  render(
    <HashRouter>
      <UserList users={users}/>
    </HashRouter>);

  const user = screen.getByText(/ellen_ripley/i);
  expect(user).toBeInTheDocument();
});
