<script setup lang="ts">
import {useSiteStore} from '@/store/siteStore';
import {useRouter} from "vue-router";
import ProfileSideBar from "./user/ProfileSideBar.vue";
import {inject} from "vue";

const emit = defineEmits(['login', 'profile']);

const router = useRouter();
const siteStore = useSiteStore();
const profileSidebarActive = inject('profileSidebarActive')

const profileClick = () => {
    // Check local storage for sid
    const username = localStorage.getItem('username');
    if (username) {
        emit('profile');
        return;
    }
    emit('login');
};

// TODO: should be scalable
const redirectToBase = () => {
    const basePath = siteStore.siteName.toLowerCase() === 'jubiman' ? '/' : `/${siteStore.siteName.toLowerCase()}`;
    router.push(basePath);
};
</script>

<template>
    <nav>
        <div class="logo" @click="redirectToBase">
            <img :src="siteStore.logoPath" alt="Logo"/>
            {{ siteStore.siteName }}
        </div>
        <div>
            <a href="https://github.com/jubiman" target="_blank" rel="noreferrer">GitHub</a>
            <!--      <a href="/jubicord">JubiCord</a>-->
            <router-link :to="{name: siteStore.prevName.toLowerCase()}">{{ siteStore.prevName }}</router-link>
            <div class="profile-icon" @click="profileClick">
                <img src="/src/assets/profile-placeholder.png" alt="Profile" />
            </div>
            <ProfileSideBar v-if="profileSidebarActive" @close="$emit('profile')"/>
        </div>
    </nav>
</template>

<style scoped>
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(90deg, #c00068, #9f116a);
    padding: 1em 2em;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

nav > div {
    display: flex;
    align-items: center;
}

nav a {
    color: white;
    text-decoration: none;
    margin: 0 1em;
    transition: color 0.3s, transform 0.3s;
}

nav a:hover {
    color: #333;
    transform: scale(1.1);
}

.logo {
    display: flex;
    align-items: center;
    font-size: 1.5em;
    font-weight: bold;
    color: white;
}

.logo:hover {
    cursor: pointer;
    color: #eaeaea;
}

.logo img,
.profile-icon img {
    vertical-align: middle;
    margin-right: 0.5em;
    height: 1.5em;
}

.profile-icon img {
    width: 2em;
    height: 2em;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.3s;
    margin-right: 3em;
}

.profile-icon img:hover {
    transform: scale(1.1);
}
</style>
