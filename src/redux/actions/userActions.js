import {showToast} from '../../config/toast';

export const setUserInfo = data => {
  return dispatch => {
    dispatch({type: 'SET_USER_INFO', data});
  };
};

export const setFirstOpen = data => {
  return dispatch => {
    dispatch({type: 'SET_FIRST_OPEN', data});
  };
};

export const doLogout = () => {
  return dispatch => {
    dispatch({type: 'DO_LOGOUT'});
  };
};
