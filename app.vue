<template>
  <v-app theme="dark">
    <v-main>

      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field v-model="date" type="date" label="Data da refeicao" required></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="prato" label="Prato" required></v-text-field>
          </v-col>
          <!-- <v-col cols="12" md="4">
            <v-text-field v-model="restaurante" label="Restaurante" required></v-text-field>
          </v-col> -->
          <v-col cols="12" md="4">
            <v-autocomplete label="Restaurante" auto-select-first

              :items="restaurantsList" v-model:search.sync="restSearch" chips v-model="restaurantId" item-value="id" item-title="nome">
              <template v-slot:no-data>
                <v-btn @click="createRestaurant()">create {{ restSearch }}</v-btn>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col v-if="newRestaurant" cols="12" md="4">
            <v-autocomplete :loading="pending" label="Cidade" auto-select-first
              :items="[...new Set(reviews.map(d => d.restaurants?.cidade))]" v-model:search.sync="cidadeSearch" chips
              v-model="cidade">
              <template v-slot:no-data>
                <v-btn @click="cidade = cidadeSearch">create {{ cidadeSearch }}</v-btn>
              </template>
            </v-autocomplete>

            <MapboxMap map-id="{ID}" style='position:relative;width: 400px; height: 300px;' :options="{
              style: 'mapbox://styles/mapbox/light-v11', // style URL
              center: lnglat, // starting position
              zoom: 5, // starting zoom
            }"
              >
              
              <MapboxGeolocateControl 
                position="top-right" 
                :options="{
                  positionOptions: { enableHighAccuracy: true}
                }"
                @geolocate="(e) => onGeolocate(e)"
              />
              <MapboxDefaultMarker 
                marker-id="Restaurante" 
                :options="{ draggable: true }" 
                :lnglat="lnglat"        
                la  
                @dragend="(e) => onDragEnd(e)"
                >
                
              </MapboxDefaultMarker>
            </MapboxMap>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="valor" label="valor" required prefix="R$" type="number"></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="tipo"
              label="Tipo"
              :items="['lanche', 'carnes', 'entradas', 'marmita', 'peixes', 'self-service', 'sushi', 'pizza', 'parmegiana', 'doces']"
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="periodo"
              label="periodo"
              :items="['café da manhã', 'almoço', 'janta']"
            >
            </v-select>
            </v-col>
          <v-col cols="12" md="4">
            <v-switch
              v-model="delivery"
              label="delivery"
            >
            </v-switch>
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
            <v-select :items="obsTemplateOptions" v-model="obsTemplateSelected" @update:model-value="onSelectObsOptions()"
              label="Templates">

            </v-select>
            <v-textarea v-model="obs_tecnico" label="Obs tecnica" required></v-textarea>
          </v-col>


          <v-col cols="12" md="4">
            <!-- <v-file-input show-size multiple chips counter label="File input"></v-file-input> -->

            <button @click="showUploadWidget()" id="upload_widget" class="cloudinary-button">Upload files</button>
            <nuxt-picture v-for="image in images" :src="image"></nuxt-picture>
          </v-col>


          <v-btn type="submit" block class="mt-2" @click="addReview()" color="primary">Submit</v-btn>
        </v-row>



      </v-container>
      <p>
        {{ mdtext }}

      </p>

      <v-snackbar
      v-model="snackbar"
      color="primary"
      outlined
    >
      Enviado!

      <template v-slot:actions>
        <v-btn
          color="pink"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    </v-main>
  </v-app>
</template>

<style>
</style>

<script setup>
useHead({
  script: [
    {
      src: 'https://widget.cloudinary.com/v2.0/global/all.js',
    },
    // {
    //   src: 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js',
    // },
  ],
})

// const config = useRuntimeConfig()

// mapboxgl.accessToken = config.public.mapbox_api;
// const map = new mapboxgl.Map({
//         container: 'map',
//         // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
//         style: 'mapbox://styles/mapbox/streets-v12',
//         center: [0, 0],
//         zoom: 2
//     });

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
const restaurantId = ref('')
const date = ref('')
const prato = ref('')
const valor = ref(10)
const obs_sentimental = ref('')
const obs_tecnico = ref('')
const notaSentimental = ref(1)
const notaTecnica = ref(1)
const periodo = ref('')
const delivery = ref(false)
const tipo = ref('')
const images = ref([])

function resetForm(){
  restaurantId.value = ''
  date.value = ''
  prato.value = ''
  valor.value = 10
  obs_sentimental.value = ''
  obs_tecnico.value = ''
  notaSentimental.value = 1
  notaTecnica.value = 1
  periodo.value = ''
  delivery.value = false
  tipo.value = ''
  images.value = []
}


// SETTINGS

const labels = ref(['ruim', 'bom', 'otimo'])
const restTipoSearch = ref('')
const restSearch = ref('')
const newRestaurant = ref(false)
const cidade = ref('')
const lnglat = ref([12.550343, 55.665957]);
// const valid = ref(true)
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')


//MAPBOX
function onDragEnd(e) {
  console.log('ON DRAGENd')
  console.log('e')
}

function onGeolocate(e){
  console.log('ON GEOLOCATE')
  console.log(e)
}

const widget = cloudinary.createUploadWidget({
  cloud_name: 'boloko', upload_preset: 'nuxtmd', sources: [
    "local",
    "camera",
    "unsplash"
  ],
  maxImageWidth: 800, //Scales the image down to a width of 2000 pixels before uploading
  defaultSource: "local",
  multiple: true,
  context: { alt: "user_uploaded" }, //add the given context data to the uploaded files
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
const obsTemplateOptions = ['parmegiana v1', 'lanche v1']
const obsTemplateSelected = ref('')

function onSelectObsOptions() {
  switch (obsTemplateSelected.value) {
    case 'parmegiana v1':
      obs_tecnico.value = `
        Molho: /3
        Crosta: /3
        Carne: /3
      `
      break;
    case 'lanche v1':
      obs_tecnico.value = `
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
  const text = obs_tecnico.value

  return yaml + text
})

// CRIAR NOVO RESTAURANTE
function createRestaurant() {
  newRestaurant.value = true
  restaurantId.value = restSearch.value
  //TODO ADICIONAR lnglat 
}

// SUPABASE
const client = useSupabaseClient()
const { data: reviews, pending, error } = await useAsyncData('reviews', async () => {
  const { data } = await client.from('reviews').select('prato, restaurants (id, nome, cidade)')

  return data
})

const {data: restaurantsList} = await client.from('restaurants').select('*')

async function addReview() {
  if (newRestaurant.value) {
    const restaurantId = addNewRestaurant()
  }

  loading.value = true

  const { data } = await client.from('reviews')
    .upsert({
      restaurant_id: restaurantId.value,
      prato: prato.value,
      nota_sentimental: notaSentimental.value,
      nota_tecnica: notaTecnica.value,
      valor: valor.value,
      photos: images.value,
      obs_sentimental: obs_sentimental.value,
      tipo: tipo.value,
      delivery: delivery.value,
      periodo: periodo.value
    })
  console.log('insert', data)
  resetForm()
  snackbar.value = true
  loading.value = false
}

async function addNewRestaurant() {
  loading.value = true
  const { data } = await client.from('restaurants')
    .upsert({
      nome: restaurante.value.trim(),
      cidade: cidade.value,
      lnglat: lnglat.value
    }).select()
  loading.value = false
  console.log(data)
  return data
}
</script>
