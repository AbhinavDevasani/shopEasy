

import { Target, Lightbulb, Zap, Award, Lock, Clock } from "lucide-react"
import { Link } from "react-router-dom"

export default function AboutPage() {
  const missionVisionCards = [
    {
      icon: Target,
      title: "Our Mission",
      description: "Deliver quality products with unmatched convenience and exceptional customer service.",
    },
    {
      icon: Lightbulb,
      title: "Our Vision",
      description: "Reinvent online shopping for everyone by making it more accessible, affordable, and delightful.",
    },
  ]

  const features = [
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Get your orders delivered quickly with our efficient logistics network.",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Every product is carefully curated to meet our high quality standards.",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "Your transactions are protected with industry-leading security measures.",
    },
    {
      icon: Clock,
      title: "24/7 Customer Support",
      description: "Our dedicated team is always ready to assist you, anytime, anywhere.",
    },
  ]

  const team = []

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "10K+", label: "Premium Products" },
    { number: "4.9/5", label: "Average Rating" },
  ]
  return (
    <div>
      <div className="bg-background text-foreground">
        {/* Hero Section */}
        <div className="relative h-screen flex items-center justify-center overflow-hidden bg-linear-to-b from-secondary to-background">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                "url(/placeholder.svg?height=1080&width=1920&query=modern-ecommerce-shopping-lifestyle)",
            }}
          />

          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-transparent" />

          <div className="relative z-10 text-center  max-w-3xl mx-auto px-4 md:px-6">
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 text-balance">
              About NextBuy
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-15 text-balance leading-relaxed">
              Your trusted destination for premium, affordable, and quality-driven shopping.
            </p>

            {/* Replaced Button */}
            <Link to={"/shop"} 
              className="bg-sky-600 cursor-pointer text-white hover:bg-accent/90 text-accent-foreground rounded-lg px-8  py-5 text-base font-semibold"
            >
              Explore Our Collections
            </Link>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="py-16 md:py-24 px-4 md:px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              <div className="flex justify-center">
                <img
                  className="w-full h-96 md:h-[400px] rounded-2xl bg-cover bg-center shadow-lg"
                  src="https://res.cloudinary.com/dnx2ozxvd/image/upload/v1765343924/Screenshot_2025-12-10_104801_ao4wsm.png"
                />
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-balance">Our Story</h2>

                <p className="text-foreground/80 text-lg leading-relaxed mb-4">
                  NextBuy was founded on a simple mission: to make premium shopping accessible to everyone.
                </p>
                <p className="text-foreground/80 text-lg leading-relaxed mb-4">
                  We have grown from a small startup to a trusted platform serving thousands of customers worldwide.
                </p>
                <p className="text-foreground/80 text-lg leading-relaxed">
                  Today, NextBuy continues to innovate and expand our offerings with customer needs in mind.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="py-16 md:py-24 px-4 md:px-6 bg-secondary">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-16 text-balance">
              Mission & Vision
            </h2>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {missionVisionCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <div
                    key={index}
                    className="bg-background rounded-2xl p-8 md:p-10 shadow-sm border border-border hover:shadow-md transition-shadow"
                  >
                    <Icon className="w-12 h-12 text-blue-800 mb-6" strokeWidth={1.5} />
                    <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">{card.title}</h3>
                    <p className="text-foreground/70 text-lg leading-relaxed">{card.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="py-16 md:py-24 px-4 md:px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-16">
              Why Choose NextBuy
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="bg-secondary rounded-2xl p-8 hover:shadow-md transition-shadow border border-border"
                  >
                    <Icon className="w-10 h-10 text-blue-800 mb-6" strokeWidth={1.5} />
                    <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                    <p className="text-foreground/70 leading-relaxed text-sm">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16 md:py-24 px-4 md:px-6 bg-secondary">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-16">Meet Our Team</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border"
                >
                  <img className="h-64 w-full  bg-cover bg-center" src={member.image}/>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-1">{member.name}</h3>
                    <p className="text-accent font-semibold text-sm mb-3">{member.role}</p>
                    <p className="text-foreground/70 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 md:py-24 px-4 md:px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-accent mb-4">{stat.number}</div>
                  <p className="text-foreground/70 text-lg md:text-xl font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="py-16 md:py-24 px-4 md:px-6 bg-gray-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Start Shopping with Confidence
            </h2>

            <p className="text-lg text-primary-foreground/90 mb-8 leading-relaxed">
              Join thousands of satisfied customers and experience premium shopping like never before.
            </p>

            {/* Replaced Button */}
            <Link to={"/shop"} 
              className="bg-white text-gray-800 cursor-pointer hover:bg-gray-300 rounded-lg px-8 py-4 text-base font-semibold"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
