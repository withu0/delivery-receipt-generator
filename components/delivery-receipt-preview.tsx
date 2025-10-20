"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Printer } from "lucide-react"

interface FormData {
  date: string
  recipientName: string
  recipientAddress: string
  deliveryNoteNumber: string
  deliveredBy: string
  contactInfo: string
  orderReference: string
  specialInstructions: string
  items: Array<{ partNumber: string; description: string; quantity: number }>
}

interface DeliveryReceiptPreviewProps {
  formData: FormData
}

export function DeliveryReceiptPreview({ formData }: DeliveryReceiptPreviewProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = async () => {
    // Dynamically import html2pdf to avoid SSR issues
    const html2pdf = (await import("html2pdf.js")).default

    const element = receiptRef.current
    if (!element) return

    const opt = {
      margin: 0.5,
      filename: `delivery-receipt-${formData.deliveryNoteNumber || "draft"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    }

    html2pdf().set(opt).from(element).save()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 print:hidden">
        <Button onClick={handleExportPDF} className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
        <Button onClick={handlePrint} variant="outline" className="flex-1 bg-transparent">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>

      <Card className="print:shadow-none print:border-0">
        <CardHeader className="print:pb-4">
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={receiptRef} className="space-y-8 bg-white p-12 text-black print:p-0">
            <div className="space-y-6 border-b-4 border-black pb-6">
              <div className="flex items-start justify-between">

                <div className="text-right">
                  <h1 className="text-4xl font-bold tracking-tight text-black">DELIVERY RECEIPT</h1>
                  <p className="mt-2 text-sm font-medium text-gray-600">
                    {formData.deliveryNoteNumber ? (
                      <span className="text-black">#{formData.deliveryNoteNumber}</span>
                    ) : (
                      <span className="opacity-30">#DN-XXXX-XXX</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Date of Delivery</p>
                <p className="mt-2 text-base font-medium text-black">
                  {formData.date ? (
                    new Date(formData.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  ) : (
                    <span className="opacity-30">Month DD, YYYY</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Order Reference</p>
                <p className="mt-2 text-base font-medium text-black">
                  {formData.orderReference || <span className="opacity-30">ORD-XXXX-XXX</span>}
                </p>
              </div>
            </div>

            <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Delivered To</p>
              <div className="mt-3 space-y-2">
                <p className="text-lg font-bold text-black">
                  {formData.recipientName || <span className="opacity-30">Recipient Name</span>}
                </p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                  {formData.recipientAddress || (
                    <span className="opacity-30">Street Address{"\n"}City, State ZIP Code</span>
                  )}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">Items Delivered</p>
              <div className="overflow-hidden rounded-lg border-2 border-gray-300">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300 bg-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                        Part Number
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                        Description
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-700">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {formData.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-black">
                          {item.partNumber || <span className="opacity-30">PN-XXXXX</span>}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {item.description || <span className="opacity-30">Item description</span>}
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-semibold text-black">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 text-right">
                <p className="text-sm font-medium text-gray-600">
                  Total Items: <span className="font-bold text-black">{formData.items.length}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Delivered By</p>
                <p className="mt-2 text-base font-medium text-black">
                  {formData.deliveredBy || <span className="opacity-30">Driver Name</span>}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Contact Information</p>
                <p className="mt-2 text-base font-medium text-black">
                  {formData.contactInfo || <span className="opacity-30">contact@example.com</span>}
                </p>
              </div>
            </div>

            {(formData.specialInstructions || true) && (
              <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Special Instructions / Notes</p>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                  {formData.specialInstructions || (
                    <span className="opacity-30">Any special delivery instructions or notes will appear here...</span>
                  )}
                </p>
              </div>
            )}

            <div className="mt-16 space-y-8 border-t-2 border-gray-300 pt-8">
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-3">
                  <div className="h-16 border-b-2 border-black"></div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Recipient Signature</p>
                    <p className="text-xs text-gray-500">I acknowledge receipt of the items listed above</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-16 border-b-2 border-black"></div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Date</p>
                    <p className="text-xs text-gray-500">MM / DD / YYYY</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-400">
                  This document serves as proof of delivery. Please retain for your records.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
