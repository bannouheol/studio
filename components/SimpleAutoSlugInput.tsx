import { useCallback, useRef } from 'react'
import { SlugInputProps, useFormValue, set, unset } from 'sanity'
import { Stack, TextInput, Button, Flex } from '@sanity/ui'
import slugify from 'slugify'

function toSlug(text: string, lang?: string): string {
  // Translate "&" based on language before slugifying
  let processedText = text
  if (lang === 'fr') {
    processedText = processedText.replace(/&/g, 'et')
  } else if (lang === 'br') {
    processedText = processedText.replace(/&/g, 'ha')
  }
  // Default to French if no lang specified (for backwards compatibility)
  else if (!lang) {
    processedText = processedText.replace(/&/g, 'et')
  }
  return slugify(processedText, { strict: true, lower: true })
}

interface SimpleAutoSlugInputProps extends SlugInputProps {
  sourceField?: string
  lang?: string
}

export function SimpleAutoSlugInput(props: SimpleAutoSlugInputProps) {
  const { onChange, value, readOnly, schemaType, lang } = props

  // Get source field from schema options or default to 'title'
  const sourceField = (schemaType.options as { source?: string })?.source || 'title'
  const sourceValue = useFormValue([sourceField]) as string | undefined

  const userHasEdited = useRef(false)
  const isUserTyping = useRef(false)

  const handleKeyDown = useCallback(() => {
    // Mark that user is actively typing - this flag allows onChange to generate slugs
    isUserTyping.current = true
    userHasEdited.current = true
  }, [])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // Only generate slug if user was actively typing (keyDown fired)
      if (isUserTyping.current) {
        const inputValue = event.target.value
        if (inputValue) {
          onChange(set({ current: toSlug(inputValue, lang), _type: 'slug' }))
        } else {
          onChange(unset())
        }
        // Reset the flag after processing
        isUserTyping.current = false
      }
      // If not user typing, just allow the value to display without generating slug
    },
    [onChange, lang]
  )

  const handleKeyUp = useCallback(() => {
    // Reset typing flag after a short delay to catch paste events
    setTimeout(() => {
      isUserTyping.current = false
    }, 100)
  }, [])

  const handleReset = useCallback(() => {
    userHasEdited.current = false
    if (sourceValue) {
      onChange(set({ current: toSlug(sourceValue, lang), _type: 'slug' }))
    }
  }, [sourceValue, onChange, lang])

  return (
    <Stack space={2}>
      <Flex gap={2}>
        <TextInput
          value={value?.current || ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onPaste={() => {
            isUserTyping.current = true
            setTimeout(() => {
              isUserTyping.current = false
            }, 100)
          }}
          readOnly={readOnly}
          style={{ flex: 1 }}
        />
        <Button
          mode="ghost"
          text="Régénérer"
          onClick={handleReset}
          disabled={readOnly}
          title="Régénérer le slug à partir du titre"
        />
      </Flex>
    </Stack>
  )
}
