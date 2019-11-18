<template>
    <v-container>
        <v-col >
            <v-row justify="space-around">
                    <v-btn color="success" @click="startPolling" :disabled="(running || done)"> Get Analysis Results
                    </v-btn>
                    <v-btn color="error" @click="resetResults">Reset Analysis Results</v-btn>
            </v-row>
            <br>
            <v-row v-if="(running)" justify="center">
                <v-progress-linear
                        v-model="donePercent"
                        color="light-blue"
                        height="20"
                        striped>
                    <template v-slot="{ value }">
                        <strong>{{ Math.ceil(value) }}%</strong>
                    </template>
                </v-progress-linear>
            </v-row>
            <v-row v-if="done">
                {{response}}
            </v-row>
        </v-col>
    </v-container>
</template>

<script>
    import githubService from "@/services/githubService";

    export default {
        name: "AnalyzeRepositories",
        props: {meta: Object},
        data: function () {
            return {
                // num of combinations to analyze - progress bar
                totalCombinations: null,
                doneCombinations: null,
                // is Analysis running
                running: false,
                // is Analysis done - when all combinations are done
                done: false,
                // % task done
                donePercent: 0,
                response: {},
                timerId: null,
                // polling interval
                interval: 30000
            }
        },
        watch: {
            donePercent: function () {
                if (this.donePercent >= 100) {
                    this.running = false;
                    this.done = true;
                    clearInterval(this.timerId);
                }
            }
        },
        methods: {
            resetResults: function () {
                this.totalCombinations = null;
                this.doneCombinations = null;
                this.running = false;
                this.done = false;
                this.donePercent = 0;
                this.response = {};
                this.timerId = null;
            },
            startPolling: function () {
                this.totalCombinations = this.meta["combinations"];
                this.running = true;
                // Once every <interval> seconds
                this.timerId = setInterval(this.pollInInterval, this.interval);
            },
            pollInInterval: function () {
                let payload = {"request_id": this.meta["request_id"]};
                githubService.getAnalysisResults(payload).then(response => {
                    this.response = response.data;
                    this.doneCombinations = Object.keys(this.response).length;
                    this.donePercent = (this.doneCombinations / this.totalCombinations) * 100;
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    }
</script>
