// app/trips/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function TripsPage() {
  const session = await getServerSession(authOptions);  

  const trips = await prisma.trip.findMany({
    where: { userId: session?.user?.id}
  })

  const sortedTrips = [...trips].sort(
    (a,b) => new Date(b.startDate).getTime() - new Date(a.endDate).getTime()
  )
  const today = new Date()
  today.setHours(0,0,0,0)
  const upComingTrips = sortedTrips.filter((trip) => new Date(trip.startDate) >= today)
  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/trips/new">
          <Button>New Trip</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Welcome back, {session?.user?.name ?? "Guest"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-500">
  {trips.length === 0 
    ? "Start planning your first trip by clicking the button above."
    : `You have ${trips.length} ${trips.length === 1 ? "trip" : "trips"} planned.${upComingTrips.length > 0 ? ` ${upComingTrips.length} upcoming.` : ""}`
  }
</CardContent>
          
          </Card>
         <div>
          <h2 className="text-xl px-4 font-semibold mb-4"> Your Recent Trips</h2>
          {trips.length ===0 ? (
            <Card className="">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <h3 className="text-xl font-medium mb-2">No trips yet!</h3>
                <p className="text-center text-slate-400 mb-4 max-w-md">
                  Ready for your next adventure? Start planning your first trip now and make unforgettable memories.
                </p>
                 <Link href="/trips/new">
                 <Button className="ring-1 ring-gray-300 bg-white text-gray-700 hover:bg-black hover:text-white">
  Create Trip
</Button>
                </Link>
               </CardContent>
            </Card>
          ) : (
             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTrips.slice(0,6).map((trip,key) => (
                <Link key={key} href={""}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="line-clamp-1">
                        {trip.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-400">
                      <p className="text-sm line-clamp-2 mb-2">
            {trip.description}
          </p>
          <div className="text-sm text-gray-500">
            {new Date(trip.startDate).toLocaleDateString()} - 
            {new Date(trip.endDate).toLocaleDateString()}
          </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
             </div>
          )}
         </div>
      
    </div>
  );
}
