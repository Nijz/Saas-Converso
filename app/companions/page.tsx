import SearchInput from "@/components/common/SearchInput";
import CompanionCards from "@/components/companion/CompanionCards";
import SubjectFilter from "@/components/companion/SubjectFilter";
import { getAllCompanions } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";

const CompanionsLibrary = async ({searchParams}: SearchParams) => {

    const params = await searchParams;
    const subject = params.subject ? params.subject : '';
    const topic = params.topic ? params.topic : '';

    const companions = await getAllCompanions({subject, topic})

    return (
        <main>
            <section className="flex justify-between gap-4 max-sm:flex-col">
                <h1>Companion Library</h1>
                <div className="flex gap-4 ">
                    <SearchInput/>
                    <SubjectFilter/>
                </div>
            </section>
            <section className="companions-grid">
                {
                    companions.length > 0 && companions.map((companion) => (
                        <CompanionCards
                            key={companion.id}
                            {...companion}
                            color={getSubjectColor(companion.subject)}
                        />
                    ))
                }
            </section>
        </main>
    )
}

export default CompanionsLibrary
