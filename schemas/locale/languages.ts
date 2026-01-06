export interface Language {
  id: string
  title: string
  isDefault?: boolean
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {id: 'br', title: 'Breton', isDefault: true},
  {id: 'fr', title: 'Français'},
]
