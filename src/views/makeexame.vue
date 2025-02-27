<template>
  <v-container class="quiz-container">
    <!-- Título do Quiz -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Carta Moz </h1>
        <p class="text-subtitle-1">Exame Profissional-G 2025</p>
      </v-col>
    </v-row>

    <!-- Temporizador e Pontuação -->
    <v-row class="mb-6">
      <v-col cols="6">
        <v-card class="pa-3" color="primary" dark>
          <v-card-title class="text-h6">Tempo</v-card-title>
          <v-card-text class="text-h5">
            {{ formatTime(elapsedTime) }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="pa-3" color="secondary" dark>
          <v-card-title class="text-h6">Pontuação</v-card-title>
          <v-card-text class="text-h5">
            {{ score }} / {{ questionsList.length }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pergunta Atual -->
    <v-row v-if="currentQuestion">
      <v-col cols="12">
        <v-btn @click="showAnswer =!showAnswer" :prepend-icon="showAnswer ? 'mdi-eye': 'mdi-eye-off'" class="text-none ma-1"> Resposta </v-btn>
        <v-chip color="green" v-show="showAnswer">
          {{ currentQuestion.answer }}

        </v-chip>
      </v-col>
      <v-col cols="12">
        <v-card class="pa-2" elevation="4">
          <h3>{{ currentQuestion.question }}</h3>
          <v-card-text>
            <v-radio-group v-model="selectedAnswer">
              <v-radio
                v-for="(option, key) in options"
                :key="key"
                :label="`${key}. ${option}`"
                :value="key"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              @click="goToPreviousQuestion"
              :disabled="currentQuestionIndex === 0"
            >
              <v-icon left>mdi-arrow-left</v-icon>
              Anterior
            </v-btn>
            <v-spacer></v-spacer>
             <v-avatar><strong>{{ currentQuestionIndex + 1 }}</strong></v-avatar>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="goToNextQuestion"
              :disabled="currentQuestionIndex === questionsList.length - 1"
            >
              Próxima
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Botão para Finalizar o Exame -->
    <v-row class="mt-6">
      <v-col cols="12" class="text-center">
        <v-btn color="error" @click="confirmFinish">
          <v-icon left>mdi-stop</v-icon>
          Finalizar Exame
        </v-btn>
      </v-col>
    </v-row>

    <!-- Resultado Final -->
    <v-dialog v-model="showResults" max-width="600" persistent>
      <v-card>
        <v-card-title class="text-h5">Resultado Final</v-card-title>
        <v-card-text>
          <p class="text-h6">Pontuação: {{ score }} / {{ questionsList.length }}</p>
          <p class="text-h6">Tempo: {{ formatTime(elapsedTime) }}</p>
          <v-divider class="my-4"></v-divider>
          <p class="text-h6">Respostas:</p>
          <v-list>
            <v-list-item
              v-for="(result, index) in results"
              :key="index"
              :class="{
                'correct-answer': result.correct,
                'incorrect-answer': !result.correct,
              }"
            >
              <v-list-item-title>
                Pergunta {{ index + 1 }}: {{ result.correct ? 'Correta' : 'Incorreta' }}
              </v-list-item-title>
              <v-list-item-subtitle>
                Resposta escolhida: {{ result.selected }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                Resposta correta: {{ result.correctAnswer }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="resetQuiz">Reiniciar Quiz</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmação para Finalizar o Exame -->
    <v-dialog v-model="showFinishConfirmation" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Finalizar Exame?</v-card-title>
        <v-card-text>
          Tem certeza de que deseja finalizar o exame? Você não poderá alterar suas respostas após confirmar.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="finishExam">Sim, Finalizar</v-btn>
          <v-btn color="primary" @click="showFinishConfirmation = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ApiService from '@/db/apiservice';
import routersName from '@/db/apiname';

const apiService = new ApiService();
const routersNames = new routersName();
const baseurl = routersNames.user;

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

interface Result {
  correct: boolean;
  selected: string;
  correctAnswer: string;
}

export default defineComponent({
  name: 'exameuser',
  data() {
    return {
      questionsList: [] as Question[],
      currentQuestionIndex: 0,
      selectedAnswer: '',
      showAnswer:false,
      score: 0,
      elapsedTime: 0,
      timer: null as number | null,
      showResults: false,
      showFinishConfirmation: false,
      results: [] as Result[],
    };
  },
  computed: {
    currentQuestion(): Question | null {
      return this.questionsList[this.currentQuestionIndex] || null;
    },
    options(): { [key: string]: string } {
      if (!this.currentQuestion) return {};
      return {
        A: this.currentQuestion.a,
        B: this.currentQuestion.b,
        C: this.currentQuestion.c,
        D: this.currentQuestion.d,
      };
    },
  },
  mounted() {
    this.getallExames();
  },
  methods: {

    async getallExames() {
      try {
        const response = await apiService.get(`${baseurl}/user/${this.$route.params.uuid}`);
        this.questionsList = response as Question[];
        this.startTimer();
      } catch (error) {
        console.error('Erro ao carregar exames:', error);
      }
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.elapsedTime++;
      }, 1000);
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    formatTime(seconds: number): string {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    },
    goToPreviousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.selectedAnswer = this.results[this.currentQuestionIndex]?.selected || '';
      }
    },
    goToNextQuestion() {
      if (this.currentQuestionIndex < this.questionsList.length - 1) {
        this.saveAnswer();
        this.currentQuestionIndex++;
        this.selectedAnswer = this.results[this.currentQuestionIndex]?.selected || '';
      } else {
        this.saveAnswer();
        this.stopTimer();
        this.showResults = true;
      }
    },
    saveAnswer() {
      if (!this.currentQuestion) return;

      const correct = this.selectedAnswer === this.currentQuestion.answer;
      if (correct) this.score++;

      this.results[this.currentQuestionIndex] = {
        correct,
        selected: this.options[this.selectedAnswer],
        correctAnswer: this.options[this.currentQuestion.answer],
      };
    },
    confirmFinish() {
      this.showFinishConfirmation = true;
    },
    finishExam() {
      this.saveAnswer(); // Salva a resposta da última questão
      this.stopTimer();
      this.showResults = true;
      this.showFinishConfirmation = false;
    },
    resetQuiz() {
      this.currentQuestionIndex = 0;
      this.selectedAnswer = '';
      this.score = 0;
      this.elapsedTime = 0;
      this.results = [];
      this.showResults = false;
      this.startTimer();
    },
  },
});
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
}

.correct-answer {
  background-color: #e8f5e9; /* Verde claro para respostas corretas */
}

.incorrect-answer {
  background-color: #ffebee; /* Vermelho claro para respostas incorretas */
}

.v-list-item {
  margin-bottom: 8px;
  border-radius: 4px;
}
</style>