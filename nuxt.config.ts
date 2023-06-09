// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr:false,
    modules: [
        '@invictus.codes/nuxt-vuetify',
        '@nuxtjs/cloudinary',
      ],

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
