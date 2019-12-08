<template>
    <v-container>
        <file-upload button-text="Load Data Dump" @uploadDone="getFileData"></file-upload>
        <render-analysis :meta="meta" v-if="loaded"></render-analysis>
    </v-container>
</template>

<script>
    import FileUpload from "@/components/common/FileUpload";
    import {mapGetters} from "vuex";
    import RenderAnalysis from "@/components/github/RenderGHAnalysis";

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
        components: {FileUpload, RenderAnalysis},
        computed: {
            ...mapGetters('centralStore', ['getUploadedFileContent']),
        },
        methods: {
            getFileData: function (eventData) {
                this.fileContent = this.getUploadedFileContent;
                // no processing required over the raw file content provided
                this.meta.data = this.fileContent;
                // this now only contain branch names as keys
                this.meta.renderData = this.prepDataForRender(this.meta.data);
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
