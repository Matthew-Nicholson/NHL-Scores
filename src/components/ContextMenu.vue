<template>
  <ul class="context-menu">
    <li @click="emit('close')">
      <span class="icon">✖</span><span>Close</span>
    </li>
  </ul>
</template>

<script setup>
const emit = defineEmits(['close']);
const props = defineProps(['x', 'y']);
</script>

<style>
.context-menu {
  position: fixed;
  top: v-bind(y + 'px');
  left: v-bind(x + 'px');
  list-style-type: none;
  background-color: #eee;
  border: thin solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
}
.context-menu li {
  margin: 0;
  padding: 2px 8px;
  text-align: center;
}
.context-menu li:hover {
  background-color: #ccc;
  cursor: pointer;
}
.icon {
  margin-right: 8px;
}
</style>
