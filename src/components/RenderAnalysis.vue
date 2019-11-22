<template>
    <v-container>
        <v-expansion-panels focusable popout>
            <v-expansion-panel
                    v-for="source of Object.keys(meta.data)" :key="source">
                <v-expansion-panel-header :expand-icon="meta.sourceIcon">
                    {{source}}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-card v-if="hasError(meta.data[source])">
                        <v-card-title>
                            Analysis Failed at Step - {{meta.data[source].step}}
                        </v-card-title>
                        <v-card-subtitle>
                            Cause
                        </v-card-subtitle>
                        <v-card-text>
                            <span><strong>Type:</strong> {{meta.data[source].error.type}}</span>
                            <br>
                            <span><strong>Message:</strong> {{meta.data[source].error.message}}</span>
                        </v-card-text>
                    </v-card>
                    <v-card v-else>
                        <!-- Use renderData for displaying branches -->
                        <v-tabs show-arrows v-model="entityTabs">
                            <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
                            <v-tab v-for="(entity, i) of Object.keys(meta.renderData[source])" v-bind:key="i">
                                <v-icon left>{{meta.entityIcon}}</v-icon>
                                {{ entity}}
                            </v-tab>
                        </v-tabs>
                        <v-tabs-items v-model="entityTabs">
                            <v-tab-item v-for="(entity, i) of Object.keys(meta.renderData[source])" v-bind:key="i">
                                <v-card>
                                    <v-tabs fixed-tabs color="deep-purple accent-4" show-arrows
                                            v-model="userTabs">
                                        <v-tab v-for="(user, j) of Object.keys(meta.data[source][entity])"
                                               v-bind:key="j">
                                            <v-icon left>{{meta.userIcon}}</v-icon>
                                            {{user}}
                                        </v-tab>
                                    </v-tabs>
                                    <v-tabs-items v-model="userTabs">
                                        <v-tab-item v-for="(user, j) of Object.keys(meta.data[source][entity])"
                                                    v-bind:key="j">
                                            <render-commits :commits="{data: meta.data[source][entity][user],
                                            startDate: meta.data[source]['start_date'],
                                             endDate: meta.data[source]['end_date'],
                                              prDetails: meta.data[source]['pr_details']}"></render-commits>
                                        </v-tab-item>
                                    </v-tabs-items>
                                </v-card>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-container>
</template>

<script>
    import RenderCommits from "@/components/RenderCommits";

    export default {
        name: "RenderAnalysis",
        components: {RenderCommits},
        data() {
            return {
                entityTabs: null,
                userTabs: null
            }
        },
        methods: {
            hasError: function (data) {
                return data.hasOwnProperty("failed");
            }
        },
        props: {meta: Object},
    }
</script>
