<template>
    <div>
        <v-stepper v-model="stepNumber">
            <v-stepper-header>
                <v-stepper-step :complete="stepNumber > 1" step="1">Enter Credentials</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="stepNumber > 2" step="2">Select Boards</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3">Perform Analysis</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-container :fluid=true class="grey lighten-5">
                        <v-row justify="start">
                            <v-col md="4">
                                <v-card class="grey lighten-5" outlined>
                                    <credential-submit v-bind:caller="{name: taigaCaller}"></credential-submit>
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
                                <lister v-bind:caller="{name: taigaCaller}"></lister>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-btn color="error" @click="stepNumber = decrement(stepNumber)">Prev</v-btn>
                    <v-btn color="success" @click="sendAnalysisRequest"
                           :disabled="isVerified()"> Analyze
                    </v-btn>
                </v-stepper-content>
                <v-stepper-content step="3">
                    <v-container :fluid=true class="grey lighten-5">
                        <v-row justify="start">
                            <v-col>
                                <analyze-entities v-bind:meta="response" v-bind:render="{renderComponent, caller: taigaCaller}"></analyze-entities>
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
    import Lister from "@/components/Lister";
    import {mapGetters, mapActions} from 'vuex';
    import taigaService from "@/services/taigaService";
    import AnalyzeEntities from "@/components/AnalyzeEntities";
    import RenderTGAnalysis from "@/components/RenderTGAnalysis";

    export default {
        name: 'TaigaAnalyze',
        components: {AnalyzeEntities, CredentialSubmit, Lister},
        data: function () {
            return {
                stepNumber: 1,
                maxStepNumber: 3,
                minStepNumber: 1,
                username: '',
                password: '',
                taigaCaller: process.env.VUE_APP_CALLER_TAIGA,
                response: null,
                renderComponent: RenderTGAnalysis
            }
        },
        methods: {
            ...mapActions('taigaCredentialStore', ['setAuthToken', 'setUsername',
                'setUserId', 'setPassword', 'setVerified']),
            ...mapActions('centralStore', ['setTGAnalysisRequested', 'setTGPayload']),
            increment: function (step) {
                this.setFromState();
                this.setVerified(false); // disable the 'Next' button on the "next" page
                if (step >= this.maxStepNumber)
                    return step;
                return step + 1;
            },
            makeTGAnalysisPayload: function() {
                let payload = {};
                payload["auth_token"] = this.getAuthToken;
                payload["board_names"] = [];
                for (let name of this.getSelectedBoards) {
                    payload["board_names"].push(
                        {
                            "name": name
                        }
                    )
                }
                return payload;
            },
            sendAnalysisRequest: function () {
                let vueThis = this;
                this.setTGPayload(this.makeTGAnalysisPayload());
                taigaService.performAnalysis(this.getTGPayload)
                    .then(response => {
                        vueThis.response = response.data;
                        // new analysis requested
                        // set central value for analysis requested, this is used to track request state
                        vueThis.setTGAnalysisRequested(true);
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
                this.password = this.getPassword;
                this.username = this.getUsername;
            }
        },
        computed: {
            ...mapGetters('taigaCredentialStore', ['getAuthToken', 'getUsername',
                'getUserId', 'getPassword', 'getVerified']),
            ...mapGetters('centralStore', ['getTGPayload']),
            ...mapGetters('boardDataStore', ['getSelectedBoards'])
        }
    }
</script>
