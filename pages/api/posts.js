import { getSortedPostsData } from '../../lib/posts'

// API Routes
export default function handler(req, res) {
  const allPostsData = getSortedPostsData()
  res.status(200).json({
    allPostsData,
  })
}
