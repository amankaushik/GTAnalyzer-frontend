<template>
    <v-container>
        <v-expansion-panels focusable popout>
            <v-expansion-panel
                    v-for="source of Object.keys(meta.data)" :key="source">
                <v-expansion-panel-header :expand-icon="meta.sourceIcon">
                    {{source}}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-card>
                        <!-- Use renderData for displaying branches -->
                        <v-tabs show-arrows v-model="entityTabs">
                            <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
                            <v-tab v-for="entity of Object.keys(meta.renderData[source])" :key="source+entity">
                                <v-icon left>{{meta.entityIcon}}</v-icon>
                                {{ entity}}
                            </v-tab>
                        </v-tabs>
                        <v-tabs-items v-model="entityTabs">
                            <v-tab-item v-for="entity of Object.keys(meta.renderData[source])" :key="source+entity">
                                <v-card>
                                    <v-tabs fixed-tabs color="deep-purple accent-4" show-arrows
                                            v-model="userTabs">
                                        <v-tab v-for="user of Object.keys(meta.data[source][entity])"
                                               :key="source+entity+user">
                                            <v-icon left>{{meta.userIcon}}</v-icon>
                                            {{user}}
                                        </v-tab>
                                    </v-tabs>
                                    <v-tabs-items v-model="userTabs">
                                        <v-tab-item v-for="user of Object.keys(meta.data[source][entity])"
                                                    :key="source+entity+user">
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
        props: {meta: Object},
    }
</script>
