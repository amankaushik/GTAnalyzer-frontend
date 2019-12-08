<template>
    <v-container>
        <file-upload button-text="Load Data Dump" @uploadDone="getFileData"></file-upload>
        <render-t-g-analysis v-if="loaded" :meta="prepareRenderPropData()"></render-t-g-analysis>
    </v-container>
</template>
<script>
    import FileUpload from "@/components/common/FileUpload";
    import RenderTGAnalysis from "@/components/taiga/RenderTGAnalysis";
    import {mapGetters} from "vuex";
    import {strategyMixin} from "@/mixins/strategyMixin";

    export default {
        name: "TaigaVisualize",
        data() {
            return {
                fileContent: null,
                loaded: false,
                meta: {
                    data: {}
                }
            }
        },
        mixins: [strategyMixin],
        components: {FileUpload, RenderTGAnalysis},
        computed: {
            ...mapGetters('centralStore', ['getUploadedFileContent']),
        },
        methods: {
            getFileData: function (eventData) {
                this.fileContent = this.getUploadedFileContent;
                this.loaded = true;
            },
            prepareRenderPropData: function () {
                let strategyManager = new this.StrategyManager(process.env.VUE_APP_CALLER_TAIGA);
                let strategy = strategyManager.strategy;
                return  strategy.prepareRenderPropData(this.fileContent);
            }
        }
    }
</script>
