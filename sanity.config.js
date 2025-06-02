import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'

import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: '👻 Plipli9 Paranormal CMS',

  projectId: 'pntbd5au', // Project ID real generat de Sanity
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('🎭 Plipli9 Paranormal Content')
          .items([
            // Site Settings - primul în listă
            S.listItem()
              .title('⚙️ Setări Site')
              .id('siteSettings')
              .icon(() => '👻')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('⚙️ Configurări Site Plipli9')
              ),
            
            // Separator
            S.divider(),
            
            // Restul documentelor (pentru viitoare extensii)
            ...S.documentTypeListItems().filter(listItem => !['siteSettings'].includes(listItem.getId()))
          ])
    }),
    visionTool({
      defaultApiVersion: '2023-05-03'
    }),
    colorInput()
  ],

  schema: {
    types: schemaTypes,
  },

  // CORS și iframe configuration pentru a rezolva X-Frame-Options
  cors: {
    origin: ['http://localhost:3333', 'http://127.0.0.1:3333'],
    credentials: true
  },

  // Studio customization
  studio: {
    components: {
      // Poți adăuga componente custom aici
    }
  },

  // Document actions customization
  document: {
    actions: (prev, context) => {
      // Pentru siteSettings, păstrează doar Save și Publish
      if (context.schemaType === 'siteSettings') {
        return prev.filter(({ action }) => ['save', 'publish'].includes(action))
      }
      return prev
    }
  },

  // API version
  apiVersion: '2023-05-03',

  // Features
  features: {
    // Asset management îmbunătățit
    asset: {
      sources: []
    }
  }
}) 