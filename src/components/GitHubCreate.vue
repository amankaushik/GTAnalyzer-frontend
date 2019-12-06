<template>
    <v-container class="grey lighten-5">
        <v-row justify="space-around">
            <v-col>
                <credential-submit v-bind:caller="{name: 'github'}"></credential-submit>
            </v-col>
            <v-col v-if="isVerified()">
                <file-upload :button-text="buttonText" @uploadDone="createRepositoryFromFile"></file-upload>
            </v-col>
        </v-row>
        <v-row justify="space-around" v-if="response">
            <v-expansion-panels inset>
                <v-expansion-panel v-for="entry of response" :key="entry.name">
                    <v-expansion-panel-header :expand-icon="getPanelHeaderIcon(entry.failed)">
                        {{entry.name}}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <div v-if="entry.showFailure">
                            <span><b> Repo-Flow Creation Failed: </b>{{entry.failed}}</span><br/>
                            <span><b> Repo-Flow Creation - Repo Created: </b>{{entry.repoCreated}}</span><br/>
                            <span><b> Repo-Flow Creation Failure Reason: </b>{{entry.reason}}</span><br/>
                            <span><b> Repo-Flow Creation Failure Step: </b>{{entry.failureStep}}</span><br/>
                        </div>
                        <v-divider></v-divider>
                        <div>
                            <span><b> Master Protected: </b>{{entry.protectionEnabled | nullToText}}</span><br/>
                        </div>
                        <v-divider></v-divider>
                        <div>
                            <h6> Collaborators </h6>
                            <v-chip v-for="item of entry.collaborators" :key="item.name + Math.random().toString()"
                                    :color="getPanelChipColor(item.failed)">
                                {{item.name | handleEmptyName}}
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
    import {csvFileParserMixin} from "@/mixins/csvFileParserMixin";
    import FileUpload from "@/components/FileUpload";

    export default {
        name: "GitHubCreate",
        components: {FileUpload, CredentialSubmit},
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
        computed: {
            ...mapGetters('centralStore', ['getUploadedFile', 'getUploadedFileContent']),
            ...mapGetters('githubCredentialStore', ['getToken', 'getUsername', 'getVerified']),
        },
        filters: {
            nullToText: function (element) {
                if (element === null)
                    return "N/A";
                return element;
            },
            handleEmptyName: function (name) {
                if (name.trim(" ")) {
                    return name;
                }
                return "No-Name-Provided";
            }
        },
        mixins: [csvFileParserMixin],
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
                    repoDict["repoCreated"] = repo["repo_created"];
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
                                repoDict["showFailure"] = true;
                                repoDict["failed"] = collaborator.failed;
                                repoDict["failureStep"] = "Collaborator Addition";
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
                this.fileContent = this.getUploadedFileContent;
                this.lines = this.parseCSVFile(this.fileContent, 3, 1);
                const data = {};
                data["token"] = this.getToken;
                data["username"] = this.getUsername;
                data["content"] = this.lines;
                let vueThis = this;
                githubService.createRepositoryFromFile(data)
                    .then(response => {
                        vueThis.response = vueThis.convertToExpansionPanel(response.data);
                        vueThis.gettingData = false;
                    }).catch(error => {
                    console.log(error)
                });
            },
        }
    }
</script>
