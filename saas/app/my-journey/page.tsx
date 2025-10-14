import CompanionList from "@/components/Companion/CompanionList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getUserCompanions, getUserSessions } from "@/lib/actions/companion.action";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const Myjourney = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      {/* --- USER PROFILE SECTION --- */}
      <section className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-6 rounded-2xl shadow-sm flex justify-between items-center gap-6 flex-wrap">
        {/* User Info */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <Image
              src={user.imageUrl}
              alt={user.firstName ?? "User"}
              width={110}
              height={110}
              className="rounded-full border-4 border-white shadow-md"
            />
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-gray-800">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600 text-sm">{user.emailAddresses[0].emailAddress}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 max-sm:w-full max-sm:justify-center">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-40 hover:shadow-md transition">
            <div className="flex items-center gap-2">
              <Image src="/icons/check.svg" alt="Lessons" width={24} height={24} />
              <p className="text-3xl font-bold text-blue-600">{sessionHistory.length}</p>
            </div>
            <p className="text-gray-600 text-sm mt-1">Lessons Completed</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-40 hover:shadow-md transition">
            <div className="flex items-center gap-2">
              <Image src="/icons/cap.svg" alt="Sessions" width={24} height={24} />
              <p className="text-3xl font-bold text-purple-600">{companions.length}</p>
            </div>
            <p className="text-gray-600 text-sm mt-1">Sessions Created</p>
          </div>
        </div>
      </section>

      {/* --- ACCORDIONS --- */}
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <Accordion type="multiple" className="space-y-4">
          {/* Recent Sessions */}
          <AccordionItem value="recent">
            <AccordionTrigger className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition">
              Recent Sessions
            </AccordionTrigger>
            <AccordionContent>
              <CompanionList
                title="Recent Sessions"
                companions={sessionHistory.map((s: any) => ({
                  id: s.id,
                  subject: s.subject || "General",
                  name: s.name || "Unnamed Session",
                  topic: s.topic || "No topic",
                  duration: s.duration || 0,
                  bookmark: false,
                }))}
              />
            </AccordionContent>
          </AccordionItem>

          {/* My Companions */}
          <AccordionItem value="companions">
            <AccordionTrigger className="text-2xl font-bold text-gray-800 hover:text-purple-600 transition">
              My Sessions ({companions.length})
            </AccordionTrigger>
            <AccordionContent>
              <CompanionList title="My Companions" companions={companions} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  );
};

export default Myjourney;
