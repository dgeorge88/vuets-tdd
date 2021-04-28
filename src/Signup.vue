<template>
  <form @submit.prevent="submitHandler">
    <form-input
      type="text"
      name="Username"
      v-model="username"
      :error="usernameStatus.message"
    ></form-input>

    <form-input
      type="text"
      name="Username"
      v-model="password"
      :error="passwordStatus.message"
    ></form-input>
    <button
      class="button is-primary"
      :disabled="!usernameStatus.valid || !passwordStatus.valid"
    >
      Submit
    </button>
  </form>
</template>

<script lang="ts">
import { required, length, validate, Status } from "./validators";
import { defineComponent, computed, ref } from "vue";
import FormInput from "./FormInput.vue";
import { User } from "./types";
import { useStore } from "./store";
import { useModal } from "./useModal";

export default defineComponent({
  components: { FormInput },
  name: "App",

  setup() {
    const username = ref("username");
    const usernameStatus = computed<Status>(() => {
      return validate(username.value, [
        required(),
        length({ min: 5, max: 10 }),
      ]);
    });

    const password = ref("password");
    const passwordStatus = computed<Status>(() => {
      return validate(password.value, [
        required(),
        length({ min: 10, max: 40 }),
      ]);
    });

    const store = useStore();
    const modal = useModal();
    const submitHandler = (e: any) => {
      if (!usernameStatus.value.valid || !passwordStatus.value.valid) {
        return;
      }

      const user: User = {
        id: -1,
        username: username.value,
        password: password.value,
      };

      store.createUser(user);
      modal.hideModal();
    };

    return {
      submitHandler,
      usernameStatus,
      username,
      passwordStatus,
      password,
    };
  },
});
</script>


<style scoped>
form {
  background: white;
  padding: 15px;
  margin-top: 25%;
}
</style>