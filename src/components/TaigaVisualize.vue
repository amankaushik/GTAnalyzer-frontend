<template>
    <v-container>
        <file-upload button-text="Load Data Dump" @uploadDone="getFileData"></file-upload>
        <render-t-g-analysis v-if="loaded"></render-t-g-analysis>
    </v-container>
</template>
<script>
    import FileUpload from "@/components/FileUpload";
    import RenderTGAnalysis from "@/components/RenderTGAnalysis";
    import {mapGetters} from "vuex";

    export default {
        name: "TaigaVisualize",
        data() {
            return {
                fileContent: null,
                loaded: false
            }
        },
        components: {FileUpload, RenderTGAnalysis},
        computed: {
            ...mapGetters('centralStore', ['getUploadedFileContent']),
        },
        methods: {
            getFileData: function (eventData) {
                this.fileContent = this.getUploadedFileContent;
                // no processing required over the raw file content provided
                // this.meta.data = this.fileContent;
                // this now only contain branch names as keys
                // this.meta.renderData = this.prepDataForRender(this.meta.data);
                this.loaded = true;
            },
            prepDataForRender: function (data) {
                let localData = JSON.parse(JSON.stringify(data));
                // for each repository in the response
                for (let source of Object.keys(localData)) {
                    // remove the "pr_details", "start_date" and "end_date" keys
                    delete localData[source]["pr_details"];
                    delete localData[source]["start_date"];
                    delete localData[source]["end_date"];
                }
                return localData;
            }
        }
    }
</script>
