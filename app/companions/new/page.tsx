import CompanionForm from '@/components/companion/CompanionForm'
import { newCompanionPermission } from '@/lib/actions/companion.actions';
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

const NewCompanion = async () => {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in')

    const canCreateCompanion = await newCompanionPermission();

    return (
        <main className='min-lg:w-1/3 min-md:w-2/3 items-center justify-center mx-auto'>
            {
                canCreateCompanion ? (
                    <article className='w-full flex flex-col gap-4'>
                        <h1>Companion Builder</h1>
                        <CompanionForm />
                    </article>
                ) : (
                    <article className='companions-limit'>
                        <Image src={'/images/limit.svg'} alt="limit" width={360} height={230} />
                        <div className='cta-badge'>
                            Upgrade your plan
                        </div>
                        <h1>You have reached your limit</h1>
                        <p>You have reached the maximum number of companions you can create. Upgrade your plan to create more.</p>
                        <Link href={'/subscription'} className='btn-primary'>
                                Upgrade my plan
                        </Link>
                    </article>
                )
            }
        </main>
    )
}

export default NewCompanion
