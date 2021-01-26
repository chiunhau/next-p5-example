import Head from 'next/head'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic'

const P5Wrapper = dynamic(() => import('../components/P5Wrapper'),{ ssr: false });

export default function Home() {
  return (
    <div className={styles.container}>
      <P5Wrapper id="p5-wrapper"/>
    </div>
  )
}
