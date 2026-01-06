import {useState, useCallback} from 'react'
import {ObjectInputProps, set, unset, PatchEvent} from 'sanity'
import {Stack, Card, Text} from '@sanity/ui'
import Barcode from 'react-barcode'
import styles from './BarcodeInput.module.css'

interface BarcodeValue {
  _type?: string
  barcode?: string
}

export function BarcodeInput(props: ObjectInputProps<BarcodeValue>) {
  const {value, renderDefault} = props
  const [valid, setValid] = useState(true)

  const handleValid = useCallback((isValid: boolean) => {
    setValid(isValid)
  }, [])

  const barcodeValue = value?.barcode

  return (
    <Stack space={4}>
      {barcodeValue && (
        <Card padding={4} radius={2} shadow={1} tone={valid ? 'default' : 'critical'}>
          <div className={valid ? styles.barcodeValid : styles.barcodeInvalid}>
            <Barcode
              textAlign="center"
              value={barcodeValue}
              format=""
              valid={handleValid}
            />
          </div>
          {!valid && (
            <Text size={1} muted>
              Invalid barcode format
            </Text>
          )}
        </Card>
      )}
      {renderDefault(props)}
    </Stack>
  )
}
