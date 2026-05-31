"use client"
import { useState } from "react"
import Link from "next/link"

type Step = { question: string; key: string; options: { label: string; emoji: string; value: string }[] }

const STEPS: Step[] = [
  {
    question: "Who are you shopping for?",
    key: "recipient",
    options: [
      { label: "Partner / Spouse",  emoji: "💑", value: "partner"   },
      { label: "Mum",               emoji: "🌸", value: "mum"       },
      { label: "Dad",               emoji: "👨", value: "dad"       },
      { label: "Friend",            emoji: "🤝", value: "friend"    },
      { label: "Child / Baby",      emoji: "🍼", value: "child"     },
      { label: "Colleague",         emoji: "💼", value: "colleague" },
    ],
  },
  {
    question: "What's the occasion?",
    key: "occasion",
    options: [
      { label: "Birthday",     emoji: "🎂", value: "Birthday"    },
      { label: "Wedding",      emoji: "💍", value: "Wedding"     },
      { label: "Anniversary",  emoji: "❤️", value: "Anniversary" },
      { label: "New Baby",     emoji: "🍼", value: "Baby"        },
      { label: "Graduation",   emoji: "🎓", value: "Graduation"  },
      { label: "Just Because", emoji: "🎁", value: "Other"       },
    ],
  },
  {
    question: "What's your budget?",
    key: "budget",
    options: [
      { label: "Under $25",   emoji: "💸", value: "under25"  },
      { label: "$25 – $50",   emoji: "💰", value: "25to50"   },
      { label: "$50 – $100",  emoji: "💎", value: "50to100"  },
      { label: "No limit!",   emoji: "👑", value: "nolimit"  },
    ],
  },
  {
    question: "What vibe are you going for?",
    key: "vibe",
    options: [
      { label: "Sentimental & heartfelt", emoji: "💌", value: "sentimental" },
      { label: "Fun & playful",           emoji: "🎉", value: "fun"         },
      { label: "Practical & useful",      emoji: "🛠️", value: "practical"  },
      { label: "Luxurious & premium",     emoji: "✨", value: "luxury"      },
    ],
  },
]

const RECOMMENDATIONS: Record<string, { title: string; handle: string; reason: string; price: string }[]> = {
  default: [
    { title: "Birthday Gift Box",        handle: "birthday-gift-box",          reason: "The all-in-one personalised set — always a winner.",   price: "$59.99" },
    { title: "NFC Birthday Card",        handle: "nfc-birthday-card",          reason: "High-tech, emotional, and impossible to forget.",      price: "$24.99" },
    { title: "Engraved Wooden Keychain", handle: "engraved-wooden-keychain",   reason: "A timeless keepsake that goes everywhere with them.",  price: "$14.99" },
  ],
  partner: [
    { title: "Engraved Jewelry Box",  handle: "engraved-wooden-jewelry-box",  reason: "She'll display it with pride every single day.",          price: "$49.99" },
    { title: "NFC Anniversary Card",  handle: "nfc-anniversary-card",          reason: "Tap to unlock your love story.",                          price: "$24.99" },
    { title: "Wedding Bundle",        handle: "wedding-bundle",                reason: "The ultimate couple's keepsake set.",                      price: "$99.99" },
  ],
  mum: [
    { title: "Personalised Canvas Print", handle: "personalised-canvas-photo-print", reason: "A family photo she'll hang on the wall forever.",  price: "$49.99" },
    { title: "Custom Photo Mug",          handle: "custom-printed-photo-mug",         reason: "Smiles with every morning coffee.",                 price: "$19.99" },
    { title: "Engraved Jewelry Box",      handle: "engraved-wooden-jewelry-box",      reason: "Timeless and treasured.",                           price: "$49.99" },
  ],
}

export default function GiftFinderPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const handleAnswer = (key: string, value: string) => {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      setDone(true)
    }
  }

  const recommendations = RECOMMENDATIONS[answers.recipient] || RECOMMENDATIONS.default
  const current = STEPS[step]

  if (done) {
    return (
      <div className="min-h-screen bg-cream-50 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🎁</div>
          <h1 className="font-serif text-4xl font-bold text-charcoal-900 mb-4">
            Your Perfect Gift Picks
          </h1>
          <p className="text-gray-500 font-sans mb-12">
            Based on your answers, here are our top recommendations for you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {recommendations.map((r, i) => (
              <Link key={r.handle} href={`/products/${r.handle}`} className="group block text-left">
                <div className="bg-white rounded-2xl p-5 border border-gold-100 hover:border-gold-300 hover:shadow-gold-md transition-all">
                  <div className="text-xs font-sans text-gold-500 font-semibold mb-2">#{i + 1} Pick</div>
                  <h3 className="font-serif font-bold text-charcoal-900 mb-2 group-hover:text-gold-600 transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-sans mb-3 leading-relaxed">{r.reason}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gold-600 font-sans">{r.price}</span>
                    <span className="text-xs text-gold-500 font-sans group-hover:underline">Shop now →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { setStep(0); setAnswers({}); setDone(false) }}
              className="btn-outline"
            >
              Start Again
            </button>
            <Link href="/shop" className="btn-primary">
              Browse All Gifts
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 py-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-sans text-gray-400">Step {step + 1} of {STEPS.length}</span>
            <button onClick={() => step > 0 && setStep(step - 1)} className="text-sm text-gold-500 hover:underline font-sans" disabled={step === 0}>
              ← Back
            </button>
          </div>
          <div className="w-full bg-gold-100 rounded-full h-2">
            <div
              className="bg-gold-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="text-center mb-10">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900 mb-2">
            Gift Finder
          </h1>
          <h2 className="font-serif text-xl text-gray-600">{current.question}</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {current.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(current.key, opt.value)}
              className="flex flex-col items-center p-5 bg-white rounded-2xl border-2 border-gray-100 hover:border-gold-400 hover:bg-gold-50 transition-all group"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{opt.emoji}</span>
              <span className="font-sans text-sm font-medium text-charcoal-800 text-center group-hover:text-gold-700">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
