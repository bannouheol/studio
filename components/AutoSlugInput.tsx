import { useCallback, useRef, useEffect } from 'react'
import { SlugInputProps, useFormValue, set, unset } from 'sanity'
import { Stack, TextInput, Button, Flex } from '@sanity/ui'
import slugify from 'slugify'
import { format, parseISO } from 'date-fns'

function customSlugify(text: string, lang?: string): string {
  let processedText = text
  if (lang === 'fr') {
    processedText = processedText.replace(/&/g, 'et')
  } else if (lang === 'br') {
    processedText = processedText.replace(/&/g, 'ha')
  }
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

  // Track if this is the initial mount (to avoid triggering on document open)
  const isInitialMount = useRef(true)
  // Track the previous title to detect actual changes
  const previousTitleRef = useRef<string | undefined>(undefined)
  // Track if user has manually edited the slug
  const userHasEditedSlug = useRef(false)
  // Track if user is typing in the slug field
  const isUserTypingInSlug = useRef(false)

  const generateSlug = useCallback(
    (title: string | undefined) => {
      if (!title) return ''
      const date = publishedAt ? format(parseISO(publishedAt), 'yyyy/MM/') : ''
      return toSlug(date + title, lang)
    },
    [publishedAt, lang]
  )

  // Watch title changes and auto-generate slug
  useEffect(() => {
    // Skip the initial mount to avoid marking document as draft on open
    if (isInitialMount.current) {
      isInitialMount.current = false
      previousTitleRef.current = titleValue
      return
    }

    // Only proceed if title actually changed (user typed something)
    if (titleValue === previousTitleRef.current) {
      return
    }

    // Update previous title reference
    previousTitleRef.current = titleValue

    // Don't auto-generate if user has manually edited the slug
    if (userHasEditedSlug.current) {
      return
    }

    // Generate and set the new slug
    const newSlug = generateSlug(titleValue)
    if (newSlug) {
      onChange(set({ current: newSlug, _type: 'slug' }))
    } else if (!titleValue) {
      onChange(unset())
    }
  }, [titleValue, generateSlug, onChange])

  const handleKeyDown = useCallback(() => {
    isUserTypingInSlug.current = true
    userHasEditedSlug.current = true
  }, [])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isUserTypingInSlug.current) {
        const inputValue = event.target.value
        if (inputValue) {
          onChange(set({ current: toSlug(inputValue, lang), _type: 'slug' }))
        } else {
          onChange(unset())
        }
        isUserTypingInSlug.current = false
      }
    },
    [onChange, lang]
  )

  const handleKeyUp = useCallback(() => {
    setTimeout(() => {
      isUserTypingInSlug.current = false
    }, 100)
  }, [])

  const handleReset = useCallback(() => {
    userHasEditedSlug.current = false
    const newSlug = generateSlug(titleValue)
    if (newSlug) {
      onChange(set({ current: newSlug, _type: 'slug' }))
    }
  }, [generateSlug, titleValue, onChange])

  return (
    <Stack space={2}>
      <Flex gap={2}>
        <TextInput
          value={value?.current || ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onPaste={() => {
            isUserTypingInSlug.current = true
            userHasEditedSlug.current = true
            setTimeout(() => {
              isUserTypingInSlug.current = false
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
