import { ACTION_TYPE } from "./Actions";

const initialState = {
  postList: [],
};

/**
 * Post Reducer
 */

const PostReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPE.FETCH_DATA:
      return {
        ...state,
        postList: action.postList,
      };
    default:
      return state;
  }
};

export default PostReducer;
