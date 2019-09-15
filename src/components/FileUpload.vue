<template>

</template>

<script>
    import {mapActions} from 'vuex';

    export default {
        name: "FileUpload",
        props: {buttonText: String},
        data: function () {
            return {
                files: [] // single file upload only
            }
        },
        methods: {
            ...mapActions('centralStore', ['setUploadedFileContent', 'setUploadedFile']),
            isFileUploaded: function () {
                if (this.files === null || this.fiber.empty || this.files.length != 1)
                    return false;
                return true;
            },
            storeDataFromUploadedFile: function () {
                this.setUploadedFileContent(null); // Reset central state whenever a new file is uploaded
                this.setUploadedFile(null); // Reset central state whenever a new file is uploaded
                let vueThis = this
                if (this.files && this.files.length != 0) {
                    this.setUploadedFile(this.files)
                    const reader = new FileReader();
                    reader.onloadend = function (event) {
                        if (event.target.readyState === FileReader.DONE) {
                            vueThis.setUploadedFileContent(event.target.result);
                        }
                    }
                    reader.readAsText(this.files);
                }
            }
        }
    }
</script>
