import { defineCliConfig } from 'sanity/cli'

const projectId = 'hk48qn3z'
const dataset = 'staging'

export default defineCliConfig({ api: { projectId, dataset } })
