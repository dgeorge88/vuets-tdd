<template>
  <post-writer :post="post" @save="save"></post-writer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PostWriter from "./PostWriter.vue";
import { Post } from "./types";
import moment from "moment";
import { useStore } from "./store";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "NewPost",
  components: {
    PostWriter,
  },
  setup() {
    const post: Post = {
      id: -1,
      title: "New Post",
      markdown: `## New Post\nEnter you post here...`,
      html: "",
      created: moment(),
      authorId: 0,
    };

    const store = useStore();
    const router = useRouter();

    const save = async (post: Post) => {
      // console.log("1");
      await store.createPost(post);
      // console.log("2");
      router.push("/");
      // console.log("3");
    };

    return {
      post,
      save,
    };
  },
});
</script>
