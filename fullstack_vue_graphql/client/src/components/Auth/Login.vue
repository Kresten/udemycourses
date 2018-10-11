<template>
  <v-container text-xs-center mt-5 pt-5>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Login</h1>
      </v-flex>
    </v-layout>

    <!-- Error alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
      </v-layout>

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="secondary" dark>
          <v-container>

            <!-- We prevent the default action, which refreshes the page -->
            <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleLoginUser">

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="usernameRules" v-model="username" prepend-icon="face" label="Username" type="text" required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" v-model="password" prepend-icon="security" label="Password" type="password" required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn :loading="loading" :disabled="!isFormValid || loading" color="accent" type="submit">
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    Submit
                  </v-btn>
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
      isFormValid: true,
      username: '',
      password: '',
      usernameRules: [
        username => !!username || 'Username is required',
        username =>
          username.length < 15 || 'Username must be less than 15 characters'
      ],
      passwordRules: [
        password => !!password || 'Password is required',
        password =>
          password.length >= 3 || 'Password must be at least 3 characters'
      ]
    };
  },
  computed: {
    ...mapGetters(['user', 'error', 'loading'])
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
      if (this.$refs.form.validate()) {
        this.$store.dispatch('loginUser', {
          username: this.username,
          password: this.password
        });
      }
    }
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
