import {useCallback, useEffect, useRef} from 'react'
import {SlugInputProps, useFormValue, set, unset} from 'sanity'
import {Stack, TextInput, Button, Flex} from '@sanity/ui'
import slugify from 'slugify'
import {format, parseISO} from 'date-fns'

function customSlugify(text: string): string {
  return slugify(text, {strict: true, lower: true})
}

function blogPostFormat(text: string): RegExpExecArray | null {
  const regex = /([0-9]{4})\/([0-9]{2})\/(.+)/gm
  return regex.exec(text)
}

function toSlug(text: string): string {
  const post = blogPostFormat(text)
  if (post) {
    post.shift()
    const postSlug = customSlugify(post.pop()!)
    return [...post, postSlug].join('/')
  } else {
    return customSlugify(text)
  }
}

interface AutoSlugInputProps extends SlugInputProps {
  lang: string
}

export function AutoSlugInput(props: AutoSlugInputProps) {
  const {onChange, value, lang, readOnly} = props
  const titleValue = useFormValue(['title', lang]) as string | undefined
  const publishedAt = useFormValue(['publishedAt']) as string | undefined
  const previousTitleRef = useRef<string | undefined>(undefined)
  const userHasEdited = useRef(false)

  const generateSlug = useCallback(
    (title: string | undefined) => {
      if (!title) return ''
      const date = publishedAt ? format(parseISO(publishedAt), 'yyyy/MM/') : ''
      return toSlug(date + title)
    },
    [publishedAt]
  )

  // Auto-generate slug when title changes (only if user hasn't manually edited)
  useEffect(() => {
    // Skip if title hasn't changed or user has manually edited
    if (titleValue === previousTitleRef.current) return
    previousTitleRef.current = titleValue

    // Only auto-generate if there's no current value or it matches the previous auto-generated slug
    const currentSlug = value?.current
    const wouldBeSlug = generateSlug(titleValue)

    // Auto-generate if:
    // - No current slug exists
    // - User hasn't manually edited (slug still matches what we'd generate from previous title)
    if (!currentSlug || !userHasEdited.current) {
      if (wouldBeSlug) {
        onChange(set({current: wouldBeSlug, _type: 'slug'}))
      }
    }
  }, [titleValue, generateSlug, onChange, value])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value
      userHasEdited.current = true
      if (inputValue) {
        onChange(set({current: toSlug(inputValue), _type: 'slug'}))
      } else {
        onChange(unset())
      }
    },
    [onChange]
  )

  const handleReset = useCallback(() => {
    userHasEdited.current = false
    const newSlug = generateSlug(titleValue)
    if (newSlug) {
      onChange(set({current: newSlug, _type: 'slug'}))
    }
  }, [generateSlug, titleValue, onChange])

  return (
    <Stack space={2}>
      <Flex gap={2}>
        <TextInput
          value={value?.current || ''}
          onChange={handleChange}
          readOnly={readOnly}
          style={{flex: 1}}
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
