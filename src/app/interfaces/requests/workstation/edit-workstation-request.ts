export interface EditWorkStationRequest {
    id: number;
    employeeLastName: string;
    employeeFirstName: string;
    email: string;
    personalPhone: string;
    socketNumber: string;
    workstationNumber: string;
    department: string;
    city: string;
    address?: string;
}