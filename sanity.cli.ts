import {defineCliConfig} from 'sanity/cli'

const projectId = 'hk48qn3z'
const dataset = 'production'

export default defineCliConfig({api: {projectId, dataset}})
