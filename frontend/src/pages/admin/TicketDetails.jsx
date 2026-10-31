import { useParams } from "react-router"

function TicketDetails() {
  const { ticketId } = useParams()

  return <h1>Ticket: {ticketId}</h1>
}

export default TicketDetails
