import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMapStore = defineStore('mapStore', () => {
  const lineupSaved = ref(false); // État pour indiquer quand un lineup est enregistré

  const isAttackMode = ref<boolean>(true);
  const mapInteractiveSide = ref<string>('');

  const mapInteractiveAtkDef: Record<string, string> = {
    AscentAtk: '/images/Map Interactive/Ascent_atk.webp',
    AscentDef: '/images/Map Interactive/Ascent_def.webp',
    AbyssAtk: '/images/Map Interactive/Abyss_atk.webp',
    AbyssDef: '/images/Map Interactive/Abyss_def.webp',
    BindAtk: '/images/Map Interactive/Bind_atk.webp',
    BindDef: '/images/Map Interactive/Bind_def.webp',
    BreezeAtk: '/images/Map Interactive/Breeze_atk.webp',
    BreezeDef: '/images/Map Interactive/Breeze_def.webp',
    HavenAtk: '/images/Map Interactive/Haven_atk.webp',
    HavenDef: '/images/Map Interactive/Haven_def.webp',
    IceboxAtk: '/images/Map Interactive/Icebox_atk.webp',
    IceboxDef: '/images/Map Interactive/Icebox_def.webp',
    SplitAtk: '/images/Map Interactive/Split_atk.webp',
    SplitDef: '/images/Map Interactive/Split_def.webp',
    LotusAtk: '/images/Map Interactive/Lotus_atk.webp',
    LotusDef: '/images/Map Interactive/Lotus_def.webp',
    PearlAtk: '/images/Map Interactive/Pearl_atk.webp',
    PearlDef: '/images/Map Interactive/Pearl_def.webp',
    SunsetAtk: '/images/Map Interactive/Sunset_atk.webp',
    SunsetDef: '/images/Map Interactive/Sunset_def.webp',
  };

  function setLineupSaved(saved) {
    lineupSaved.value = saved;
  }


  function getModeSuffix(): string {
    return isAttackMode.value ? 'Atk' : 'Def';
  }

  function getMapImagePath(mapName: string): string {
    const path = mapInteractiveAtkDef[`${mapName}${getModeSuffix()}`];
    if (!path) {
      console.warn(`Aucun chemin trouvé pour la carte "${mapName}" en mode ${getModeSuffix()}`);
      return '';
    }
    console.log(`getMapImagePath: mapName=${mapName}, mode=${getModeSuffix()}, path=${path}`);
    return path;
  }

  function updateMapInteractiveSide(mapName: string) {
    const path = getMapImagePath(mapName);
    mapInteractiveSide.value = path;
    console.log(`updateMapInteractiveSide: mapName=${mapName}, mapInteractiveSide=${mapInteractiveSide.value}`);
  }

  function toggleMode(mapName: string) {
    isAttackMode.value = !isAttackMode.value;
    updateMapInteractiveSide(mapName);
    console.log(`toggleMode: mapName=${mapName}, isAttackMode=${isAttackMode.value}`);
  }

  function resetStore() {
    isAttackMode.value = true;
    mapInteractiveSide.value = '';
  }

  return {
    resetStore,
    isAttackMode,
    toggleMode,
    updateMapInteractiveSide,
    mapInteractiveSide,
    setLineupSaved,
    lineupSaved,
  };
});
