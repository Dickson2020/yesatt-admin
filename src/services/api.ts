
import { ApiResponse, DashboardStats, User, Driver, Vehicle, Booking, Transaction, KYCDocument, Ticket } from "../types";

const API_URL = 'https://booker-olive-kappa.vercel.app' //"https://booker-olive-kappa.vercel.app";

const api = {
  login: async (email: string, password: string): Promise<ApiResponse<{ id: number }>> => {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  },

  getKYCRequests: async (): Promise<ApiResponse<KYCDocument[]>> => {
    const response = await fetch(`${API_URL}/admin/kyc-requests`);
    return await response.json();
  },
  
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const getID = localStorage.getItem('logged_in')? localStorage.getItem('logged_in') : 1;
    const response = await fetch(`${API_URL}/management-summary?id=${getID}`);
    return await response.json();
  },

  getRiders: async (page: number = 1): Promise<ApiResponse<{ users: User[] }>> => {
    const response = await fetch(`${API_URL}/admin/fetch-riders?page=${page}`);
    return await response.json();
  },

  getDrivers: async (page: number = 1): Promise<ApiResponse<{ users: Driver[] }>> => {
    const response = await fetch(`${API_URL}/admin/fetch-drivers?page=${page}`);
    return await response.json();
      },

      getVehicleInfo: async (vin: string): Promise<ApiResponse<Vehicle>> => {
        const response = await fetch(`${API_URL}/get-vehicle-info?vin=${vin}`);
        return await response.json();
      },

      getBookings: async (page: number = 1, filter: string = 'pending'): Promise<ApiResponse<{ bookings: Booking[] }>> => {  const response = await fetch(`${API_URL}/admin/fetch-bookings?page=${page}&filter=${filter}`);
    return await response.json();
  },

  getTransactions: async (page: number = 1): Promise<ApiResponse<{ transactions: Transaction[] }>> => {
    const response = await fetch(`${API_URL}/admin/fetch-transaction?page=${page}`);
    return await response.json();
  },

  deleteAccount: async (id: number, type: string = 'passenger'): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/admin/delete-account?id=${id}&type=${type}`);
    return await response.json();
  },

  updateVehicle: async (vehicleData: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/update-vehicle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicleData),
    });
    return await response.json();
  },

  deleteVehicle: async (id: number): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/admin/delete-vehicle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    return await response.json();
  },

  replyTicket: async (data: { name: string, email: string, message: string, id: number }): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/reply-ticket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  addNewStaff: async (staffData: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/admin/add-new-staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(staffData),
    });
    return await response.json();
  },

  updateApi: async (apiData: { stripeSecretKey: string, stripePublishableApiKey: string }): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/admin/update-api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiData),
    });
    return await response.json();
  },

  updateBio: async (bioData: { name: string, email: string, phone: string }): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/admin/update-bio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bioData),
    });
    return await response.json();
  },

  sendOtp: async (email: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  },

  resetPassword: async (data: { email: string, otp: string, password: string }): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/admin/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  broadcastMessage: async (message: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/admin/broadcast-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    return await response.json();
  },

  approveLicence: async (data: { id: number, driver_id: number, email: string }): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/admin/approve-licence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  rejectLicence: async (data: { id: number, driver_id: number, email: string }): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_URL}/admin/reject-licence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
};

export default api;
