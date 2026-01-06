declare module 'react-barcode' {
  import {ComponentType} from 'react'

  interface BarcodeProps {
    value: string
    format?: string
    width?: number
    height?: number
    displayValue?: boolean
    fontOptions?: string
    font?: string
    textAlign?: 'left' | 'center' | 'right'
    textPosition?: 'bottom' | 'top'
    textMargin?: number
    fontSize?: number
    background?: string
    lineColor?: string
    margin?: number
    marginTop?: number
    marginBottom?: number
    marginLeft?: number
    marginRight?: number
    valid?: (valid: boolean) => void
  }

  const Barcode: ComponentType<BarcodeProps>
  export default Barcode
}
