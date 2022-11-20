import Link from 'next/link'
import { useRef, useState } from 'react'
import Layout from '../../components/Layout'

export default function write() {
  const idRef = useRef(undefined)
  const titleRef = useRef(undefined)
  const contentRef = useRef(undefined)

  const [showLink, setShowLink] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()

    const id = idRef.current.value
    const title = titleRef.current.value
    const content = contentRef.current.value

    if (id && title && content) {
      fetch('/api/post/write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title,
          content,
        }),
      })
        .then((response) => {
          // fetch() promise는 HTTP error에 의해 reject되지 않는다.
          // 그래서 resonse.ok로 에러처리를 대응한다
          if (response.ok) {
            return response.json()
          }
          throw new Error('Fetch error')
        })
        .then((data) => {
          setShowLink(true)
          alert(data.message)
        })
        .catch((error) => alert(`request error: ${error}`))
    }
  }
  return (
    <Layout>
      <h1>Write a Post</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="id" placeholder="id" required ref={idRef} />
        <br />
        <input
          type="text"
          name="title"
          placeholder="title"
          required
          ref={titleRef}
        />
        <br />
        <textarea
          type="text"
          name="content"
          placeholder="content"
          required
          ref={contentRef}
        />
        <br />
        <input type="submit" value="Create" />
      </form>
      {showLink && (
        <Link href={`/posts/${idRef.current.value}`}>Created Post</Link>
      )}
    </Layout>
  )
}
