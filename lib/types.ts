export type ConversionType =
  // Word document conversions
  | "doc-to-txt"
  | "txt-to-doc"
  | "doc-to-rtf"
  | "rtf-to-doc"
  | "doc-to-pdf"
  | "pdf-to-doc"

  // Excel conversions
  | "xls-to-csv"
  | "csv-to-xls"
  | "xls-to-pdf"
  | "pdf-to-xls"

  // PowerPoint conversions
  | "ppt-to-pdf"
  | "pdf-to-ppt"
  | "ppt-to-jpg"
  | "jpg-to-ppt"
  | "ppt-to-png"
  | "png-to-ppt"

  // Text format conversions
  | "txt-to-rtf"
  | "rtf-to-txt"
  | "html-to-txt"
  | "txt-to-html"
  | "html-to-rtf"
  | "rtf-to-html"

  // E-book conversions
  | "epub-to-mobi"
  | "mobi-to-epub"
  | "pdf-to-epub"
  | "epub-to-pdf"
  | "pdf-to-mobi"
  | "mobi-to-pdf"

  // CAD conversions
  | "dwg-to-dxf"
  | "dxf-to-dwg"
  | "dwg-to-pdf"
  | "pdf-to-dwg"

  // Image to document conversions
  | "image-to-doc"
  | "doc-to-image"
  | "image-to-xls"
  | "xls-to-image"
  | "image-to-pdf"
  | "pdf-to-image"

export interface ConversionResult {
  url: string
  filename: string
}

