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
                                                       @click="getEntitiesFromSource">
                                                    Get Repositories/Boards
                                                </v-btn>
                                            </template>
                                            <span>Get Repositories from GitHub/ Get Board from Taiga</span>
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
                                           @click="getEntitiesFromFile">
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
        <div v-if="!entityList.empty">
            <v-text-field
                    v-model="filterText"
                    outlined
                    clearable
                    label="Search"
                    type="text"
                    @input="filterEntityList"
            >
            </v-text-field>
            <v-chip-group v-model="selectedEntities" column multiple>
                <v-chip filter outlined color="teal" v-for="entityName of entityList"
                        v-bind:key="entityName">
                    {{entityName}}
                </v-chip>
            </v-chip-group>
        </div>
    </div>

</template>

<script>
    import githubService from "@/services/githubService";
    import taigaService from "@/services/taigaService";
    import {listerStrategyMixin} from "@/mixins/listerStrategyMixin";
    import {mapGetters} from "vuex";

    export default {
        name: "Lister",
        data: function () {
            return {
                selectedEntities: [],
                entityList: [],
                files: [],
                gettingData: false,
                verified: false,
                filterText: ""
            }
        },
        mixins: [listerStrategyMixin],
        props: {caller: Object},
        watch: {
            // Enable/Disable "Next" button and update the central state of selectedRepositories
            selectedEntities: function () {
                let strategyManager = new this.StrategyManager(this.caller.name)
                let strategy = strategyManager.strategy
                strategy.setSelectedEntities(this.selectedEntities)
                this.verified = false
                if (this.selectedEntities.length) { // any repository is selected
                    this.verified = true;
                }
                strategy.setVerified(this.verified)
            },
        },
        computed: {
            ...mapGetters('taigaCredentialStore', ["getAuthToken", "getUserId"]),
        },
        methods: {
            isFileUploaded: function () {
                if (this.files === null || this.fiber.empty || this.files.length != 1)
                    return false;
                return true;
            },
            filterEntityList: function () {
                let strategyManager = new this.StrategyManager(this.caller.name)
                let strategy = strategyManager.strategy
                if (this.filterText === null) {
                    this.EntityList = strategy.getEntityList()
                } else {
                    this.EntityList = strategy.getEntityList.filter(name =>
                        name.toLowerCase().includes(this.filterText.toLowerCase())
                    )
                }
            },
            getEntitiesFromFile: function () {
                console.log("getting entity data from file")
                let strategyManager = new this.StrategyManager(this.caller.name)
                let strategy = strategyManager.strategy
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
                                vueThis.entityList.push(line[0])
                            }
                            strategy.setEntityList(vueThis.entityList) // update central state
                            vueThis.gettingData = false; // hide progress circle
                        }
                    }
                    reader.readAsText(this.files);
                }
            },
            getEntitiesFromSource: function () {
                console.log("getting entity data from Source")
                let strategyManager = new this.StrategyManager(this.caller.name)
                let strategy = strategyManager.strategy
                this.performPreFetchSteps()
                let vueThis = this;
                if (this.caller.name === "github") {
                    githubService.getRepositoriesFromGitHub(this.getToken, this.getUsername)
                        .then(response => {
                            vueThis.entityList = this.extractRepositoryData(response.data)
                            vueThis.gettingData = false; // hide progress circle
                            strategy.setEntityList(vueThis.entityList) // update central state
                        }).catch(error => {
                        console.log(error)
                        vueThis.gettingData = false; // hide progress circle
                    })
                } else if (this.caller.name === "taiga") {
                    taigaService.getBoardList(this.getUserId, this.getAuthToken)
                        .then(response => {
                            vueThis.entityList = this.extractBoardData(response.data)
                            vueThis.gettingData = false; // hide progress circle
                            strategy.setEntityList(vueThis.entityList) // update central state
                        }).catch(error => {
                        console.log(error)
                        vueThis.gettingData = false; // hide progress circle
                    })
                }
            },
            extractRepositoryData: function (repositoryList) {
                let repoNames = [];
                for (let repo of repositoryList) {
                    repoNames.push(repo.name);
                }
                return repoNames;
            },
            extractBoardData: function (boardList) {
                let boardNames = [];
                for (let board of boardList) {
                    boardNames.push(board.name);
                }
                return boardNames;
            },
            performPreFetchSteps: function () {
                let strategyManager = new this.StrategyManager(this.caller.name)
                let strategy = strategyManager.strategy
                this.entityList = []
                strategy.setEntityList(this.entityList) // update central state
                // disable 'Next' every time repositories are reloaded
                this.verified = false;
                strategy.setVerified(this.verified)
                this.gettingData = true; // display progress circle
            },
        }
    }
</script>
