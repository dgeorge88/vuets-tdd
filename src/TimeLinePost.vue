<template>
  <a class="panel-block" data-test="post">
    <div>
      <a data-test="post-title">{{ post.title }}</a>
      <div data-test="post-created">{{ post.created.format("Do MMM") }}</div>
    </div>
  </a>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Post } from "./types";
export default defineComponent({
  props: {
    post: {
      type: Object as () => Post,
      required: true,
    },
  },
});
</script>