<script setup>
import { ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import CoreServices from '../core'
import Notification from './AlertNotification.component.vue'

import { useNotificationStore } from '../stores/notification'

const notificationStore = useNotificationStore()

const userConfig = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

const validatorConfig = {
  requiredString: yup.string().required(),
  validateEmail: yup.string().required().email(),
  validatePassword: yup.string().min(6).required()
}

async function signUp() {
  if (
    !userConfig.value.firstName ||
    !userConfig.value.lastName ||
    !userConfig.value.email ||
    !userConfig.value.password
  ) {
    notificationStore.ADD({
      title: 'Please fill all fields'
    })

    return
  }

  await CoreServices.register({
    firstName: userConfig.value.firstName,
    lastName: userConfig.value.lastName,
    email: userConfig.value.email,
    password: userConfig.value.password
  })
}
</script>

<template>
  <div class="container w-screen">
    <div class="flex flex-col flex-grow max-h-screen">
      <Form id="loginForm" @submit.prevent="signUp" class="ml-[40%] h-1/4">
        <div>
          <div>
            <p>First name</p>
            <Field
              v-model="userConfig.firstName"
              :validate-on-input="true"
              class="bg-base-300 text-base-content input input-bordered w-full max-w-xs"
              type="text"
              name="first_name"
              :rules="validatorConfig.requiredString"
            />
            <ErrorMessage name="email" as="div" class="text-warning" />
          </div>
          <div class="mt-10">
            <p>Last name</p>
            <Field
              v-model="userConfig.lastName"
              :validate-on-input="true"
              class="bg-base-300 text-base-content input input-bordered w-full max-w-xs"
              type="text"
              name="last_name"
              :rules="validatorConfig.validateEmail"
            />
            <ErrorMessage name="email" as="div" class="text-warning" />
          </div>
          <div class="mt-10">
            <p>Email</p>
            <Field
              v-model="userConfig.email"
              :validate-on-input="true"
              class="bg-base-300 text-base-content input input-bordered w-full max-w-xs"
              type="email"
              name="email"
              :rules="validatorConfig.validateEmail"
            />
            <ErrorMessage name="email" as="div" class="text-warning" />
          </div>
          <div class="mt-10">
            <p>Password</p>
            <Field
              v-model="userConfig.password"
              :validate-on-input="true"
              class="bg-base-300 text-base-content input input-bordered w-full max-w-xs"
              type="password"
              name="password"
              :rules="validatorConfig.validatePassword"
            />
            <ErrorMessage name="password" as="div" class="text-warning" />
          </div>
        </div>
        <button class="btn mt-5" type="submit" @click.prevent="signUp">Sign up</button>
      </Form>
      <Notification />
    </div>
  </div>
</template>
