<template>
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
                            accept=".csv,.json"
                    >
                    </v-file-input>
                    <v-divider vertical class="mx-2"></v-divider>
                    <v-btn :disabled="disableButton()" color="success"
                           @click="storeDataFromUploadedFile">
                        {{buttonText}}
                    </v-btn>
                </v-row>
            </v-container>
        </v-form>
        <div v-if="gettingData">
            <v-progress-circular
                    indeterminate
                    color="purple"
            ></v-progress-circular>
        </div>
    </v-col>
</template>

<script>
    import {mapActions} from 'vuex';

    export default {
        name: "FileUpload",
        props: {buttonText: String},
        data: function () {
            return {
                gettingData: false,
                files: [], // single file upload only
                csv: "text/csv",
                json: "application/json"
            }
        },
        methods: {
            ...mapActions('centralStore', ['setUploadedFileContent', 'setUploadedFile']),
            disableButton: function () {
                // file selected then deselected - disable button
                if (this.files === null || this.files === undefined)
                    return true;
                // files is an empty array - disable button
                if (this.files.length !== undefined && this.files.length === 0)
                    return true;
                // files is a File Object - enable button
                if (this.files.length === undefined && this.files.size >= 0)
                    return false;
            },
            storeDataFromUploadedFile: function () {
                this.gettingData = true;
                this.setUploadedFileContent(null); // Reset central state whenever a new file is uploaded
                this.setUploadedFile([]); // Reset central state whenever a new file is uploaded
                let vueThis = this;
                if (this.files.size >= 0) {
                    this.setUploadedFile(this.files);
                    const reader = new FileReader();
                    reader.onloadend = function (event) {
                        if (event.target.readyState === FileReader.DONE) {
                            let fileContent = event.target.result;
                            vueThis.gettingData = false;
                            if (vueThis.files.type === vueThis.csv) {
                                vueThis.setUploadedFileContent(fileContent);
                            } else if (vueThis.files.type === vueThis.json) {
                                let jsonFileContent = {};
                                eval("jsonFileContent =" + fileContent);
                                vueThis.setUploadedFileContent(jsonFileContent);
                            } else {
                                console.log("Incorrect file format!");
                                vueThis.setUploadedFileContent([]);
                            }
                            vueThis.$emit("uploadDone", true);
                        }
                    };
                    reader.readAsText(this.files, "utf-8");
                }
            }
        }
    }
</script>
