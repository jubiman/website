<script setup lang="ts">
import {ref, onMounted, nextTick} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {getGuild, getSuperusers } from '@/api';
import type {Guild, Superuser} from '@/types';
import {useSiteStore} from "@/store/siteStore.ts";
import {getGuildIconUrl, getRandomSVG} from "@/utils.ts";
import axios from 'axios';
import {useToast} from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const guild = ref<Guild | null>(null);
const guildIcon = ref<string>();
const superusers = ref<Superuser[]>([]);
const identifier = ref<string | null>(null);
const channelId = ref<string | null>(null);
const isEditingIdentifier = ref(false);
const editedIdentifier = ref<string | null>(null);

onMounted(async () => {
    const guildId = route.params.guildId as string;
    guild.value = await getGuild(guildId);
    guildIcon.value = getGuildIconUrl(guildId, guild.value?.iconUrl, guild.value?.guildName);

    // Fetch superusers
    const fetchedSuperusers: Superuser[] = await getSuperusers(guildId, { full: true });
    superusers.value = fetchedSuperusers.map(user => ({
        ...user,
        avatarUrl: `https://cdn.discordapp.com/avatars/${user.userId}/${user.avatarUrl}.png`
    }));

    // Fetch identifier and channelId
    identifier.value = guild.value?.identifier || null;
    channelId.value = guild.value?.channelId || null;
});

function goBack() {
    router.push('/jubicord/guilds');
}

function editIdentifier() {
    isEditingIdentifier.value = true;
    editedIdentifier.value = identifier.value;
    nextTick(() => {
        const input = document.querySelector('.edit-input') as HTMLInputElement;
        input.focus();
    });
}

function cancelEdit() {
    isEditingIdentifier.value = false;
    editedIdentifier.value = null;
}

function sanitizeInput(input: string): string {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
}

async function saveIdentifier() {
    if (editedIdentifier.value !== null) {
        const sanitizedIdentifier = sanitizeInput(editedIdentifier.value);
        const guildId = route.params.guildId as string;
        try {
            await axios.post(`/api/jubicord/v1/guilds/${guildId}/`, {identifier: sanitizedIdentifier});
            identifier.value = sanitizedIdentifier;
            isEditingIdentifier.value = false;
        } catch (error) {
            console.error('Failed to save identifier:', error);
            toast.error('Failed to save identifier. Please try again.');
        }
    }
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
        saveIdentifier();
    } else if (event.key === 'Escape') {
        cancelEdit();
    }
}

// Select random SVG from @assets/logo/jubicord/*.svg and set site name and logo
const imageModules = import.meta.glob('/src/assets/logo/jubicord/*.svg', {
    eager: true,
    query: '?url',
});
let randomSVG = getRandomSVG(imageModules);
const siteStore = useSiteStore();
siteStore.setSiteName('JubiCord');
siteStore.logoPath = randomSVG;
</script>

<template>
    <div class="guild-view">
        <button class="back-button" @click="goBack">←</button>
        <div class="guild-header">
            <img :src="guildIcon" alt="Guild icon" class="guild-icon"/>
            <h2>{{ guild?.guildName }}</h2>
        </div>
        <div class="guild-info-grid">
            <div class="guild-info-item">
                <h3>Superusers</h3>
                <ul>
                    <li v-for="user in superusers" :key="user.userId" class="superuser-item">
                        <img :src="user.avatarUrl" alt="User avatar" class="superuser-avatar"/>
                        <span>{{ user.username }}</span>
                    </li>
                </ul>
            </div>
            <div class="guild-info-item">
                <h3>Minecraft Identifier</h3>
                <div v-if="isEditingIdentifier" class="edit-box">
                    <input v-model="editedIdentifier" class="edit-input" @keydown="handleKeydown"/>
                    <div class="button-container">
                        <div class="button-container-2">
                            <button @click="cancelEdit" class="cancel-button">Cancel</button>
                            <button @click="saveIdentifier" class="save-button">Save</button>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p>{{ identifier }}</p>
                    <button @click="editIdentifier">Edit</button>
                </div>
            </div>
            <div class="guild-info-item">
                <h3>Bot Channel</h3>
                <p>{{ channelId }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.guild-view {
    padding: 20px;
    position: relative;
}

.back-button {
    background: none;
    border: none;
    font-size: 2em;
    padding: 10px 20px;
    top: 12%;
    left: 1%;
    position: fixed;
    overflow: hidden;
    cursor: pointer;
    transition: color 0.3s ease;
    color: #fff;
}

.back-button::before {
    content: "";
    position: absolute;
    top: calc(50% + 1px);
    left: calc(50% - 1px);
    width: 0;
    height: 0;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease;
    z-index: -1;
}

.back-button:hover::before {
    width: 75%;
    height: 75%;
}

.guild-header {
    display: flex;
    align-items: center;
    margin-top: 50px;
}

.guild-icon {
    width: 30px;
    height: 30px;
    object-fit: cover;
    margin-right: 8px;
}

.guild-info-grid {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    flex-wrap: wrap;
}

.guild-info-item {
    flex: 1;
    border: 2px solid #ccc;
    padding: 20px;
    min-height: 200px;
    min-width: 200px;
    border-radius: 10px;
    background-color: #151515;
}

.guild-info-item ul {
    list-style-type: none;
    padding: 0;
}

.superuser-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.superuser-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.edit-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
}

.edit-input {
    flex: 1;
    padding: 8px;
    border: 2px solid #ccc;
    border-radius: 5px;
    background-color: #252525;
    color: #fff;
    width: 100%;
}

.button-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    width: 100%;
    position: relative;
}

.button-container-2 {
    display: flex;
    gap: 10px;
    position: absolute;
    bottom: -90px;
}

.save-button, .cancel-button {
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.save-button {
    background-color: #4CAF50;
    color: #fff;
}

.save-button:hover {
    background-color: #45a049;
}

.cancel-button {
    background-color: #f44336;
    color: #fff;
}

.cancel-button:hover {
    background-color: #e53935;
}

/* Media query for responsiveness */
@media (max-width: 768px) {
    .guild-info-grid {
        flex-direction: column;
    }
}
</style>
