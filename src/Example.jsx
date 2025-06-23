// Example component that lets you use source from some other location

// preload all example files
const code = { ...import.meta.glob('../examples/**/*.js', { eager: true, query: '?raw' }), ...import.meta.glob('../examples/**/*.c', { eager: true, query: '?raw' }) }

export default function Example({ src }) {
  return (
    <pre>
      <code>{code[`../examples/${src}`]?.default}</code>
    </pre>
  )
}
