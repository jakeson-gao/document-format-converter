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

export function ImageConverter() {
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

      // Determine if we're converting from image to document or vice versa
      const extension = file.name.split(".").pop()?.toLowerCase()
      if (["jpg", "jpeg", "png", "gif", "bmp", "tiff"].includes(extension || "")) {
        conversionType = `image-to-${outputFormat}` as ConversionType
      } else {
        conversionType = `${extension}-to-image` as ConversionType
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
    const extension = file?.name.split(".").pop()?.toLowerCase()

    if (["jpg", "jpeg", "png", "gif", "bmp", "tiff"].includes(extension || "")) {
      return [
        { value: "doc", label: "Word Document (.docx)" },
        { value: "xls", label: "Excel Spreadsheet (.xlsx)" },
        { value: "pdf", label: "PDF (.pdf)" },
      ]
    } else {
      return [
        { value: "jpg", label: "JPEG Image (.jpg)" },
        { value: "png", label: "PNG Image (.png)" },
      ]
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Image Conversion</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Convert images to documents (using OCR) or documents to images.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="image-file-upload" className="block mb-2">
            Upload File
          </Label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => document.getElementById("image-file-upload")?.click()}
              className="w-full h-24 border-dashed flex flex-col items-center justify-center gap-2"
            >
              <Upload className="h-6 w-6" />
              <span>{file ? file.name : "Click to upload"}</span>
              <span className="text-xs text-slate-500">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}</span>
            </Button>
            <input id="image-file-upload" type="file" className="hidden" onChange={handleFileChange} />
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
                  <RadioGroupItem value={option.value} id={`image-${option.value}`} />
                  <Label htmlFor={`image-${option.value}`}>{option.label}</Label>
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

