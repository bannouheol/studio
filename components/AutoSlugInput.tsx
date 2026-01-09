import { useCallback, useRef } from 'react'
import { SlugInputProps, useFormValue, set, unset } from 'sanity'
import { Stack, TextInput, Button, Flex } from '@sanity/ui'
import slugify from 'slugify'
import { format, parseISO } from 'date-fns'

function customSlugify(text: string, lang?: string): string {
  // Translate "&" based on language before slugifying
  let processedText = text
  if (lang === 'fr') {
    processedText = processedText.replace(/&/g, 'et')
  } else if (lang === 'br') {
    processedText = processedText.replace(/&/g, 'ha')
  }
  // Replace apostrophes (straight, curly, and other variants) with dashes
  processedText = processedText.replace(/[''']/g, '-')
  return slugify(processedText, { strict: true, lower: true })
}

function blogPostFormat(text: string): RegExpExecArray | null {
  const regex = /([0-9]{4})\/([0-9]{2})\/(.+)/gm
  return regex.exec(text)
}

function toSlug(text: string, lang?: string): string {
  const post = blogPostFormat(text)
  if (post) {
    post.shift()
    const postSlug = customSlugify(post.pop()!, lang)
    return [...post, postSlug].join('/')
  } else {
    return customSlugify(text, lang)
  }
}

interface AutoSlugInputProps extends SlugInputProps {
  lang: string
}

export function AutoSlugInput(props: AutoSlugInputProps) {
  const { onChange, value, lang, readOnly } = props
  const titleValue = useFormValue(['title', lang]) as string | undefined
  const publishedAt = useFormValue(['publishedAt']) as string | undefined
  const userHasEdited = useRef(false)
  const isUserTyping = useRef(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const generateSlug = useCallback(
    (title: string | undefined) => {
      if (!title) return ''
      const date = publishedAt ? format(parseISO(publishedAt), 'yyyy/MM/') : ''
      return toSlug(date + title, lang)
    },
    [publishedAt, lang]
  )

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
    const newSlug = generateSlug(titleValue)
    if (newSlug) {
      onChange(set({ current: newSlug, _type: 'slug' }))
    }
  }, [generateSlug, titleValue, onChange])

  return (
    <Stack space={2}>
      <Flex gap={2}>
        <TextInput
          ref={inputRef}
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

// Factory function to create language-specific components
export function createAutoSlugInput(lang: string) {
  return function AutoSlugInputForLang(props: SlugInputProps) {
    return <AutoSlugInput {...props} lang={lang} />
  }
}
