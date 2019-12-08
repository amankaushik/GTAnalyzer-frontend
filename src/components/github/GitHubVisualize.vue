<template>
    <v-container>
        <file-upload button-text="Load Data Dump" @uploadDone="getFileData"></file-upload>
        <render-g-h-analysis :meta="prepareRenderPropData()" v-if="loaded"></render-g-h-analysis>
    </v-container>
</template>

<script>
    import FileUpload from "@/components/common/FileUpload";
    import {mapGetters} from "vuex";
    import RenderGHAnalysis from "@/components/github/RenderGHAnalysis";
    import {strategyMixin} from "@/mixins/strategyMixin";

    export default {
        data() {
            return {
                fileContent: null,
                meta: {
                    userIcon: "mdi-github-circle",
                    entityIcon: "mdi-source-branch",
                    sourceIcon: "mdi-source-repository-multiple",
                    data: {},
                    renderData: {}
                },
                loaded: false
            }
        },
        name: "GitHubVisualize",
        components: {FileUpload, RenderGHAnalysis},
        computed: {
            ...mapGetters('centralStore', ['getUploadedFileContent']),
        },
        mixins: [strategyMixin],
        methods: {
            getFileData: function (eventData) {
                this.fileContent = this.getUploadedFileContent;
                this.loaded = true;
            },
            prepareRenderPropData: function () {
                let strategyManager = new this.StrategyManager(process.env.VUE_APP_CALLER_GITHUB);
                let strategy = strategyManager.strategy;
                return  strategy.prepareRenderPropData(this.fileContent);
            }
        }
    }
</script>
