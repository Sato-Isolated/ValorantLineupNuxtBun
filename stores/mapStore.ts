import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMapStore = defineStore('mapStore', () => {
  const lineupSaved = ref(false); // État pour indiquer quand un lineup est enregistré

  const isAttackMode = ref<boolean>(true);
  const mapInteractiveSide = ref<string>('');

  const mapInteractiveAtkDef: Record<string, string> = {
    AscentAtk: '/images/Map Interactive/Ascent_atk.jpg',
    AscentDef: '/images/Map Interactive/Ascent_def.jpg',
    AbyssAtk: '/images/Map Interactive/Abyss_atk.jpg',
    AbyssDef: '/images/Map Interactive/Abyss_def.jpg',
    BindAtk: '/images/Map Interactive/Bind_atk.jpg',
    BindDef: '/images/Map Interactive/Bind_def.jpg',
    BreezeAtk: '/images/Map Interactive/Breeze_atk.jpg',
    BreezeDef: '/images/Map Interactive/Breeze_def.jpg',
    HavenAtk: '/images/Map Interactive/Haven_atk.jpg',
    HavenDef: '/images/Map Interactive/Haven_def.jpg',
    IceboxAtk: '/images/Map Interactive/Icebox_atk.jpg',
    IceboxDef: '/images/Map Interactive/Icebox_def.jpg',
    SplitAtk: '/images/Map Interactive/Split_atk.jpg',
    SplitDef: '/images/Map Interactive/Split_def.jpg',
    LotusAtk: '/images/Map Interactive/Lotus_atk.jpg',
    LotusDef: '/images/Map Interactive/Lotus_def.jpg',
    PearlAtk: '/images/Map Interactive/Pearl_atk.jpg',
    PearlDef: '/images/Map Interactive/Pearl_def.jpg',
    SunsetAtk: '/images/Map Interactive/Sunset_atk.jpg',
    SunsetDef: '/images/Map Interactive/Sunset_def.jpg',
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
