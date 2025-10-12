import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { subjectsColors } from "@/constants";

interface Companion {
  id: string;
  subject: string;
  name: string;
  topic: string;
  duration: string | number;
  color?: string;
  bookmark: boolean;
}

interface CompanionListProps {
  title: string;
  companions: Companion[];
  classNames?: string;
}

const CompanionList = ({ title, companions, classNames }: CompanionListProps) => {
  return (
    <article className={cn("companion-list space-y-4", classNames)}>
      <h1 className="font-bold text-2xl mb-2">{title}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg w-2/3">Lessons</TableHead>
            <TableHead className="text-lg">Subject</TableHead>
            <TableHead className="text-lg">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companions?.map((companion, index) => {
            // ✅ Automatically pick a color based on subject or fallback
            const backgroundColor =
              subjectsColors[companion.subject.toLowerCase() as keyof typeof subjectsColors] ||
              companion.color ||
              "#E5E7EB"; // fallback to neutral gray

            return (
              <TableRow key={index} className="hover:bg-gray-50 transition-all">
                <TableCell className="font-medium">
                  <Link href={`/companion/${companion.id}`}>
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-xl">{companion.name}</p>
                      <p className="text-gray-500 text-sm">{companion.topic}</p>
                    </div>
                  </Link>
                </TableCell>

                <TableCell>
                  <div
                    className="subject-badge w-fit text-sm font-semibold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor,
                      color: "#000", // text color for readability
                    }}
                  >
                    {companion.subject.charAt(0).toUpperCase() + companion.subject.slice(1)}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 w-full">
                    <p className="text-lg flex items-center gap-1">
                      {companion.duration} <span className="max-md:hidden">mins</span>
                      <Image
                        src="/icons/clock.svg"
                        alt="clock"
                        width={14}
                        height={14}
                        className="md:hidden"
                      />
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </article>
  );
};

export default CompanionList;
