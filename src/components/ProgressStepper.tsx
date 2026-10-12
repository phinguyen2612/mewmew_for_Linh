import { Check } from 'lucide-react'

const steps = ['Pick your photos', 'Meet the camera', 'Make a little magic']

export function ProgressStepper({ activeStep }: { activeStep: number }) {
  return (
    <ol className="stepper" aria-label="Studio progress">
      {steps.map((step, index) => {
        const number = index + 1
        const complete = number < activeStep
        const active = number === activeStep
        return (
          <li key={step} className={`step ${active ? 'step-active' : ''}`}>
            <span className={`step-number ${complete ? 'step-complete' : ''}`}>{complete ? <Check size={14} /> : number}</span>
            <span className="hidden sm:inline">{step}</span>
          </li>
        )
      })}
    </ol>
  )
}
