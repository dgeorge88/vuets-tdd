<template>
  <nav class="navbar">
    <div class="navbar-end">
      <div class="buttons" v-if="auth">
        <router-link class="button" to="/posts/new">New Post</router-link>
        <button class="button" @click="">Signup</button>
      </div>

      <div class="buttons" v-if="!auth">
        <button class="button" @click="signup">Signup</button>
        <button class="button" @click="signin">Login</button>
      </div>
    </div>
    <teleport to="#modal" v-if="modal.visible">
      <component :is="component"></component>
    </teleport>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent, markRaw } from "vue";
import Signup from "./Signup.vue";
import { useStore } from "./store";
import { useModal } from "./useModal";

export default defineComponent({
  setup() {
    const store = useStore();
    const auth = computed(() => store.getState().authors.currentUserId);

    //  dynamically render modal compoentn
    const modal = useModal();

    const signup = () => {
      modal.showModal();
      modal.component.value = markRaw(Signup); // markRaw removes reactive
    };

    const signin = () => {
      modal.showModal();
    };

    return {
      component: modal.component,
      modal,
      auth,
      signup,
      signin,
    };
  },
});
</script>