import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'


import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './db/config'
 
loadFonts()

onAuthStateChanged(auth, (user) => {
  if (user) {
    store.dispatch('fetchUserUid', { userUid: user.uid, isloged: true });
  } else {
    store.dispatch('fetchUserUid', { userUid: null, isloged: false });
  }
});

function checkAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(!!user);
    });
  });
}

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app')
