<template>
  <v-container>

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-row align="center">
            <!-- Avatar e Email -->
            <v-col cols="auto">
              <v-avatar color="primary" size="40">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
            </v-col>
            <v-col>
              <span class="text-body-1">{{ userProfile.email }}</span>
            </v-col>

            <!-- Status (Ativo/Inativo) -->
            <v-col cols="auto">
              <v-chip :color="userProfile.ativo ? 'success' : 'error'" small>
                {{ userProfile.ativo ? 'Ativo' : 'Inativo' }}
              </v-chip>
            </v-col>
          </v-row>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
              <v-card class="pa-4">
                <!-- Informações do Usuário -->
                <v-card-text>
                  <v-list>


                    <!-- Email -->
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="primary">mdi-email</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Email</v-list-item-title>
                        <v-list-item-subtitle>{{ userProfile.email }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <!-- Data de Cadastro -->
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="primary">mdi-calendar</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Data de Cadastro</v-list-item-title>
                        <v-list-item-subtitle>{{ formatDate(userProfile.data_cadastro) }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <!-- Tipo de Pacote -->
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="primary">mdi-package-variant</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Tipo de Pacote</v-list-item-title>
                        <v-list-item-subtitle>{{ userProfile.tipo_pacote || 'Nenhum pacote ativo'
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <!-- Data de Término -->
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="primary">mdi-calendar-end</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Data de Término</v-list-item-title>
                        <v-list-item-subtitle>{{ formatDate(userProfile.data_termino) || 'Nenhuma data definida'
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <!-- Progresso (Páginas) -->
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="primary">mdi-book-open-page-variant</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Progresso</v-list-item-title>
                        <v-list-item-subtitle>{{ userProfile.pags }} páginas estudadas</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Título da página -->
    <v-btn class="my-2 text-none" color="primary" @click="dialog3 = true">
      Escolher Plano premium
    </v-btn>
    <v-btn class="text-none pa-2" color="green" @click="getUserProfile()"> Atualizar Conta</v-btn>
    <br>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Exames Profissional -G Disponíveis 2025</h1>
        <p class="text-subtitle-1">Confira a lista de exames que você pode realizar.</p>
      </v-col>
    </v-row>
    <v-tabs v-model="tab" color="deep-purple-accent-4">
      <v-tab :value="1">Exames</v-tab>
      <v-tab :value="2" @click="getallSumary()">Resumo</v-tab>


    </v-tabs>

<!-- 
     <v-row class="mb-6">
      <v-col cols="12">
        <v-btn :to="{ name: 'exames' }" color="primary" prepend-icon="mdi-plus">
          Agendar Novo Exame
        </v-btn>
      </v-col>
    </v-row> -->

    <!-- Lista de exames -->
    <v-window v-model="tab">
      <v-window-item :value="1">


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
                <v-btn
                  @click="userProfile.ativo == 0 && exame.id > 2 ? openexame(exame.uuid) : openfreeExams(exame.uuid)"
                  color="secondary" variant="flat" :disabled="!exame.available">
                  <v-icon left>mdi-calendar</v-icon>
                  {{ userProfile.ativo == 0 && exame.id > 2 ? "Conteúdo Premium" : "Fazer exame" }} </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item :value="2">
        <v-row>
          <v-col cols="12" v-for="i in questionsList" :key="i.id">
            <v-card class="pa-4 mb-4" elevation="3">
              <!-- Cabeçalho da Pergunta -->
              <v-chip color="green" class="mr-3">{{ i.id }}</v-chip>
              <span class="text-h6">{{ i.question }}</span>


              <!-- Resposta Correta -->
              <v-card-text>
                <v-alert type="success" outlined dense>
                  R: <strong>{{ i.correctAnswer }}</strong>
                </v-alert>
              </v-card-text>


            </v-card>
          </v-col>
        </v-row>
        <v-col cols="12" class="text-center">
          <v-btn class="ma-2" color="primary" @click="dialog10=!dialog10">
            <v-icon left>mdi-refresh</v-icon>
           reiniciar
          </v-btn>
          
          <v-btn color="primary" @click="loadMoreQuestions(questionsList[questionsList.length - 1].id)">
            <v-icon left>mdi-plus</v-icon>
            Proxima pagina
          </v-btn>
        </v-col>
      </v-window-item>
    </v-window>
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

    <v-dialog v-model="dialog2" max-width="500" persistent>
      <v-card>
        <!-- Título do Diálogo -->
        <v-card-title class="headline primary--text">
          Pagamento para Realização do Exame
        </v-card-title>

        <!-- Informações do Pagamento -->
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <p class="text-body-1">
                <strong>Método:</strong> M-pesa
              </p>
              <p class="text-body-1">
                <strong>Pacote:</strong> {{ plano.tempo }}
              </p>
              <p class="text-body-1">
                <strong>Montante:</strong> {{ formatarMoeda(plano.montante) }}
              </p>
            </v-col>
          </v-row>

          <!-- Campo de Número de Telefone -->
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="phoneNumber" label="Número de Telefone" placeholder="84XXXXXXX" outlined
                :rules="phoneRules" required prepend-inner-icon="mdi-phone"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Ações do Diálogo -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" @click="dialog2 = false">
            Cancelar
          </v-btn>
          <v-btn :loading="loading" variant="tonal" class="text-none" color="green darken-1" @click="confirmPage">
            Realizar Pagamento
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialogo para escolher plano -->

    <v-dialog v-model="dialog3" max-width="600">
      <v-card>
        <!-- Título do Diálogo -->
        <v-card-title class="text-h5 primary--text">
          Escolha seu Plano
        </v-card-title>

        <!-- Lista de Planos -->
        <v-card-text>
          <v-list>
            <v-list-item v-for="(plano, index) in price" :key="index" @click="selecionarPlano(plano)">
              <v-list-item-icon>
                <v-icon color="primary">mdi-cash</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  Plano {{ plano.tempo }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatarMoeda(plano.montante) }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-chip color="primary" small>
                  {{ plano.tempo }}
                </v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>

        <!-- Rodapé do Diálogo -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog3 = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog max-width="500" v-model="dialog10">
      <v-card >
        <v-card-text>
          Deseja reiniciar os resumos dos exames ?
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog10 = !dialog10">cancelar</v-btn>
          <v-btn @click="restartexameReview()">confirmar</v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>

  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ApiService from '@/db/apiservice';
import routersName from '@/db/apiname';
import store from '@/store';

const apiService = new ApiService();
const routersNames = new routersName();
const baseurl = routersNames.user;
const baseurlprofile = routersNames.conta;

export default defineComponent({
  name: 'home',

  data() {
    return {
      tab: null,
      dialog3: false,
      dialog10: false,
      plano: {
        tempo: "mensal",
        montante: 250
      } as { tempo: string, montante: number },
      price: [{ "tempo": "diario", "montante": 25 },
      { "tempo": "semanal", "montante": 100 },
      { "tempo": "mensal", "montante": 250 },
      { "tempo": "semestral", "montante": 550 }
      ],
      userProfile: {} as {
        id: number,
        uuid: string,
        email: string,
        data_: number,
        tipo_: string,
        data_termino: string,
        ativo: number,
        pags: number,
        data_cadastro: string,
        tipo_pacote: string
      },

      examUuid: "",
      exameList: [] as { id: number; available: number; uuid: string }[],
      questionsList: [] as { id: number, correctAnswer: string, question: string }[],
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
  computed: {

    userUid() {
      return store.getters.getUserUid.userUid;
    }
  },
  mounted() {
    this.getUserProfile()
    this.getallExames();

  },
  methods: {
    async getUserProfile() {
      try {
        const response: any = await apiService.get(`${baseurlprofile}/all/${this.userUid}`);
        this.userProfile = response[0]; // Assume que a resposta é um array com um único objeto
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        alert('Erro ao carregar perfil. Tente novamente.');
      }
    },
    formatDate(date: any) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('pt-BR');
    },
    openfreeExams(uuid2: string) {
      this.examUuid = uuid2;
      this.$router.push({ name: 'exameuser', params: { uuid: this.examUuid } })

    },
    openexame(uuid2: string) {
      this.examUuid = uuid2;
      if (this.userProfile.ativo == 1) {
        this.$router.push({ name: 'exameuser', params: { uuid: this.examUuid } })

      }
      this.dialog3 = true
    },
    async confirmPage() {
      this.loading = true;
      const response = await apiService.insert(`${baseurl}/pay`, {
        "pay": {
          "phoneNumber": `258${this.phoneNumber}`,
          "amount": this.plano.montante
        },
        pacote: { id: this.userProfile.id, tempo: this.plano.tempo }
      }).then((val) => {
        alert("Parabéns, você se tornou um usuário premium!");
        this.getUserProfile();
      }).catch(() => {
        alert("Erro ao efetuar o pagamento");
      }).finally(() => { this.loading = false });

    },

    async getallExames() {
      try {
        const response = await apiService.get(`${baseurl}/`);
        this.exameList = response as { id: number; available: number; uuid: string }[];
      } catch (error) {
        console.error('Erro ao carregar exames:', error);
      }
    },
    async getallSumary() {
      try {
        const response = await apiService.get(`${baseurl}/user2/${this.userProfile.pags}`);
        this.questionsList = response as { id: number, correctAnswer: string, question: string }[];
      } catch (error) {
        console.error('Erro ao carregar exames:', error);
      }
    },
    async restartSumary(pag:number){
      
     await apiService.update(`${baseurlprofile}/resumo/${pag}/${this.userProfile.id}`,{"nome":"jose mane"});
     
    },
    async restartexameReview(){
      this.dialog10 = false;
      this.questionsList = []
      const response = await apiService.get(`${baseurl}/user2/0`);
        this.questionsList = response as { id: number, correctAnswer: string, question: string }[];
      await apiService.update(`${baseurlprofile}/resumo/0/${this.userProfile.id}`,{"nome":"jose mane"});
      
      
    },
    async loadMoreQuestions(last: number) {
      try {
        if (this.userProfile.ativo == 0) {
          alert("Disponivel somente para usuarios premiuns")
        return
        }
        this.questionsList = [];
        const response = await apiService.get(`${baseurl}/user2/${last}`);
        this.questionsList = response as { id: number, correctAnswer: string, question: string }[];
        this.restartSumary(last);
      } catch (error) {
        console.error('Erro ao carregar exames:', error);
      }
    },
    openDialog(exame: { id: number; available: number; uuid: string }) {
      this.selectedExame = exame;
      this.dialog = true;
    },

    formatarMoeda(valor: any) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "mtn",
      }).format(valor);
    },

    // Método para selecionar um plano
    selecionarPlano(plano: any) {
      this.plano = plano;
      this.dialog2 = true;
      this.dialog3 = false;
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

.v-card {
  border-radius: 12px;
  /* Bordas mais arredondadas */
  transition: transform 0.3s ease;
  /* Efeito de hover */
}

.v-card:hover {
  transform: translateY(-5px);
  /* Efeito de elevação ao passar o mouse */
}

.v-alert {
  border-left: 4px solid #4caf50;
  /* Borda esquerda verde */
}
</style>