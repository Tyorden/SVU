/**
 * Tooltip Component
 *
 * Displays a help icon that shows a definition on hover.
 * Used throughout the UI to explain terminology from the dataset.
 */

import { useState } from 'react'

interface TooltipProps {
  term: string
  definition: string
}

export default function Tooltip({ term, definition }: TooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <span className="relative inline-block">
      <button
        type="button"
        className="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs text-slate-400 hover:text-slate-600 rounded-full border border-slate-300 hover:border-slate-400 transition-colors cursor-help"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        aria-label={`Definition of ${term}`}
      >
        ?
      </button>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg">
          <div className="font-semibold mb-1">{term}</div>
          <div className="text-slate-300">{definition}</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
            <div className="border-8 border-transparent border-t-slate-800" />
          </div>
        </div>
      )}
    </span>
  )
}

/**
 * Inline term with tooltip
 */
interface TermWithTooltipProps {
  term: string
  definition: string
  children?: React.ReactNode
}

export function TermWithTooltip({ term, definition, children }: TermWithTooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <span
      className="relative inline-block border-b border-dashed border-slate-400 cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children || term}
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg">
          <div className="font-semibold mb-1">{term}</div>
          <div className="text-slate-300">{definition}</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
            <div className="border-8 border-transparent border-t-slate-800" />
          </div>
        </div>
      )}
    </span>
  )
}
