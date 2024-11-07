// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/reset.css'],
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate',
    '@nuxt/image',
    'nuxt-security'
  ],
  alias: {
    '@styles': 'C:/Users/ismys/Desktop/ValorantLineupNuxtBun/assets/styles'
  },
  /*  security: {
      strict: true,
      headers: {
        crossOriginResourcePolicy: 'same-origin',
        crossOriginOpenerPolicy: 'same-origin',
        crossOriginEmbedderPolicy: 'credentialless',
        contentSecurityPolicy: {
          'base-uri': ["'none'"],
          'font-src': ["'self'", 'https:', 'data:'],
          'form-action': ["'self'"],
          'frame-ancestors': ["'self'"],
          'img-src': ["'self'", 'data:'],
          'object-src': ["'none'"],
          'script-src-attr': ["'none'"],
          'style-src': ["'self'", 'https:', "'unsafe-inline'"],
          'script-src': ["'self'", 'https:', "'unsafe-inline'", "'strict-dynamic'", "'nonce-{{nonce}}'"],
          'upgrade-insecure-requests': true
        },
        originAgentCluster: '?1',
        referrerPolicy: 'no-referrer',
        strictTransportSecurity: {
          maxAge: 15552000,
          includeSubdomains: true,
        },
        xContentTypeOptions: 'nosniff',
        xDNSPrefetchControl: 'off',
        xDownloadOptions: 'noopen',
        xFrameOptions: 'SAMEORIGIN',
        xPermittedCrossDomainPolicies: 'none',
        xXSSProtection: '1',
      },
      requestSizeLimiter: {
        maxRequestSizeInBytes: 2000000,
        maxUploadFileRequestInBytes: 8000000,
        throwError: true
      },
      rateLimiter: {
        tokensPerInterval: 150,
        interval: 300000,
        headers: false,
        driver: {
          name: 'lruCache'
        },
        throwError: true
      },
      xssValidator: {
        throwError: true
      },
      allowedMethodsRestricter: {
        methods: '*',
        throwError: true
      },
      hidePoweredBy: true,
      basicAuth: false,
      enabled: true,
      csrf: true,
      nonce: true,
      removeLoggers: {
        external: [],
        consoleType: ['log', 'debug'],
        include: [/\.[jt]sx?$/, /\.vue\??/],
        exclude: [/node_modules/, /\.git/]
      },
      ssg: {
        meta: true,
        hashScripts: true,
        hashStyles: true,
        nitroHeaders: true,
        exportToPresets: true,
      },
      sri: true
    }*/
})