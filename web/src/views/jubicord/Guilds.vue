<script setup lang="ts">
import {ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useSiteStore} from '@/store/siteStore';
import {Guild} from '@/types/guild';
import {getGuilds} from '@/api';
import {getGuildIconUrl, getRandomSVG} from "@/utils.ts";

const router = useRouter();
const guilds = ref<Guild[]>([]);
const currentPage = ref(1);
const itemsPerPage = 9;

getGuilds().then((data: Guild[]) => {
    guilds.value = data;
});

const paginatedGuilds = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return guilds.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(guilds.value.length / itemsPerPage);
});

const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const goToGuild = (guildId: string) => {
    router.push(`/jubicord/guilds/${guildId}`);
};

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
    <div class="guild-grid">
        <div v-for="guild in paginatedGuilds" :key="guild.guildId" class="guild-item">
            <button @click="goToGuild(guild.guildId)">
                <img :src="getGuildIconUrl(guild.guildId, guild.iconUrl, guild.guildName)" alt="Guild Icon" class="guild-icon"/>
                <div class="guild-name">{{ guild.guildName }}</div>
            </button>
        </div>
    </div>
    <div class="pagination-controls">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    </div>
</template>

<style scoped>
.guild-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    width: 500px;
}

.guild-item > * {
    text-align: center;
    flex: 1 1 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.guild-icon {
    width: 100px;
    height: 100px;
    object-fit: cover;
}

.guild-name {
    margin-top: 8px;
    font-size: 14px;
}

.pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
}

.pagination-controls button {
    margin: 0 8px;
}
</style>