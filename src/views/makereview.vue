<template>
    <v-container class="review-container">
      <!-- Cabeçalho -->
      <v-row class="mb-2">
        <v-col cols="12">
          <h1 class="text-h4 font-weight-bold">Revisão Inteligente</h1>
          <p class="text-subtitle-1">Exame Profissional-G 2025</p>
        </v-col>
      </v-row>
  
      <!-- Controles -->
      <v-row class="mb-4">
        <v-col cols="12" sm="6">
          <v-switch
            v-model="showAll"
            inset
            :label="showAll ? 'Mostrando todas opções' : 'Mostrando respostas'"
            color="primary"
            hide-details
            class="mt-0"
          ></v-switch>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="searchQuery"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            label="Buscar perguntas..."
            clearable
            variant="outlined"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
  
      <!-- Lista de Perguntas -->
      <v-row>
        <v-col 
          v-for="(question, index) in filteredQuestions" 
          :key="question.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <v-card class="question-card" elevation="2">
            <!-- Cabeçalho do Card -->
            <div class="question-header pa-3" @click="toggleQuestion(index)">
              <v-badge 
                color="primary" 
                :content="index + 1" 
                inline 
                class="mr-2"
              ></v-badge>
              <h3 class="question-text text-body-1">{{ question.question }}</h3>
            </div>
  
            <!-- Conteúdo do Card (sempre visível) -->
            <div class="answer-content pa-3">
              <!-- Modo Todas Opções -->
              <template v-if="showAll">
                <v-list density="compact" class="py-0">
                  <v-list-item
                    v-for="(option, key) in getOptions(question)"
                    :key="key"
                    class="px-0"
                    :class="{ 'correct-option': key === question.answer }"
                  >
                    <template v-slot:prepend>
                      <v-icon :color="key === question.answer ? 'success' : ''" size="small">
                        {{ key === question.answer ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                      </v-icon>
                    </template>
                    <v-list-item-title class="text-caption">
                      <strong>{{ key }}.</strong> {{ option }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </template>
  
              <!-- Modo Apenas Resposta -->
              <template v-else>
                <div class="correct-answer d-flex align-center">
                  <v-icon color="success" size="small" class="mr-2">mdi-check-circle</v-icon>
                  <div>
                    <div class="text-caption font-weight-bold">Resposta correta:</div>
                    <div class="text-caption">
                      {{ question.answer }}. {{ getOptions(question)[question.answer] }}
                    </div>
                  </div>
                </div>
              </template>
  
              <!-- Explicação -->
              <div v-if="question.explanation" class="explanation mt-2">
                <v-alert
                  density="compact"
                  type="info"
                  variant="tonal"
                  class="text-caption mb-0"
                >
                  {{ question.explanation }}
                </v-alert>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Sem resultados -->
      <v-row v-if="filteredQuestions.length === 0">
        <v-col cols="12" class="text-center py-8">
          <v-icon size="large" color="grey">mdi-magnify-remove</v-icon>
          <p class="text-grey">Nenhuma pergunta encontrada</p>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import ApiService from '@/db/apiservice';
  import routersName from '@/db/apiname';
  
  const apiService = new ApiService();
  const routersNames = new routersName();
  const baseurl = routersNames.user;
  
  export default {
    name: 'ReviewPage',
    data() {
      return {
        showAll: false,
        searchQuery: '',
        questions: [],
        activeQuestions: []
      };
    },
    computed: {
      filteredQuestions() {
        if (!this.searchQuery) return this.questions;
        const query = this.searchQuery.toLowerCase();
        return this.questions.filter(q => 
          q.question.toLowerCase().includes(query) ||
          q.a.toLowerCase().includes(query) ||
          q.b.toLowerCase().includes(query) ||
          q.c.toLowerCase().includes(query) ||
          q.d.toLowerCase().includes(query)
        );
      }
    },
    async created() {
      await this.fetchQuestions();
    },
    methods: {
      async fetchQuestions() {
        try {
          const response = await apiService.get(`${baseurl}/user/${this.$route.params.uuid}`);
          this.questions = response.map(q => ({
            ...q,
            explanation: q.explanation || this.generateExplanation(q.answer, q)
          }));
        } catch (error) {
          console.error('Erro ao carregar perguntas:', error);
        }
      },
      
      getOptions(question) {
        return {
          A: question.a,
          B: question.b,
          C: question.c,
          D: question.d
        };
      },
      
      generateExplanation(answer, question) {
        const options = this.getOptions(question);
        return `A opção ${answer} está correta porque ${options[answer]}...`;
      },
      
      toggleQuestion(index) {
        const i = this.activeQuestions.indexOf(index);
        if (i > -1) {
          this.activeQuestions.splice(i, 1);
        } else {
          this.activeQuestions.push(index);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .review-container {
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 32px;
  }
  
  .question-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .question-header {
    background-color: rgba(0, 0, 0, 0.02);
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  
  .question-text {
    flex: 1;
    margin: 0;
    line-height: 1.4;
  }
  
  .answer-content {
    flex: 1;
  }
  
  .correct-option {
    background-color: rgba(76, 175, 80, 0.05);
  }
  
  .correct-answer {
    background-color: rgba(76, 175, 80, 0.05);
    border-radius: 4px;
    padding: 8px;
  }
  
  .explanation {
    font-size: 0.75rem;
  }
  
  /* Responsividade */
  @media (max-width: 600px) {
    .question-header {
      padding: 12px;
    }
    .question-text {
      font-size: 0.875rem;
    }
  }
  
  @media (min-width: 960px) {
    .question-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  }
  </style>