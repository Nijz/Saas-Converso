import CompanionCards from '@/components/companion/CompanionCards'
import CompanionsList from '@/components/companion/CompanionsList'
import Cta from '@/components/companion/Cta'
import { getAllCompanions, getRecentSessions } from '@/lib/actions/companion.actions'
import { getSubjectColor } from '@/lib/utils'
import React from 'react'

const Page = async () => {

  const companions = await getAllCompanions({limit: 3}) 
  const recentSessions = await getRecentSessions(10)

  return (
    <main>
      
      <h1 className='text-2xl underline'>Popular Companions</h1>
      
      <section className=' home-section'>
        
        {
          companions.length > 0 && companions.map((companion) => (
            <CompanionCards
              id={companion.id}
              key={companion.id}
              name={companion.name}
              topic={companion.topic}
              subject={companion.subject}
              duration={companion.duration}
              color={getSubjectColor(companion.subject)}
            />
          ))
        }

      </section>

      <section className='home-section'>
        <CompanionsList
          title="Recent completed sessions"
          companions={recentSessions}
          classNames="w-2/3 max-lg:w-full"
        />
        <Cta/>
      </section>
    </main>
  )
}

export default Page