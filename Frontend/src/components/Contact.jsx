import { useState } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Headphones,
  Shield,
  MessageCircle,
  CheckCircle,
} from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email"
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.subject.trim()) newErrors.subject = "Subject is required"
    if (!formData.message.trim() || formData.message.length < 10)
      newErrors.message = "Message must be at least 10 characters"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)

    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    }, 3000)
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-20 text-center bg-gray-50">
        <h1 className="text-4xl font-bold mb-4">Get in Touch with ShopEasy</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We’re here to help you with orders, queries, and feedback.
        </p>
      </section>

      {/* Form + Info */}
      <section className="container mx-auto px-4 py-16 grid lg:grid-cols-[1fr,400px] gap-10">
        {/* Form */}
        <div className="border rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

          {isSubmitted ? (
            <div className="text-center py-20">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <p className="font-semibold">Message sent successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                />
                <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "")
                        setFormData({ ...formData, phone: value })
                    }}
                    className="w-full border p-3 rounded"
                />

              </div>

              <input
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              <textarea
                name="message"
                rows="5"
                placeholder="Your message..."
                value={formData.message}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              />

              <button
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 rounded hover:opacity-90"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {[
            { icon: Mail, title: "Email", text: "support@shopeasy.com" },
            { icon: Phone, title: "Phone", text: "+91 98765 43210" },
            {
              icon: MapPin,
              title: "Address",
              text: "Nanakramguda, Hyderabad, India",
            },
            {
              icon: Clock,
              title: "Hours",
              text: "Mon–Fri: 9AM – 6PM",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <item.icon className="h-6 w-6 text-black" />
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="py-16 bg-gray-100">
        <iframe
          className="w-full h-[400px]"
          src="https://www.google.com/maps?q=Nanakramguda&output=embed"
          loading="lazy"
          title="ShopEasy Location"
        />
      </section>

      {/* Support Highlights */}
      <section className="py-16 container mx-auto grid md:grid-cols-4 gap-6 text-center">
        {[Headphones, MessageCircle, Shield, CheckCircle].map((Icon, i) => (
          <div key={i} className="border rounded-xl p-6">
            <Icon className="mx-auto h-8 w-8 mb-3" />
            <p className="font-semibold">Premium Support</p>
            <p className="text-sm text-gray-600">
              Reliable and secure customer service
            </p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-4">Need Quick Help?</h2>
        <button className="bg-black text-white px-8 py-3 rounded">
          Visit Help Center
        </button>
      </section>
    </main>
  )
}
