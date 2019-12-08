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
                                                    <v-dialog width="800px">
                                                        <template v-slot:activator="{ on }">
                                                            <v-btn color="primary" text v-on="on">View Timeline
                                                            </v-btn>
                                                        </template>
                                                        <v-card>
                                                            <v-toolbar dark color="primary">
                                                                <v-toolbar-title>Timeline</v-toolbar-title>
                                                            </v-toolbar>
                                                            <v-container>
                                                                <v-timeline>
                                                                    <v-timeline-item small
                                                                                     v-for="(history, i) of getUSTimeline(ustory['history'],
                                                                            meta.data[source].milestones[entity]['estimated_start'],
                                                                    meta.data[source].milestones[entity]['estimated_finish'])"
                                                                                     v-bind:key="i"
                                                                                     :color="history.color">
                                                                        <template v-slot:opposite>
                                                                            <span :class="`${history.color}--text`"  v-text="history.date">
                                                                            </span>
                                                                        </template>
                                                                            <v-card class="elevation-2"
                                                                                    :color="`${history.color} lighten-3`">
                                                                                <v-card-subtitle>
                                                                                    {{history.event}}
                                                                                </v-card-subtitle>
                                                                            </v-card>
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
                sprintStartEventName: "Sprint Start",
                sprintEndEventName: "Sprint End",
                sprintMSEventName: "milestone",
                sprintDescEventName: "description_diff",
                sprintDescHTMLEventName: "description_html",
                sprintFinishEventName: "finish_date",
                sprintCloseEventName: "is_closed",
                sprintStatusEventName: "status",
                sprintOrderEventName: "sprint_order",
                sprintBLOrderEventName: "backlog_order",
                sprintPointsEventOrder: "points",
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
            getDiffEventDesc: function (event, details) {
                if (event === this.sprintMSEventName) { // US moved to/from Sprint
                    if (details[0] === null) { // US was in the backlog
                        return `US moved to ${details[1]}`;
                    } else if (details[1] === null) {
                        return `US moved to backlog`;
                    } else {
                        return `US moved from ${details[0]} to ${details[1]}`;
                    }
                } else if (event === this.sprintDescEventName) {
                    return "US Description changed"
                } else if (event === this.sprintFinishEventName) {
                    if (details[0] === "None") {
                        return `New 'FinishDate': ${details[1].slice(0, 10)} assigned`;
                    } else if (details[1] === "None") {
                        return `'FinishDate' removed`;
                    } else {
                        return `'FinishDate' changed from ${details[0].slice(0, 10)} to ${details[1].slice(0, 10)}`;
                    }
                } else if (event === this.sprintCloseEventName) {
                    if (details[0]) {
                        return `User Story Closed`;
                    } else {
                        return `User Story (re)Opened`;
                    }
                } else if (event === this.sprintStatusEventName) {
                    return `US status changed from ${details[0]} to ${details[1]}`;
                } else if (event === this.sprintOrderEventName) {
                    return `US sprint order changed`;
                } else if (event === this.sprintBLOrderEventName) {
                    return `US backlog order changed`;
                } else if (event === this.sprintPointsEventOrder) {
                    let template = '';
                    for (let _type of Object.keys(details)) {
                        if (details[_type][0] === "?") {
                            template += `${details[_type[1]]} points assigned for ${_type}`;
                        } else if (details[_type][1] === "?") {
                            template += `Assigned points removed for ${_type}`;
                        } else {
                            template += `Points assigned for ${_type} changed from ${details[_type[0]]} to ${details[_type[1]]}`
                        }
                        template += '\n';
                    }
                    return template;
                } else {
                    return `Changes made to ${event}`;
                }
            },
            getUSTimeline: function (history, start_date, end_date) {
                let timelineData = [];
                timelineData.push({
                    date: start_date,
                    event: this.sprintStartEventName,
                    color: this.getEventColor(this.sprintStartEventName)
                });
                timelineData.push({
                    date: end_date,
                    event: this.sprintEndEventName,
                    color: this.getEventColor(this.sprintEndEventName)
                });
                for (let item of history) {
                    for (let event in item.diff) {
                        /*
                        For description change two keys are received at the same level.
                        "description_diff" and "description_html".
                        They both refer to the same event, hence of the keys is skipped here.
                         */
                        if (event === this.sprintDescHTMLEventName)
                            continue;
                        timelineData.push({
                            date: item["created_at"],
                            event: this.getDiffEventDesc(event, item.diff[event]),
                            color: this.getEventColor(event)
                        });
                    }
                }
                return timelineData.sort((a, b) =>
                    (new Date(a.date).getTime() > new Date(b.date).getTime()) ? 1 : -1
                );
            },
            getEventColor: function (event) {
                if (event === this.sprintStartEventName) {
                    return "green";
                } else if (event === this.sprintEndEventName) {
                    return "red";
                } else if (event === this.sprintMSEventName) {
                    return "blue";
                } else if (event === this.sprintDescEventName) {
                    return "indigo";
                } else if (event === this.sprintFinishEventName) {
                    return "deep-purple";
                } else if (event === this.sprintCloseEventName) {
                    return "orange";
                } else if (event === this.sprintStatusEventName) {
                    return "amber";
                } else if (event === this.sprintOrderEventName) {
                    return "blue-grey";
                } else if (event === this.sprintBLOrderEventName) {
                    return "brown";
                } else if (event === this.sprintPointsEventOrder) {
                    return "grey";
                } else {
                    return "black";
                }
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
