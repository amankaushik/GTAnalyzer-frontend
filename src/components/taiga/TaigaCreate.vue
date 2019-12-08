<template>
    <v-container class="grey lighten-5">
        <v-row justify="space-around">
            <v-col>
                <credential-submit v-bind:caller="{name: 'taiga'}"></credential-submit>
            </v-col>
            <v-col v-if="isVerified()">
                <file-upload :button-text="buttonText" @uploadDone="createRepositoryFromFile"></file-upload>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row justify="space-around" v-if="gettingData">
            <v-progress-circular
                    indeterminate
                    color="purple"
            ></v-progress-circular>
        </v-row>
        <v-row justify="space-around" v-if="response">
            <v-expansion-panels inset>
                <v-expansion-panel v-for="entry of response" :key="entry.name">
                    <v-expansion-panel-header :expand-icon="getPanelHeaderIcon(entry.failed)">
                        {{entry.name}}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <div v-if="entry.showFailure">
                            <span><b> Board-Flow Creation Failed: </b>{{entry.failed}}</span><br/>
                            <span><b> Board-Flow Creation Failure Reason: </b>{{entry.reason}}</span><br/>
                        </div>
                        <v-divider></v-divider>
                        <div>
                            <h6> Members </h6>
                            <v-chip v-for="item of entry.members" :key="item.name"
                                    :color="getPanelChipColor(false)">
                                {{item.name}}
                            </v-chip>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-row>
    </v-container>
</template>

<script>
    import CredentialSubmit from "@/components/common/CredentialSubmit";
    import {mapGetters} from "vuex";
    import taigaService from "@/services/taigaService";
    import {csvFileParserMixin} from "@/mixins/csvFileParserMixin";

    export default {
        name: "TaigaCreate",
        components: {CredentialSubmit},
        data: function () {
            return {
                buttonText: "Create",
                gettingData: false,
                files: [], // single file upload only
                response: null,
                lines: [],
                active: [],
                fileContent: []
            }
        },
        mixins: [csvFileParserMixin],
        computed: {
            ...mapGetters('centralStore', ['getUploadedFile', 'getUploadedFileContent']),
            ...mapGetters('taigaCredentialStore', ['getAuthToken', 'getUsername',
                'getUserId', 'getPassword', 'getVerified']),
        },
        filters: {
            nullToText: function (element) {
                if (element === null)
                    return "N/A";
                return element;
            }
        },
        methods: {
            isVerified: function () {
                return this.getVerified;
            },
            convertToExpansionPanel: function (data) {
                let panelData = {};
                for (let board of data) {
                    let boardDict = {};
                    let memberList = [];
                    boardDict["members"] = memberList;
                    panelData[board["project_name"]] = boardDict;
                    boardDict["name"] = board["project_name"];
                    boardDict["showFailure"] = false;
                    if (board.hasOwnProperty("error")) {
                        if (board["error"]) {
                            boardDict["showFailure"] = true;
                            boardDict["failed"] = board["error"];
                            boardDict["reason"] = board["message"];
                        } else {
                            if (board.hasOwnProperty("members")) {
                                for (let member of board["members"]) {
                                    memberList.push(
                                        {
                                            "name": member["email"],
                                            "failed": false  // if a member is present, then it was successfully created
                                        }
                                    );
                                }
                            }
                        }
                    }
                }
                return panelData;
            },
            getPanelHeaderIcon: function (_type) {
                if (_type)
                    return "mdi-close-circle";
                return "mdi-checkbox-marked-circle";
            },
            getPanelChipColor: function (_type) {
                if (_type)
                    return "red";
                return "green";
            },
            createRepositoryFromFile: function () {
                this.response = null;
                this.gettingData = true;
                this.fileContent = this.getUploadedFileContent;
                this.lines = this.parseCSVFile(this.fileContent, 3, 1);
                const data = this.createPayload(this.lines);
                let vueThis = this;
                taigaService.createBoardFromFile(data)
                    .then(response => {
                        vueThis.response = vueThis.convertToExpansionPanel(response.data);
                        vueThis.gettingData = false;
                    }).catch(error => {
                    console.log(error)
                })
            },
            createPayload: function (lines) {
                let payload = [];
                for (let line of lines) {
                    let data = {};
                    data["auth_token"] = this.getAuthToken;
                    data["is_private"] = false;  // always create a public board
                    data["project_name"] = line[0];
                    // Assumption: No 'project description' is provided in the CSV file.
                    data["project_description"] = line[0];
                    data["members"] = line.slice(1);
                    payload.push(data);
                }
                console.log(payload);
                return payload;
            }
        }
    }
</script>
