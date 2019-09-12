<template>
    <div>
        <v-card>
            <v-container>
                <v-row>
                    <v-col>
                        <v-form>
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn color="primary" dark v-on="on"
                                                       @click="getRepositoriesFromGitHub">
                                                    Get Repositories
                                                </v-btn>
                                            </template>
                                            <span>Get Repositories from GitHub</span>
                                        </v-tooltip>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-form>
                    </v-col>
                    <v-col>
                        <v-form>
                            <v-container>
                                <v-row>
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
                                    <v-btn :disabled="!(isFileUploaded)" color="success"
                                           @click="getRepositoriesFromFile">
                                        Submit
                                    </v-btn>
                                </v-row>
                            </v-container>
                        </v-form>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
        <div v-if="gettingData">
            <v-progress-circular
                    indeterminate
                    color="purple"
            ></v-progress-circular>
        </div>
        <div v-if="!repositoryList.empty">
            <v-chip-group v-model="selectedRepositories" column multiple>
                <v-chip filter outlined color="teal" v-for="repositoryName of repositoryList"
                        v-bind:key="repositoryName">
                    {{repositoryName}}
                </v-chip>
            </v-chip-group>
        </div>
    </div>

</template>

<script>
    import githubService from "@/services/githubService";
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "ListRepositories",
        data: function () {
            return {
                selectedRepositories: [],
                repositoryList: [],
                files: [],
                gettingData: false,
                verified: false
            }
        },
        computed: {
            ...mapGetters('credentialStore', ['getToken', 'getUsername', 'getVerified']),
            ...mapGetters('repositoryDataStore', ['getRepositoryList', 'getSelectedRepositories']),
        },
        watch: {
            // Enable/Disable "Next" button and update the central state of selectedRepositories
            selectedRepositories: function () {
                this.setSelectedRepositories(this.selectedRepositories)
                if (this.selectedRepositories.length) { // any repository is selected
                    this.setVerifiedByValue(true)
                } else {
                    this.setVerifiedByValue(false)
                }
            }
        },
        methods: {
            ...mapActions('credentialStore',
                ['setToken', 'setUsername', 'setVerified']),
            ...mapActions('repositoryDataStore',
            ['setRepositoryList', 'setSelectedRepositories']),
            isFileUploaded: function () {
                if (this.files === null || this.fiber.empty || this.files.length != 1)
                    return false;
                return true;
            },
            getRepositoriesFromFile: function () {
                console.log("getting repository data from file")
                let vueThis = this
                if (this.files && this.files.length != 0) {
                    this.performPreFetchSteps()
                    const reader = new FileReader();
                    reader.onloadend = function (event) {
                        if (event.target.readyState === FileReader.DONE) {
                            this.fileContent = event.target.result
                            this.fileContent = this.fileContent.split("\n")  // convert content sting to lines/list
                            this.fileContent = this.fileContent.slice(1)  // remove header
                            for (let line of this.fileContent) {
                                line = line.split(",")  // convert content sting to lines/list
                                vueThis.repositoryList.push(line[0])
                            }
                            vueThis.setRepositoryList(vueThis.repositoryList) // update central state
                            vueThis.gettingData = false; // hide progress circle
                        }
                    }
                    reader.readAsText(this.files);
                }
            },
            getRepositoriesFromGitHub: function () {
                console.log("getting repository data from GitHub")
                this.performPreFetchSteps()
                let vueThis = this;
                githubService.getRepositoriesFromGitHub(this.getToken, this.getUsername)
                    .then(response => {
                        vueThis.repositoryList = this.extractRepositoryData(response.data)
                        vueThis.gettingData = false; // hide progress circle
                        vueThis.setRepositoryList(vueThis.repositoryList) // update central state
                    }).catch(error => {
                    console.log(error)
                    vueThis.gettingData = false; // hide progress circle
                })
            },
            extractRepositoryData: function (repositoryList) {
                let repoNames = []
                for (let repo of repositoryList) {
                    repoNames.push(repo.name)
                }
                return repoNames
            },
            performPreFetchSteps: function () {
                this.repositoryList = []
                this.setRepositoryList(this.repositoryList) // update central state
                // disable 'Next' every time repositories are reloaded
                this.setVerifiedByValue(false); // disable 'Next' till the results are fetched
                this.gettingData = true; // display progress circle
            },
            setVerifiedByValue: function (value) {
                this.verified = value;
                this.setVerified(this.verified)
            }
        }
    }
</script>

<style scoped>

</style>