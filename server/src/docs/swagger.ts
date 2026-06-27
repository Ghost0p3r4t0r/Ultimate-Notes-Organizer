import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vault — Ultimate Notes Organizer API',
      version: '1.0.0',
      description: 'REST API for organizing, comparing, and managing dynamic collections',
    },
    servers: [
      { url: 'http://localhost:4000', description: 'Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            avatar: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          },
        },
        Collection: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            icon: { type: 'string', nullable: true },
            themeColor: { type: 'string', nullable: true },
            coverImage: { type: 'string', nullable: true },
            itemCount: { type: 'integer' },
            fields: {
              type: 'array',
              items: { $ref: '#/components/schemas/CollectionField' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CollectionField: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            type: { type: 'string', enum: ['text', 'number', 'currency', 'date', 'dropdown', 'tags', 'image', 'rating', 'url', 'email', 'phone', 'color', 'checkbox', 'boolean', 'multiSelect', 'json', 'markdown', 'file'] },
            required: { type: 'boolean' },
            placeholder: { type: 'string', nullable: true },
            defaultValue: { type: 'object', nullable: true },
            validation: { type: 'object', nullable: true },
            displayOptions: { type: 'object', nullable: true },
            order: { type: 'integer' },
          },
        },
        Item: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            collectionId: { type: 'string', format: 'uuid' },
            fieldValues: { type: 'object' },
            images: { type: 'array', items: { $ref: '#/components/schemas/Media' } },
            tags: { type: 'array', items: { $ref: '#/components/schemas/Tag' } },
            pinnedNotes: { type: 'array', items: { $ref: '#/components/schemas/Note' } },
            noteCount: { type: 'integer' },
            mediaCount: { type: 'integer' },
            favorite: { type: 'boolean' },
            archived: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Media: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            url: { type: 'string' },
            thumbnailUrl: { type: 'string', nullable: true },
            filename: { type: 'string' },
            mimeType: { type: 'string' },
            size: { type: 'integer' },
            width: { type: 'integer', nullable: true },
            height: { type: 'integer', nullable: true },
          },
        },
        Tag: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            color: { type: 'string', nullable: true },
          },
        },
        Note: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            content: { type: 'string' },
            pinned: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        DashboardStats: {
          type: 'object',
          properties: {
            totalCollections: { type: 'integer' },
            totalItems: { type: 'integer' },
            totalMedia: { type: 'integer' },
            totalFavorites: { type: 'integer' },
            recentItems: {
              type: 'array',
              items: { $ref: '#/components/schemas/Item' },
            },
            collectionStats: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
                  itemCount: { type: 'integer' },
                },
              },
            },
            activities: { type: 'array', items: { $ref: '#/components/schemas/Activity' } },
          },
        },
        Activity: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            action: { type: 'string' },
            details: { type: 'object', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            item: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                fieldValues: { type: 'object' },
                collectionId: { type: 'string', format: 'uuid' },
              },
            },
          },
        },
        CompareResult: {
          type: 'object',
          properties: {
            collection: {
              type: 'object',
              properties: { id: { type: 'string' }, name: { type: 'string' } },
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  title: { type: 'string' },
                  images: { type: 'array', items: { type: 'object', properties: { url: { type: 'string' }, thumbnailUrl: { type: 'string', nullable: true } } } },
                },
              },
            },
            fields: { type: 'array', items: { type: 'object' } },
            totalItems: { type: 'integer' },
            totalFields: { type: 'integer' },
          },
        },
        PaginatedItems: {
          type: 'object',
          properties: {
            items: { type: 'array', items: { $ref: '#/components/schemas/Item' } },
            total: { type: 'integer' },
            page: { type: 'integer' },
            limit: { type: 'integer' },
          },
        },
      },
    },
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'name'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    name: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            409: { description: 'Email already registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh access token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: { refreshToken: { type: 'string' } },
                },
              },
            },
          },
          responses: {
            200: { description: 'Tokens refreshed' },
            401: { description: 'Invalid or expired refresh token' },
          },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { refreshToken: { type: 'string' } },
                },
              },
            },
          },
          responses: { 200: { description: 'Logged out' } },
        },
      },
      '/api/auth/profile': {
        get: {
          tags: ['Auth'],
          summary: 'Get user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'User profile', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/User' } } } } } },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/collections': {
        get: {
          tags: ['Collections'],
          summary: 'List user collections',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Collections list', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/Collection' } } } } } } },
          },
        },
        post: {
          tags: ['Collections'],
          summary: 'Create a collection',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    icon: { type: 'string' },
                    themeColor: { type: 'string' },
                    coverImage: { type: 'string' },
                    fields: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          type: { type: 'string' },
                          required: { type: 'boolean' },
                          placeholder: { type: 'string' },
                          order: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Collection created', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Collection' } } } } } },
          },
        },
      },
      '/api/collections/{id}': {
        get: {
          tags: ['Collections'],
          summary: 'Get collection by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Collection detail', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Collection' } } } } } },
            404: { description: 'Collection not found' },
          },
        },
        put: {
          tags: ['Collections'],
          summary: 'Update collection',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { 200: { description: 'Collection updated' } },
        },
        delete: {
          tags: ['Collections'],
          summary: 'Delete collection',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { 200: { description: 'Collection deleted' } },
        },
      },
      '/api/collections/{id}/items': {
        get: {
          tags: ['Items'],
          summary: 'List items in a collection (paginated)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'sort', in: 'query', schema: { type: 'string' } },
            { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Paginated items', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/PaginatedItems' } } } } } },
          },
        },
      },
      '/api/items': {
        post: {
          tags: ['Items'],
          summary: 'Create an item',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['collectionId', 'fieldValues'],
                  properties: {
                    collectionId: { type: 'string', format: 'uuid' },
                    fieldValues: { type: 'object' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Item created', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Item' } } } } } },
          },
        },
      },
      '/api/items/{id}': {
        get: {
          tags: ['Items'],
          summary: 'Get item by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { 200: { description: 'Item detail' } },
        },
        put: {
          tags: ['Items'],
          summary: 'Update item',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { 200: { description: 'Item updated' } },
        },
        delete: {
          tags: ['Items'],
          summary: 'Delete item',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { 200: { description: 'Item deleted' } },
        },
      },
      '/api/search': {
        get: {
          tags: ['Search'],
          summary: 'Global search across collections, items, and tags',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: { 200: { description: 'Search results' } },
        },
      },
      '/api/search/filter': {
        post: {
          tags: ['Search'],
          summary: 'Advanced filtered search with AND/OR groups',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Filtered results' } },
        },
      },
      '/api/compare': {
        post: {
          tags: ['Compare'],
          summary: 'Compare items side-by-side',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['itemIds'],
                  properties: {
                    itemIds: { type: 'array', items: { type: 'string', format: 'uuid' }, minItems: 2, maxItems: 10 },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Comparison result', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/CompareResult' } } } } } } },
        },
      },
      '/api/dashboard/stats': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get dashboard statistics',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Dashboard stats', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/DashboardStats' } } } } } } },
        },
      },
      '/api/favorites': {
        get: {
          tags: ['Favorites'],
          summary: 'List favorited items',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Favorites list' } },
        },
      },
      '/api/favorites/{itemId}/toggle': {
        post: {
          tags: ['Favorites'],
          summary: 'Toggle favorite on an item',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'itemId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { 200: { description: 'Favorite toggled' } },
        },
      },
      '/api/upload': {
        post: {
          tags: ['Upload'],
          summary: 'Upload a file (multipart form-data)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    file: { type: 'string', format: 'binary' },
                    itemId: { type: 'string', format: 'uuid' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'File uploaded' } },
        },
      },
      '/api/import-export/import': {
        post: {
          tags: ['Import/Export'],
          summary: 'Import items from CSV, Excel, or JSON',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Import results' } },
        },
      },
      '/api/import-export/export': {
        post: {
          tags: ['Import/Export'],
          summary: 'Export items to CSV, Excel, or JSON',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Export file download' } },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
