import {
  createTuit,
  deleteTuit, deleteTuitByUserId, findAllTuits,
  findTuitById
} from "../services/tuits-service";

describe('can create tuit with REST API', () => {
  // sample tuit to insert
  const tuit = {
    _postedBy: '63648a07ecc60d08fa496a83',
    _tuit: 'This is curleys Tuit!!!'
  };

  // setup test before running test
  beforeAll(() => {
    // remove any/all tuits to make sure we create it in the test
    return deleteTuitByUserId(tuit._postedBy);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteTuitByUserId(tuit._postedBy);
  })

  test('can create tuit with REST API', async () => {
    // insert new tuit in the database
    const newTuit = await createTuit(tuit._postedBy, tuit);

    // verify inserted tuit's properties match parameter tuit
    expect(newTuit._postedBy).toEqual(tuit._postedBy);
    expect(newTuit._tuit).toEqual(tuit._tuit);
  });
});


describe('can delete tuit wtih REST API', () => {
  // sample tuit to delete
  const tuit = {
    _postedBy: '63648a07ecc60d08fa496a83',
    _tuit: 'This is curleys Tuit!!!'
  }

  // setup the tests before verification
  beforeAll(() => {})

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteTuit(tuit._postedBy);
  })

  test('can delete tuit wtih REST API', async () => {
    // delete a tuit by their id. Assumes tuit already exists
    const newTuit = await createTuit(tuit._postedBy, tuit);
    const status = await deleteTuit(newTuit._id);

    // verify we deleted at least one tuit by their id
    expect(status.deletedCount).toBeGreaterThanOrEqual(1);
  });
});



describe('can retrieve a tuit by their primary key with REST API', () => {
  // sample tuit we want to retrieve
  const tuit = {
    _postedBy: '63648a07ecc60d08fa496a83',
    _tuit: 'This is curleys Tuit!!!'
  }

  // setup before running test
  beforeAll(() => {
    // clean up before the test making sure the tuit doesn't already exist
    return deleteTuitByUserId(tuit._postedBy)
  })

  // clean up after ourselves
  afterAll(() => {
    // remove any data we inserted
    return deleteTuitByUserId(tuit._postedBy)
  })

  test('can retrieve a tuit by their primary key with REST API', async () => {
    // insert the tuit in the database
    const newTuit = await createTuit(tuit._postedBy, tuit);
    // verify new tuit matches the parameter tuit
    expect(newTuit._postedBy).toEqual(tuit._postedBy);
    expect(newTuit._tuit).toEqual(tuit._tuit);

    // retrieve the tuit from the database by its primary key
    const existingUser = await findTuitById(newTuit._id);
    // verify retrieved tuit matches parameter tuit
    expect(existingUser._postedBy._id).toEqual(tuit._postedBy);
    expect(existingUser._tuit).toEqual(tuit._tuit);
  })
})

describe('can retrieve all tuits with REST API', () => {
  // sample tuits we'll insert to then retrieve
  const tuits = [
    {
      _postedBy: '63648a07ecc60d08fa496a83',
      _tuit: 'This is curleys Tuit!!!'
    },
    {
      _postedBy: '636490116cc0ec884dc608ac',
      _tuit: 'This is javiers Tuit!!!'
    },
    {
      _postedBy: '636490216cc0ec884dc608ae',
      _tuit: 'This is tostons Tuit!!!'
    }
  ]

  // setup data before test
  beforeAll(() =>
    // insert several known tuits
    Promise.all(tuits.map((_tuit) => {    
      createTuit(_tuit._postedBy, {
        _tuit: _tuit._tuit,
        _postedBy: _tuit._postedBy
      })
    })
  ))

  // clean up after ourselves
  afterAll(() =>
    // delete the tuits we inserted
    Promise.all(tuits.map((_tuit) =>
      deleteTuitByUserId(_tuit._postedBy)
    )
  ))

  test('can retrieve all tuits from REST API', async () => {
    // retrieve all the tuits
    const tuitsRetrieved = await findAllTuits();
    // there should be a minimum number of tuits
    expect(tuitsRetrieved.length).toBeGreaterThanOrEqual(tuits.length);

    // let's check each tuit we inserted
    const tuitsWeInserted = tuitsRetrieved.filter(
      tuit => tuits.indexOf(tuit._tuit) >= 0);

    // compare the actual users in database with the ones we sent
    tuitsWeInserted.forEach(tuit => {
      const _tuit = tuits.find(tuit => tuit === tuit._tuit);
      expect(tuit._postedBy).toEqual(_tuit._postedBy);
      expect(tuit._tuit).toEqual(_tuit._tuit);
    });
  });
});

