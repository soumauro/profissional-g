<template>
  <v-container>
    <!-- Título da página -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Exames Profissional -G Disponíveis 2025</h1>
        <p class="text-subtitle-1">Confira a lista de exames que você pode realizar.</p>
      </v-col>
    </v-row>

    <!-- Botão de ação -->
    <!-- <v-row class="mb-6">
      <v-col cols="12">
        <v-btn :to="{ name: 'exames' }" color="primary" prepend-icon="mdi-plus">
          Agendar Novo Exame
        </v-btn>
      </v-col>
    </v-row> -->

    <!-- Lista de exames -->
    <v-row>
      <v-col cols="12" md="6" v-for="exame in exameList" :key="exame.id">
        <v-card class="pa-4" hover>
          <v-card-item>
            <v-card-title class="text-h6">
              Exame #{{ exame.id }}
            </v-card-title>
            <v-card-subtitle>
              <v-chip :color="exame.available ? 'green' : 'red'" size="small" class="mr-2">
                {{ exame.available ? 'Disponível' : 'Indisponível' }}
              </v-chip>
            </v-card-subtitle>
          </v-card-item>

          <v-card-actions>
            <v-btn color="primary" variant="outlined" :disabled="!exame.available" @click="openDialog(exame)">
              <v-icon left>mdi-information</v-icon>
              Detalhes
            </v-btn>
            <v-btn color="secondary" variant="flat" :disabled="!exame.available" @click="
              exame.id < 3 ? openexame(exame.uuid) :
                opendialog2(exame.uuid)">
              <v-icon left>mdi-calendar</v-icon>
              Fazer Exame
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog de detalhes -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Detalhes do Exame</v-card-title>
        <v-card-text>
          <p><strong>ID:</strong> {{ selectedExame?.id }}</p>
          <p><strong>Taxa de Aprovação:</strong> 0 %</p>
          <p><strong>Status:</strong>
            <v-chip :color="selectedExame?.available ? 'green' : 'red'" size="small">
              {{ selectedExame?.available ? 'Disponível' : 'Indisponível' }}
            </v-chip>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" max-width="500">
           <v-card>
        <v-card-title class="headline">
          Pagamento para Realização do Exame
        </v-card-title>

        <v-card-text>
          <p>
            Para realizar o exame, insira seu número de telefone da Vodacom.
            Será cobrado um valor de <strong>25 MTN</strong>.
          </p>

          <v-text-field v-model="phoneNumber" label="Número de Telefone" placeholder="84XXXXXXX" outlined
            :rules="phoneRules" required></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" @click="dialog2 = false">
            Cancelar
          </v-btn>
          <v-btn :loading="loading" variant="tonal" class="text-none" color="green darken-1" @click="confirmPage()">
            Realizar Pagamento
          </v-btn>
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

export default defineComponent({
  name: 'home',

  data() {
    return {
      examUuid: "",
      exameList: [] as { id: number; available: number; uuid: string }[],
      dialog: false, // Controla a visibilidade do dialog
      dialog2: false, // Controla a visibilidade do dialog
      phoneNumber: "",
      loading: false,
      phoneRules: [
        (v: string) => !!v || "Número de telefone é obrigatório",
        (v: string) => /^84[0-9]{7}$/.test(v) || "Número de telefone inválido",
      ],
      selectedExame: null as { id: number; available: number; uuid: string } | null, // Exame selecionado para detalhes
    };
  },
  mounted() {
    this.getallExames();
  },
  methods: {
    openexame(uuid2: string) {
      this.examUuid = uuid2;
      this.$router.push({ name: 'exameuser', params: { uuid: this.examUuid } })
    },
    async confirmPage() {
      this.loading = true;
      const response = await apiService.insert(`${baseurl}/pay`, {
        "phoneNumber": `258${this.phoneNumber}`,
        "amount": "25"
      }).then((val) => {
        this.$router.push({ name: 'exameuser', params: { uuid: this.examUuid } })

      }).catch(() => {
        alert("Erro ao efetuar o pagamento");
      }).finally(() => { this.loading = false });

    },
    opendialog2(uuids: string) {
      this.examUuid = uuids;
      this.dialog2 = !this.dialog2;

    },
    async getallExames() {
      try {
        const response = await apiService.get(`${baseurl}/`);
        this.exameList = response as { id: number; available: number; uuid: string }[];
      } catch (error) {
        console.error('Erro ao carregar exames:', error);
      }
    },
    openDialog(exame: { id: number; available: number; uuid: string }) {
      this.selectedExame = exame;
      this.dialog = true;
    },
    agendarExame(exame: { id: number; available: number; uuid: string }) {
      alert(`Exame #${exame.id} agendado com sucesso!`);
      // Aqui você pode adicionar a lógica para agendar o exame
    },
  },
});

</script>
<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-5px);
}

.v-chip {
  margin-right: 8px;
}
</style>