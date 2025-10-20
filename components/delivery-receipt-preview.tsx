'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Printer } from 'lucide-react'

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
    const html2pdf = (await import('html2pdf.js')).default
    
    const element = receiptRef.current
    if (!element) return

    const opt = {
      margin: 0.5,
      filename: `delivery-receipt-${formData.deliveryNoteNumber || 'draft'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
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
          <div
            ref={receiptRef}
            className="space-y-6 rounded-lg border border-border bg-card p-8 print:border-0 print:p-0"
          >
            {/* Header */}
            <div className="border-b-2 border-foreground pb-4">
              <h1 className="text-3xl font-bold text-foreground">DELIVERY RECEIPT</h1>
              {formData.deliveryNoteNumber && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Note #: {formData.deliveryNoteNumber}
                </p>
              )}
            </div>

            {/* Date and Order Reference */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Date
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {formData.date ? new Date(formData.date).toLocaleDateString() : '—'}
                </p>
              </div>
              {formData.orderReference && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Order Reference
                  </p>
                  <p className="mt-1 text-sm text-foreground">{formData.orderReference}</p>
                </div>
              )}
            </div>

            {/* Recipient Information */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Delivered To
              </p>
              <div className="mt-2 space-y-1">
                <p className="font-medium text-foreground">
                  {formData.recipientName || '—'}
                </p>
                <p className="whitespace-pre-line text-sm text-foreground">
                  {formData.recipientAddress || '—'}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Items Delivered
              </p>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Part #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Description
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Qty
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {formData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {item.partNumber || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {item.description || '—'}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-foreground">
                          {item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delivery Details */}
            {(formData.deliveredBy || formData.contactInfo) && (
              <div className="grid gap-4 sm:grid-cols-2">
                {formData.deliveredBy && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Delivered By
                    </p>
                    <p className="mt-1 text-sm text-foreground">{formData.deliveredBy}</p>
                  </div>
                )}
                {formData.contactInfo && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Contact Info
                    </p>
                    <p className="mt-1 text-sm text-foreground">{formData.contactInfo}</p>
                  </div>
                )}
              </div>
            )}

            {/* Special Instructions */}
            {formData.specialInstructions && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Special Instructions
                </p>
                <p className="mt-2 whitespace-pre-line text-sm text-foreground">
                  {formData.specialInstructions}
                </p>
              </div>
            )}

            {/* Signature Line */}
            <div className="mt-12 border-t border-border pt-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <div className="border-b border-foreground pb-1"></div>
                  <p className="mt-2 text-xs text-muted-foreground">Recipient Signature</p>
                </div>
                <div>
                  <div className="border-b border-foreground pb-1"></div>
                  <p className="mt-2 text-xs text-muted-foreground">Date</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
