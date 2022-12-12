const initialState = {
  user: null,
  loading: false,
  isFirstOpen: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_USER_INFO':
      return {...state, user: action.data};

    case 'SET_FIRST_OPEN':
      return {...state, isFirstOpen: action.data};

    case 'DO_LOGOUT':
      return initialState;
  }

  return state;
}
