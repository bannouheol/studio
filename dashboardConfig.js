export default {
  widgets: [
    {
      name: 'now',
      options: {
        nowConfig: {
          // https://zeit.co/account/tokens
          //token: '___TOKEN___',
          // https://zeit.co/docs/v2/more/deploy-hooks
          deployHook:
            'https://api.zeit.co/v1/integrations/deploy/Qma4PH7Uok2nwvmwjgM7eLtea8SJy2L2r3w7quPcBmBJDQ/uza9zW51mt',
          // https://zeit.co/docs/api?query=tokens#endpoints/teams/list-all-your-teams
          //teamId: '___TEAM_ID___',
          // https://zeit.co/docs/api?query=tokens#endpoints/projects/get-all-projects
          //projectId: '___PROJETC_ID___'
        },
      },
    },
  ],
}
