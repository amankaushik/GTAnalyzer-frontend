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
                <v-expansion-panels focusable popout>
                    <v-expansion-panel
                            v-for="(repo, i) of response" :key="i">
                        <v-expansion-panel-header></v-expansion-panel-header>
                        <v-expansion-panel-content>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
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
                totalCombinations: 0,
                doneCombinations: 0,
                // is Analysis running
                running: false,
                // is Analysis done - when all combinations are done
                done: false,
                // % task done
                // donePercent: 0,
                response: {},
                timerId: null,
                // polling interval
                interval: 30000
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
            // donePercent: function () {
            //     if (this.donePercent >= 100) {
            //         this.running = false;
            //         this.done = true;
            //         clearInterval(this.timerId);
            //     }
            // }
        },
        methods: {
            resetResults: function () {
                this.totalCombinations = 0;
                this.doneCombinations = 0;
                this.running = false;
                this.done = false;
                // this.donePercent = 0;
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
                    // this.donePercent = (this.doneCombinations / this.totalCombinations) * 100;
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    }
</script>
