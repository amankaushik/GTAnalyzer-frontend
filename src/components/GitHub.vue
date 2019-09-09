<template>
  <div>
    <v-stepper v-model="stepNumber">
      <v-stepper-header>
        <v-stepper-step :complete="stepNumber > 1" step="1">Enter Credentials</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="stepNumber > 2" step="2">Select Repositories</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">Perform Analysis</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card
                  class="mb-12"
                  color="grey lighten-1"
                  height="200px"
          ></v-card>
          <v-btn color="error" @click="stepNumber = decrement(stepNumber)" disabled="stepNumber < 1">Prev</v-btn>
          <v-btn color="success" @click="stepNumber = increment(stepNumber)" :disabled="isVerifiedToNextStep()">Next</v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-card
                  class="mb-12"
                  color="grey lighten-1"
                  height="200px"
          ></v-card>
          <v-btn color="error" @click="stepNumber = decrement(stepNumber)">Prev</v-btn>
          <v-btn color="success" @click="stepNumber = increment(stepNumber)" :disabled="isVerifiedToNextStep()">Next</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card
                  class="mb-12"
                  color="grey lighten-1"
                  height="200px"
          ></v-card>
          <v-btn color="error" @click="stepNumber = decrement(stepNumber)">Prev</v-btn>
          <v-btn color="success" @click="">Analyze</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>

export default {
  name: 'github',
  data: function () {
    return {
      stepNumber: 1,
      maxStepNumber: 3,
      minStepNumber: 1
    }
  },
  methods: {
    increment: function (step) {
      if (step >= this.maxStepNumber)
        return step;
      return step + 1;
    },
    decrement: function (step) {
      if (step <= this.minStepNumber)
        return step
      return step - 1;
    },
    foundValidCredentials: function () {
      return true;
    },
    isVerifiedToNextStep: function () {
      return !(this.foundValidCredentials());
    }
  }
}
</script>
