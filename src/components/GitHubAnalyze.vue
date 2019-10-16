<template>
    <div>
        <v-stepper v-model="stepNumber">
            <v-stepper-header>
                <v-stepper-step :complete="stepNumber > 1" step="1">Enter Credentials</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="stepNumber > 2" step="2">Select Repositories</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3">Perform Analysis</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-container :fluid=true class="grey lighten-5">
                        <v-row justify="start">
                            <v-col md="4">
                                <v-card class="grey lighten-5" outlined>
                                    <credential-submit v-bind:caller="{name: 'github'}" ></credential-submit>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-btn color="error" @click="stepNumber = decrement(stepNumber)" :disabled="stepNumber <= 1">Prev
                    </v-btn>
                    <v-btn color="success" @click="stepNumber = increment(stepNumber)" :disabled="isVerified()">Next
                    </v-btn>
                </v-stepper-content>
                <v-stepper-content step="2">
                    <v-container :fluid=true class="grey lighten-5">
                        <v-row justify="start">
                            <v-col >
                                    <lister v-bind:caller="{name: 'github'}"></lister>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-btn color="error" @click="stepNumber = decrement(stepNumber)">Prev</v-btn>
                    <v-btn color="success" @click="stepNumber = increment(stepNumber)"
                           :disabled="isVerified()">Next
                    </v-btn>
                </v-stepper-content>
                <v-stepper-content step="3">
                    <v-container :fluid=true class="grey lighten-5">
                        <v-row justify="start">
                            <v-col md="4">
                                <v-card class="grey lighten-5" outlined>
                                    <analyze-repositories></analyze-repositories>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-btn color="error" @click="stepNumber = decrement(stepNumber)">Prev</v-btn>
                    <v-btn color="success" @click="">Analyze</v-btn>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </div>
</template>

<script>

    import CredentialSubmit from "@/components/CredentialSubmit";
    import Lister from "@/components/Lister";
    import AnalyzeRepositories from "@/components/AnalyzeRepositories";
    import {mapGetters, mapActions} from 'vuex';

    export default {
        name: 'GitHubAnalyze',
        components: {AnalyzeRepositories, CredentialSubmit, Lister},
        data: function () {
            return {
                stepNumber: 1,
                maxStepNumber: 3,
                minStepNumber: 1,
                username: '',
                token: ''
            }
        },
        methods: {
            ...mapActions('githubCredentialStore',
                ['setToken', 'setUsername', 'setVerified']),
            increment: function (step) {
                this.setFromState();
                this.setVerified(false); // disable the 'Next' button on the "next" page
                if (step >= this.maxStepNumber)
                    return step;
                return step + 1;
            },
            decrement: function (step) {
                if (step <= this.minStepNumber)
                    return step
                return step - 1;
            },
            isVerified: function () {
                return !this.getVerified;
            },
            setFromState: function () {
                this.token = this.getToken
                this.username = this.getUsername
            }
        },
        computed: {
            ...mapGetters('githubCredentialStore', ['getToken', 'getUsername', 'getVerified']),
        }
    }
</script>
