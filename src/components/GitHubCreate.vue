<template>
    <v-container class="grey lighten-5">
        <v-row justify="space-around">
            <v-col>
                <credential-submit></credential-submit>
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
                            <span><b> Repo Creation Failed: </b>{{entry.failed}}</span><br/>
                            <span><b> Repo Creation Failure Reason: </b>{{entry.reason}}</span><br/>
                            <span><b> Repo Creation Failure Step: </b>{{entry.failureStep}}</span><br/>
                        </div>
                        <v-divider></v-divider>
                        <div>
                            <span><b> Master Protected: </b>{{entry.protectionEnabled | nullToText}}</span><br/>
                        </div>
                        <v-divider></v-divider>
                        <div>
                            <h6> Collaborators </h6>
                            <v-chip v-for="item of entry.collaborators" :key="item.name"
                                    :color="getPanelChipColor(item.failed)">
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
    import githubService from "@/services/githubService";
    import {mapGetters} from "vuex";

    export default {
        name: "GitHubCreate",
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
            ...mapGetters('credentialStore', ['getToken', 'getUsername', 'getVerified']),
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
                for (let repo of data) {
                    let repoDict = {};
                    panelData[repo["repo_name"]] = repoDict;
                    repoDict["name"] = repo["repo_name"];
                    repoDict["showFailure"] = false;
                    if (repo.hasOwnProperty("failed")) {
                        repoDict["showFailure"] = true;
                        repoDict["failed"] = repo["failed"];
                        repoDict["failureStep"] = repo["failure_step"];
                        repoDict["reason"] = repo["reason"]
                    }
                    let collabList = [];
                    repoDict["collaborators"] = collabList;
                    if (repo.hasOwnProperty("collaborator_status")) {
                        for (let collaborator of repo["collaborator_status"]) {
                            collabList.push(
                                {
                                    "name": collaborator["collab_name"],
                                    "failed": collaborator.failed
                                }
                            );
                            if (collaborator.failed) {  // Even if there is one failure, indicate failure
                                repoDict["failure"] = true;
                            }
                        }
                    }
                    repoDict["protectionEnabled"] = null;
                    if (repo.hasOwnProperty("protection_enabled")) {
                        repoDict["protectionEnabled"] = repo["protection_enabled"]
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
                    const data = {};
                    reader.onloadend = function (event) {
                        if (event.target.readyState === FileReader.DONE) {
                            this.fileContent = event.target.result
                            this.fileContent = this.fileContent.split("\n")  // convert content sting to lines/list
                            this.fileContent = this.fileContent.slice(1)  // remove header
                            for (let line of this.fileContent) {
                                line = line.split(",")  // convert content sting to lines/list
                                vueThis.lines.push(line)
                            }
                            data["token"] = vueThis.getToken;
                            data["username"] = vueThis.getUsername;
                            data["content"] = vueThis.lines;
                            githubService.createRepositoryFromFile(data)
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
            }
        }
    }
</script>
