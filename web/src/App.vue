<script setup lang="ts">
import {ref, provide} from 'vue';
import NavigationBar from './components/shared/NavigationBar.vue';
import LoginPopup from "./components/shared/user/LoginPopup.vue";
import RegisterPopup from "./components/shared/user/RegisterPopup.vue";

const userPopupState = ref<'login' | 'register' | null>(null);
const profileSidebarActive = ref<Boolean>(false);

const setUserPopupState = (popup: 'login' | 'register' | null) => {
    userPopupState.value = popup;
};

const toggleProfileSidebar = () => {
    profileSidebarActive.value = !profileSidebarActive.value;
};

// Provide the state and toggle function to child components
provide('userPopupState', userPopupState);
provide('profileSidebarActive', profileSidebarActive);
</script>

<template>
    <NavigationBar @login="setUserPopupState('login')" @profile="toggleProfileSidebar" />
    <router-view/>
    <div v-if="userPopupState" class="overlay" @click="setUserPopupState(null)">
        <div class="login-popup" @click.stop>
            <LoginPopup v-if="userPopupState === 'login'" @close="setUserPopupState(null)" @switch="setUserPopupState('register')" />
            <RegisterPopup v-if="userPopupState === 'register'" @close="setUserPopupState(null)" @switch="setUserPopupState('login')" />
        </div>
    </div>
</template>

<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.login-popup {
    position: relative;
    max-width: 400px;
    margin: 5em auto;
    padding: 2em;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #1b1e1d;
}

.register-popup {
    position: relative;
    max-width: 400px;
    margin: 5em auto;
    padding: 2em;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #1b1e1d;
}
</style>
