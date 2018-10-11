<template>
  <v-container text-xs-center mt-5 pt-5>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Get started here</h1>
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
        <v-card color="accent" dark>
          <v-container>

            <!-- We prevent the default action, which refreshes the page -->
            <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleSignupUser">

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="usernameRules" v-model="username" prepend-icon="face" label="Username" type="text" required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="emailRules" v-model="email" prepend-icon="email" label="Email" type="email" required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" v-model="password" prepend-icon="security" label="Password" type="password" required></v-text-field>
                </v-flex>
              </v-layout>


              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" v-model="passwordConfirmation" prepend-icon="gavel" label="Confirm Password" type="password" required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn :loading="loading" :disabled="!isFormValid || loading" color="accent" type="submit">
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    Signup
                  </v-btn>
                  <h3>Already have an account?
                    <router-link to="/login">Login</router-link>
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
  name: 'Signup',
  data() {
    return {
      isFormValid: true,
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      usernameRules: [
        username => !!username || 'Username is required',
        username =>
          username.length < 15 || 'Username cannot be more than 15 characters'
      ],
      emailRules: [
        email => !!email || 'Email is required',
        email => /.@+./.test(email) || 'Email must be valid'
      ],
      passwordRules: [
        password => !!password || 'Password is required',
        password =>
          password.length >= 3 || 'Password must be at least 3 characters',
        passwordConfirmation =>
          passwordConfirmation === this.password || 'Passwords must match'
      ]
    };
  },
  watch: {
    user(value) {
      // if user values changes at all, redirect to homepage
      if (value) {
        this.$router.push('/');
      }
    }
  },
  computed: {
    ...mapGetters(['loading', 'error', 'user'])
  },
  methods: {
    handleSignupUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signupUser', {
          username: this.username,
          email: this.email,
          password: this.password
        });
      }
    }
  }
};
</script>
