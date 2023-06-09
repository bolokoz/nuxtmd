<template>
  <v-app>
    <v-main>

        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field v-model="prato" label="Prato" required></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="restaurante" label="Restaurante" required></v-text-field>
            </v-col>
            <v-col v-if="!pending" cols="12" md="4">
              <v-autocomplete :loading="pending" label="Restaurante" auto-select-first :items="reviews.map(d=>d.restaurants.nome)"
                v-model:search.sync="restSearch" chips v-model="restaurante">
                <template v-slot:no-data>
                  <v-btn @click="newRestaurant()">create {{ restSearch }}</v-btn>
                </template>
              </v-autocomplete>
            </v-col>

            <!-- <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="restaurante"
            label="Restaurante"
            required
          ></v-text-field>
        </v-col> -->



            <v-col cols="12" md="4">
              <span>Nota sentimental</span>
              <v-rating v-model="notaSentimental" :item-labels="labels" :length="3">
                <template v-slot:item-label="props">
                  <span class="font-weight-black text-caption">
                    {{ props.label }}
                  </span>
                </template>
              </v-rating>
            </v-col>
            <v-col cols="12" md="4">
              <span>Nota tecnica</span>
              <v-rating v-model="notaTecnica" :item-labels="labels" :length="3">
                <template v-slot:item-label="props">
                  <span class="text-caption">
                    {{ props.label }}
                  </span>
                </template>
              </v-rating>
            </v-col>

            <v-col cols="12" md="4">
              <v-textarea v-model="obs_sentimental" label="Obs sentimental" required></v-textarea>
            </v-col>
            <v-col cols="12" md="4">
              <v-textarea v-model="obs_tecnica" label="Obs tecnica" required></v-textarea>
            </v-col>

            
            <v-col cols="12" md="4">
              <!-- <v-file-input show-size multiple chips counter label="File input"></v-file-input> -->
              
              <button @click="showUploadWidget()" id="upload_widget" class="cloudinary-button">Upload files</button>
            </v-col>
            <v-btn type="submit" block class="mt-2">Submit</v-btn>
          </v-row>
          
          
          
        </v-container>
      <p>
        {{ mdtext }}

      </p>
    </v-main>
  </v-app>
</template>

<script setup>
// import { Client } from '@notionhq/client'
useHead({
  script: [
    {
      src: 'https://widget.cloudinary.com/v2.0/global/all.js',
    },
  ],
})

// const notion = new Client({ auth: 'secret_ur0AobNYDDXKMsWBCv7t33VkCNvjN5f5ZuxOWD4de3g' });
// const blockId = 'c7ca4eca35ee4f8ebe2665a7be719c36';

// const { data: restaurantes, pending, error, refresh } = await useAsyncData(
//   'database',
//   () => notion.databases.query({

//     database_id: 'c7ca4eca35ee4f8ebe2665a7be719c36'
//   }),
//   {
//     transform: (restaurantes) => {
//       return restaurantes.results.map(d => d.properties.Restaurante.select?.name)
//     }
//   }
// )
const images = ref([])

const client = useSupabaseClient()
const { data: reviews, pending, error } = await useAsyncData('reviews', async () => {
  const {data} = await client.from('reviews').select('prato, restaurants (nome)')
  
  return data
})
const restaurantOptions = computed(() => {

  return reviews.map(d=> d?.restaurants?.nome)
}
)

console.log(reviews)

const widget = cloudinary.createUploadWidget({
  cloud_name: 'boloko', upload_preset: 'nuxtmd', sources: [
    "local",
    "camera",
    "unsplash"
  ],
  maxImageWidth: 800, //Scales the image down to a width of 2000 pixels before uploading
  defaultSource: "local",
  multiple: true,
  context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
  styles: {
        palette: {
            window: "#000000",
            sourceBg: "#000000",
            windowBorder: "#8E9FBF",
            tabIcon: "#FFFFFF",
            inactiveTabIcon: "#8E9FBF",
            menuIcons: "#2AD9FF",
            link: "#08C0FF",
            action: "#336BFF",
            inProgress: "#00BFFF",
            complete: "#33ff00",
            error: "#EA2727",
            textDark: "#000000",
            textLight: "#FFFFFF"
        },
      },

},
  (error, result) => {
    if (!error && result && result.event === "success") {
      images.value.push(result.info.url)
      console.log("Done! Here is the image info: ", result.info);
    }
  })

function showUploadWidget() {
  //  
  widget.open()
}

// onMounted(() => {
//   if(process.client){
//     const widget = window.cloudinary.createUploadWidget({ cloud_name: 'boloko', upload_preset: 'boloko1' },
//         function (error, result) { console.log(error, result) });
//   }
// })



// const myWidget = process.client.cloudinary.createUploadWidget(
//   {
//     cloudName: cloudName,
//     uploadPreset: uploadPreset,
//     // cropping: true, //add a cropping step
//     // showAdvancedOptions: true,  //add advanced options (public_id and tag)
//     // sources: [ "local", "url"], // restrict the upload sources to URL and local files
//     // multiple: false,  //restrict upload to a single file
//     // folder: "user_images", //upload files to the specified folder
//     // tags: ["users", "profile"], //add the given tags to the uploaded files
//     // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
//     // clientAllowedFormats: ["images"], //restrict uploading to image files only
//     // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
//     // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
//     // theme: "purple", //change to a purple theme
//   },
//   (error, result) => {
//     if (!error && result && result.event === "success") {
//       console.log("Done! Here is the image info: ", result.info);
//       document
//         .getElementById("uploadedimage")
//         .setAttribute("src", result.info.secure_url);
//     }
//   }
// );

// function open(){
// myWidget.open()
// }

// import {Cloudinary} from '@cloudinary/url-gen'
// import { AdvancedImage } from "@cloudinary/vue";
// import { fill } from "@cloudinary/url-gen/actions/resize";

// const cld = new Cloudinary({
//   cloud: {
//     cloudName: 'boloko'
//   }
// })

// const myImg = cld.image("docs/models");
// // Resize to 250 x 250 pixels using the 'fill' crop mode.
// myImg.resize(fill().width(250).height(250));

const restSearch = ref('')
const valid = ref(true)
const restaurante = ref('')
const prato = ref('')
const obs = ref('')
const notaSentimental = ref(1)
const labels = ref(['ruim', 'bom', 'otimo'])
const notaTecnica = ref(1)

const mdtext = computed(() => {
  const yaml = `--- 
  ` +
    `prato:${prato.value} \r\n` +
    `images:${images.value} \r\n` +
    `nota:${notaSentimental.value} \\n
  ---`
  const text = obs.value

  return yaml + text
})

function newRestaurant() {
  restaurante.value = restSearch.value
}
</script>
