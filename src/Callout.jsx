export default function Callout({ emoji, type, children }) {
  return (
    <div role='alert' className={`alert text-xl p-4${type ? ` alert-${type}` : ''}`}>
      {emoji && <span className='text-4xl'>{emoji}</span>}
      <span>{children}</span>
    </div>
  )
}
