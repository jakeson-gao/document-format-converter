"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Upload, Download, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { convertDocument } from "@/lib/convert-document"
import type { ConversionType } from "@/lib/types"

interface OfficeConverterProps {
  type: "document" | "spreadsheet" | "presentation"
}

export function OfficeConverter({ type }: OfficeConverterProps) {
  const [file, setFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState<string>("")
  const [isConverting, setIsConverting] = useState(false)
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setConvertedFileUrl(null)
    setError(null)
  }

  const handleConvert = async () => {
    if (!file || !outputFormat) {
      setError("Please select a file and output format")
      return
    }

    setIsConverting(true)
    setError(null)

    try {
      let conversionType: ConversionType

      if (type === "document") {
        const extension = file.name.split(".").pop()?.toLowerCase()
        if (extension === "doc" || extension === "docx") {
          conversionType = `doc-to-${outputFormat}` as ConversionType
        } else {
          conversionType = `${extension}-to-doc` as ConversionType
        }
      } else if (type === "spreadsheet") {
        const extension = file.name.split(".").pop()?.toLowerCase()
        if (extension === "xls" || extension === "xlsx") {
          conversionType = `xls-to-${outputFormat}` as ConversionType
        } else {
          conversionType = `${extension}-to-xls` as ConversionType
        }
      } else {
        const extension = file.name.split(".").pop()?.toLowerCase()
        if (extension === "ppt" || extension === "pptx") {
          conversionType = `ppt-to-${outputFormat}` as ConversionType
        } else {
          conversionType = `${extension}-to-ppt` as ConversionType
        }
      }

      const result = await convertDocument(file, conversionType)
      setConvertedFileUrl(result.url)
    } catch (err) {
      setError("Error converting file. Please try again.")
      console.error(err)
    } finally {
      setIsConverting(false)
    }
  }

  const getFormatOptions = () => {
    if (type === "document") {
      const extension = file?.name.split(".").pop()?.toLowerCase()
      if (extension === "doc" || extension === "docx") {
        return [
          { value: "txt", label: "Text (.txt)" },
          { value: "rtf", label: "Rich Text Format (.rtf)" },
          { value: "pdf", label: "PDF (.pdf)" },
        ]
      } else {
        return [{ value: "doc", label: "Word Document (.docx)" }]
      }
    } else if (type === "spreadsheet") {
      const extension = file?.name.split(".").pop()?.toLowerCase()
      if (extension === "xls" || extension === "xlsx") {
        return [
          { value: "csv", label: "CSV (.csv)" },
          { value: "pdf", label: "PDF (.pdf)" },
        ]
      } else {
        return [{ value: "xls", label: "Excel Spreadsheet (.xlsx)" }]
      }
    } else {
      const extension = file?.name.split(".").pop()?.toLowerCase()
      if (extension === "ppt" || extension === "pptx") {
        return [
          { value: "pdf", label: "PDF (.pdf)" },
          { value: "jpg", label: "JPEG Image (.jpg)" },
          { value: "png", label: "PNG Image (.png)" },
        ]
      } else {
        return [{ value: "ppt", label: "PowerPoint Presentation (.pptx)" }]
      }
    }
  }

  const getTitle = () => {
    if (type === "document") return "Word Document Conversion"
    if (type === "spreadsheet") return "Excel Spreadsheet Conversion"
    return "PowerPoint Presentation Conversion"
  }

  const getDescription = () => {
    if (type === "document") {
      return "Convert between Word documents (.doc/.docx) and other formats like PDF, TXT, and RTF."
    } else if (type === "spreadsheet") {
      return "Convert between Excel spreadsheets (.xls/.xlsx) and formats like CSV and PDF."
    } else {
      return "Convert between PowerPoint presentations (.ppt/.pptx) and formats like PDF and images."
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{getTitle()}</h2>
        <p className="text-slate-600 dark:text-slate-400">{getDescription()}</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="file-upload" className="block mb-2">
            Upload File
          </Label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
              className="w-full h-24 border-dashed flex flex-col items-center justify-center gap-2"
            >
              <Upload className="h-6 w-6" />
              <span>{file ? file.name : "Click to upload"}</span>
              <span className="text-xs text-slate-500">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}</span>
            </Button>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
          </div>
        </div>

        {file && (
          <div>
            <Label className="block mb-2">Output Format</Label>
            <RadioGroup
              value={outputFormat}
              onValueChange={setOutputFormat}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2"
            >
              {getFormatOptions().map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleConvert} disabled={!file || !outputFormat || isConverting} className="flex-1">
            {isConverting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              "Convert File"
            )}
          </Button>

          {convertedFileUrl && (
            <Button variant="outline" onClick={() => window.open(convertedFileUrl, "_blank")} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download Converted File
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

