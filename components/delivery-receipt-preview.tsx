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
          <div ref={receiptRef} className="space-y-6 bg-white p-8 text-black print:p-0">
            {/* Header Section */}
            <div className="space-y-4 border-b-2 border-gray-900 pb-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h1 className="font-serif text-5xl font-bold tracking-tight text-gray-900">DELIVERY RECEIPT</h1>
                  <p className="text-sm font-medium uppercase tracking-widest text-gray-500">Proof of Delivery</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Receipt Number</p>
                  <p className="mt-1 font-mono text-xl font-bold text-gray-900">
                    {formData.deliveryNoteNumber || <span className="opacity-20">DN-2024-0001</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Date and Reference Section */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Delivery Date</p>
                <p className="font-mono text-base font-semibold text-gray-900">
                  {formData.date ? (
                    new Date(formData.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  ) : (
                    <span className="opacity-20">January 1, 2024</span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Order Reference</p>
                <p className="font-mono text-base font-semibold text-gray-900">
                  {formData.orderReference || <span className="opacity-20">ORD-2024-0001</span>}
                </p>
              </div>
            </div>

            {/* Recipient Section */}
            <div className="rounded-md border-2 border-gray-900 bg-gray-50 p-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">Delivered To</p>
              <div className="space-y-2">
                <p className="text-xl font-bold text-gray-900">
                  {formData.recipientName || <span className="opacity-20">Recipient Company Name</span>}
                </p>
                <p className="whitespace-pre-line font-mono text-sm leading-relaxed text-gray-700">
                  {formData.recipientAddress || (
                    <span className="opacity-20">
                      123 Business Street{"\n"}
                      Suite 100{"\n"}
                      City, State 12345
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Items Delivered</p>
              <div className="overflow-hidden rounded-md border-2 border-gray-900">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-900 bg-gray-900">
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                        Part Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                        Description
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-white">
                        Qty
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {formData.items.map((item, index) => (
                      <tr key={index} className="transition-colors hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-sm font-semibold text-gray-900">
                          {item.partNumber || <span className="opacity-20">PN-XXXXX</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.description || <span className="opacity-20">Product description</span>}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm font-bold text-gray-900">
                          {item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end border-t-2 border-gray-300 pt-2">
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Items</p>
                  <p className="font-mono text-2xl font-bold text-gray-900">{formData.items.length}</p>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="grid grid-cols-2 gap-6 border-t-2 border-gray-300 pt-6">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Delivered By</p>
                <p className="text-base font-semibold text-gray-900">
                  {formData.deliveredBy || <span className="opacity-20">Driver Name</span>}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Contact Information</p>
                <p className="font-mono text-base font-semibold text-gray-900">
                  {formData.contactInfo || <span className="opacity-20">contact@company.com</span>}
                </p>
              </div>
            </div>

            {/* Special Instructions */}
            {(formData.specialInstructions || true) && (
              <div className="rounded-md border border-gray-300 bg-gray-50 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">Special Instructions</p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                  {formData.specialInstructions || (
                    <span className="opacity-20">
                      Any special delivery instructions, handling requirements, or additional notes will appear here...
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Signature Section */}
            <div className="space-y-6 border-t-2 border-gray-900 pt-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="h-20 border-b-2 border-gray-900"></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-900">Recipient Signature</p>
                    <p className="mt-1 text-xs italic text-gray-500">I acknowledge receipt of the items listed above</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-20 border-b-2 border-gray-900"></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-900">Date Received</p>
                    <p className="mt-1 text-xs italic text-gray-500">MM / DD / YYYY</p>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-gray-100 p-4 text-center">
                <p className="text-xs font-medium text-gray-600">
                  This document serves as official proof of delivery. Please retain this receipt for your records.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  For questions or concerns, please contact us using the information provided above.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
