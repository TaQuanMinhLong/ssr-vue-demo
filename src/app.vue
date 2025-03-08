<script setup lang="ts">
// import TEMPLATES from './templates';
import { resolveComponent } from 'vue';

const props = defineProps({
  name: { type: String, required: true },
  props: { type: Object, required: true, default: {} },
})
console.log("[client] template data", props);

</script>

<template>
  <component :is="resolveComponent(props.name)" v-bind="props.props" />
</template>
