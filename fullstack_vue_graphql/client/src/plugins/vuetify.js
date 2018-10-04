import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify, {
  theme: {
    primary: colors.blue.lighten1,
    secondary: colors.lightBlue.darken3,
    accent: colors.blue.accent3,
    error: colors.red.accent2,
    warning: colors.yellow.darken1,
    info: colors.lightBlue.lighten2,
    success: colors.green.accent4
  }
});
