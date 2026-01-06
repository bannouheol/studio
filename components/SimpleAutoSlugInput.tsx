import {useCallback, useEffect, useRef} from 'react'
import {SlugInputProps, useFormValue, set, unset} from 'sanity'
import {Stack, TextInput, Button, Flex} from '@sanity/ui'
import slugify from 'slugify'

function toSlug(text: string): string {
  return slugify(text, {strict: true, lower: true})
}

interface SimpleAutoSlugInputProps extends SlugInputProps {
  sourceField?: string
}

export function SimpleAutoSlugInput(props: SimpleAutoSlugInputProps) {
  const {onChange, value, readOnly, schemaType} = props

  // Get source field from schema options or default to 'title'
  const sourceField = (schemaType.options as {source?: string})?.source || 'title'
  const sourceValue = useFormValue([sourceField]) as string | undefined

  const previousSourceRef = useRef<string | undefined>(undefined)
  const userHasEdited = useRef(false)

  // Auto-generate slug when source changes (only if user hasn't manually edited)
  useEffect(() => {
    if (sourceValue === previousSourceRef.current) return
    previousSourceRef.current = sourceValue

    const currentSlug = value?.current

    // Auto-generate if no current slug or user hasn't manually edited
    if (!currentSlug || !userHasEdited.current) {
      if (sourceValue) {
        const newSlug = toSlug(sourceValue)
        onChange(set({current: newSlug, _type: 'slug'}))
      }
    }
  }, [sourceValue, onChange, value])

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
    if (sourceValue) {
      onChange(set({current: toSlug(sourceValue), _type: 'slug'}))
    }
  }, [sourceValue, onChange])

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
