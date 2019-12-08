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
                        <v-tabs show-arrows grow v-model="entityTabs">
                            <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
                            <!-- Each milestone (User Story) -->
                            <v-tab v-for="(entity, i) of Object.keys(meta.data[source].milestones)" v-bind:key="i">
                                <v-icon left>{{meta.entityIcon}}</v-icon>
                                {{ meta.data[source].milestones[entity].name }}
                            </v-tab>
                        </v-tabs>
                        <v-tabs-items v-model="entityTabs">
                            <v-tab-item v-for="(entity, i) of Object.keys(meta.data[source].milestones)" v-bind:key="i">
                                <v-container>
                                    <v-row justify="center">
                                        <v-col>
                                            <v-card class="mx-auto" max-width="500">
                                                <v-card-title> Sprint Details</v-card-title>
                                                <v-list dense>
                                                    <v-list-item>
                                                        <template v-if="isClosed(meta.data[source].milestones[entity])">
                                                            <v-chip class="ma-2" color="green"
                                                                    text-color="white">
                                                                <v-icon left>mdi-thumb-up-outline</v-icon>
                                                                Closed
                                                            </v-chip>
                                                        </template>
                                                        <template v-else>
                                                            <v-chip class="ma-2" color="orange"
                                                                    text-color="white">
                                                                <v-icon left>mdi-alert-outline</v-icon>
                                                                Still Open
                                                            </v-chip>
                                                        </template>
                                                        <v-chip class="ma-2" outlined color="indigo darken-3">
                                                            <v-icon left>mdi-fire</v-icon>
                                                            <span>
                                                               {{meta.data[source].milestones[entity]["closed_points"]}}
                                                                /
                                                                {{meta.data[source].milestones[entity]["total_points"]}}
                                                            </span>
                                                        </v-chip>
                                                        <v-chip class="ma-2" outlined color="primary">
                                                            <span>
                                                                {{meta.data[source].milestones[entity]["estimated_start"]}}
                                                            </span>
                                                            <v-icon>
                                                                mdi-arrow-right-bold
                                                            </v-icon>
                                                            <span>
                                                                {{meta.data[source].milestones[entity]["estimated_finish"]}}
                                                            </span>
                                                        </v-chip>
                                                    </v-list-item>
                                                </v-list>
                                                <v-card-actions>
                                                    <a class="v-btn"
                                                       :href="getSprintURL(source, meta.data[source].milestones[entity]['slug'])"
                                                       target="_blank">View Sprint</a>
                                                </v-card-actions>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <v-divider></v-divider>
                                    <v-row>
                                        <v-col cols="auto"
                                               v-for="ustory of meta.data[source].milestones[entity]['user_stories']"
                                               v-bind:key="ustory.id">
                                            <v-card class="mx-auto" max-width="500" min-width="200">
                                                <v-card-title> {{ustory.subject}}</v-card-title>
                                                <v-list dense>
                                                    <v-list-item>
                                                        <template v-if="isClosed(ustory)">
                                                            <v-chip x-small class="ma-2" color="green"
                                                                    text-color="white">
                                                                <v-icon x-small left>mdi-thumb-up-outline</v-icon>
                                                                Closed
                                                            </v-chip>
                                                        </template>
                                                        <template v-else>
                                                            <v-chip x-small class="ma-2" color="orange"
                                                                    text-color="white">
                                                                <v-icon x-small left>mdi-alert-outline</v-icon>
                                                                Still Open
                                                            </v-chip>
                                                        </template>
                                                        <v-chip class="ma-2" x-small
                                                                :color="statusColorCode(ustory['status'])"
                                                                text-color="white">
                                                            <v-icon x-small left>{{statusIcon(ustory['status'])}}
                                                            </v-icon>
                                                            <span>{{ustory["status"]}}</span>
                                                        </v-chip>
                                                        <v-chip class="ma-2" x-small>
                                                            <span>
                                                            Points: {{ustory["total_points"] | nullToText}}
                                                            </span>
                                                        </v-chip>
                                                        <v-chip x-small class="ma-2">
                                                            <span>
                                                                Tasks: {{ustory["tasks"].length}}
                                                            </span>

                                                        </v-chip>
                                                    </v-list-item>
                                                </v-list>
                                                <v-card-actions>
                                                    <v-dialog v-model="dialog" width="800px" scrollable persistent>
                                                        <template v-slot:activator="{ on }">
                                                            <v-btn color="primary" text v-on="on">View Timeline
                                                            </v-btn>
                                                        </template>
                                                        <v-card>
                                                            <v-toolbar dark color="primary">
                                                                <v-chip outlined align="left" class="ma-2"
                                                                        @click="dialog = false">
                                                                    <v-icon left>mdi-close</v-icon>
                                                                </v-chip>
                                                                <v-toolbar-title>Timeline</v-toolbar-title>
                                                            </v-toolbar>
                                                            <v-container>
                                                                <v-timeline>
                                                                    <v-timeline-item
                                                                            v-for="(year, i) in years"
                                                                            :key="i"
                                                                            :color="year.color"
                                                                            small
                                                                    >
                                                                        <template v-slot:opposite>
        <span
                :class="`headline font-weight-bold ${year.color}--text`"
                v-text="year.year"
        ></span>
                                                                        </template>
                                                                        <div class="py-4">
                                                                            <h2 :class="`headline font-weight-light mb-4 ${year.color}--text`">
                                                                                Lorem ipsum</h2>
                                                                            <div>
                                                                                Lorem ipsum dolor sit amet, no nam
                                                                                oblique veritus. Commune scaevola
                                                                                imperdiet nec ut, sed euismod convenire
                                                                                principes at. Est et nobis iisque
                                                                                percipit, an vim zril disputando
                                                                                voluptatibus, vix an salutandi
                                                                                sententiae.
                                                                            </div>
                                                                        </div>
                                                                    </v-timeline-item>
                                                                </v-timeline>
                                                            </v-container>
                                                        </v-card>
                                                    </v-dialog>
                                                    <a class="v-btn"
                                                       :href="getUSURL(source, ustory['ref'], meta.data[source].milestones[entity]['id'])"
                                                       target="_blank">View US</a>
                                                </v-card-actions>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-container>
</template>

<script>
    export default {
        name: "RenderTGAnalysis",
        data() {
            return {
                entityTabs: null,
                dialog: false,
                sprintDetailKeys: [
                    "estimated_start",
                    "estimated_finish"
                ],
                sprintDetailKeysToText: {
                    "estimated_start": "Start Date",
                    "estimated_finish": "End Date"
                },
                years: [
                    {
                        color: 'cyan',
                        year: '1960',
                    },
                    {
                        color: 'green',
                        year: '1970',
                    },
                    {
                        color: 'pink',
                        year: '1980',
                    },
                    {
                        color: 'amber',
                        year: '1990',
                    },
                    {
                        color: 'orange',
                        year: '2000',
                    },
                ],
            }
        },
        filters: {
            nullToText: function (data) {
                if (data === null)
                    return "Not Available";
                return data;
            }
        },
        props: {meta: Object},
        methods: {
            closeDialog: function () {
                this.dialog = false;
            },
            getSprintURL: function (source, slug) {
                return `https://tree.taiga.io/project/${source}/taskboard/${slug}`
            },
            getUSURL: function (source, usRef, msId) {
                return `https://tree.taiga.io/project/${source}/us/${usRef}?milestone=${msId}`
            },
            hasError: function (data) {
                return data.hasOwnProperty("failed");
            },
            isClosed: function (data) {
                return data["is_closed"];
            },
            statusColorCode: function (status) {
                if (status === "Done") {
                    return "green";
                } else if (status === "New") {
                    return "orange";
                } else if (status === "In progress") {
                    return "yellow darken-2";
                } else if (status === "Blocked") {
                    return "red";
                }
                return "brown lighten-1";
            },
            statusIcon: function (status) {
                if (status === "Done")
                    return "mdi-thumb-up-outline";
                return "mdi-alert-outline"
            }
        }
    }
</script>
