import CompanionsList from "@/components/companion/CompanionsList"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getUserCompanions, getUserSessions } from "@/lib/actions/companion.actions"
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image"
import { redirect } from "next/navigation"


const Profile = async () => {

  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const userCompanions = await getUserCompanions(user?.id)
  const userSessions = await getUserSessions(user?.id)

  return (
    <main className='min-lg:w-3/4'>
      <section className="flex justify-between gap-4 max-sm:flex-col items-center">
        <div className="flex gap-4 items-center">
          <Image src={user?.imageUrl} alt={user.firstName!} width={120} height={120} className='rounded-full' />
          <div className='flex flex-col gap-2'>
            <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
            <p className="text-sm text-muted-foreground ">{user.emailAddresses[0].emailAddress}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="border border-black rounded-lg flex flex-col h-fit gap-2 p-3 ">
            <div className="flex gap-2 items-center">
              <Image src={'/icons/check.svg'} alt="check" width={24} height={24} />
              <p className="text-2xl font-bold">{userSessions.length}</p>
              <div>Lessons completed</div>
            </div>
          </div>
          <div className="border border-black rounded-lg flex flex-col h-fit gap-2 p-3 ">
            <div className="flex gap-2 items-center">
              <Image src={'/icons/cap.svg'} alt="check" width={24} height={24} />
              <p className="text-2xl font-bold">{userCompanions.length}</p>
              <div>Companions created</div>
            </div>
          </div>
        </div>
      </section>
      <Accordion type="multiple">
        <AccordionItem value="recent">
          <AccordionTrigger className="text-2xl font-bold">Recent Sessions</AccordionTrigger>
          <AccordionContent>
            <CompanionsList
              title="Recent Companions"
              companions={userSessions}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="companions">
          <AccordionTrigger className="text-2xl font-bold">My companions {`(${userCompanions.length})`}</AccordionTrigger>
          <AccordionContent>
            <CompanionsList
            title="My companions"
            companions={userCompanions}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  )
}

export default Profile
