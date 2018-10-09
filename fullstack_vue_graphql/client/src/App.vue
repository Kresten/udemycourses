<template>
  <!-- This should be a style class -->
  <v-app style="background: #EEEEEE">
    <!-- Side Navbar -->
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="secondary" dark flat>
        <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
          <router-link to="/" tag="span" style="cursor: pointer">
            <h1 class="title pl-3">VueShare</h1>
          </router-link>
      </v-toolbar>

      <v-divider></v-divider>

      <!-- Side Navbar Links-->
      <v-list>
        <v-list-tile v-for="item in sideNavbarLinks" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{item.title}}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>

    <v-toolbar fixed color="primary">
      <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor:pointer">
          VueShare
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search input -->
      <v-text-field flex prepend-icon="search" placeholder="Search posts" color="accent" single-line hide-details></v-text-field>

      <v-spacer></v-spacer>

      <!-- Horizontal navbar links -->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in horizontalNavbarLinks" :key="item.title" :to="item.link">
          <v-icon class="hidden-sm-only" left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>

        <v-btn flat to="/profile" v-if="user">
          <v-icon class="hidden-sm-only" left>account_box</v-icon>
          <v-badge right color="blue darken-2">
            <span slot="badge">1</span>
            Profile
          </v-badge>
        </v-btn>

        <v-btn flat v-if="user">
          <v-icon class="hidden-sm-only" left>axit_to_app</v-icon>
          Signout
        </v-btn>

      </v-toolbar-items>
    </v-toolbar>

    <!-- App Content -->
    <main>
      <v-container class="mt-4">
        <transition name="fade">
          <router-view/>
        </transition>

      </v-container>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      sideNav: false,
      links: [
        { icon: 'chat', title: 'Posts', link: '/posts' },
        { icon: 'lock_open', title: 'Login', link: '/login' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ],      
      nav_links: [
        { icon: 'stars', title: 'Create Post', link: '/post/add' }
      ],      
      auth_links: [
        { icon: 'chat', title: 'Posts', link: '/posts' },
        { icon: 'stars', title: 'Create Post', link: '/post/add' },
        { icon: 'account_box', title: 'Profile', link: '/profile' }
      ]
    };
  },
  computed: {
    ...mapGetters(['user']),
    horizontalNavbarLinks() {
      if (this.user) {
        return this.nav_links;
      }
      return this.links;
    },
    sideNavbarLinks() {
      if (this.user) {
        return this.auth_links;
      }
      return this.links;
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}
/* To prevent "bumping", enter waits for leave to finish */
.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  /* Could also move in from left with (set transition-property: all;)
  transform: translateX(-25px);
  */
}
</style>


