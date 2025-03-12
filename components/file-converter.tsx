"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, FileSpreadsheet, FileImage, File } from "lucide-react"
import { OfficeConverter } from "./converters/office-converter"
import { TextConverter } from "./converters/text-converter"
import { ImageConverter } from "./converters/image-converter"

export function FileConverter() {
  const [activeTab, setActiveTab] = useState<string>("office")

  return (
    <Card className="p-6 shadow-lg bg-white dark:bg-slate-950 max-w-4xl mx-auto">
      <Tabs defaultValue="office" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="office" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Office</span>
          </TabsTrigger>
          <TabsTrigger value="spreadsheet" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">Spreadsheet</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span className="hidden sm:inline">Text</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            <span className="hidden sm:inline">Image</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="office">
          <OfficeConverter type="document" />
        </TabsContent>

        <TabsContent value="spreadsheet">
          <OfficeConverter type="spreadsheet" />
        </TabsContent>

        <TabsContent value="text">
          <TextConverter />
        </TabsContent>

        <TabsContent value="image">
          <ImageConverter />
        </TabsContent>
      </Tabs>
    </Card>
  )
}

