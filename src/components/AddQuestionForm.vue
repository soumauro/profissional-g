<template>
    <v-card class="pa-4">
      <v-card-title>Adicionar Nova Pergunta</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitQuestion">
          <!-- Campo para a pergunta -->
          <v-text-field
            v-model="form.question"
            label="Pergunta"
            required
            outlined
          ></v-text-field>
  
          <!-- Campos para as opções de resposta -->
          <v-text-field
            v-model="form.a"
            label="Opção A"
            required
            outlined
          ></v-text-field>
          <v-text-field
            v-model="form.b"
            label="Opção B"
            required
            outlined
          ></v-text-field>
          <v-text-field
            v-model="form.c"
            label="Opção C"
            required
            outlined
          ></v-text-field>
          <v-text-field
            v-model="form.d"
            label="Opção D"
            required
            outlined
          ></v-text-field>
  
          <!-- Seleção da resposta correta -->
          <v-select
            v-model="form.answer"
            :items="answerOptions"
            label="Resposta Correta"
            required
            outlined
          ></v-select>
  
          <!-- Botão de envio -->
          <v-btn type="submit" color="primary" :loading="loading">
            Adicionar Pergunta
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </template>
  
  <script lang="ts">
  import routersName from '@/db/apiname';
import ApiService from '@/db/apiservice';
import { useRoute } from 'vue-router';
import { defineComponent, ref } from 'vue';
  //import api from '@/services/api';
  const api = new ApiService ()
  const baseurel = new routersName()
  
  
  export default defineComponent({
    name: 'AddQuestionForm',
    
    setup(props, { emit }) {
        const route = useRoute();
        const uuid = route.params.uuid;

        const form = ref({
        question: '',
        a: '',
        b: '',
        c: '',
        d: '',
        answer: '',
        "uuid": uuid
    });
  
  
      const answerOptions = ['A', 'B', 'C', 'D']; // Opções para a resposta correta
      const loading = ref(false);
  
      const submitQuestion = async () => {
        loading.value = true;
        try {
          await api.insert( `${baseurel.questions}/insert` , form.value); // Envia os dados para a API
          emit('question-added'); // Notifica o componente pai
          resetForm(); // Limpa o formulário após o envio
        } catch (error) {
          console.error('Erro ao adicionar pergunta:', error);
        } finally {
          loading.value = false;
        }
      };
  
      const resetForm = () => {
        form.value = {
          question: '',
          a: '',
          b: '',
          c: '',
          d: '',
          answer: '',
          "uuid": uuid
        };
      };
  
      return {
        form,
        answerOptions,
        loading,
        submitQuestion,
      };
    },
  });
  </script>