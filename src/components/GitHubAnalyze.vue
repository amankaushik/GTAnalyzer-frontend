<template>
    <div>
        <v-stepper v-model="stepNumber">
            <v-stepper-header>
                <v-stepper-step :complete="stepNumber > 1" step="1">Enter Credentials</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="stepNumber > 2" step="2">Select Repositories</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="stepNumber > 3" step="3">Pick Date Range</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="4">Perform Analysis</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-container :fluid=true class="grey lighten-5">
                        <v-row justify="start">
                            <v-col md="4">
                                <v-card class="grey lighten-5" outlined>
                                    <credential-submit v-bind:caller="{name: githubCaller}"></credential-submit>
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
                            <v-col>
                                <lister v-bind:caller="{name: githubCaller}"></lister>
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
                            <v-col>
                                <DateRangeSelector v-bind:caller="{name: githubCaller}"></DateRangeSelector>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-btn color="error" @click="stepNumber = decrement(stepNumber)">Prev</v-btn>
                    <v-btn color="success" @click="sendAnalysisRequest"
                           :disabled="isVerified()">Analyze
                    </v-btn>
                </v-stepper-content>
                <v-stepper-content step="4">
                    <v-container :fluid=true class="grey lighten-5">
                        <v-row justify="start">
                            <v-col>
                                <analyze-entities v-bind:meta="response" v-bind:render="{renderComponent, caller: githubCaller}"></analyze-entities>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-btn color="error" @click="stepNumber = decrement(stepNumber)">Prev</v-btn>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </div>
</template>

<script>

    import CredentialSubmit from "@/components/CredentialSubmit";
    import DateRangeSelector from "@/components/DateRangeSelector";
    import Lister from "@/components/Lister";
    import AnalyzeEntities from "@/components/AnalyzeEntities";
    import RenderAnalysis from "@/components/RenderAnalysis";
    import {mapGetters, mapActions} from 'vuex';
    import githubService from "@/services/githubService";

    export default {
        name: 'GitHubAnalyze',
        components: {DateRangeSelector, AnalyzeEntities, CredentialSubmit, Lister},
        data: function () {
            return {
                stepNumber: 1,
                maxStepNumber: 4,
                minStepNumber: 1,
                username: '',
                token: '',
                githubCaller: process.env.VUE_APP_CALLER_GITHUB,
                renderComponent: RenderAnalysis,
                response: null
            }
        },
        methods: {
            ...mapActions('githubCredentialStore',
                ['setToken', 'setUsername', 'setVerified']),
            ...mapActions('centralStore', ['setGHAnalysisRequested']),
            increment: function (step) {
                this.setFromState();
                this.setVerified(false); // disable the 'Next' button on the "next" page
                if (step >= this.maxStepNumber)
                    return step;
                return step + 1;
            },
            sendAnalysisRequest: function () {
                let vueThis = this;
                githubService.performAnalysis(this.getGHPayload)
                    .then(response => {
                        vueThis.response = response.data;
                        // new analysis requested
                        // set central value for analysis requested, this is used to track request state
                        vueThis.setGHAnalysisRequested(true);
                    }).catch(error => {
                    console.log(error);
                });
                this.stepNumber = this.increment(this.stepNumber)
            },
            decrement: function (step) {
                if (step <= this.minStepNumber)
                    return step;
                return step - 1;
            },
            isVerified: function () {
                return !this.getVerified;
            },
            setFromState: function () {
                this.token = this.getToken;
                this.username = this.getUsername
            }
        },
        computed: {
            ...mapGetters('githubCredentialStore', ['getToken', 'getUsername', 'getVerified']),
            ...mapGetters('centralStore', ['getGHPayload']),
        }
    }
</script>
