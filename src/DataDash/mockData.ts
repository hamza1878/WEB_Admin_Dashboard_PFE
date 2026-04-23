import type { RevenueEntry, SupportEntry, Vehicle } from ".";

export const revenueData: RevenueEntry[] = [
  { day: "Mon", revenue: 14200, rides: 1820 },
  { day: "Tue", revenue: 16800, rides: 2140 },
  { day: "Wed", revenue: 21400, rides: 2780 },
  { day: "Thu", revenue: 18900, rides: 2410 },
  { day: "Fri", revenue: 22100, rides: 2960 },
  { day: "Sat", revenue: 28400, rides: 3580 },
  { day: "Sun", revenue: 31200, rides: 3920 },
];

export const supportData: SupportEntry[] = [
  { time: "08:00", resolved: 45, pending: 12 },
  { time: "10:00", resolved: 72, pending: 19 },
  { time: "12:00", resolved: 58, pending: 8  },
  { time: "14:00", resolved: 83, pending: 15 },
  { time: "16:00", resolved: 67, pending: 10 },
  { time: "18:00", resolved: 91, pending: 6  },
];

export const fleetData: Vehicle[] = [
  { id: "MOV-4822", status: "ACTIVE",      driver: "Marcus Chen",     location: "Mission District", battery: 82, lat: 0.38, lng: 0.55 },
  { id: "MOV-9031", status: "EN ROUTE",    driver: "Elena Rodriguez", location: "SOMA",             battery: 45, lat: 0.52, lng: 0.42 },
  { id: "MOV-2210", status: "MAINTENANCE", driver: null,              location: "Depot North",      battery: 12, lat: 0.22, lng: 0.68 },
  { id: "MOV-5517", status: "ACTIVE",      driver: "James Park",      location: "Castro",           battery: 94, lat: 0.65, lng: 0.35 },
  { id: "MOV-3304", status: "EN ROUTE",    driver: "Sofia Diaz",      location: "Tenderloin",       battery: 61, lat: 0.45, lng: 0.58 },
  { id: "MOV-7729", status: "ACTIVE",      driver: "Amir Hassan",     location: "Nob Hill",         battery: 77, lat: 0.30, lng: 0.45 },
];

export const aiInsights: string[] = [
  "Deploy surge incentives in SOMA district for the next 45 minutes to balance demand.",
  "System predicted a 15% increase in weekend evening bookings.",
  "3 drivers approaching shift end in Mission District — pre-position replacements.",
];

export const navItems: string[] = [
  "Dashboard",
  "Live Map",
  "Revenue",
  "AI Insights",
  "Fleet",
];
