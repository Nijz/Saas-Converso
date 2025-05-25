import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Cta = () => {
    return (
        <section className='cta-section'>
            <div className='cta-badge'>
                Start learning your way.
            </div>
            <h2 className='text-3xl font-bold'> Build and Personalized learning companion</h2>
            <p>Pick a name, subject, voice, & personality -- and start learning through voice converstions that feel natural and fun.</p>
            <Image
                src={'/images/cta.svg'}
                alt='cta-illustration'
                width={362}
                height={232}
            />

            <button className='btn-primary'>
                <Image src={"/icons/plus.svg"} alt='plus' width={12} height={12} />
                <Link href={'/companions/new'}>
                    <p>Build a new companion</p>
                </Link>
            </button>
        </section>
    )
}

export default Cta
