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
                  <v-btn @click="createRestaurant()">create {{ restSearch }}</v-btn>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col
            v-if="newRestaurant"
          cols="12"
          md="4"
        >
        <v-autocomplete :loading="pending" label="Cidade" auto-select-first :items="[...new Set(reviews.map(d=>d.restaurants?.cidade))]"
                v-model:search.sync="cidadeSearch" chips v-model="cidade">
                <template v-slot:no-data>
                  <v-btn @click="cidade = cidadeSearch">create {{ cidadeSearch }}</v-btn>
                </template>
              </v-autocomplete>

        </v-col>
        
        <v-col cols="12" md="4">


          
          <MapboxMap
          map-id="{ID}"
          style='position:relative;width: 400px; height: 300px;'
          :options="{
            style: 'mapbox://styles/mapbox/light-v11', // style URL
            center: [-68.137343, 45.137451], // starting position
            zoom: 5 // starting zoom
          }"
    />
  </v-col>



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
              <v-select
                :items="obsTemplateOptions"
                v-model="obsTemplateSelected"
                @update:model-value="onSelectObsOptions()"
                label="Templates"
              >

              </v-select>
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
useHead({
  script: [
    {
      src: 'https://widget.cloudinary.com/v2.0/global/all.js',
    },
  ],
})

// import { Client } from '@notionhq/client'
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

// FORM
const restSearch = ref('')
const restaurante = ref('')
const prato = ref('')
const obs_sentimental = ref('')
const obs_tecnica = ref('')
const notaSentimental = ref(1)
const labels = ref(['ruim', 'bom', 'otimo'])
const notaTecnica = ref(1)
const images = ref([])


// SETTINGS
const newRestaurant = ref(false)
const cidade = ref('')
// const valid = ref(true)


// SUPABASE
const client = useSupabaseClient()
const { data: reviews, pending, error } = await useAsyncData('reviews', async () => {
  const {data} = await client.from('reviews').select('prato, restaurants (nome, cidade)')
  
  return data
})

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

//TEMPLATES
const obsTemplateOptions= ['parmegiana v1', 'lanche v1']
const obsTemplateSelected = ref('')

function onSelectObsOptions(){
  switch (obsTemplateSelected.value) {
    case 'parmegiana v1':
      obs_tecnica.value = `
        Molho: /3
        Crosta: /3
        Carne: /3
      `
      break;
    case 'lanche v1':
      obs_tecnica.value = `
        Pao: /3
        Embalagem: /3
        Carne: /3
      `
      break;
  
  }
}


// MD FILES
const mdtext = computed(() => {
  const yaml = `--- 
  ` +
    `prato:${prato.value} \r\n` +
    `images:${images.value} \r\n` +
    `nota:${notaSentimental.value} \\n
  ---`
  const text = obs_tecnica.value

  return yaml + text
})

// CRIAR NOVO RESTAURANTE
function createRestaurant() {
  newRestaurant.value = true
  restaurante.value = restSearch.value
  //TODO ADICIONAR LATLNG 
}
</script>
