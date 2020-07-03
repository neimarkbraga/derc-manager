import Vue from 'vue';
import Router from 'vue-router';

import Home from '../views/Home';
import Manage from '../views/Manage';
import Export from '../views/Export';
import Import from '../views/Import';
import PageNotFound from '../views/PageNotFound';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/manage',
      component: Manage
    },
    {
      path: '/export',
      component: Export
    },
    {
      path: '/import',
      component: Import
    },
    {
      path: '*',
      component: PageNotFound
    }
  ]
});

export default router;