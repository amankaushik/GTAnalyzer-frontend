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
                    <file-upload button-text="Submit" @uploadDone="getEntitiesFromFile"></file-upload>
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
                <v-chip filter outlined color="teal" v-for="(entityName, index) of entityList"
                        v-bind:key="index">
                    {{entityName}}
                </v-chip>
            </v-chip-group>
        </div>
    </div>

</template>

<script>
    import {strategyMixin} from "@/mixins/strategyMixin";
    import {csvFileParserMixin} from "@/mixins/csvFileParserMixin";
    import FileUpload from "@/components/common/FileUpload";
    import {mapGetters} from "vuex";

    export default {
        name: "Lister",
        components: {FileUpload},
        data: function () {
            return {
                selectedEntities: [],
                entityList: [],
                files: [],
                verified: false,
                filterText: "",
                fileContent: [],
                gettingData: false
            }
        },
        mixins: [strategyMixin, csvFileParserMixin],
        props: {caller: Object},
        computed: {
            ...mapGetters('centralStore', ['getUploadedFileContent']),
        },
        watch: {
            // Enable/Disable "Next" button and update the central state of selectedRepositories
            selectedEntities: function () {
                let strategyManager = new this.StrategyManager(this.caller.name);
                let strategy = strategyManager.strategy;
                let selectedEntityNames = [];
                // selectedEntities hold the index of the selected chip
                for (let index of this.selectedEntities) {
                    selectedEntityNames.push(strategy.getEntityList()[index]);
                }
                strategy.setSelectedEntities(selectedEntityNames);
                this.verified = this.selectedEntities.length;
                strategy.setVerified(this.verified)
            },
        },
        methods: {
            filterEntityList: function () {
                let strategyManager = new this.StrategyManager(this.caller.name);
                let strategy = strategyManager.strategy;
                if (this.filterText === null) {
                    this.entityList = strategy.getEntityList()
                } else {
                    this.entityList = strategy.getEntityList().filter(name =>
                        name.toLowerCase().includes(this.filterText.toLowerCase())
                    )
                }
            },
            getEntitiesFromFile: function () {
                let strategyManager = new this.StrategyManager(this.caller.name);
                let strategy = strategyManager.strategy;
                this.performPreFetchSteps(strategy, false);
                this.fileContent = this.getUploadedFileContent;
                this.fileContent = this.parseCSVFile(this.fileContent, 3, 1);
                for (let line of this.fileContent) {
                    this.entityList.push(line[0])
                }
                strategy.setEntityList(this.entityList); // update central state
            },
            getEntitiesFromSource: function () {
                let strategyManager = new this.StrategyManager(this.caller.name);
                let strategy = strategyManager.strategy;
                this.performPreFetchSteps(strategy, true);
                let vueThis = this;
                vueThis.entityList = [];
                strategy.serviceGetter(strategy.getUser(), strategy.getToken())
                    .then(response => {
                        vueThis.entityList = this.extractEntityData(response.data, strategy.entityKeyName);
                        vueThis.gettingData = false; // hide progress circle
                        strategy.setEntityList(vueThis.entityList) // update central state
                    }).catch(error => {
                    console.log(error);
                    vueThis.gettingData = false; // hide progress circle
                })
            },
            extractEntityData: function (entityList, keyName) {
                let entityNames = [];
                for (let entity of entityList) {
                    entityNames.push(entity[keyName]);
                }
                return entityNames;
            },
            performPreFetchSteps: function (strategy, gettingData) {
                this.entityList = [];
                strategy.setEntityList(this.entityList); // update central state
                // disable 'Next' every time repositories are reloaded
                this.verified = false;
                strategy.setVerified(this.verified);
                this.gettingData = gettingData; // display progress circle
            },
        }
    }
</script>
