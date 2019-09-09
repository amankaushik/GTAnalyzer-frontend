<template>
    <div>
        <v-navigation-drawer
                v-model="drawer"
                app
                clipped
        >
            <v-list dense>
                <v-list-item @click="toggleComponent('github')">
                    <v-list-item-action>
                        <v-icon>mdi-view-dashboard</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>GitHub</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="toggleComponent('taiga')">
                    <v-list-item-action>
                        <v-icon>mdi-view-dashboard</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Taiga</v-list-item-title>
                    </v-list-item-content>
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
                activeComponentIsGitHub: true
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
