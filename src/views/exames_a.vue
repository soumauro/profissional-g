<template>
    <v-container>
      <!-- Botão para criar exame -->
      <v-btn color="primary" @click="insertExam" class="mb-4">
        Criar Exame
      </v-btn>
  
      <!-- Lista de exames -->
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="i in exameList" :key="i.id">
          <v-card :color="i.available == 1 ? 'green lighten-4' : 'red lighten-4'" class="ma-2">
            <v-card-title>
              Exame {{ i.id }}
            </v-card-title>
            <v-card-subtitle>
              UUID: {{ i.uuid }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn color="primary" :to="{name:'QuestionsView2', params:{uuid:i.uuid}}">
                Detalhes
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="black" variant="outlined" @click="toggleExameStatus(i)">
                {{ i.available == 1 ? "Desativar" : "Ativar" }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Snackbar para feedback -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
        {{ snackbar.message }}
      </v-snackbar>
    </v-container>
  </template>


<script lang="ts">
import { defineComponent } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import ApiService from '@/db/apiservice';
import routersName from '@/db/apiname';

const apiService = new ApiService();
const routersNames = new routersName();
const baseurl = routersNames.exame;

export default defineComponent({
  name: "ExamesView_a",
  data() {
    return {
      exameList: [] as { id: number; available: number; uuid: string }[],
      snackbar: {
        show: false,
        message: '',
        color: 'success', // Pode ser 'success', 'error', etc.
      },
    };
  },
  mounted() {
    this.getallExames();
  },
  methods: {
    // Cria um novo exame
    async insertExam() {
      try {
        await apiService.insert(`${baseurl}/a/insert`, { uuid: uuidv4() });
        this.showSnackbar('Exame criado com sucesso!', 'success');
        this.getallExames(); // Atualiza a lista após a inserção
      } catch (error) {
        this.showSnackbar('Erro ao criar exame.', 'error');
      }
    },

    // Busca todos os exames
    async getallExames() {
      try {
        const response = await apiService.get(`${baseurl}/a/all`);
        this.exameList = response as { id: number; available: number; uuid: string }[];
      } catch (error) {
        this.showSnackbar('Erro ao carregar exames.', 'error');
      }
    },

    // Alterna o status do exame (ativo/desativado)
    async toggleExameStatus(exame: { id: number; available: number }) {
      try {
        const newStatus = exame.available === 1 ? 0 : 1; // Alterna entre 0 e 1
        await apiService.update(`${baseurl}/a/update/${exame.id}`, { available: newStatus });

        // Atualiza o estado local do exame
        exame.available = newStatus;
        this.showSnackbar('Status do exame atualizado!', 'success');
      } catch (error) {
        this.showSnackbar('Erro ao atualizar exame.', 'error');
      }
    },

    // Navega para os detalhes do exame
    goToDetails(id: number) {
      // Implemente a navegação para a página de detalhes
      console.log('Navegar para detalhes do exame:', id);
    },

    // Exibe uma mensagem de feedback
    showSnackbar(message: string, color: string) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
  },
});
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: scale(1.05);
}

.v-card-actions {
  padding: 16px;
}
</style>