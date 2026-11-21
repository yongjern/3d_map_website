export type RoomKind = "public" | "service" | "staff" | "hotel";

export type RoomConfig = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  purpose: string;
  kind: RoomKind;
  center: [number, number, number];
  size: [number, number];
  camera: [number, number, number];
  color: string;
};

export const SHOP = {
  width: 24,
  depth: 30,
  wallHeight: 4,
  wallThickness: 0.22,
  entranceWidth: 3.2,
} as const;

export const ROOMS: RoomConfig[] = [
  { id: "entrance", name: "Entrance and exit", shortName: "Entrance", description: "A centered double-door arrival point with clear views into the retail aisles.", purpose: "Welcomes visitors and keeps the main circulation route legible from the threshold.", kind: "public", center: [0, 0.04, 12.9], size: [7, 3.5], camera: [0, 4.5, 17], color: "#ead8b9" },
  { id: "retail", name: "Retail product zone", shortName: "Retail", description: "Four product aisles organize food, treats, toys and everyday pet supplies.", purpose: "Supports browsing while preserving a broad central route from the entrance to service check-in.", kind: "public", center: [0, 0.04, 7.8], size: [17, 8.4], camera: [0, 7, 13], color: "#d8e3c7" },
  { id: "offers", name: "Special-offer displays", shortName: "Offers", description: "Low promotional tables frame the front ends of the principal retail aisles.", purpose: "Makes seasonal products visible without narrowing the entrance path.", kind: "public", center: [0, 0.05, 10.4], size: [15, 2.4], camera: [0, 4.3, 14], color: "#ecc5ad" },
  { id: "diy", name: "DIY enrichment area", shortName: "DIY enrichment", description: "A wall-side making bench holds puzzle components and pet-safe enrichment materials.", purpose: "Provides a practical station for assembling simple enrichment activities.", kind: "public", center: [9.5, 0.04, 7.4], size: [3.4, 7.4], camera: [7.8, 4.5, 11], color: "#ead8b9" },
  { id: "service-zone", name: "Service and grooming zone", shortName: "Service zone", description: "A generous transition area connects retail, check-in, waiting and grooming rooms.", purpose: "Separates service circulation from retail browsing while keeping staff routes direct.", kind: "service", center: [0, 0.04, 2], size: [16, 4.4], camera: [0, 6, 7], color: "#d5dfd0" },
  { id: "service-counter", name: "Central service counter", shortName: "Service counter", description: "A rounded central counter places grooming and service check-in side by side.", purpose: "Creates one clear point for enquiries, arrivals and handovers.", kind: "service", center: [0, 0.04, -1.4], size: [7.2, 4.4], camera: [0, 4.2, 3.8], color: "#d9b39f" },
  { id: "waiting", name: "Waiting area", shortName: "Waiting", description: "Perimeter seating faces the service counter and remains clear of active routes.", purpose: "Gives visitors a comfortable place to wait with pets before collection or service.", kind: "service", center: [7.7, 0.04, -1.4], size: [6.2, 6.7], camera: [7.8, 4.6, 3.5], color: "#e2d7c6" },
  { id: "grooming-1", name: "Grooming Room 1", shortName: "Grooming 1", description: "A private grooming room with wash station, table and enclosed equipment storage.", purpose: "Supports washing, trimming and drying in a hygienic, controlled room.", kind: "service", center: [-9.1, 0.04, -4.7], size: [4.4, 5.1], camera: [-7.5, 4.2, -1.5], color: "#cbded9" },
  { id: "grooming-2", name: "Grooming Room 2", shortName: "Grooming 2", description: "A second matching room increases capacity while keeping each appointment separate.", purpose: "Allows concurrent grooming sessions with independent equipment and circulation.", kind: "service", center: [-9.1, 0.04, 0.6], size: [4.4, 5.1], camera: [-7.5, 4.2, 3.8], color: "#cbded9" },
  { id: "breakroom", name: "Staff breakroom", shortName: "Breakroom", description: "A staff-only room sits between grooming and secure cat-hotel support spaces.", purpose: "Provides seating, lockers and a compact refreshment area away from visitors.", kind: "staff", center: [-0.8, 0.04, -6.4], size: [8.6, 3.9], camera: [-0.8, 4.4, -2.8], color: "#d8d2c2" },
  { id: "staff-wc", name: "Staff WC", shortName: "Staff WC", description: "A compact accessible staff washroom is placed beside the secure entrance.", purpose: "Keeps staff facilities close to both grooming and boarding work areas.", kind: "staff", center: [4.5, 0.04, -6.4], size: [2.1, 3.9], camera: [4.5, 3.6, -3.1], color: "#ddd8cf" },
  { id: "secure-entry", name: "Secure cat-hotel entrance", shortName: "Secure entry", description: "A controlled vestibule separates public service space from the boarding rooms.", purpose: "Reduces escape risk and creates a clear handover point for cat-hotel staff.", kind: "hotel", center: [6.8, 0.04, -6.4], size: [2.3, 3.9], camera: [6.8, 3.8, -3.2], color: "#d5dfd0" },
  { id: "storage", name: "Storage", shortName: "Storage", description: "Enclosed storage keeps bulky supplies beside the food-preparation room.", purpose: "Keeps consumables and equipment secure without entering boarding circulation.", kind: "staff", center: [9.8, 0.04, -6.4], size: [3.5, 3.9], camera: [9.5, 3.8, -3.3], color: "#d7d0c2" },
  { id: "cat-hotel", name: "Cat-hotel boarding room", shortName: "Cat hotel", description: "Two rows of individual boarding suites face a generous supervised aisle.", purpose: "Provides secure sleeping and observation spaces with direct access to enrichment and cleaning.", kind: "hotel", center: [1.2, 0.04, -10.2], size: [12.7, 3.5], camera: [1.2, 5.2, -6.7], color: "#c9d9c0" },
  { id: "cat-enrichment", name: "Cat enrichment area", shortName: "Cat enrichment", description: "Platforms, tunnels and climbing forms occupy the rear-left corner of the hotel.", purpose: "Offers supervised movement and play outside individual boarding suites.", kind: "hotel", center: [-8.1, 0.04, -10.2], size: [5.4, 3.5], camera: [-7.6, 4.7, -6.8], color: "#d8e3c7" },
  { id: "food-prep", name: "Food preparation and cleaning area", shortName: "Food prep", description: "A sink, preparation counter and cleaning equipment line the secure rear-right room.", purpose: "Centralizes meal preparation, washing and sanitation for the boarding area.", kind: "hotel", center: [8.7, 0.04, -10.2], size: [4.7, 3.5], camera: [8.4, 4.4, -6.8], color: "#c9dad5" },
];

export const TOUR = ["entrance", "retail", "service-counter", "waiting", "grooming-1", "cat-hotel", "cat-enrichment", "food-prep"];

export const MATERIAL_PRESETS = {
  warm: { floor: "#d8c9b1", wall: "#f3eee4", wood: "#9a6f4a", accent: "#a8b99d" },
  sage: { floor: "#c9cec2", wall: "#f0f1e9", wood: "#80684f", accent: "#78917a" },
  clay: { floor: "#d7c3b4", wall: "#f7f0e8", wood: "#9d7358", accent: "#b96e55" },
} as const;

export type MaterialPreset = keyof typeof MATERIAL_PRESETS;
