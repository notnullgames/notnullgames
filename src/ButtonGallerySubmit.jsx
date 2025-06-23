export default function ButtonGallerySubmit({ className, children, ...props }) {
  return (
    <button className={`btn ${className || ''}`} {...props}>
      {children || 'Submit'}
    </button>
  )
}
