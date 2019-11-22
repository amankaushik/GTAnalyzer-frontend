<template>
    <v-container>
        <v-col>
            <v-row justify="space-around">
                <v-btn color="success" @click="startPolling" :disabled="isAnalysisRequested()"> Get Analysis Results
                </v-btn>
<!--                <v-btn color="error" @click="resetResults">Reset Analysis Results</v-btn>-->
            </v-row>
            <br>
            <v-row v-if="(running)" justify="center">
                <v-progress-linear
                        v-model="doneCombinations"
                        color="light-blue"
                        height="20"
                        striped>
                    <template v-slot="{ value }">
                        <strong>{{doneCombinations}} of {{totalCombinations}}</strong>
                    </template>
                </v-progress-linear>
            </v-row>
            <v-row v-if="done">
                <render-analysis :meta="prepareRenderPropData()"></render-analysis>
            </v-row>
        </v-col>
    </v-container>
</template>

<script>
    import githubService from "@/services/githubService";
    import RenderAnalysis from "@/components/RenderAnalysis";
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "AnalyzeRepositories",
        components: {RenderAnalysis},
        props: {meta: Object},
        data: function () {
            return {
                // num of combinations to analyze - progress bar
                totalCombinations: 0,
                doneCombinations: -1,
                // is Analysis running
                running: false,
                // is Analysis done - when all combinations are done
                done: false,
                // % task done
                // donePercent: 0,
                response: {},
                timerId: null,
                // polling interval
                interval: 30000,

            }
        },
        watch: {
            doneCombinations: function () {
                if (this.doneCombinations >= this.totalCombinations) {
                    this.running = false;
                    this.done = true;
                    clearInterval(this.timerId);
                }
            },
        },
        computed: {
            ...mapGetters('centralStore', ['getAnalysisRequested'])
        },
        methods: {
            ...mapActions('centralStore', ['setAnalysisRequested']),
            isAnalysisRequested: function() {
                // if a new analysis has been requested enable the button
                return !(this.getAnalysisRequested);
            },
            startPolling: function () {
                this.totalCombinations = this.meta["combinations"];
                this.doneCombinations = 0;
                this.running = true;
                this.done = false;
                this.response = {};
                // requested analysis has been processed - disable the button
                this.setAnalysisRequested(false);
                // Once every <interval> seconds
                this.timerId = setInterval(this.pollInInterval, this.interval);
            },
            pollInInterval: function () {
                let payload = {"request_id": this.meta["request_id"]};
                githubService.getAnalysisResults(payload).then(response => {
                    this.response = response.data;
                    this.doneCombinations = Object.keys(this.response).length;
                }).catch(error => {
                    console.log(error);
                });
            },
            prepareRenderPropData: function () {
                let meta = {
                    userIcon: "mdi-github-circle",
                    entityIcon: "mdi-source-branch",
                    sourceIcon: "mdi-source-repository-multiple",
                    data: this.response,
                    renderData: {}
                };
                let localData = JSON.parse(JSON.stringify(meta.data));
                // for each repository in the response
                for (let source of Object.keys(localData)) {
                    // remove the "pr_details", "start_date" and "end_date" keys
                    delete localData[source]["pr_details"];
                    delete localData[source]["start_date"];
                    delete localData[source]["end_date"];
                    // remove "error" and "failed"
                    if (localData[source].hasOwnProperty("error"))
                        delete localData[source]["error"];
                    if (localData[source].hasOwnProperty("failed"))
                        delete localData[source]["failed"];
                    if (localData[source].hasOwnProperty("repo_name"))
                        delete localData[source]["repo_name"];
                    if (localData[source].hasOwnProperty("step"))
                        delete localData[source]["step"];
                }
                meta.renderData = localData;
                return meta;
            }
        }
    }
</script>
