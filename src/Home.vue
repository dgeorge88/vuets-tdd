<template>
  <Suspense>
    <template #default>
      <timeline></timeline>
    </template>

    <template #fallback>
      <loading></loading>
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Timeline from "./Timeline.vue";
import Loading from "./Loading.vue";

export default defineComponent({
  name: "Home",
  components: {
    Timeline,
    Loading,
  },
});
</script>
