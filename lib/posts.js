import fs from 'fs' // nodeJS의 라이브러리: 파일을 읽어오는 파일 시스템: server side에서만 동작한다.(node환경에서만)
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { serialize } from 'next-mdx-remote/serialize'

// process.cwd(): project root를 의미
const postsDirectory = path.join(process.cwd(), 'posts') // /posts

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$|\.mdx$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    // UTF8형식으로 파일 내용을 읽는다
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    // gray-matter를 써서 상단의 메타 데이터만 뽑아낸다
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    }
  })
  // Sort posts by date
  // date기준으로 정렬한다(날짜)
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1
    } else if (a > b) {
      return -1
    } else {
      return 0
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$|\.md$/, ''),
      },
    }
  })
}

export async function getPostData(id) {
  const fullMdPath = path.join(postsDirectory, `${id}.md`)
  const mdExist = fs.existsSync(fullMdPath)

  if (mdExist) {
    // 모든 파일을 다 읽는게 아니라 id를 파라미터로 받아서 id를 타겟팅 해서 읽는다.
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)
    const contentHtml = processedContent.toString()

    // Combine the data with the id and contentHtml
    return {
      id,
      contentHtml,
      ...matterResult.data,
    }
  } else {
    //mdx라면
    // 모든 파일을 다 읽는게 아니라 id를 파라미터로 받아서 id를 타겟팅 해서 읽는다.
    const fullPath = path.join(postsDirectory, `${id}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    const mdxSource = await serialize(matterResult.content)

    return {
      id,
      mdxSource,
      ...matterResult.data,
    }
  }
}

export async function createPost({ id, title, date, content }) {
  const fullPath = path.join(postsDirectory, `${id}.md`)

  const data = `---
title: '${title}'
date: '${date}'
---

${content}`

  // 전달받은 인자에 따라서 md 파일을 만들어서 저장해준다.
  fs.writeFileSync(fullPath, data)
}
