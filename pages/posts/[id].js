import { MDXRemote } from 'next-mdx-remote'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Date from '../../components/Date'
import Layout from '../../components/Layout'
import CodeBlock from '../../components/CodeBlock'
import { getAllPostIds, getPostData } from '../../lib/posts'
import utilStyles from '../../styles/utils.module.css'

export async function getStaticPaths() {
  const paths = getAllPostIds()
  // const paths = [
  //   {
  //     params: {
  //       id: 'ssg-ssr',
  //     },
  //   },
  // ]
  return {
    paths,
    // fallback 옵션: 빌드시 생성되지 않은 page에 대한 처리에 관련된 옵션
    fallback: true,
    // false: 빌드타임에 없으면 별도 처리하지 않겠다. 404 보여주겠다.
    // true: 지금은(build time에는) 데이터가 없을 수 있지만 fallback을 그려놓고 기다렸다가 데이터가 오면(런타임에) 다시 그릴게!
    // blocking: 지금은(build time에는) 데이터가 없을 수 있지만 fallback을 그려놓지 않고 기다렸다가 데이터가 오면(런타임에) 그때 그릴게!
  }
}

export async function getStaticProps({ params }) {
  // getPostData가 Promise를 리턴하기 때문
  const postData = await getPostData(params.id)
  return {
    props: {
      postData,
    },
  }
}

const Button = ({ children }) => {
  return (
    <button
      className="bg-black dark:bg-white text-lg text-teal-200 dark:text-teal-700 rounded-lg px-5"
      onClick={() => alert(`thanks to ${children}`)}
    >
      {children}
    </button>
  )
}

const components = { Button, CodeBlock }

export default function Post({ postData }) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        {postData.contentHtml && (
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        )}
        {postData.mdxSource && (
          <MDXRemote {...postData.mdxSource} components={components} />
        )}
      </article>
    </Layout>
  )
}
