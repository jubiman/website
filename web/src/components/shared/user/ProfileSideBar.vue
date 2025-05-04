<script setup lang="ts">
import {useRouter} from 'vue-router';

const emit = defineEmits(['close']);

const router = useRouter();

const goToProfile = () => {
    router.push('/profile');
    emit('close');
};

const logout = async () => {
    const response = await fetch('/auth/logout', {
        method: 'get',
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData.error || 'Logout failed');
        return;
    }

    // Clear the username from local storage
    localStorage.removeItem('username');
    emit('close');
    await router.push('/');
};
</script>

<template>
    <div class="overlay" @click="emit('close')">
        <div class="sidebar" @click.stop>
            <button @click="goToProfile">Profile</button>
            <button @click="logout">Logout</button>
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
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
    transition: opacity 0.3s ease;
    backdrop-filter: brightness(0.8);
}

.sidebar {
    width: 300px;
    height: 100%;
    background: #1b1e1d;
    box-shadow: -4px 0 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    padding: 1em;
    gap: 1em;
    transition: transform 0.3s ease;
    transform: translateX(0); /* Slide in */
}

.sidebar button {
    background: none;
    border: none;
    padding: 0.5em 1em;
    text-align: left;
    cursor: pointer;
    font-size: 1em;
    transition: background 0.3s;
}

.sidebar button:hover {
    background: #424242;
}
</style>
