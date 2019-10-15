<template>
    <v-container class="grey lighten-5">
        <v-row justify="space-around">
            <v-col>
                <credential-submit v-bind:caller="{name: 'taiga'}" ></credential-submit>
            </v-col>
            <v-col v-if="isVerified()">
                <v-form>
                    <v-container>
                        <v-row justify="space-around">
                            <v-file-input
                                    v-model="files"
                                    color="deep-purple accent-4"
                                    counter
                                    label="File input"
                                    placeholder="Select your file"
                                    prepend-icon="mdi-paperclip"
                                    outlined
                                    :show-size="1000"
                                    accept=".csv"
                            >
                            </v-file-input>
                            <v-divider vertical class="mx-2"></v-divider>
                            <v-btn color="success"
                                   @click="createRepositoryFromFile">
                                {{buttonText}}
                            </v-btn>
                        </v-row>
                    </v-container>
                </v-form>
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
                            <span><b> Board Creation Failed: </b>{{entry.failed}}</span><br/>
                            <span><b> Board Creation Failure Reason: </b>{{entry.reason}}</span><br/>
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
    import CredentialSubmit from "@/components/CredentialSubmit";
    import {mapGetters} from "vuex";
    import taigaService from "@/services/taigaService";

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
                active: []
            }
        },
        computed: {
            ...mapGetters('centralStore', ['getUploadedFile']),
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
                let vueThis = this;
                if (this.files && this.files.length !== 0) {
                    const reader = new FileReader();
                    reader.onloadend = function (event) {
                        if (event.target.readyState === FileReader.DONE) {
                            this.fileContent = event.target.result
                            this.fileContent = this.fileContent.split("\n")  // convert content sting to lines/list
                            this.fileContent = this.fileContent.slice(1)  // remove header
                            for (let line of this.fileContent) {
                                line = line.split(",")  // convert content sting to list
                                vueThis.lines.push(line.map(item => item.trim(" ")))
                            }
                            const data = vueThis.createPayload(vueThis.lines)
                            taigaService.createBoardFromFile(data)
                                .then(response => {
                                    vueThis.response = vueThis.convertToExpansionPanel(response.data)
                                    vueThis.gettingData = false;
                                }).catch(error => {
                                console.log(error)
                            })
                        }
                    }
                    reader.readAsText(this.files);
                }
            },
            createPayload: function (lines) {
                let payload = []
                for (let line of lines) {
                    let data = {}
                    data["auth_token"] = this.getAuthToken;
                    data["is_private"] = false;  // always create a public board
                    data["project_name"] = line[0];
                    data["project_description"] = line[1];
                    data["members"] = line.slice(2);
                    payload.push(data);
                }
                console.log(payload);
                return payload;
            }
        }
    }
</script>
