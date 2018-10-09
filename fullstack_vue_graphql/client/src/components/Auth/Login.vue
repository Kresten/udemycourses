<template>
  <v-container text-xs-center mt-5 pt-5>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Login</h1>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="secondary" dark>
          <v-container>

            <!-- We prevent the default action, which refreshes the page -->
            <v-form @submit.prevent="handleLoginUser">

              <v-layout row>
                <v-flex xs12>
                  <v-text-field v-model="username" prepend-icon="face" label="Username" type="text" required></v-text-field>  
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field v-model="password" prepend-icon="security" label="Password" type="password" required></v-text-field>  
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn color="accent" type="submit">Submit</v-btn>
                  <h3>Don't have an account?
                    <router-link to="/signup">Signup</router-link> 
                  </h3> 
                </v-flex>
              </v-layout>

            </v-form>
          </v-container>
        </v-card>
      </v-flex> 
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {
    user(value) {
      // if user values changes at all, redirect to homepage
      if (value) {
        this.$router.push('/');
      }
    }
  },
  methods: {
    handleLoginUser() {
      this.$store.dispatch('loginUser', {
        username: this.username,
        password: this.password
      });
    }
  }
};
</script>
