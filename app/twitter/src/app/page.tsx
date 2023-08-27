import Header from './component/Header'
import NewTweet from './component/NewTweet'
import PostFeed from './component/Post/PostFeed'

export default function Home() {
  return (
    <div className=''>
      <Header label='Home'/>
      <NewTweet />
      <PostFeed />
    </div>
  )
}