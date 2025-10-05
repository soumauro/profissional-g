<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card class="pa-6">
                    <!-- Cabeçalho com contagem regressiva -->
                    <v-card-title class="text-h4 text-center primary--text mb-2">
                        🔥 Promoção Relâmpago! 🔥
                    </v-card-title>

                    <v-card-subtitle class="text-center mb-4">
                        <v-chip color="red" text-color="white" class="mr-2">
                            <v-icon left>mdi-clock-alert-outline</v-icon>
                            Termina em: {{ countdown }}
                        </v-chip>
                        <v-chip color="green" text-color="white">
                            <v-icon left>mdi-tag</v-icon>
                            Até 50% OFF
                        </v-chip>
                    </v-card-subtitle>

                    <v-card-text>
                        <v-alert v-if="errorMessage" type="error" class="mb-6">
                            {{ errorMessage }}
                        </v-alert>

                        <v-alert v-if="isPremiumUser" type="success" class="mb-6">
                            Você já é um usuário premium! Seu pacote atual: {{ userSubscription.tipoPacote }}
                        </v-alert>

                        <div v-else>
                            <p class="text-h6 text-center mb-6">
                                Atualize agora e economize até {{ maxDiscount }}%!
                            </p>

                            <v-row class="mb-6">
                                <v-col v-for="(pkg, index) in packagesWithDiscount" :key="index" cols="12" sm="6"
                                    md="4">
                                    <v-card
                                        :class="['package-card', selectedPackage === pkg ? 'selected' : '', pkg.highlight ? 'highlight-card' : '']"
                                        @click="selectedPackage = pkg" hover elevation="4">
                                        <v-card-title class="text-center">
                                            {{ formatPackageName(pkg.tempo) }}
                                        </v-card-title>
                                        <v-divider></v-divider>
                                        <v-card-text class="text-center">
                                            <!-- Preço original riscado -->
                                            <div class="original-price" v-if="pkg.discount > 0">
                                                <s>{{ pkg.originalPrice }} MTN</s>
                                            </div>
                                            <!-- Preço com desconto -->
                                            <div class="price">
                                                {{ pkg.montante }} MTN
                                                <v-chip v-if="pkg.discount > 0" small color="red" text-color="white"
                                                    class="ml-2">
                                                    -{{ pkg.discount }}%
                                                </v-chip>
                                            </div>
                                            <div class="period">{{ getPeriodText(pkg.tempo) }}</div>

                                            <!-- Economia -->
                                            <div class="savings mt-2" v-if="pkg.discount > 0">
                                                <v-icon small color="green">mdi-wallet</v-icon>
                                                Economize {{ pkg.originalPrice - pkg.montante }} MTN
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>

                            <v-alert border="left" colored-border type="info" elevation="2" class="mb-4">
                                <strong>Oferta válida por tempo limitado!</strong> Aproveite os descontos antes que
                                acabem.
                            </v-alert>

                            <v-btn color="primary" block large :disabled="!selectedPackage" @click="openPaymentDialog"
                                class="pulse-button">
                                <v-icon left>mdi-flash</v-icon>
                                ASSINAR AGORA
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Dialog de Pagamento -->
        <v-dialog v-model="paymentDialog" max-width="500">
            <v-card>
                <v-card-title class="text-h5 primary--text text-center">
                    Confirmar Pagamento
                </v-card-title>

                <v-card-text>
                    <v-row justify="center">
                        <v-col cols="12" class="text-center">
                            <v-icon size="60" color="primary">mdi-credit-card</v-icon>
                        </v-col>
                    </v-row>

                    <div class="text-center mb-4">
                        <div>Método de Pagamento: M-PESA</div>
                        <div class="mt-2">Pacote: {{ selectedPackage.tempo }}</div>

                        <!-- Mostrar preço original e com desconto no diálogo -->
                        <div v-if="selectedPackage.discount > 0">
                            <div class="text-subtitle-1">
                                <s>{{ selectedPackage.originalPrice }} MTN</s>
                            </div>
                            <div class="text-h6 font-weight-bold primary--text">
                                {{ selectedPackage.montante }} MTN
                                <v-chip small color="red" text-color="white" class="ml-2">
                                    -{{ selectedPackage.discount }}%
                                </v-chip>
                            </div>
                        </div>
                        <div v-else class="text-h6 font-weight-bold primary--text">
                            {{ selectedPackage.montante }} MTN
                        </div>
                    </div>

                    <v-text-field v-model="phoneNumber" label="Número de Telefone"
                        placeholder="Digite seu número de telefone" outlined prepend-icon="mdi-phone"
                        type="tel"></v-text-field>

                    <v-progress-linear v-if="isLoading" indeterminate color="primary"></v-progress-linear>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="paymentDialog = false">Cancelar</v-btn>
                    <v-btn color="primary" :loading="isLoading" @click="confirmPayment">
                        Confirmar Pagamento
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { getAuth } from 'firebase/auth';
import ApiService from '@/db/apiservice';
import routersName from '@/db/apiname';
import axios from 'axios';

const routersNames = new routersName();
const baseurlprofile = routersNames.conta;

export default {
    name: 'PromocoesPage',
    data() {
        return {
            // Preços originais e com desconto
            originalPrices: {
                semanal: 99,
                mensal: 200,
                semestral: 350
            },
            packages: [
                { tempo: "semanal", montante: 75, highlight: true },
                { tempo: "mensal", montante: 180, highlight: false },
                { tempo: "semestral", montante: 300, highlight: true }
            ],
            selectedPackage: null,
            phoneNumber: '',
            paymentDialog: false,
            isLoading: false,
            errorMessage: '',
            userSubscription: {
                id: 0,
                uuid: '',
                email: '',
                dataCadastro: null,
                tipoPacote: '',
                pags: 0,
                dataTermino: null,
                ativo: 0
            },
            countdown: "23:59:59",
            countdownInterval: null
        };
    },
    computed: {
        isPremiumUser() {
            return this.userSubscription.tipoPacote && this.userSubscription.ativo === 1;
        },
        packagesWithDiscount() {
            return this.packages.map(pkg => ({
                ...pkg,
                originalPrice: this.originalPrices[pkg.tempo],
                discount: Math.round((1 - pkg.montante / this.originalPrices[pkg.tempo]) * 100)
            }));
        },
        maxDiscount() {
            return Math.max(...this.packagesWithDiscount.map(pkg => pkg.discount));
        }
    },
    created() {
        this.fetchProfile();
        this.startCountdown();
    },
    beforeDestroy() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    },
    methods: {
        startCountdown() {
            // Configura o tempo final para 24 horas no futuro
            const endTime = new Date();
            endTime.setHours(endTime.getHours() + 24);

            this.countdownInterval = setInterval(() => {
                const now = new Date();
                const diff = endTime - now;

                if (diff <= 0) {
                    clearInterval(this.countdownInterval);
                    this.countdown = "00:00:00";
                    return;
                }

                // Formata o tempo restanto
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                this.countdown = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
        },
        async fetchProfile() {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) return;

                const apiService = new ApiService();
                const response = await apiService.get(`${baseurlprofile}/all/${user.uid}`);
                this.userSubscription = response[0];

            } catch (error) {
                this.errorMessage = `Erro ao buscar perfil: ${error.message}`;
                console.error('Erro ao buscar perfil:', error);
            }
        },
        formatPackageName(name) {
            return name.charAt(0).toUpperCase() + name.slice(1);
        },
        getPeriodText(period) {
            const periods = {
                semanal: 'por semana',
                mensal: 'por mês',
                semestral: 'por semestre'
            };
            return periods[period] || '';
        },
        openPaymentDialog() {
            if (!this.selectedPackage) return;
            this.phoneNumber = '';
            this.paymentDialog = true;
        },

        async confirmPayment() {
    if (!this.phoneNumber) {
        this.errorMessage = 'Por favor, insira um número de telefone.';
        return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
        const payload = {
            phoneNumber: `258${this.phoneNumber}`,
            amount: `${this.selectedPackage.montante}`,
            id: this.userSubscription.id,
            tempo: this.selectedPackage.tempo
        };

        const response = await axios({
            method: 'post',
            url: `${baseurlprofile}/cartaProfissional/pagamento`, // ✅ agora aponta para o backend intermediário
            data: payload,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        if (response.status >= 200 && response.status < 300) {
            await this.fetchProfile();
            this.$router.push('/');
            this.$toast.success('Pagamento efetuado com sucesso!');

            setTimeout(() => {
                this.paymentDialog = false;
            }, 3000);
        } else {
            throw new Error(response.data.message || 'Erro ao processar pagamento');
        }
    } catch (error) {
        console.error('Erro no pagamento:', error);
        this.paymentDialog = false;

        const mensagem = error.response?.data?.message || error.message || 'Erro desconhecido';
        this.errorMessage = `Erro ao efetuar o pagamento: ${mensagem}`;
        this.$toast.error(this.errorMessage);
    } finally {
        this.isLoading = false;
    }
}


    }
};
</script>

<style scoped>
.package-card {
    transition: all 0.3s ease;
    border: 2px solid transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.package-card.selected {
    border-color: var(--v-primary-base);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.highlight-card {
    border: 2px solid #FF5722;
    box-shadow: 0 0 15px rgba(255, 87, 34, 0.3);
}

.highlight-card::before {
    content: "MAIS POPULAR";
    position: absolute;
    top: 10px;
    right: -30px;
    background: #FF5722;
    color: white;
    padding: 2px 30px;
    font-size: 0.7rem;
    font-weight: bold;
    transform: rotate(45deg);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.price {
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--v-primary-base);
    margin: 10px 0;
}

.original-price {
    font-size: 1rem;
    color: #999;
    text-decoration: line-through;
}

.period {
    color: #666;
    font-size: 0.9rem;
}

.savings {
    color: #4CAF50;
    font-weight: bold;
    font-size: 0.9rem;
}

.pulse-button {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
    }

    70% {
        box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
    }
}
</style>