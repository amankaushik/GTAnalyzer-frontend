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
                <v-list-item v-for="item of items" v-bind:key="item.itemTitleString"
                             @click="toggleComponent(item.toggleID)">
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
            <v-toolbar-title>GT Analyzer - {{activeComponent.name}}</v-toolbar-title>
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
    import GitHubAnalyze from "@/components/GitHubAnalyze";
    import GitHubCreate from "@/components/GitHubCreate";
    import GitHubVisualize from "@/components/GitHubVisualize";
    import TaigaAnalyze from "@/components/TaigaAnalyze";
    import TaigaCreate from "@/components/TaigaCreate";
    import TaigaVisualize from "@/components/TaigaVisualize";

    export default {
        name: "landing",
        props: {
            source: String,
        },
        data: function () {
            return {
                drawer: null,
                defaultComponent: GitHubAnalyze,
                activeComponent: GitHubAnalyze, // component to load on page load
                activeComponentID: -1,
                activeComponentIsGitHub: true,
                items: [
                    {
                        toggleID: 101,
                        itemTitleString: "GitHub - Analyze",
                        tooltipString: "Perform New Analysis on GitHub Repositories",
                        component: GitHubAnalyze
                    },
                    {
                        toggleID: 102,
                        itemTitleString: "GitHub - Visualize",
                        tooltipString: "Visualize old Analyses from File",
                        component: GitHubVisualize

                    },
                    {
                        toggleID: 103,
                        itemTitleString: "GitHub - Create",
                        tooltipString: "Creat new GitHub Repositories from File",
                        component: GitHubCreate
                    },
                    {
                        toggleID: 201,
                        itemTitleString: "Taiga - Analyze",
                        tooltipString: "Perform New Analysis on Taiga Boards",
                        component: TaigaAnalyze
                    },
                    {
                        toggleID: 202,
                        itemTitleString: "Taiga - Visualize",
                        tooltipString: "Visualize old Analyses from File",
                        component: TaigaVisualize
                    },
                    {
                        toggleID: 203,
                        itemTitleString: "Taiga - Create",
                        tooltipString: "Creat new Taiga Boards from File",
                        component: TaigaCreate
                    }
                ]
            }
        },
        methods: {
            toggleComponent: function (source) {
                if (source === -1)
                    return this.defaultComponent;
                this.getComponentFromID(source);
            },
            getComponentFromID(id) {
                for (let item of this.items) {
                    if (item.toggleID === id) {
                        this.activeComponent = item.component;
                        return;
                    }
                }
                this.activeComponent = this.defaultComponent;
            }
        }
    }
</script>
