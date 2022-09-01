<template>
  <div ref="wrapper" class="wrapper" id="wrapper">
    <div
      class="centered shadow no-games column normalize-width bg-white draggable rounded"
      v-if="!games.length"
    >
      <p class="nowrap" v-show="!demoMode">No games today.</p>
      <button
        v-if="!demoMode"
        class="underlined no-drag"
        @click="demoMode = true"
      >
        Demo mode
      </button>
      <button
        v-else
        class="underlined no-drag"
        @click="
          demoMode = false;
          featured = null;
        "
      >
        Exit Demo
      </button>
    </div>
    <TransitionGroup ref="list" class="list" name="list" tag="ul">
      <li
        v-for="(game, index) in displayGames"
        :key="index"
        class="list-item bg-transparent"
      >
        <NhlGame
          :game="game"
          @dblclick="setFeatured(index)"
          v-if="featured === index || featured === null"
        />
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup>
// TODO: App is working as expected. Time to get electron involved.
import {
  ref,
  reactive,
  computed,
  nextTick,
  onUpdated,
  onMounted,
  watch,
} from 'vue';
// import { ipcRenderer } from 'electron';
import { useSocketIO } from './scripts/socketio.service';
import NhlGame from './components/NhlGame.vue';
// === DEMO ===
import demoGames from './scripts/demoGames';

const demoMode = ref(true);
// === DEMO ===

const socket = useSocketIO();
socket.on('scores', (scores) => {
  console.log('scores fired.', scores);
  demoMode.value = false;
  Object.assign(games, scores);
});

socket.on('no games', () => {
  console.log('no games fired.');
});

const games = reactive([]);

const featured = ref(null);
const setFeatured = (index) => {
  if (featured.value === index) {
    return (featured.value = null);
  }
  return (featured.value = index);
};

const displayGames = computed(() => {
  return demoMode.value ? demoGames : games;
});

// WRAPPER
const wrapper = ref(null);
onMounted(() => {
  const sizeObserver = new ResizeObserver((data) => {
    const height = data[0].contentRect.height;
    const width = data[0].contentRect.width;
    console.log('Height:', height, 'Width:', width);
    // TODO: Emit a resize event for electron to work with.
  });
  sizeObserver.observe(wrapper.value);
});
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  max-width: min-content !important;
  max-height: min-content;
  /* background-color: red; */
}
button {
  all: unset;
  cursor: pointer;
  padding: 8px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #212f3e;
  box-sizing: border-box;
  max-width: min-content;
}
.draggable {
  -webkit-user-select: none;
  user-select: none;
  -webkit-app-region: drag;
}
.no-drag {
  -webkit-app-region: no-drag !important;
}
.bg-white {
  background-color: white;
}
.no-games {
  padding: 2px;
}
.rounded {
  border-radius: 12px;
}
.bg-transparent {
  background-color: transparent;
}
.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.nowrap {
  white-space: nowrap;
}
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}
.column {
  flex-direction: column;
}
.underlined {
  text-decoration: underline;
  color: rgb(13, 13, 33);
}
.list {
  list-style-type: none;
  width: min-content;
  padding: 0;
}
.list-item {
  margin-bottom: 12px;
  cursor: pointer;
}
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.normalize-width {
  width: 169px;
  /* So the buttons don't jump around when games are removed from DOM */
}
</style>
