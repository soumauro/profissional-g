<template>
    <v-container>
      <!-- Formulário para adicionar perguntas -->
      <AddQuestionForm @question-added="getQuestions" />
  
      <!-- Lista de perguntas -->
      <v-row class="mt-4">
        <v-col cols="12" sm="6" md="4" v-for="question in questions" :key="question.id">
          <v-card class="ma-2">
            <v-card-title>{{ question.question }}</v-card-title>
            <v-card-text>
              <p><strong>A:</strong> {{ question.a }}</p>
              <p><strong>B:</strong> {{ question.b }}</p>
              <p><strong>C:</strong> {{ question.c }}</p>
              <p><strong>D:</strong> {{ question.d }}</p>
              <p><strong>Resposta Correta:</strong> {{ question.answer }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import ApiService from '@/db/apiservice'; // Certifique-se de que o caminho está correto
import AddQuestionForm from '@/components/AddQuestionForm.vue';

// Defina a interface para o tipo de uma pergunta
interface Question {
  id: number;
  available: number;
  uuid: string;
  question: string;
  a: string;
  b: string;
  c: string;
  d: string;
  answer: string;
}

export default defineComponent({
  name: 'QuestionsView',
  components: {
    AddQuestionForm,
  },
  setup() {
    const api = new ApiService(); // Instância do ApiService
    const questions = ref<Question[]>([]); // Array de perguntas

    // Função para buscar as perguntas
    const getQuestions = async () => {
      try {
        const response = await api.get('/questions'); // Faz a requisição GET
        questions.value = response as Question[]; // Atribui os dados ao `questions`
      } catch (error) {
        console.error('Erro ao carregar perguntas:', error);
      }
    };

    // Busca as perguntas ao montar o componente
    onMounted(() => {
      getQuestions();
    });

    return {
      questions,
      getQuestions,
    };
  },
});
</script>