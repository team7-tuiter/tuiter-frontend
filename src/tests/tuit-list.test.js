import Tuits from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";
import axios from "axios";
import {deleteTuit} from '../services/tuits-service'


const MOCKED_TUITS = [{ _tuit: "alice's tuit", _postedBy: '636490116cc0ec884dc608ac' }, 
                      { _tuit: "bob's tuit", _postedBy: '636490216cc0ec884dc608ae' }, 
                      {_tuit: "charlie's tuit", _postedBy: '636490216cc0ec884dc608ae'}];

// const MOCKED_TUITS = ['fwqrqwef', 'qwefqwfe']
test('tuit list renders static tuit array', () => {
  // TODO: implement this
  render(
    <HashRouter>
      <Tuits tuits={MOCKED_TUITS} />
    </HashRouter>
    );
  const linkElement2 = screen.getByText(/alice's tuit/i);
  const linkElement3 = screen.getByText(/charlie's tuit/i);
  const linkElement4 = screen.getByText(/bob's tuit/i);
  expect(linkElement2).toBeInTheDocument();
  expect(linkElement3).toBeInTheDocument();
  expect(linkElement4).toBeInTheDocument();
});

test('tuit list renders async', async () => {
  // TODO: implement this

  const tuits = await findAllTuits();
  render(
    <HashRouter>
      <Tuits tuits={tuits}/>
    </HashRouter>);
    const linkElement2 = screen.getByText(/Hello/i);
    expect(linkElement2).toBeInTheDocument();
})

test('tuit list renders mocked', async () => {
  // TODO: implement this
    // jest.mock('axios');

    axios.get = jest.fn()

    // axios.get.mockResolvedValueOnce({ data: {users: MOCKED_USERS}})
    axios.get.mockImplementation(() =>
      Promise.resolve({ data: {tuits: MOCKED_TUITS} }));
  
    const response = await findAllTuits();
    const tuits = response.tuits;
  
    render(
      <HashRouter>
        <Tuits tuits={tuits}/>
      </HashRouter>);
  
  const linkElement2 = screen.getByText(/alice's tuit/i);
  const linkElement3 = screen.getByText(/charlie's tuit/i);
  const linkElement4 = screen.getByText(/bob's tuit/i);
  expect(linkElement2).toBeInTheDocument();
  expect(linkElement3).toBeInTheDocument();
  expect(linkElement4).toBeInTheDocument();

});
