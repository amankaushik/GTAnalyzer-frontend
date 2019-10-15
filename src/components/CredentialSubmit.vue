<template>
    <form>
        <v-text-field
                v-model="username"
                :error-messages="usernameErrors"
                label="Username"
                required
        ></v-text-field>
        <v-text-field
                v-model="token"
                :error-messages="tokenErrors"
                :type="'password'"
                label="Token/Password"
                required
        ></v-text-field>
        <v-btn class="mr-4" @click="submit">Submit</v-btn>
        <v-btn @click="clear">Clear</v-btn>
    </form>
</template>

<script>
    import {validationMixin} from 'vuelidate'
    import {required} from 'vuelidate/lib/validators'
    import {mapActions} from 'vuex';
    import githubService from "@/services/githubService";
    import taigaService from "@/services/taigaService";

    export default {
        name: "CredentialSubmit",
        mixins: [validationMixin],
        validations: {
            username: {required},
            token: {required},
        },
        props: {caller: Object},
        data: () => ({
            username: '',
            token: '',
            verified: false
        }),
        computed: {
            usernameErrors() {
                const errors = []
                if (!this.$v.username.$dirty) return errors
                !this.$v.username.required && errors.push('Username is required.')
                return errors
            },
            tokenErrors() {
                const errors = []
                if (!this.$v.token.$dirty) return errors
                !this.$v.token.required && errors.push('Token/Password is required.')
                return errors
            }
        },
        methods: {
            ...mapActions('githubCredentialStore',
                ['setToken', 'setUsername', 'setVerified'],
            ),
            ...mapActions('taigaCredentialStore',
                {setAuthToken: "setAuthToken", setPassword: "setPassword",
                    setUserId: "setUserId", setTaigaUsername: "setUsername", setTaigaVerified:  "setVerified"}),
            submit() {
                this.verified = false;
                this.$v.$touch()
                if (!this.$v.$invalid) {
                    if (this.caller.name === "github") {
                        this.setToken(this.token);
                        this.setUsername(this.username);
                        this.performFlightCheck();
                    } else if (this.caller.name === "taiga") {
                        this.setPassword(this.token);
                        this.setTaigaUsername(this.username);
                        this.getAuthToken()
                    } else {
                        console.log("Invalid Caller!")
                    }
                }
            },
            clear() {
                this.$v.$reset()
                this.username = ''
                this.token = ''
            },
            performFlightCheck() {
                console.log("performing flight checks")
                githubService.performFlightCheck(this.token, this.username)
                    .then(response => {
                        this.verified = true;
                        this.setVerified(this.verified)
                    }).catch(error => {
                        console.log(error);
                })
            },
            getAuthToken() {
                taigaService.getAuthToken(this.username, this.token)
                    .then(response => {
                        this.verified = true;
                        this.setAuthToken(response.data.auth_token);
                        this.setTaigaVerified(this.verified);
                    }).catch(error => {
                        console.log(error);
                })
            }
        }
    }
</script>

