<template>
  <div class="centered column normalize-width" v-if="!games.length">
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
  <TransitionGroup class="list" name="list" tag="ul">
    <li v-for="(game, index) in displayGames" :key="index" class="list-item">
      <NhlGame
        :game="game"
        @dblclick="setFeatured(index)"
        v-if="featured === index || featured === null"
      />
    </li>
  </TransitionGroup>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useSocketIO } from './scripts/socketio.service';
import NhlGame from './components/NhlGame.vue';

const socket = useSocketIO();
socket.on('scores', (scores) => {
  demoMode.value = false;
  Object.assign(games, scores);
});

const games = reactive([]);

// === DEMO ===
const demoMode = ref(false);
const demoGames = reactive([
  {
    homeTeam: 'Boston Bruins',
    awayTeam: 'Washington Capitals',
    homeScore: 2,
    awayScore: 2,
    period: 3,
    periodOrdinal: '3rd',
    timeRemaining: '1:21',
    startTime: '2022-10-12T23:00:00Z',
    started: true,
    finished: false,
  },
  {
    homeTeam: 'Columbus Blue Jackets',
    awayTeam: 'Carolina Hurricanes',
    homeScore: 1,
    awayScore: 0,
    period: 3,
    periodOrdinal: '3rd',
    timeRemaining: '4:20',
    startTime: '2022-10-12T23:00:00Z',
    started: true,
    finished: false,
  },
  {
    homeTeam: 'Toronto Maple Leafs',
    awayTeam: 'Montréal Canadiens',
    homeScore: 3,
    awayScore: 1,
    period: 3,
    periodOrdinal: 'Final',
    timeRemaining: '0:00',
    startTime: '2022-10-12T23:00:00Z',
    started: true,
    finished: true,
  },
  {
    homeTeam: 'Chicago Blackhawks',
    awayTeam: 'Colorado Avalanche',
    homeScore: 0,
    awayScore: 0,
    period: 1,
    periodOrdinal: '1st',
    timeRemaining: '19:41',
    startTime: '2022-10-13T01:30:00Z',
    started: true,
    finished: false,
  },
  {
    homeTeam: 'Seattle Kraken',
    awayTeam: 'Anaheim Ducks',
    homeScore: 0,
    awayScore: 0,
    period: 0,
    periodOrdinal: null,
    timeRemaining: '20:00',
    startTime: '2022-10-13T02:00:00Z',
    started: false,
    finished: false,
  },
  {
    homeTeam: 'Vancouver Canucks',
    awayTeam: 'Edmonton Oilers',
    homeScore: 0,
    awayScore: 0,
    period: 0,
    periodOrdinal: null,
    timeRemaining: '20:00',
    startTime: '2022-10-13T02:00:00Z',
    started: false,
    finished: false,
  },
]);
// === DEMO ===

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
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  max-width: min-content;
  max-height: min-content;
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
