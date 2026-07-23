"use client";

import { Star, Quote, CheckCircle2 } from "lucide-react";

export function CustomerReviews() {
  const reviews = [
    {
      id: "r1",
      name: "Victoria Sterling",
      location: "New York, USA",
      role: "Vogue VIP Subscriber",
      rating: 5,
      title: "Surpassed The Row & Khaite",
      text: "The Soren Cowl dress fabric weight is unmatched. The silk satin drapes effortlessly down the waist. Delivery arrived in 48 hours to Manhattan.",
      product: "Soren Cowl Satin Midi Dress",
    },
    {
      id: "r2",
      name: "Charlotte Laurent",
      location: "Paris, France",
      role: "Verified Atelier Client",
      rating: 5,
      title: "Runway quality suiting",
      text: "The Aura linen blazer fits like bespoke tailoring from Rue Saint-Honoré. Crisp shoulders, perfect wide-leg crease. UNI is my new go-to.",
      product: "Aura Double-Breasted Suit",
    },
    {
      id: "r3",
      name: "Anastasia Volkov",
      location: "London, UK",
      role: "Luxury Stylist",
      rating: 5,
      title: "Sculpting perfection",
      text: "Bought the Valeria corset bodysuit for red carpet styling. Holds shape without restricting breathability. Phenomenal packaging & presentation.",
      product: "Valeria Sculpt Bodysuit",
    },
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12 border-t border-neutral-200/40">
      <div className="text-center space-y-3 mb-16">
        <span className="text-[10px] font-label uppercase tracking-[0.3em] text-[#706C66] font-semibold block">
          CLIENT PRAISE
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury font-light uppercase tracking-[0.08em] text-[#1A1A1A]">
          EDITORIAL TESTIMONIALS
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white p-8 rounded-[20px] border border-neutral-200/50 shadow-luxury-xs flex flex-col justify-between space-y-6 hover:shadow-luxury-md transition-shadow duration-500"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex text-[#C8A46B]">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C8A46B] stroke-none" />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-neutral-200 stroke-[1]" />
              </div>

              <h3 className="text-lg font-serif-luxury font-medium text-[#1A1A1A] uppercase tracking-wide">
                "{r.title}"
              </h3>
              <p className="text-xs text-[#706C66] leading-relaxed font-sans font-light">
                "{r.text}"
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold font-label text-[#1A1A1A] flex items-center">
                  <span>{r.name}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-700 ml-1.5" />
                </h4>
                <p className="text-[10px] font-label text-[#706C66] uppercase tracking-wider">
                  {r.location} • {r.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
