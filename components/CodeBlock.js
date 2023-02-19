import SyntaxHighlighter from 'react-syntax-highlighter'
import { vs2015 } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

const CopyButton = ({ target }) => {
  const handleCopy = async () => {
    if (target) {
      try {
        await navigator.clipboard.writeText(target)
        alert('copied')
      } catch (error) {
        alert(`copy failed ${error}`)
      }
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute right-0.5 top-0.5 rounded-lg px-2 bg-white dark:text-gray-800"
    >
      copy
    </button>
  )
}

export default function CodeBlock({ children }) {
  return (
    <div className="relative">
      <CopyButton target={children} />
      <SyntaxHighlighter showLineNumbers style={vs2015}>
        {children}
      </SyntaxHighlighter>
    </div>
  )
}
