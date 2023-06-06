<script setup>
import { ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import CoreServices from '../core'
import Notification from './AlertNotification.component.vue'

const email = ref('')
const password = ref('')

const validateEmail = yup.string().required().email()
const validatePassword = yup.string().min(6).required()

async function logIn() {
  await CoreServices.logIn({ email: email.value, password: password.value })
}
</script>

<template>
  <div class="container w-screen">
    <div class="flex flex-col flex-grow max-h-screen">
      <Form id="loginForm" @submit="logIn" class="ml-[40%] h-1/4">
        <div>
          <div>
            <Field
              v-model="email"
              :validate-on-input="true"
              class="bg-base-300 text-base-content input input-bordered w-full max-w-xs"
              type="email"
              name="email"
              :rules="validateEmail"
            />
            <ErrorMessage name="email" as="div" />
          </div>
          <div class="mt-10">
            <Field
              v-model="password"
              :validate-on-input="true"
              class="bg-base-300 text-base-content input input-bordered w-full max-w-xs"
              type="password"
              name="password"
              :rules="validatePassword"
            />
            <ErrorMessage name="password" as="div" class="text-warning" />
          </div>
        </div>
        <div class="flex items-center">
          <button class="btn mt-5" type="submit">Log In</button>
          <router-link to="/sign-up" class="ml-5">Register now</router-link>
        </div>
      </Form>
      <Notification />
    </div>
  </div>
</template>
