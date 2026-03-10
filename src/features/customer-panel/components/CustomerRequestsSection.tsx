import type { CreateCustomerTicketInput, CustomerPanelProject, CustomerPanelTicket } from "../model/types";
import CustomerRequestForm from "./CustomerRequestForm";
import CustomerRequestsTable from "./CustomerRequestsTable";

interface CustomerRequestsSectionProps {
  tickets: CustomerPanelTicket[];
  isLoading: boolean;
  isCreating: boolean;
  errorMessage: string | null;
  projects: CustomerPanelProject[];
  onCreateTicket: (input: CreateCustomerTicketInput) => Promise<void>;
}

export default function CustomerRequestsSection({
  tickets,
  isLoading,
  isCreating,
  errorMessage,
  projects,
  onCreateTicket,
}: CustomerRequestsSectionProps) {
  return (
    <div className="space-y-4">
      <CustomerRequestForm
        projects={projects}
        isCreating={isCreating}
        errorMessage={errorMessage}
        onCreateTicket={onCreateTicket}
      />

      <CustomerRequestsTable tickets={tickets} isLoading={isLoading} />
    </div>
  );
}
