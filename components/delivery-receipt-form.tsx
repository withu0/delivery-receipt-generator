"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, RotateCcw } from "lucide-react"

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

interface DeliveryReceiptFormProps {
  formData: FormData
  setFormData: (data: FormData) => void
}

export function DeliveryReceiptForm({ formData, setFormData }: DeliveryReceiptFormProps) {
  const updateField = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { partNumber: "", description: "", quantity: 1 }],
    })
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData({ ...formData, items: newItems })
    }
  }

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      recipientName: "",
      recipientAddress: "",
      deliveryNoteNumber: "",
      deliveredBy: "",
      contactInfo: "",
      orderReference: "",
      specialInstructions: "",
      items: [{ partNumber: "", description: "", quantity: 1 }],
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Receipt Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryNoteNumber">Delivery Note #</Label>
              <Input
                id="deliveryNoteNumber"
                placeholder="DN-2024-001"
                value={formData.deliveryNoteNumber}
                onChange={(e) => updateField("deliveryNoteNumber", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientName">Recipient Name</Label>
            <Input
              id="recipientName"
              placeholder="John Doe"
              value={formData.recipientName}
              onChange={(e) => updateField("recipientName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientAddress">Recipient Address</Label>
            <Textarea
              id="recipientAddress"
              placeholder="123 Main Street&#10;City, State 12345"
              rows={3}
              value={formData.recipientAddress}
              onChange={(e) => updateField("recipientAddress", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderReference">Order Reference Number</Label>
            <Input
              id="orderReference"
              placeholder="ORD-2024-001"
              value={formData.orderReference}
              onChange={(e) => updateField("orderReference", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Items</CardTitle>
            <Button onClick={addItem} size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="space-y-3 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Item {index + 1}</span>
                {formData.items.length > 1 && (
                  <Button
                    onClick={() => removeItem(index)}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`partNumber-${index}`}>Part Number</Label>
                  <Input
                    id={`partNumber-${index}`}
                    placeholder="PN-12345"
                    value={item.partNumber}
                    onChange={(e) => updateItem(index, "partNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                  <Input
                    id={`quantity-${index}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${index}`}>Description</Label>
                <Input
                  id={`description-${index}`}
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deliveredBy">Delivered By</Label>
            <Input
              id="deliveredBy"
              placeholder="Driver name"
              value={formData.deliveredBy}
              onChange={(e) => updateField("deliveredBy", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactInfo">Contact Info</Label>
            <Input
              id="contactInfo"
              placeholder="Email or phone number"
              value={formData.contactInfo}
              onChange={(e) => updateField("contactInfo", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              placeholder="Any special delivery notes..."
              rows={3}
              value={formData.specialInstructions}
              onChange={(e) => updateField("specialInstructions", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={resetForm} variant="outline" className="w-full bg-transparent">
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset Form
      </Button>
    </div>
  )
}
