<template>
    <div>
        <v-navigation-drawer
                v-model="drawer"
                app
                clipped
                class="deep-purple accent-2"
                expand-on-hover
        >
            <v-list dense>
                <v-list-item v-for="item of items" v-bind:key="item.itemTitleString" @click="toggleComponent(item.toggleString)">
                    <v-list-item-action>
                        <v-icon>mdi-view-dashboard</v-icon>
                    </v-list-item-action>
                    <v-tooltip right>
                        <template v-slot:activator="{ on }">
                            <v-list-item-content v-on="on">
                                <v-list-item-title>{{item.itemTitleString}}</v-list-item-title>
                            </v-list-item-content>
                        </template>
                        <span>{{item.tooltipString}}</span>
                    </v-tooltip>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar
                app
                clipped-left
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>GT Analyzer</v-toolbar-title>
        </v-app-bar>

        <v-content>
            <v-container
                    class="fill-height"
                    fluid
            >
                <v-row
                        align="center"
                        justify="center"
                >
                    <v-col>
                        <keep-alive>
                            <component v-bind:is="activeComponent"></component>
                        </keep-alive>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </div>
</template>

<script>
    import GitHub from "@/components/GitHub";
    import Taiga from "@/components/Taiga";

    export default {
        name: "landing",
        props: {
            source: String,
        },
        data: function () {
            return {
                drawer: null,
                activeComponent: GitHub,
                activeComponentIsGitHub: true,
                items: [
                    {
                        toggleString: 'github',
                        itemTitleString: "GitHub - Analyze",
                        tooltipString: "Perform New Analysis on GitHub Repositories"
                    },
                    {
                        toggleString: "github",
                        itemTitleString: "GitHub - Visualize",
                        tooltipString: "Visualize old Analyses from File"
                    },
                    {
                        toggleString: "github",
                        itemTitleString: "GitHub - Create",
                        tooltipString: "Creat new GitHub Repositories from File"
                    },
                    {
                        toggleString: "taiga",
                        itemTitleString: "Taiga - Analyze",
                        tooltipString: "Perform New Analysis on Taiga Boards"
                    },
                    {
                        toggleString: "taiga",
                        itemTitleString: "Taiga - Visualize",
                        tooltipString: "Visualize old Analyses from File"
                    },
                    {
                        toggleString: "taiga",
                        itemTitleString: "Taiga - Create",
                        tooltipString: "Creat new Taiga Boards from File"
                    }
                ]
            }
        },
        methods: {
            toggleComponent: function (source) {
                if (source !== 'github' && this.activeComponentIsGitHub) {
                    this.activeComponentIsGitHub = false;
                    this.activeComponent = Taiga;
                } else if (source === "github" && !(this.activeComponentIsGitHub)) {
                    this.activeComponentIsGitHub = true;
                    this.activeComponent = GitHub;
                }
            }
        },
    }
</script>k
