import fs from 'fs' // nodeJS의 라이브러리: 파일을 읽어오는 파일 시스템: server side에서만 동작한다.
import path from 'path'
import matter from 'gray-matter'

// process.cwd(): project root를 의미
const postsDirectory = path.join(process.cwd(), 'posts') // /posts

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

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
