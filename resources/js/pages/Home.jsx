import React from 'react'
import Header from '../components/Header'
import SpecalityMenu from '../components/SpecalityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import Div from '../common/Div'

const Home = () => {
  return (
    <Div>
      <Header/>
      <SpecalityMenu/>
      <TopDoctors/>
      <Banner/>
    </Div>
  )
}

export default Home
