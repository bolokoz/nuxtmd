// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig:{
    mapbox_api: process.env.MAPBOX_API
  },
  ssr:false,
    modules: [
        '@invictus.codes/nuxt-vuetify',
        '@nuxtjs/cloudinary',
        '@nuxtjs/supabase',
        'nuxt-mapbox',
        '@vite-pwa/nuxt',
        '@nuxt/image',
      ],

      image: {
        cloudinary: {
          baseURL: 'https://res.cloudinary.com/boloko/image/upload/'
        }
      }

      mapbox: {
        accessToken: process.env.MAPBOX_API
      },

      vuetify: {
        /* vuetify options */

        moduleOptions: {
          /* nuxt-vuetify module options */
          treeshaking: true,
          useIconCDN: true,
          /* vite-plugin-vuetify options */
        }
      },

      app: {
        head: {
          script: [
            {
                src: 'https://widget.cloudinary.com/v2.0/global/all.js',
            },
        ],
        },
      }
})
