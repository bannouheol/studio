import { defineCliConfig } from 'sanity/cli'

// @TODO report top-level await bug
// Using a dynamic import here as `loadEnvConfig` needs to run before this file is loaded
// const { projectId, dataset } = await import('lib/sanity.api')
const projectId = "hk48qn3z"
const dataset = "production"

export default defineCliConfig({ api: { projectId, dataset } })