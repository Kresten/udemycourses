<template>
  <!-- This should be a style class -->
  <v-app style="background: #EEEEEE">
    <!-- Side Navbar (Extract to component :)) -->
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

        <v-list-tile v-if="user" @click="handleSignoutUser">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-action>
            Signout
          </v-list-tile-action>
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
      <v-text-field v-model="searchTerm" @input="handleSearchPosts"
      flex prepend-icon="search" placeholder="Search posts" color="accent" single-line hide-details></v-text-field>

      <v-card flexbox center dark v-if="searchResults.length" id="search__card">
        <v-list>
          <v-list-tile @click="goToSearchResult(result._id)" v-for="result in searchResults" :key="result._id">
            <v-list-tile-title>
              {{result.title}} -
              <span class="font-weight-thin">{{formatDescription(result.description)}}</span>
            </v-list-tile-title>
            <v-list-tile-action v-if="checkIfUserFavorite(result._id)"></v-list-tile-action>
            <v-icon>favorite</v-icon>
          </v-list-tile>
        </v-list>
      </v-card>

      <v-spacer></v-spacer>

      <!-- Horizontal navbar links -->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in horizontalNavbarLinks" :key="item.title" :to="item.link">
          <v-icon class="hidden-sm-only" left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>

        <v-btn flat to="/profile" v-if="user">
          <v-icon class="hidden-sm-only" left>account_box</v-icon>
          <v-badge right color="blue darken-2" :class="{'bounce': badgeAnimated}">
            <span slot="badge" v-if="userFavorites.length">{{userFavorites.length}}</span>
            Profile
          </v-badge>
        </v-btn>

        <v-btn flat v-if="user" @click="handleSignoutUser">
          <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
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

        <!-- Auth Snackbar -->
        <v-snackbar v-model="authSnackbar" color="success" :timeout='5000' bottom>
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn dark flat @click="authSnackbar = false">Close</v-btn>
        </v-snackbar>

        <!-- Auth Error Snackbar -->
        <v-snackbar v-if="authError" v-model="authErrorSnackbar" color="warning" :timeout='5000' bottom>
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{authError.message}}</h3>
          <v-btn dark flat to="/Login">Login</v-btn>
        </v-snackbar>

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
      searchTerm: '',
      sideNav: false,
      authSnackbar: false,
      badgeAnimated: false,
      authErrorSnackbar: false,
      links: [
        { icon: 'chat', title: 'Posts', link: '/posts' },
        { icon: 'lock_open', title: 'Login', link: '/login' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ],
      nav_links: [
        { icon: 'chat', title: 'Posts', link: '/posts' },
        { icon: 'stars', title: 'Create Post', link: '/post/add' }
      ],
      auth_links: [
        { icon: 'chat', title: 'Posts', link: '/posts' },
        { icon: 'stars', title: 'Create Post', link: '/post/add' },
        { icon: 'account_box', title: 'Profile', link: '/profile' }
      ]
    };
  },
  watch: {
    // we only want to show snackbar on initial login
    user(newValue, oldValue) {
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    },
    userFavorites(value) {
      if (value) {
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false), 1000);
      }
    }
  },
  computed: {
    ...mapGetters(['user', 'authError', 'userFavorites', 'searchResults']),
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
    formatDescription(desc) {
      return desc.length > 30 ? `${desc.slice(0, 30)}...` : desc;
    },
    handleSignoutUser() {
      this.$store.dispatch('signoutUser');
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },
    handleSearchPosts() {
      this.$store.dispatch('searchPosts', {
        searchTerm: this.searchTerm
      });
    },
    goToSearchResult(id) {
      // clear search term
      this.searchTerm = '';
      this.$router.push(`/posts/${id}`);
      this.$store.commit('clearSearchResults');
    },
    checkIfUserFavorite(id) {
      return (
        this.userFavorites && this.userFavorites.some(fave => fave._id === id)
      );
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

#search__card {
  position: absolute;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%;
}

.bounce {
  animation: bounce 1s both;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>


