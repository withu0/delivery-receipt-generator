'use client'

import { useState } from 'react'
import { DeliveryReceiptForm } from '@/components/delivery-receipt-form'
import { DeliveryReceiptPreview } from '@/components/delivery-receipt-preview'
import { FileText } from 'lucide-react'

export default function Home() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    recipientName: '',
    recipientAddress: '',
    deliveryNoteNumber: '',
    deliveredBy: '',
    contactInfo: '',
    orderReference: '',
    specialInstructions: '',
    items: [{ partNumber: '', description: '', quantity: 1 }]
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              Delivery Receipt Generator
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <DeliveryReceiptForm formData={formData} setFormData={setFormData} />
          <DeliveryReceiptPreview formData={formData} />
        </div>
      </main>
    </div>
  )
}
