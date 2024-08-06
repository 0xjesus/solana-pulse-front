// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    css: [
		'~/assets/styles/main.scss',
	],
    modules: [
        'nuxt-icons',
        'nuxt-swiper',
        'nuxt-svgo',
        '@pinia/nuxt',
    ],
    imports: {
        dirs: [
            'stores',
        ],
    },

    runtimeConfig: {
        public: {
            baseURL: process.env.BASE_URL || 'http://localhost:1337',
            appURL: process.env.APP_URL || 'http://localhost:3000',
        },
    },
    vite: {
        css: {
            preprocessorOptions: {
                sass: {
                    additionalData: '@import "~/assets/styles/variables.sass"\nbody\n\tmargin: 0',
                },
            },
        },
    },

})
