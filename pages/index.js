import Head from 'next/head'
import { useEffect, useState } from 'react'
import Layout, { siteTitle } from '../components/Layout'
import { getSortedPostsData } from '../lib/posts'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import Date from '../components/Date'

// SSG
// getStaticProps, getStaticPaths등은 client-side 코드에 포함되지 않는다.
// 그렇기에 서버 사이드에서는 DB에 직접 접근하고 시크릿 키를 쓰는 등 훨씬 자유도 높은 작업을 할 수 있다.
export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData,
    },
  }
}

// server-side에서는 API Routes를 사용하지 말아야 한다.
// export async function getServerSideProps() {
//   // localhost:3000=>getStaticProps에서 동작 안됨. 빌드타임에서 localhost:3000이 떠 있어야 하는데 그렇지 않으니까.
//   // 예시로 보여주기 위한 코드. 실제로는 이렇게 쓰면 안된다.
//   // api routes는 clinet side에서 server side로 요청하기 위함이지, server to server의 요청을 위한 것은 아니기 때문.
//   const response = await fetch('http://localhost:3000/api/posts')
//   const json = await response.json()
//   return {
//     props: {
//       allPostsData: json.allPostsData,
//     },
//   }
// }

export default function Home({ allPostsData }) {
  // CSR
  // const [allPostsData, setAllPostsData] = useState([])
  // useEffect(() => {
  //   fetch('/api/posts')
  //     .then((res) => res.json())
  //     .then((data) => setAllPostsData(data.allPostsData))
  // }, [])

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          생활의 전문가와 소비자를 연결하는 O2O 플랫폼 <strong>숨고</strong>를
          운영하는 <strong>브레이브 모바일</strong>의 프론트엔드 엔지니어로
          재직중입니다. 사용자가 원하는 지점에 도달하기까지의 프로세스 전반을
          고민하고 개선하는 일에 관심이 많습니다.
        </p>
        <h2 className={utilStyles.headingLg}>Posts</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}
