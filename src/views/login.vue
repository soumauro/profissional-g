<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4" class="text-center">
        <!-- Título -->
        <v-card-title class="text-h4 font-weight-bold primary--text mb-4">
          Cartamozpro - G.
        </v-card-title>

        <!-- Subtítulo -->
        <v-card-subtitle class="text-body-1 grey--text text--darken-1 mb-6">
          Crie sua conta para começar.
        </v-card-subtitle>

        <!-- Botão de Login com Google -->
        <v-btn 
          color="primary" 
          @click="signInWithGoogle()" 
          :loading="loading"
          :disabled="loading"
          class="px-6 py-4 px-sm-8 py-sm-6"
        >
          <v-icon left>mdi-google</v-icon>
          <span class="text-body-2 text-sm-body-1 font-weight-bold">Entrar com Google</span>
        </v-btn>

        <!-- Mensagem de feedback -->
        <v-alert v-if="errorMessage" type="error" class="mt-4">
          {{ errorMessage }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '.././db/config';
import ApiService from '.././db/apiservice';
import routersName from '../db/apiname';
import { getAdditionalUserInfo } from "firebase/auth";
import { useRouter } from 'vue-router';
import { defineComponent, ref } from "vue";

const provider = new GoogleAuthProvider();
const apiservice = new ApiService()
const baseurl = new routersName()

export default defineComponent({
  name: "login",

  setup() {
    const router = useRouter();
    const loading = ref(false);
    const errorMessage = ref('');

    const signInWithGoogle = async () => {
      loading.value = true;
      errorMessage.value = '';

      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const additionalInfo = getAdditionalUserInfo(result);
        const isNewUser = additionalInfo?.isNewUser;

        if (isNewUser) {
          await apiservice.insert(`${baseurl.conta}/insert`, { "user": { "uuid": user.uid, email: user.email } });
          alert(`Bem-vindo, ${user.displayName}! Sua conta foi criada com sucesso.`);
        }

        // Redireciona para a página "home" após o login/registro
        router.push({ name: "home" });

      } catch (error) {
        console.error('Erro ao fazer login:', error);
        errorMessage.value = 'Erro ao fazer login. Tente novamente.';
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      errorMessage,
      signInWithGoogle,
    };
  }
});
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
}

.v-card {
  border-radius: 15px;
}

.v-card-title {
  font-family: 'Roboto', sans-serif;
}

.v-card-subtitle {
  font-family: 'Roboto', sans-serif;
}

.v-btn {
  text-transform: none;
  font-size: 1.1rem;
}
</style>