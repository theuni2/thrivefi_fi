import React from 'react'
import Nav from '../../components/nav'
import Hero from '../../components/regenvest_home/hero'
import Bout from '../../components/regenvest_home/about'
import Time from '../../components/regenvest_home/time'
import Downhero from '../../components/regenvest_home/downhero'
import Fre from '../../components/regenvest_home/fre'
import Footer from '../../components/thriveFi/footer'
import Sponser from '../../components/regenvest_home/sponser'
import CommentSection from '../../components/comment'
import ResultsAndWinners from '../../components/regenvest_home/result'

export default function Page() {
  return (
    <div>

<Nav/>
<Hero/>
<Bout/>
<ResultsAndWinners/>
{/* <Time/> */}
<Downhero/>
<Sponser/>
<Fre/>
<CommentSection/>
<Footer/>

    </div>
  )
}
