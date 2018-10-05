import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/Auth/Login.vue';
import Profile from './components/Auth/Profile.vue';
import Signup from './components/Auth/Signup.vue';
import AddPost from './components/Posts/AddPost.vue';
import Posts from './components/Posts/Posts.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/post/add',
      name: 'addpost',
      component: AddPost
    },
    {
      path: '/posts',
      name: 'posts',
      component: Posts
    },
  ]
});
