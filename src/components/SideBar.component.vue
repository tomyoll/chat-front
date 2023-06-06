<template>
  <div class="overflow-y-auto box-border bottom-0 top-0 block z-10 w-72 fixed bg-base-200">
    <div class="overflow-x-auto overflow-y-auto h-full w-full">
      <div class="w-full box-border min-h-16">
        <div class="block pt-2">
          <div class="p-0 w-full h-12 block">
            <select data-choose-theme class="select w-full bg-primary text-primary-content">
              <option disabled selected>Change theme</option>
              <option class="bg-secondary" value="dark">Default</option>
              <option class="bg-secondary" value="light">light</option>
              <option class="bg-secondary" value="dark">dark</option>
              <option class="bg-secondary" value="cupcake">cupcake</option>
              <option class="bg-secondary" value="bumblebee">bumblebee</option>
              <option class="bg-secondary" value="emerald">emerald</option>
              <option class="bg-secondary" value="corporate">corporate</option>
              <option class="bg-secondary" value="synthwave">synthwave</option>
              <option class="bg-secondary" value="retro">retro</option>
              <option class="bg-secondary" value="cyberpunk">cyberpunk</option>
              <option class="bg-secondary" value="valentine">valentine</option>
              <option class="bg-secondary" value="halloween">halloween</option>
              <option class="bg-secondary" value="garden">garden</option>
              <option class="bg-secondary" value="forest">forest</option>
              <option class="bg-secondary" value="aqua">aqua</option>
              <option class="bg-secondary" value="lofi">lofi</option>
              <option class="bg-secondary" value="pastel">pastel</option>
              <option class="bg-secondary" value="fantasy">fantasy</option>
              <option class="bg-secondary" value="wireframe">wireframe</option>
              <option class="bg-secondary" value="black">black</option>
              <option class="bg-secondary" value="luxury">luxury</option>
              <option class="bg-secondary" value="dracula">dracula</option>
              <option class="bg-secondary" value="cmyk">cmyk</option>
              <option class="bg-secondary" value="autumn">autumn</option>
              <option class="bg-secondary" value="business">business</option>
              <option class="bg-secondary" value="acid">acid</option>
              <option class="bg-secondary" value="lemonade">lemonade</option>
              <option class="bg-secondary" value="night">night</option>
              <option class="bg-secondary" value="coffee">coffee</option>
              <option class="bg-secondary" value="winter">winter</option>
            </select>
            <button
              v-if="isAuthorized"
              class="btn bg-primary text-primary-content w-full mt-2"
              @click="
                () => {
                  store.LOGOUT()
                }
              "
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const store = useAuthStore()

function isAuthorized() {
  return store.IS_AUTHORIZED
}
</script>
