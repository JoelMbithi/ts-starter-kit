"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
  test: string;
}

const CompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
}: CompanionCardProps) => {
  const [loading, setLoading] = useState(false);

  const handleLaunch = () => {
    setLoading(true);
  };

  return (
    <article
      className={`companion-card ${color}`}
      style={{ backgroundColor: color }}
    >
      <div className="flex justify-between items-center">
        <div className="subject-badge">{subject}</div>
        <div className="companion-bookmark">
          <Image src="/icons/bookmark.svg" alt="bookmark" width={12} height={15} />
        </div>
      </div>

      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-sm">{topic}</p>

      <div className="flex items-center gap-2">
        <Image src="/icons/clock.svg" alt="duration" width={13} height={13} />
        <p className="text-sm">{duration} minutes</p>
      </div>

      <Link href={`/companion/newCompanion/${id}`} onClick={handleLaunch}>
        <button
          className="btn-primary w-full justify-center flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2
              
              />
              Loading...
            </>
          ) : (
            "Launch Lesson"
          )}
        </button>
      </Link>
    </article>
  );
};

export default CompanionCard;
