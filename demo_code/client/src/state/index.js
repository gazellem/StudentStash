import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    setUser: (state,action) => {
      if(state.user){
        state.user = action.payload.user
      }
      else {
        console.log("error")
      }
      //state.user = action.payload.user;
    },
    setListing: (state,action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setListing,setMode, setLogin, setLogout, setProfile, setInbox, setFriends, setPosts, setPost,setUser } =
  authSlice.actions;
export default authSlice.reducer;