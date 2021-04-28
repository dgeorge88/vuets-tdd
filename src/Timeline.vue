<template>
  <nav class="is-primary">
    <p class="panel-tabs">
      <a
        data-test="period"
        v-for="period in periods"
        :key="period"
        @click="setPeriod(period)"
        :class="[period === selectedPeriod ? 'is-active' : '']"
        >{{ period }}
      </a>
    </p>

    <time-line-post
      v-for="post in posts"
      :key="post.id"
      :post="post"
    ></time-line-post>
  </nav>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref } from "vue";
import moment from "moment";

import { Period, Post } from "./types";
import { useStore } from "./store";
import TimeLinePost from "./TimeLinePost.vue";

export default defineComponent({
  components: { TimeLinePost },
  async setup() {
    //type binding with TS
    const periods: Period[] = ["today", "this week", "this month"];
    const selectedPeriod = ref<Period>("today");

    // initiase store
    const store = useStore();

    if (!store.getState().posts.loaded) {
      await store.fetchPosts();
    }

    const allPosts = store.getState().posts.ids.reduce<Post[]>((acc, id) => {
      const post = store.getState().posts.all[id];
      return acc.concat(post);
    }, []); // each itteration push post data to array

    //posts
    const posts: ComputedRef<Post[]> = computed(() =>
      allPosts.filter((post) => {
        //today
        if (
          selectedPeriod.value === "today" &&
          post.created.isAfter(moment().subtract(1, "day"))
        ) {
          return true;
        }
        //this week
        if (
          selectedPeriod.value === "this week" &&
          post.created.isAfter(moment().subtract(7, "day"))
        ) {
          return true;
        }
        //this month
        if (
          selectedPeriod.value === "this month" &&
          post.created.isAfter(moment().subtract(1, "month"))
        ) {
          return true;
        }
        return false;
      })
    );

    //click binding
    const setPeriod = (period: Period) => {
      selectedPeriod.value = period;
    };
    return {
      periods,
      selectedPeriod,
      setPeriod,
      posts,
    };
  },
});
</script>