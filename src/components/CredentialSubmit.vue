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
                label="Token"
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

    export default {
        name: "CredentialSubmit",
        mixins: [validationMixin],
        validations: {
            username: {required},
            token: {required},
        },
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
                !this.$v.token.required && errors.push('Token is required.')
                return errors
            }
        },
        methods: {
            ...mapActions('credentialStore',
                ['setToken', 'setUsername', 'setVerified']
            ),
            submit() {
                this.verified = false;
                this.$v.$touch()
                if (!this.$v.$invalid) {
                    this.setToken(this.token);
                    this.setUsername(this.username);
                    this.performFlightCheck();
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
                        console.log(error)
                })
            }
        }
    }
</script>

