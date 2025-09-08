"use server"
import TripDetailClient from "@/components/trip-detail"
import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export default async function TripDetail({
  params,
}: {
  params: { tripId: string }
}) {
  const { tripId } = params
  const session = await getSession()

  if (!session) {
    return <div>Please sign in!</div>
  }

  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: session.user?.id },
  })

  if (!trip) {
    return <div>Trip not found</div>
  }

  return <TripDetailClient trip={trip} />
}
