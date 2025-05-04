<script setup lang="ts">
import {ref} from 'vue';

const emit = defineEmits(['close', 'switch']);

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');

const handleRegister = async () => {
    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match';
        return;
    }

    try {
        const response = await fetch('/auth/register', { // TODO: change this?
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username.value, password: password.value}),
        });

        if (!response.ok) {
            const errorData = await response.json();
            errorMessage.value = errorData.error || 'Registration failed';
            return;
        }

        emit('switch');
    } catch (error) {
        errorMessage.value = 'An error occurred. Please try again.';
    }
};

// Random Logo bullshittery
import {getRandomSVG} from "@/utils.ts";
import {useSiteStore} from "@/store/siteStore.ts";

// Select random SVG from @assets/logo/jubiman/*.svg and set site name and logo
const imageModules = import.meta.glob('/src/assets/logo/jubiman/*.svg', {
    eager: true,
    query: '?url',
});
let randomSVG = getRandomSVG(imageModules);
const siteStore = useSiteStore();
siteStore.setSiteName('Jubiman');
siteStore.logoPath = randomSVG;
</script>

<template>
    <div class="header">
        <h1>Register</h1>
        <button class="close-button" @click="$emit('close')">×</button>
    </div>
    <form @submit.prevent="handleRegister">
        <div class="form-group">
            <input id="username" v-model="username" type="text" placeholder="Username" required/>
        </div>
        <div class="form-group">
            <input id="password" v-model="password" type="password" placeholder="Password" required/>
        </div>
        <div class="form-group">
            <input id="confirmPassword" v-model="confirmPassword" type="password" placeholder="Confirm Password"
                   required/>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button class="submit" type="submit">Register</button>
    </form>
    <p class="redirect">
        Already have an account?
        <a @click="$emit('switch')">Log in</a>
    </p>
</template>

<style scoped>
.header {
    margin-bottom: 1em;
    max-height: 70px;
}
.close-button {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 2.5em;
    line-height: 1ex;
    padding: 0;
    margin: 0;
    height: 1ex;
    width: 1ex;
    text-align: center;
    cursor: pointer;
    color: #8c8c8c;
    transition: color 0.3s ease;
    box-sizing: border-box;
}

.close-button:hover {
    color: #fff;
}

h1 {
    margin: 0;
    padding: 0;
}

.form-group {
    margin-bottom: 1em;
}

label {
    display: block;
    margin-bottom: 0.5em;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 0.5em;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.submit {
    width: 100%;
    padding: 0.75em;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
}

.submit:hover {
    background-color: #0056b3;
}

.error {
    color: red;
    font-size: 0.9em;
    margin-top: -0.5em;
    margin-bottom: 1em;
    text-align: center;
}

.redirect {
    text-align: center;
    margin-top: 1em;
    font-size: 0.9em;
    color: #8c8c8c;
}

.redirect a {
    color: #ffffff;
    text-decoration: none;
}

.redirect a:hover {
    text-decoration: underline;
}
</style>
