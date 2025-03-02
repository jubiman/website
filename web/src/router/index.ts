import {createRouter, createWebHistory} from 'vue-router';

const routes = [
    {
        path: '/',
        name: "jubiman",
        component: () => import('@/views/Jubiman.vue'),
        meta: {
            title: "Jubiman",
            metaTags: [
                {
                    name: 'description',
                    content: 'The home page of Jubiman.'
                },
                {
                    property: 'og:description',
                    content: 'The home page of Jubiman.'
                }
            ]
        }
    },
    {
        path: '/jubicord',
        name: "jubicord",
        component: () => import('@/views/jubicord/JubiCord.vue'),
        meta: {
            title: "JubiCord",
            metaTags: [
                {
                    name: 'description',
                    content: 'The home page of the JubiCord dashboard.'
                },
                {
                    property: 'og:description',
                    content: 'The home page of the JubiCord dashboard.'
                }
            ]
        }
    },
    {
        path: '/jubicord/guilds',
        name: "guilds",
        component: () => import('@/views/jubicord/Guilds.vue'),
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;