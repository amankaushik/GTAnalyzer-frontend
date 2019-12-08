<template>
    <v-container>
        <v-row justify="start">
            <v-col>
                <v-radio-group v-model="criteria" hide-details>
                    <v-radio value="auto" label="Get Sprint Dates from Taiga"></v-radio>
                    <v-radio value="manual" label="Select Date Range"></v-radio>
                </v-radio-group>
            </v-col>
            <v-col v-if="isCriteriaTaiga()">
                <CredentialSubmit v-bind:caller="{name: taigaCaller}"></CredentialSubmit>
            </v-col>
            <v-col v-else>
                <v-col>
                    <v-date-picker v-model="dates" range></v-date-picker>
                </v-col>
                <v-col>
                    <v-text-field v-model="dateRangeText" label="Date range" prepend-icon="event"
                                  readonly></v-text-field>
                </v-col>
            </v-col>
        </v-row>
        <!-- If Taiga Credentials have been stored -->
        <v-row v-if="this.taigaGetVerified">
            <file-upload button-text="Get Sprint Dates" @uploadDone="getEntitiesFromFile"></file-upload>
        </v-row>
        <!-- file the file has been parsed -->
        <v-col v-if="!payloadRepoNames.empty">
            <v-card v-for="(item, index) of payloadRepoNames" v-bind:key="item.name">
                <v-card-text>
                    <v-col>{{item.name}} | {{item.board_name}}</v-col>
                    <v-col>
                        <v-row>
                            <v-radio-group hide-details v-model="payloadRepoNames[index].selected"
                                           v-for="milestone of item.milestones" v-bind:key="milestone.name" dense>
                                <v-radio :value="getDateRange(milestone)" :label="getDateRange(milestone)"></v-radio>
                            </v-radio-group>
                        </v-row>
                    </v-col>
                </v-card-text>
            </v-card>
        </v-col>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-row>
            <v-btn :disabled="payloadRepoNames.length === 0 && dates.length === 0" @click="createPayload">
                Done Selecting Date Range
            </v-btn>
        </v-row>
    </v-container>
</template>

<script>
    import CredentialSubmit from "@/components/common/CredentialSubmit";
    import {mapGetters, mapActions} from 'vuex';
    import taigaService from "@/services/taigaService";
    import {csvFileParserMixin} from "@/mixins/csvFileParserMixin";
    import FileUpload from "@/components/common/FileUpload";

    export default {
        name: "DateRangeSelector",
        components: {FileUpload, CredentialSubmit},
        data: () => ({
            // not guaranteed to be sorted
            dates: [],
            criteria: "auto",
            verified: false,
            files: [],
            fileContent: [],
            payload: {},
            payloadRepoNames: [],
            taigaCaller: process.env.VUE_APP_CALLER_TAIGA
        }),
        watch: {
            // Enable/Disable "Next" button and update the central state of sprintList
            payload: function () {
                this.setGHPayload(this.payload);
                this.verified = false;
                if (Object.entries(this.payload).length !== 0) {
                    this.verified = true;
                }
                this.setVerified(this.verified);
            },
            // Reset Payload if criteria changes
            criteria: function () {
                // reset to disable "Done Selecting Date Range Button"
                this.dates = [];
                this.payloadRepoNames = [];
                // reset payload if criteria changes
                this.payload = {};
                // hide file selector
                this.taigaSetVerified(false);
            }
        },
        props: {caller: Object},
        computed: {
            ...mapGetters('githubCredentialStore', ['getVerified', 'getUsername', 'getToken']),
            ...mapGetters('taigaCredentialStore', {
                'taigaGetVerified': 'getVerified',
                'getAuthToken': 'getAuthToken',
                'getUserId': 'getUserId'
            }),
            ...mapGetters('repositoryDataStore', ['getSelectedRepositories', 'getRepositoryList']),
            ...mapGetters('centralStore', ['getGHPayload', 'getUploadedFileContent']),
            dateRangeText() {
                return this.dates.join(' ~ ')
            },
        },
        mixins: [csvFileParserMixin],
        methods: {
            ...mapActions('centralStore',
                ['setGHPayload']),
            ...mapActions('githubCredentialStore',
                ['setVerified']),
            ...mapActions('taigaCredentialStore', {'taigaSetVerified': 'setVerified'}),
            getDateRange: function (data) {
                return data["estimated_start"] + '~' + data["estimated_finish"]
            },
            splitDateRange: function (data) {
                return data.split('~');
            },
            getEntitiesFromFile: function () {
                let vueThis = this;
                this.performPreFetchSteps();
                this.fileContent = this.getUploadedFileContent;
                this.fileContent = vueThis.parseCSVFile(this.fileContent, 0, 1);
                for (let content of this.fileContent) {
                    // Get the corresponding Taiga board for the selected repo
                    if (vueThis.getSelectedRepositories.includes(content[0])) {
                        let _tmp = {
                            "name": content[0],
                            "board_name": content[1],
                            "selected": null  // Filled from radio buttons
                        };
                        taigaService.getMilestones(vueThis.getAuthToken, content[1])
                            .then(response => {
                                _tmp["milestones"] = response.data;
                                _tmp["selected"] = vueThis.getDateRange( // default selection
                                    _tmp["milestones"][0]
                                );
                                vueThis.payloadRepoNames.push(_tmp); // only push if milestones available
                            }).catch(error => {
                            console.log(error);
                        })
                    }
                }
            },
            performPreFetchSteps: function () {
                // disable 'Next' every time repositories are reloaded
                this.verified = false;
                this.setVerified(this.verified);
            },
            isCriteriaTaiga: function () {
                // get date range from Taiga
                if (this.criteria === "auto")
                    return true;
                // select date range from date picker
                if (this.criteria === "manual")
                    return false;
            },
            createPayload: function () {
                let payload = {};
                payload["username"] = this.getUsername;
                payload["token"] = this.getToken;
                payload["tg_user_id"] = this.getUserId;
                payload["tg_auth_token"] = this.getAuthToken;
                payload["repo_names"] = [];
                // DatePicker used to get date ranges
                if (this.criteria === "manual") {
                    payload["integrate_taiga"] = false;
                    let dates = this.splitDateRange(this.dateRangeText);
                    // getTime returns milliseconds
                    dates = dates.map(date => new Date(date).getTime() / 1000);
                    dates.sort();
                    // timestamp, dates[0] already in expected format
                    for (let repo of this.getSelectedRepositories) {
                        payload["repo_names"].push({
                            "name": repo,
                            "board_name": null,
                            "start_date": dates[0],
                            "end_date": dates[1]
                        });
                    }
                } else { // Taiga Used to get date ranges
                    payload["integrate_taiga"] = true;
                    for (let repo of this.payloadRepoNames) {
                        let dates = this.splitDateRange(repo.selected);
                        // getTime returns milliseconds
                        dates = dates.map(date => new Date(date).getTime() / 1000);
                        payload["repo_names"].push({
                            "name": repo.name,
                            "board_name": repo.board_name,
                            "start_date": dates[0],
                            "end_date": dates[1]
                        })
                    }
                }
                this.payload = payload;
            }
        }
    }
</script>
