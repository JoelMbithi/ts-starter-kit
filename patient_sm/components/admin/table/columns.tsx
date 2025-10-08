"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import StatusBadge from "./StatusBadge"
import { formatDateTime } from "@/lib/utils"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "scheduled" | "cancelled"
  email: string
patient: { id: string; name: string }
 
}

export const columns: ColumnDef<Payment>[] = [
    {
        header: 'ID',
        cell: ({ row }) => <p className="text-lg font-medium">{row.index + 1}</p>
    },
    {
      accessorKey:'patient',
      header:'Patient',
      cell:({ row }) => {
        const appointment = row.original
        return <p className="text-lg font-medium">
          {appointment.patient.name}
        </p>
      }
    },
    
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row}) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status}/>
      </div>
    )
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row})=> (
      <p className="text font-regular min-w[100px]">
         {formatDateTime(row.original.date).dateTime}
      </p>
    )
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    }
  },
   {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]