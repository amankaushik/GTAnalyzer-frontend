<template>
    <v-container>
        <v-col>
            <v-row justify="space-around">
                <v-btn color="success" @click="startPolling" :disabled="isAnalysisRequested()"> Get Analysis Results
                </v-btn>
                <a :href="downloadDataDump" download="dump.json" > Download Data Dump
                </a>
            </v-row>
            <br>
            <v-row v-if="(running)" justify="center">
                <v-progress-linear
                        v-model="donePercent"
                        color="light-blue"
                        height="20"
                        striped>
                    <template v-slot="{ value }">
                        <strong>{{doneCombinations}} of {{totalCombinations}}</strong>
                    </template>
                </v-progress-linear>
            </v-row>
            <v-row v-if="done">
                <component v-bind:is="render.renderComponent" :meta="prepareRenderPropData()"></component>
            </v-row>
        </v-col>
    </v-container>
</template>

<script>
    import {strategyMixin} from "@/mixins/strategyMixin";

    export default {
        name: "AnalyzeEntities",
        props: {meta: Object, render: Object},
        mixins: [strategyMixin],
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
                donePercent: 0,
                response: {"error": "No Data available"},
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
            downloadDataDump: function () {
                let dData = JSON.stringify(this.response, null, 2);
                let blob = new Blob([dData], {type: 'application/json'});
                return window.URL.createObjectURL(blob);
            }
        },
        methods: {
            isAnalysisRequested: function () {
                let strategyManager = new this.StrategyManager(this.render.caller);
                let strategy = strategyManager.strategy;
                // if a new analysis has been requested enable the button
                return !(strategy.getAnalysisRequested);
            },
            startPolling: function () {
                let strategyManager = new this.StrategyManager(this.render.caller);
                let strategy = strategyManager.strategy;
                this.totalCombinations = this.meta["combinations"];
                this.doneCombinations = 0;
                this.running = true;
                this.done = false;
                this.response = {};
                // requested analysis has been processed - disable the button
                strategy.setAnalysisRequested(false);
                // Once every <interval> seconds
                this.timerId = setInterval(this.pollInInterval, this.interval);
            },
            pollInInterval: function () {
                let payload = {"request_id": this.meta["request_id"]};
                let strategyManager = new this.StrategyManager(this.render.caller);
                let strategy = strategyManager.strategy;
                strategy.resultGetter(payload).then(response => {
                    this.response = response.data;
                    this.doneCombinations = Object.keys(this.response).length;
                    this.donePercent = (this.doneCombinations / this.totalCombinations) * 100;
                }).catch(error => {
                    console.log(error);
                });
            },
            prepareRenderPropData: function () {
                let strategyManager = new this.StrategyManager(this.render.caller);
                let strategy = strategyManager.strategy;
                return  strategy.prepareRenderPropData(this.response);
            }
        }
    }
</script>
