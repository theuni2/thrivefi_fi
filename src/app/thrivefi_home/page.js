import React from 'react'
import Hero from '../../components/thriveFi/hero'
import Nav from '../../components/nav'
import Event from '../../components/thriveFi/event'
import Getinvolve from '../../components/thriveFi/getinvolved'
import Footer from '../../components/thriveFi/footer'
import Slider from '../../components/slider'
// import ParallaxCards from '../component/sliderp'
import ThreeCsSlider from '../../components/sliderp'
import Sec1 from '../../components/sec'
import Marquee from '../../components/mar'

// import ParticleSphereCanvas from '../component/ParticleSphereCanvas'


export default function Page() {
  return (
    <div className='bg-white'>
        <Nav/>
        <Slider/>
        {/* <Hero/> */}
        <Sec1/>
        {/* <ParticleSphereCanvas/> */}
        <Marquee/>
        <Event/>
        {/* <ParallaxCards/>
         */}
         {/* <ThreeCsParallax/> */}
         <ThreeCsSlider/>
        {/* <Getinvolve/> */}
        <Footer/>

    </div>
  )
}
