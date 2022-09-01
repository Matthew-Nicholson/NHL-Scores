<template>
  <div class="flex shadow unselectable bg-white normalize-width">
    <img
      :src="logos[props.game.homeTeam]"
      :alt="props.game.homeTeam"
      class="logo"
    />
    <span class="text-bold"
      >{{ props.game.homeScore }} - {{ props.game.awayScore }}</span
    >
    <img
      :src="logos[props.game.awayTeam]"
      :alt="props.game.awayTeam"
      class="logo"
    />
    <div class="bottom-center">
      <span v-if="props.game.finished" class="uppercase">Final</span>
      <span v-else-if="props.game.started"
        >{{ props.game.periodOrdinal }} • {{ props.game.timeRemaining }}</span
      >
      <span v-else class="uppercase">{{ startTime }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import logos from '../scripts/teamLogos';
const props = defineProps(['game']);
const startTime = computed(() => {
  return new Date(props.game.startTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
});
</script>

<style>
.flex {
  display: inline-flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  height: 65px;
  border-radius: 24px;
  padding-left: 2px;
  padding-right: 2px;
  white-space: nowrap;
  /* background-color: transparent; */
}
.shadow {
  /* box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px; */
  box-shadow: rgba(6, 24, 44, 0.1) 0px 0px 0px 2px,
    rgba(6, 24, 44, 0.2) 0px 4px 6px -1px;
}
.uppercase {
  text-transform: uppercase;
}
.logo {
  aspect-ratio: 1/1;
  max-height: 100%;
  max-width: 100%;
  border-radius: 50%;
  overflow: hidden;
}
.bottom-center {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: darkgreen;
  border-radius: 16px;
  font-size: 12px;
  width: min-content;
  padding: 2px 8px;
  white-space: nowrap;
  overflow: hidden;
}
.text-bold {
  font-weight: bold;
  font-size: 19px;
  letter-spacing: -1px;
}
</style>
