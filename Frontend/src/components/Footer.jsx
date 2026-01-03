import React from 'react'
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
function Footer() {
  return (
    <div>
      <footer className="bg-gray-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold">ShopEasy</h3>
                <p className="text-background/70 text-sm">
                Your one-stop shop for premium quality products at affordable prices.
                </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
                <h4 className="font-semibold">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                <li>
                    <a href="#" className="hover:text-background/80 transition-colors">
                    About Us
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-background/80 transition-colors">
                    Shop
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-background/80 transition-colors">
                    Contact
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-background/80 transition-colors">
                    Blog
                    </a>
                </li>
                </ul>
            </div>

            {/* Help */}
            <div className="space-y-4">
                <h4 className="font-semibold">Help</h4>
                <ul className="space-y-2 text-sm">
                <li>
                    <a href="#" className="hover:text-background/80 transition-colors">
                    Shipping Info
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-background/80 transition-colors">
                    Returns
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-background/80 transition-colors">
                    FAQ
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-background/80 transition-colors">
                    Track Order
                    </a>
                </li>
                </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
                <h4 className="font-semibold">Legal</h4>
                <ul className="space-y-2 text-sm">
                <li>
                    <a href="#" className="hover:text-background/80 transition-colors">
                    Privacy Policy
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-background/80 transition-colors">
                    Terms of Service
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-background/80 transition-colors">
                    Cookie Policy
                    </a>
                </li>
                <li>
                    <a href="#" className="hover:text-background/80 transition-colors">
                    Sitemap
                    </a>
                </li>
                </ul>
            </div>
            </div>

            {/* Divider */}
            <div className="border-t border-background/20 pt-8 mt-8">
            {/* Bottom Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-background/70">&copy; 2025 ShopEasy. All rights reserved.</p>

                {/* Social Icons */}
                <div className="flex items-center gap-4">
                <a href="#" className="p-2 hover:bg-background/20 rounded-lg transition-colors">
                    <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 hover:bg-background/20 rounded-lg transition-colors">
                    <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 hover:bg-background/20 rounded-lg transition-colors">
                    <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 hover:bg-background/20 rounded-lg transition-colors">
                    <Linkedin className="w-5 h-5" />
                </a>
                </div>
            </div>
            </div>
        </div>
        </footer>
    </div>
  )
}

export default Footer
