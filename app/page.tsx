import CompanionCards from '@/components/companion/CompanionCards'
import CompanionsList from '@/components/companion/CompanionsList'
import Cta from '@/components/companion/Cta'
import React from 'react'

const Page = () => {
  return (
    <main>
      
      <h1 className='text-2xl underline'>Popular Companions</h1>
      
      <section className=' home-section'>
        
        <CompanionCards
          id="123"
          name="Neura the Brainy Explorer"
          topic="Neural Network of Brain"
          subject="Science"
          duration={45}
          color="#ffda6e"
        />

        <CompanionCards
          id="456"
          name="Countsy the number wizard"
          topic="Derivatives and Integrals"
          subject="Maths"
          duration={30}
          color="#e5d0ff"
        />

        <CompanionCards
          id="789"
          name="Verba the Language Master"
          topic="English Grammar"
          subject="Language"
          duration={30}
          color="#bde7ff"
        />
      </section>

      <section className='home-section'>
        <CompanionsList/>
        <Cta/>
      </section>
    </main>
  )
}

export default Page