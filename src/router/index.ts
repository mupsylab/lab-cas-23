import { createRouter, createWebHashHistory } from 'vue-router'

import experDefault from '../view/exper/exp3.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "experment",
      component: experDefault
    },
    {
      path: "/exp1",
      name: "experment1",
      component: () => import("../view/exper/exp1.vue")
    },
    {
      path: "/exp2",
      name: "experment2",
      component: () => import("../view/exper/exp2.vue")
    },
    {
      path: "/exp3",
      name: "experment3",
      component: () => import("../view/exper/exp3.vue")
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../view/error/index.vue"),
    }
  ]
});

export default router;
