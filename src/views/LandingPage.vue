<template>
    <v-container class="landing-page">
      <!-- Seção Hero -->
      <v-row class="hero-section" align="center">
        <v-col cols="12" md="6" class="text-center text-md-left">
          <h1 class="text-h3 font-weight-bold mb-4">
            Prepare-se para o Exame de Condução Profissional com a Carta Moz!
          </h1>
          <p class="text-h6 mb-6">
            Acesso a quizzes atualizados e práticos para você passar no exame de condução profissional.
          </p>
          <v-btn :to="{name:'home' }" color="primary" size="large" @click="scrollToFeatures">
            Comece Agora
          </v-btn>
        </v-col>
        <v-col cols="12" md="6" class="text-center">
          <v-img
            src="https://via.placeholder.com/500"
            alt="Imagem de um condutor profissional"
            class="hero-image"
          ></v-img>
        </v-col>
      </v-row>
  
      <!-- Seção de Benefícios -->
      <v-row class="features-section" id="features">
        <v-col cols="12" class="text-center">
          <h2 class="text-h4 font-weight-bold mb-6">Por que escolher a Carta Moz?</h2>
        </v-col>
        <v-col cols="12" md="4" class="text-center">
          <v-icon size="64" color="primary">mdi-book-open-page-variant</v-icon>
          <h3 class="text-h5 font-weight-bold mt-4">Quizzes Atualizados</h3>
          <p class="text-body-1">
            Questões baseadas nos últimos exames oficiais para garantir sua preparação.
          </p>
        </v-col>
        <v-col cols="12" md="4" class="text-center">
          <v-icon size="64" color="primary">mdi-clock-outline</v-icon>
          <h3 class="text-h5 font-weight-bold mt-4">Simulados em Tempo Real</h3>
          <p class="text-body-1">
            Pratique em condições reais de exame com temporizador e pontuação.
          </p>
        </v-col>
        <v-col cols="12" md="4" class="text-center">
          <v-icon size="64" color="primary">mdi-chart-line</v-icon>
          <h3 class="text-h5 font-weight-bold mt-4">Acompanhe Seu Progresso</h3>
          <p class="text-body-1">
            Veja seu desempenho e melhore com relatórios detalhados.
          </p>
        </v-col>
      </v-row>
  
      <!-- Seção de Chamada para Ação -->
      <v-row class="cta-section" align="center">
        <v-col cols="12" class="text-center">
          <h2 class="text-h4 font-weight-bold mb-4">Pronto para começar?</h2>
          <p class="text-h6 mb-6">
            Cadastre-se agora e tenha acesso a todos os quizzes e recursos.
          </p>
          <v-btn :to="{name:'home' }" color="primary" size="large">
            Acessar Exames
          </v-btn>
        </v-col>
      </v-row>
  
      <!-- Rodapé -->
      <v-row class="footer-section">
        <v-col cols="12" class="text-center">
          <p class="text-body-1">
            &copy; 2025 Carta Moz Profissional. Todos os direitos reservados.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LandingPage',
  setup() {
    const router = useRouter();

    const scrollToFeatures = () => {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const navigateToQuiz = () => {
      router.push({ name: 'quiz' }); // Redireciona para a página de quizzes
    };

    return {
      scrollToFeatures,
      navigateToQuiz,
    };
  },
});
</script>

<style scoped>
.landing-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero-section {
  margin-bottom: 80px;
}

.hero-image {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.features-section {
  margin-bottom: 80px;
}

.cta-section {
  margin-bottom: 80px;
  padding: 60px 20px;
  background-color: #f5f5f5;
  border-radius: 16px;
}

.footer-section {
  margin-top: 40px;
  padding: 20px 0;
  background-color: #f5f5f5;
  border-radius: 16px;
}

.text-h3 {
  font-size: 2.5rem;
}

.text-h4 {
  font-size: 2rem;
}

.text-h5 {
  font-size: 1.5rem;
}

.text-h6 {
  font-size: 1.25rem;
}

.text-body-1 {
  font-size: 1rem;
  color: #666;
}
</style>