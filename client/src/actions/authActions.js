import axios from "axios";

import { SET_CURRENT_USER } from "./types";

export const setCurrentUser = () => dispatch => {
  axios
    .get("/api/current_user")
    .then(res => {
      console.log(res.data);
      dispatch({
        type: SET_CURRENT_USER,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err.response);
    });
};
