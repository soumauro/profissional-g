<template>
    <v-container class="fill-height" fluid>
      <v-row justify="center" align="center">
        <v-col cols="12" md="8" lg="6">
          <v-card class="pa-6" elevation="10">
            <!-- Cabeçalho -->
            <v-card-title class="text-center primary--text">
              <v-icon large color="primary" left>mdi-book-open-variant</v-icon>
              <span class="text-h4 font-weight-bold">Cartamozpro</span>
            </v-card-title>
  
            <!-- Subtítulo -->
            <v-card-subtitle class="text-center text-h6">
              Prepare-se para os exames do INNATRO 2025 de forma eficiente e inteligente!
            </v-card-subtitle>
  
            <!-- Mensagem de Boas-Vindas -->
            <v-card-text class="text-center">
              <p class="text-body-1">
                Bem-vindo ao <strong>Cartamozpo</strong>, a plataforma que vai te ajudar a conquistar sua aprovação no INNATRO 2025.
              </p>
              <p class="text-body-1">
                Aqui você encontra:
              </p>
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-check</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <strong>Materiais atualizados</strong> para todas as disciplinas.
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-check</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <strong>Simulados personalizados</strong> para testar seu conhecimento.
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-check</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <strong>Dicas de estudo</strong> dos melhores especialistas.
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
  
            <!-- Botão de Login com Google -->
            <v-card-actions class="justify-center">
              <v-btn
              elevation="4"
              variant="outlined"
                color="primary"
                large
                @click="signInWithGoogle()"
              >
                <v-icon left>mdi-google</v-icon>
                Entrar com Google
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script lang="ts">
  import {   signInWithPopup,GoogleAuthProvider,  } from "firebase/auth";
import { auth } from '.././db/config';
import ApiService from '.././db/apiservice';
import routersName from '../db/apiname';
import { getAdditionalUserInfo } from "firebase/auth";
import store from '../store';
import { useRouter } from 'vue-router';

const provider = new GoogleAuthProvider();
const apiservice = new ApiService()
const baseurl = new routersName()
export default {
  name:"login",
    
  methods: {
    async signInWithGoogle() {
      const router = useRouter();
      try {
        
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const additionalInfo = getAdditionalUserInfo(result);
        const isNewUser = additionalInfo?.isNewUser;
        
        if (isNewUser) {
          apiservice.insert(`${baseurl.conta}/insert`, {"user": { "uuid": user.uid, email: user.email }} )
          alert(`Bem-vindo, ${user.displayName}! Sua conta foi criada com sucesso.`);
        } else {
          alert(`Bem-vindo de volta, ${user.displayName}!`);
        }
        
        router.push('/'); // Redireciona para a página inicial após o login
      } catch (error) {
        console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login. Tente novamente.');
    }
  }
} 
}
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