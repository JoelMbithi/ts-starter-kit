import CompanionAI from "@/components/CompanionSound/CompanionAI";
import { subjectsColors } from "@/constants";
import { getCompanion } from "@/lib/actions/companion.action";

import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

interface CompanionSessionPageProps {
  params: Promise<{ id: string }>;
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
  const { id } = await params;
  const companion = await getCompanion(id);
  const user = await currentUser();
const { name,subject,title,topic,duration} = companion
  if (!user) redirect("/sign-in");
  if (!companion) redirect("/companion");

  const subjectKey = companion.subject?.toLowerCase() as keyof typeof subjectsColors;
  const backgroundColor =
    subjectsColors[subjectKey] || companion.color || "#E5E7EB";

  return (
    <main>
      <article className="flex rounded-border justify-between p-6 max-md:flex-col">
        <div className="flex items-center gap-2">
          <div
            className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
            style={{ backgroundColor }}
          >
            <Image
              src={`/icons/${companion.subject}.svg`}
              alt="companion.subject"
               width={35}
               height={35}
            />
            
          </div>
          <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{companion.name}</span>
              <div className="subject-badge">
             {companion.topic}
          </div>
          </div>
           <p className="text-lg">{companion.topic}</p>
          </div>
          
        </div>
        <div className="items-start text-2xl max-md:hidden">{companion.duration} minutes</div>
      </article>
      <CompanionAI
      {...companion}
      companionId={id}
      userName={user.firstName!}
      userImage={user.imageUrl!}
      />
    </main>
  );
};

export default CompanionSession;
