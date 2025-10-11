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

interface Companion {
  id: string;
  subject: string;
  name: string;
  topic: string;
  duration: string;
  color: string;
  bookmark: boolean;
}

interface CompanionListProps {
  title: string;
  companions: Companion[];
  classNames?: string;
}

const CompanionList = ({ title, companions, classNames }: CompanionListProps) => {
  return (
    <article className={cn("companion-list", classNames)}>
      <h1 className="font-bold text-2xl">{title}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg w-2/3">Lessons</TableHead>
            <TableHead className="text-lg">Subject</TableHead>
            <TableHead className="text-lg">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companions?.map((companion, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <Link href={`/companion/${companion.id}`}>
                  {companion.subject}
                </Link>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-2">
                    <p className="font-bold text-2xl">{companion.name}</p>
                    <p className="text-gray-500 text-sm">{companion.topic}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="subject-badge w-fit">{companion.subject}</div>
              </TableCell>
              <TableCell>
                <div className="flex  items-center  gap-2 w-full ">
                  <p className="text-2xl flex flex-row gap-2">{companion.duration} {''} 
                    <span className="max-md:hidden">mins</span>
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
          ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default CompanionList;
