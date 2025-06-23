export default function Callout({ emoji, className, children }) {
  return (
    <div role='alert' className={`alert text-xl p-4 ${className}`}>
      {emoji && <span className='text-4xl'>{emoji}</span>}
      <span>{children}</span>
    </div>
  )
}
