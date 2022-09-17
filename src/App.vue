<template>
  <div
    @click="contextMenu.show = false"
    @contextmenu="showContextMenu"
    @mousedown="onMouseDown"
    ref="wrapper"
    class="wrapper bg-transparent unselectable"
    id="wrapper"
  >
    <div class="shadow no-games normalize-width bg-white" v-if="!games.length">
      <p class="nowrap" v-show="!demoMode">No games today.</p>
      <button v-if="!demoMode" class="underlined" @click="demoMode = true">
        Demo mode
      </button>
      <button
        v-else
        class="underlined"
        @click="
          demoMode = false;
          featured = null;
        "
      >
        Exit Demo
      </button>
    </div>
    <TransitionGroup ref="list" class="list" name="list" tag="ul">
      <li v-for="(game, index) in displayGames" :key="index" class="list-item">
        <NhlGame
          :game="game"
          @dblclick="setFeatured(index)"
          v-if="featured === index || featured === null"
        />
      </li>
    </TransitionGroup>
    <ContextMenu
      v-if="contextMenu.show"
      :x="contextMenu.x"
      :y="contextMenu.y"
      @close="closeApp"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useSocketIO } from './scripts/socketio.service';
import NhlGame from './components/NhlGame.vue';
import ContextMenu from './components/ContextMenu.vue';
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
    const width = data[0].contentRect.width + 4; // Adding +4 prevents app from ever having width of 0, which causes a crash.
    window.ipc.send('resize', { height: height, width: width });
  });
  sizeObserver.observe(wrapper.value);
});

// Context menu
const contextMenu = reactive({
  show: false,
  x: 0,
  y: 0,
});
const showContextMenu = (e) => {
  e.preventDefault();
  contextMenu.x = e.clientX;
  contextMenu.y = e.clientY;
  return (contextMenu.show = true);
};
const closeApp = () => {
  return window.ipc.send('close');
};

// Drag
const animationId = ref(null);
const mouseX = ref(null);
const mouseY = ref(null);

function onMouseDown(e) {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
  document.addEventListener('mouseup', onMouseUp);
  requestAnimationFrame(moveWindow);
}
function onMouseUp(e) {
  document.removeEventListener('mouseup', onMouseUp);
  cancelAnimationFrame(animationId.value);
}
function moveWindow() {
  window.ipc.send('windowMoving', {
    mouseX: mouseX.value,
    mouseY: mouseY.value,
  });
  animationId.value = requestAnimationFrame(moveWindow);
}
</script>

<style>
body,
html {
  margin: 0; /* Otherwise app sometimes has width of 0. Idk. */
  padding: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #212f3e;
  overflow: hidden; /* Electron likes to randomly add a pixel here or there. Probably a rounding issue. */
  max-width: min-content; /* We send this width to electron, so this is important.*/
  max-height: min-content;
}
.wrapper {
  padding: 2px; /* So our box shadow isn't cut off*/
}
::-webkit-scrollbar {
  display: none; /* This isn't doing anything but might be necessary on small screens*/
}
button {
  all: unset;
  cursor: pointer;
  padding: 8px;
}

.bg-white {
  background-color: white;
}
.no-games {
  align-items: center;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2px;
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

.underlined {
  text-decoration: underline;
  color: rgb(13, 13, 33);
}
.list {
  list-style-type: none;
  width: min-content;
  padding: 0;
  margin-bottom: 0;
  padding-bottom: 0;
}
.list-item {
  margin-bottom: 12px;
  cursor: pointer;
}
.list-item:last-child {
  margin-bottom: 0;
}
.list-move {
  transition: all 0.42s ease-in-out;
}
.normalize-width {
  width: 169px;
  /* So the buttons don't jump around when games are removed from DOM */
}
</style>
