<template>
  <v-app>
    <v-toolbar fixed color="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor:pointer">
          VueShare
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search input -->
      <v-text-field flex prepend-icon="search" placeholder="Search posts" color="accent" single-line hide-details></v-text-field>

      <v-spacer></v-spacer>

      <!-- Horizontal navbar links -->
      <v-toolbar-items>
        <v-btn flat v-for="item in horizontalNavbarLinks" :key="item.title" :to="item.link">
          <v-icon left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <router-view/>
    </main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  computed: {
    horizontalNavbarLinks() {
      return [
        { icon: 'chat', title: 'Posts', link: '/posts' },
        { icon: 'lock_open', title: 'Login', link: '/login' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ];
    }
  }
};
</script>


