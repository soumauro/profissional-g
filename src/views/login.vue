<template>
  <v-container class="fill-height login-container" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="12" md="8" lg="6" xl="4">
        <v-card class="login-card" elevation="10">
          <!-- Cabeçalho com logo -->
          <div class="login-header">
            <div class="logo-container">
              <v-img
                src="@/assets/icon.jpg"
                contain
                max-height="80"
                max-width="80"
                class="logo"
              ></v-img>
            </div>
            <v-card-title class="text-h3 font-weight-bold text-center primary--text pt-4">
              CartaMoz <span class="accent--text">Pro-G</span>
            </v-card-title>
            <v-card-subtitle class="text-subtitle-1 text-center grey--text">
              Sua jornada para a carteira de motorista profissional começa aqui
            </v-card-subtitle>
          </div>

          <!-- Conteúdo principal -->
          <v-card-text class="px-8 py-6">
            <!-- Botão de Login com Google -->
            <v-btn
              block
              x-large
              color="pink"
              elevation="2"
              dark
              @click="signInWithGoogle()"
              :loading="loading"
              :disabled="loading"
              class="google-btn mb-4"
            >
              <v-icon left color="#DB4437">mdi-google</v-icon>
              <span class="google-btn-text">Criar conta com Google</span>
            </v-btn>

            <!-- Divisor -->
            <!-- <div class="divider-container my-4">
              <v-divider></v-divider>
              <span class="divider-text px-3">ou</span>
              <v-divider></v-divider>
            </div> -->

            <!-- Formulário de email (opcional para futuro) -->
            <!-- <v-text-field
              v-model="email"
              label="Email"
              prepend-inner-icon="mdi-email"
              outlined
              rounded
              class="mb-4"
              disabled
            ></v-text-field>

            <v-btn
              block
              x-large
              color="primary"
              dark
              rounded
              class="mb-4"
              disabled
            >
              <v-icon left>mdi-email</v-icon>
              Continuar com Email
            </v-btn> -->

            <!-- Rodapé -->
            <div class="text-center mt-6 footer-text">
              <p class="text-caption grey--text">
                Ao continuar, você concorda com nossos <a href="#" class="primary--text">Termos de Serviço</a> e <a href="#" class="primary--text">Política de Privacidade</a>
              </p>
            </div>
          </v-card-text>
        </v-card>

        <!-- Mensagem de feedback -->
        <v-snackbar
          v-model="showError"
          color="error"
          timeout="4000"
          top
        >
          {{ errorMessage }}
          <template v-slot:actions>
            <v-btn
              outlined
              @click="showError = false"
            >
              Fechar
            </v-btn>
          </template>
        </v-snackbar>
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
      
      email: '',
      showError: false
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
.login-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
}

.login-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-header {
  background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
  padding: 40px 20px 20px;
  color: white;
  text-align: center;
}

.logo-container {
  background: white;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.google-btn {
  border: 1px solid #e0e0e0 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: 48px;
}

.google-btn-text {
  color: #3c4043;
  font-weight: 500;
}

.divider-container {
  display: flex;
  align-items: center;
}

.divider-text {
  color: #757575;
  font-size: 0.875rem;
}

.footer-text a {
  text-decoration: none;
}

/* Efeitos de hover */
.v-btn.google-btn:hover {
  background-color: #f8f9fa !important;
}

.v-btn:not(.google-btn):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* Responsividade */
@media (max-width: 600px) {
  .login-card {
    border-radius: 0;
  }
  
  .login-header {
    padding: 30px 15px 15px;
  }}
</style>