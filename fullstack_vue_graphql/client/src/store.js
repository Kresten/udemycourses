import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';

import { defaultClient as apolloClient } from './main';

import { GET_CURRENT_USER, GET_POSTS, LOGIN_USER, SIGNUP_USER, ADD_POST } from './queries';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null,
    authError: null
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
    clearUser: state => (state.user = null),
    clearError: state => (state.error = null),
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
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
        }
      })
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          console.error(err);
        });
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
    userFavorites: state => state.user && state.user.favorites
  }
});
