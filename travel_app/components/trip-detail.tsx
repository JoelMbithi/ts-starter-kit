"use client"

import { Trip } from "@/app/generated/prisma"
import Image from "next/image"
import { Calendar, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { useState } from "react"

interface TripDetailClientProps {
  trip: Trip
}

export default function TripDetailClient({ trip }: TripDetailClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "map">("overview")

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Trip Image */}
      {trip.imageUrl && (
        <div className="w-full h-72 md:h-96 overflow-hidden rounded-xl shadow-lg relative">
          <Image
            src={trip.imageUrl}
            alt={trip.title}
            className="object-cover"
            fill
            priority
          />
        </div>
      )}

      {/* Trip Info */}
      <div className="bg-white p-6 shadow rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">{trip.title}</h1>
          <div className="flex items-center mt-1 text-gray-500">
            <Calendar className="h-5 w-5 mr-2" />
            <span className="text-sm">
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
            </span>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <Link href={`/trips/${trip.id}/itinerary/new`}>
            <Button className="ring-1 ring-slate-400 bg-white text-black hover:text-white hover:bg-black">
              <Plus className="w-5 h-5 mr-1" />
              Add Location
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white p-6 shadow rounded-lg">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="text-lg">Overview</TabsTrigger>
            <TabsTrigger value="itinerary" className="text-lg">Itinerary</TabsTrigger>
            <TabsTrigger value="map" className="text-lg">Map</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Trip Summary</h2>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <Calendar className="h-6 w-6 mr-3 text-gray-500"/>
                            <div>
                                <p className="font-medium text-gray-700">Dates</p>
                                <p className="text-sm text-gray-500">
                                    {formatDate(trip.startDate)} – {formatDate(trip.endDate)}

                                    <br />
                                    {`${Math.round(
                                        (trip.endDate.getTime() - trip.startDate.getTime())/ (1000 * 60 * 60 * 24)
                                    )} days(s)`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="itinerary">Itinerary content here</TabsContent>
          <TabsContent value="map">Map content here</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
