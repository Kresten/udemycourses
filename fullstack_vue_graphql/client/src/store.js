import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';

import { defaultClient as apolloClient } from './main';

import {
  GET_CURRENT_USER,
  GET_POSTS,
  LOGIN_USER,
  SIGNUP_USER,
  ADD_POST,
  SEARCH_POSTS,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  INFINITE_SCROLL_POSTS
} from './queries';
import { POINT_CONVERSION_HYBRID } from 'constants';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    userPosts: [],
    loading: false,
    error: null,
    authError: null,
    searchResults: []
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    clearUser: state => (state.user = null),
    clearError: state => (state.error = null),
    clearSearchResults: state => (state.searchResults = []),
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    }
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit('setLoading', false);
          commit('setUser', data.getCurrentUser);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload
        }).then(({ data }) => {
          commit('setUserPosts', data.getUserPosts);
        }).catch(err => console.error(err));
    },
    getPosts: ({ commit }) => {
      commit('setLoading', true);
      // use ApolloClient to fire getPosts query
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          // commit allows us to pass data from an an action to a mutation function
          commit('setPosts', data.getPosts);
          commit('setLoading', false);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient.query({
        query: SEARCH_POSTS,
        variables: payload
      }).then(({ data }) => {
        commit('setSearchResults', data.searchPosts);
      }).catch(err => {
        console.error(err);
      });
    },
    addPost: ({ commit }, payload) => {
      apolloClient.mutate({
        mutation: ADD_POST,
        variables: payload,
        // When we add a post, we want it to be reflected in the carousel as well.
        // This carousel uses the initial posts from login, so we add our post to the cached query (called on init)
        update: (cache, { data: { addPost } }) => {
          const data = cache.readQuery({ query: GET_POSTS });
          // we have copied the data from the old cached query and added the new posts at the beginning
          data.getPosts.unshift(addPost);
          // we write the updated array back to the cache
          cache.writeQuery({
            query: GET_POSTS,
            data
          });
        },
        // we use optimitic reponse to ensure the post is added immediately
        // When using optimistic response, the data is returned immediately, and thus fields added by the backend will not be filled (e.g. createdDate on Posts)
        optimisticResponse: {
          __typename: 'Mutation',
          addPost: {
            __typename: 'Post',
            _id: -1,
            ...payload
          }
        },
        // rerun specified queries after performing the mutation in order to get fresh data
        refetchQueries: [
          {
            query: INFINITE_SCROLL_POSTS,
            variables: {
              pageNum: 1,
              pageSize: 2
            }
          }
        ]
      })
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient.mutate({
        mutation: DELETE_USER_POST,
        variables: payload
      })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(post => post._id === data.deleteUserPost._id);
          // create new array up to the one we have updated, insert new one, +1 to index to skip old post
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ];
          commit('setUserPosts', userPosts);
        })
        .catch(err => console.error(err));
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient.mutate({
        mutation: UPDATE_USER_POST,
        variables: payload
      })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(post => post._id === data.updateUserPost._id);
          // create new array up to the one we have updated, insert new one, +1 to index to skip old post
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ];
          commit('setUserPosts', userPosts);
        })
        .catch(err => console.error(err));
    },
    signupUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false);
          // Are you fucking serious???
          localStorage.setItem('token', data.signupUser.token);
          // make sure created is run in main.js - reload the page
          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
        });
    },
    loginUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);
      apolloClient
        .mutate({
          mutation: LOGIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false);
          // Are you fucking serious???
          localStorage.setItem('token', data.loginUser.token);
          // make sure created is run in main.js - reload the page
          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
        });
    },
    signoutUser: async ({ commit }) => {
      // clear user in state
      commit('clearUser');
      // remove token in localStorage
      localStorage.setItem('token', '');
      // end session in Apollo
      await apolloClient.resetStore();
      // redirect home - kick users out of private pages
      router.push('/');
    }
  },
  getters: {
    posts: state => state.posts,
    user: state => state.user,
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError,
    userPosts: state => state.userPosts,
    searchResults: state => state.searchResults,
    userFavorites: state => state.user && state.user.favorites
  }
});
