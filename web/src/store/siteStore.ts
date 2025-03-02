import {defineStore} from 'pinia';
import {ref} from 'vue';

const opposite = {
    "JubiCord": 'Jubiman',
    "Jubiman": 'JubiCord',
}

export const useSiteStore = defineStore('site', () => {
    const siteName = ref('Jubiman');
    const prevName = ref('JubiCord');
    const logoPath = ref('');

    function setSiteName(name: string) {
        siteName.value = name;
        prevName.value = opposite[name];
    }

    return {siteName, setSiteName, logoPath, prevName};
});