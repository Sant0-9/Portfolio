import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: `projects/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    slug: {
      type: 'string',
      description: 'The URL slug for this project',
      required: true,
    },
    title: {
      type: 'string',
      description: 'The title of this project',
      required: true,
    },
    summary: {
      type: 'string',
      description: 'A brief summary of the project',
      required: true,
    },
    role: {
      type: 'string',
      description: 'Your role in this project',
      required: true,
    },
    period: {
      type: 'string',
      description: 'Time period when project was active (e.g., "2023 - 2024")',
      required: true,
    },
    stack: {
      type: 'list',
      of: { type: 'string' },
      description: 'Technologies used in this project',
      required: true,
    },
    links: {
      type: 'json',
      description: 'Relevant links for this project as JSON array',
      required: false,
    },
    impact: {
      type: 'json',
      description: 'Measurable impact metrics as JSON array',
      required: false,
    },
    cover: {
      type: 'string',
      description: 'Cover image URL for this project',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/projects/${doc.slug}`,
    },
  },
}))

export const Note = defineDocumentType(() => ({
  name: 'Note',
  filePathPattern: `notes/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    slug: {
      type: 'string',
      description: 'The URL slug for this note',
      required: true,
    },
    title: {
      type: 'string',
      description: 'The title of this note',
      required: true,
    },
    summary: {
      type: 'string',
      description: 'A brief summary of the note',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date this note was published',
      required: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'Tags for categorizing this note',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/notes/${doc.slug}`,
    },
  },
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Project, Note],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})