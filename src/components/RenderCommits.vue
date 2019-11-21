<template>
    <v-container>
        <v-card class="mx-auto">
            <v-toolbar color="indigo" dark>
                <v-toolbar-title>Commit Calender</v-toolbar-title>
            </v-toolbar>
            <v-container fluid>
                <v-sheet height="500" v-if="isCommitDataAvailable()">
                    <v-calendar
                            type="custom-weekly"
                            :start="commits.startDate"
                            :end="commits.endDate"
                            :events="events"
                            :event-color="getEventColor"
                    ></v-calendar>
                </v-sheet>
                <v-sheet v-else>
                    <span> No Records Found!</span>
                </v-sheet>
            </v-container>
        </v-card>
        <v-card class="mx-auto">
            <v-toolbar color="indigo" dark>
                <v-toolbar-title>Commit Details</v-toolbar-title>
            </v-toolbar>
            <v-container fluid>
                <v-row dense v-if="isCommitDataAvailable()">
                    <v-col v-for="commit of commitData" :key="commit.sha">
                        <v-card class="mx-auto" max-width="400">
                            <v-card-title>
                                <v-icon large left>mdi-calendar-range</v-icon>
                                <span class="title font-weight-light">{{commit.date}}</span>
                            </v-card-title>
                            <v-card-text class="headline font-weight-bold">
                                {{commit.message}}
                            </v-card-text>
                            <v-card-actions>
                                <v-list-item class="grow">
                                    <v-row dense align="center" justify="space-around">
                                        <v-icon small class="mr-1">mdi-plus-circle</v-icon>
                                        <span>{{commit.stats.additions}}</span>
                                        <span class="mr-1">·</span>
                                        <v-icon small class="mr-1">mdi-minus-circle</v-icon>
                                        <span>{{commit.stats.deletions}}</span>
                                        <span class="mr-1">·</span>
                                        <v-icon small class="mr-1">mdi-all-inclusive</v-icon>
                                        <span>{{commit.stats.total}}</span>
                                        <span class="mr-1">·</span>
                                        <v-icon small class="mr-1">mdi-github-circle</v-icon>
                                        <a :href="commit.url" target="_blank">View</a>
                                        <template v-if="hasUSNumber(commit.message)">
                                            <v-chip x-small class="ma-2" color="green" text-color="white">
                                                <v-icon x-small left>mdi-thumb-up-outline</v-icon>
                                                Has US
                                            </v-chip>
                                        </template>
                                        <template v-else>
                                            <v-chip x-small class="ma-2" color="orange" text-color="white">
                                                <v-icon x-small left>mdi-alert-outline</v-icon>
                                                No US
                                            </v-chip>
                                        </template>
                                        <template v-if="hasTaskNumber(commit.message)">
                                            <v-chip x-small class="ma-2" color="green" text-color="white">
                                                <v-icon x-small left>mdi-thumb-up-outline</v-icon>
                                                Has Task
                                            </v-chip>
                                        </template>
                                        <template v-else>
                                            <v-chip x-small class="ma-2" color="orange" text-color="white">
                                                <v-icon x-small left>mdi-alert-outline</v-icon>
                                                No Task
                                            </v-chip>
                                        </template>
                                    </v-row>
                                </v-list-item>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row v-else>
                    <span> No Records Found!</span>
                </v-row>
            </v-container>
        </v-card>
        <v-card class="mx-auto">
            <v-toolbar color="indigo" dark>
                <v-toolbar-title>PR Details</v-toolbar-title>
            </v-toolbar>
            <v-container fluid v-for="role of [authorKey, reviewerKey, assigneeKey]" :key="role">
                <v-row dense v-if="hasDoneThis(role)">
                    <v-col v-for="pr of commits.data[role]" :key="pr">
                        <v-card class="mx-auto" max-width="400">
                            <v-card-title>
                                <v-icon large left>mdi-calendar-range</v-icon>
                                <span class="title font-weight-light"> {{getPRObjectField(pr, "created_date")}}</span>
                            </v-card-title>
                            <v-card-text class="headline font-weight-bold">
                                {{getPRObjectField(pr, "title")}}
                                <br>
                                {{getPRObjectField(pr, "body")}}
                            </v-card-text>
                            <v-card-actions>
                                <v-list-item class="grow">
                                    <v-row dense align="center" justify="center">
                                        <v-icon small class="mr-1">mdi-source-branch</v-icon>
                                        <span> Head: {{getPRObjectField(pr, "head")}}</span>
                                        <span class="mr-1">·</span>
                                        <v-icon small class="mr-1">mdi-source-branch</v-icon>
                                        <span> Base: {{getPRObjectField(pr, "base")}}</span>
                                        <span class="mr-1">·</span>
                                        <v-icon small class="mr-1">mdi-pound-box-outline</v-icon>
                                        <span> Commits: {{getPRObjectField(pr, "num_commits")}}</span>
                                        <span class="mr-1">·</span>
                                        <v-icon small class="mr-1">mdi-pound-box-outline</v-icon>
                                        <span> Files: {{getPRObjectField(pr, "num_files")}}</span>
                                        <span class="mr-1">·</span>
                                        <span> PR: {{getPRObjectField(pr, "number")}}</span>
                                        <span class="mr-1">·</span>
                                        <v-icon small class="mr-1">mdi-pound-box-outline</v-icon>
                                        <span> Comments: {{getPRObjectField(pr, "num_comments")}}</span>
                                        <span class="mr-1">·</span>
                                        <v-icon small class="mr-1">mdi-github-circle</v-icon>
                                        <span> <a :href="getPRObjectField(pr, 'url')"
                                           target="_blank">View</a></span>
                                        <span class="mr-1">·</span>
                                        <template v-if="isOpen(getPRObjectField(pr, 'state'))">
                                            <v-chip small class="ma-2" color="green"
                                                    text-color="white">
                                                <v-icon small left>mdi-thumb-up-outline</v-icon>
                                                Closed
                                            </v-chip>
                                        </template>
                                        <template v-else>
                                            <v-chip small class="ma-2" color="orange"
                                                    text-color="white">
                                                <v-icon small left>mdi-alert-outline</v-icon>
                                                Open
                                            </v-chip>
                                        </template>
                                        <span class="mr-1">·</span>
                                        <template>
                                            <v-chip small class="ma-2" color="blue"
                                                    text-color="white">
                                                <v-icon small left>mdi-account-outline</v-icon>
                                                {{role}}
                                            </v-chip>
                                        </template>
                                    </v-row>
                                </v-list-item>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row v-else>
                    Not acted as a {{role}} on any PR.
                </v-row>
            </v-container>
        </v-card>
    </v-container>
</template>

<script>
    export default {
        name: "RenderCommits",
        props: {commits: Object},
        data() {
            return {
                commitKey: "commits",
                authorKey: "author",
                reviewerKey: "reviewer",
                assigneeKey: "assignee",
                timelineDates: [],
                commitDataFlag: false,
                eventDataFlag: false,
                commitData: null,
                events: [],
                selectedEvent: {},
                selectedElement: null,
                selectedOpen: false,
            }
        },
        methods: {
            isCommitDataAvailable: function () {
                if (this.commitDataFlag || this.commits.data.hasOwnProperty(this.commitKey)) {
                    this.commitDataFlag = true;
                    this.extractCommitObject();
                    if (!this.eventDataFlag) {
                        this.generateCalendarEvents();
                    }
                    return true;
                }
                return false;
            },
            generateCalendarEvents: function () {
                for (let commit of this.commitData) {
                    this.events.push({
                        name: `Commit with ${commit.stats.additions} additions and ${commit.stats.deletions} deletions.`,
                        start: commit.date,
                        end: commit.date,
                        color: "blue"
                    });
                }
                this.events.push({
                    name: "Sprint Start",
                    start: this.commits.startDate,
                    end: this.commits.startDate,
                    color: "green"
                });
                this.events.push({
                    name: "Sprint End",
                    start: this.commits.endDate,
                    end: this.commits.endDate,
                    color: "red"
                });
                this.eventDataFlag = true;
            },
            extractCommitObject: function () {
                this.commitData = this.commits.data[this.commitKey];
            },
            hasUSNumber: function (message) {
                let regExp = new RegExp('US#[\\d]+', 'gi');
                return regExp.test(message);
            },
            hasTaskNumber: function (message) {
                let regExp = new RegExp('TASK#[\\d]+', 'gi');
                return regExp.test(message);
            },
            getEventColor: function (event) {
                return event.color;
            },
            hasDoneThis: function (key) {
                return !(this.commits.data[key] === undefined);
            },
            isOpen: function (state) {
                return state === "closed";
            },
            getPRObjectField: function (pr, key) {
                return this.commits.prDetails[pr.toString()][key];
            }
        }
    }
</script>

<style scoped>

</style>