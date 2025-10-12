"use client"

interface PricingToggleProps {
  isYearly: boolean
  onToggle: (isYearly: boolean) => void
}

export default function PricingToggle({ isYearly, onToggle }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center mb-12">
      <div className="flex items-center bg-blueish-black/40 rounded-lg p-1">
        <button
          onClick={() => onToggle(false)}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            !isYearly
              ? 'bg-gray-blue text-primary-black shadow-sm'
              : 'text-light-gray hover:text-creme-white'
          }`}
        >
          Monatlich
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            isYearly
              ? 'bg-gray-blue text-primary-black shadow-sm'
              : 'text-light-gray hover:text-creme-white'
          }`}
        >
          Jährlich
          <span className="ml-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
            -20%
          </span>
        </button>
      </div>
    </div>
  )
}
