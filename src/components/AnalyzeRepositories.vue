<template>
    <div>
        {{names}}
        {{selected}}
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    export default {
        name: "AnalyzeRepositories",
        computed: {
            ...mapGetters('repositoryDataStore', ['getRepositoryList', 'getSelectedRepositories']),
            names: function () {
                return this.getRepositoryList
            },
            selected: function () {
                return this.getSelectedRepositories
            }
        },
    }
</script>
