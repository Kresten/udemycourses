import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#0D47A1',
    secondary: '#1E88E5',
    accent: '#18FFFF',
    error: '#D32F2F',
    warning: '#ffeb3b',
    info: '#2196f3',
    success: '#4caf50'
  }
});
