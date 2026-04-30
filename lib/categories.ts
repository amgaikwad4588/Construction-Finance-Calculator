export type CategoryDef = {
  name: string;
  icon: string;
  subcategories: string[];
};

export const CATEGORIES: CategoryDef[] = [
  {
    name: "Land & Legal",
    icon: "📜",
    subcategories: [
      "Land purchase",
      "Registration & Stamp duty",
      "Survey",
      "Soil testing",
      "Legal / Lawyer fees",
      "Title verification",
    ],
  },
  {
    name: "Approvals & Permits",
    icon: "🏛️",
    subcategories: [
      "Building plan approval",
      "Municipal / Panchayat fees",
      "NOC",
      "Water connection",
      "Electricity sanction",
      "Other govt fees",
    ],
  },
  {
    name: "Ceremonies & Pooja",
    icon: "🪔",
    subcategories: [
      "Bhumi Pujan",
      "Vastu Pujan",
      "Griha Pravesh",
      "Pandit dakshina",
      "Pooja samagri",
      "Prasad / Bhog",
    ],
  },
  {
    name: "Design & Consulting",
    icon: "📐",
    subcategories: [
      "Architect fees",
      "Structural engineer",
      "Interior designer",
      "Vastu consultant",
      "3D rendering",
      "Site supervision",
    ],
  },
  {
    name: "Labour & Contractor",
    icon: "👷",
    subcategories: [
      "Contractor",
      "Mason (Mistri)",
      "Carpenter",
      "Electrician",
      "Plumber",
      "Painter",
      "Welder",
      "Helper",
      "Daily wages",
      "Tile worker",
      "POP / False ceiling worker",
    ],
  },
  {
    name: "Foundation & Structure",
    icon: "🧱",
    subcategories: [
      "Excavation",
      "PCC",
      "RCC work",
      "Slab casting",
      "Columns & beams",
      "Lintel",
      "Centring & shuttering",
    ],
  },
  {
    name: "Materials — Core",
    icon: "📦",
    subcategories: [
      "Cement",
      "Steel / TMT bars",
      "Sand",
      "Aggregate / Gravel",
      "Bricks",
      "Concrete blocks",
      "Stone",
      "Binding wire",
    ],
  },
  {
    name: "Masonry & Plastering",
    icon: "🏗️",
    subcategories: [
      "Brick work",
      "Block work",
      "Internal plaster",
      "External plaster",
      "Waterproofing",
      "Mortar materials",
    ],
  },
  {
    name: "Electrical",
    icon: "💡",
    subcategories: [
      "Wiring",
      "Switches & sockets",
      "MCB / DB / Wires",
      "Lights & fixtures",
      "Fans",
      "Inverter / Stabilizer",
      "Solar setup",
      "CCTV / Networking",
    ],
  },
  {
    name: "Plumbing & Sanitary",
    icon: "🚿",
    subcategories: [
      "Pipes & fittings",
      "CPVC / PVC lines",
      "Sanitaryware (WC, basin)",
      "Taps & faucets",
      "Geyser",
      "Bathroom accessories",
      "Drainage",
    ],
  },
  {
    name: "Doors & Windows",
    icon: "🚪",
    subcategories: [
      "Main door",
      "Internal doors",
      "Door frames (Chowkhat)",
      "Windows",
      "Window frames",
      "Grills",
      "Mosquito mesh",
      "Hardware (locks, hinges)",
    ],
  },
  {
    name: "Flooring & Tiles",
    icon: "🟫",
    subcategories: [
      "Floor tiles",
      "Wall tiles",
      "Marble",
      "Granite",
      "Wood / Vinyl flooring",
      "Skirting",
      "Adhesive / Grout",
    ],
  },
  {
    name: "Painting & Finishing",
    icon: "🎨",
    subcategories: [
      "Putty",
      "Primer",
      "Interior paint",
      "Exterior paint",
      "Texture / Distemper",
      "POP / False ceiling",
      "Wood polish",
    ],
  },
  {
    name: "Kitchen",
    icon: "🍳",
    subcategories: [
      "Modular kitchen",
      "Countertop (granite/quartz)",
      "Sink",
      "Chimney",
      "Hob",
      "Kitchen appliances",
      "Backsplash tiles",
    ],
  },
  {
    name: "Interiors & Furniture",
    icon: "🛋️",
    subcategories: [
      "Wardrobes",
      "Beds",
      "Sofa",
      "Dining set",
      "Study / Office",
      "Curtains & blinds",
      "Wall decor",
      "Storage / Shelves",
    ],
  },
  {
    name: "External Works",
    icon: "🌳",
    subcategories: [
      "Compound wall",
      "Main gate",
      "Driveway",
      "Landscaping",
      "Garden",
      "Parking shed",
      "Outdoor lighting",
    ],
  },
  {
    name: "Water & Borewell",
    icon: "💧",
    subcategories: [
      "Borewell drilling",
      "Pump & motor",
      "Sump tank",
      "Overhead tank",
      "Water purifier",
      "Plumbing connection",
    ],
  },
  {
    name: "Transportation & Equipment",
    icon: "🚚",
    subcategories: [
      "Material transport",
      "JCB / Excavator rental",
      "Crane",
      "Concrete mixer",
      "Tools rental",
      "Loading / Unloading",
    ],
  },
  {
    name: "Site Utilities",
    icon: "⚡",
    subcategories: [
      "Construction water",
      "Construction electricity",
      "Temporary connection",
      "Site shed / Storage",
    ],
  },
  {
    name: "Finance",
    icon: "💰",
    subcategories: [
      "Loan EMI",
      "Loan processing fee",
      "Insurance",
      "Interest paid",
      "Bank charges",
    ],
  },
  {
    name: "Food & Hospitality",
    icon: "🍱",
    subcategories: [
      "Workers food",
      "Tea & snacks",
      "Tips / Bakshish",
      "Guests",
    ],
  },
  {
    name: "Miscellaneous",
    icon: "📝",
    subcategories: [
      "Tools",
      "Safety equipment",
      "Cleaning",
      "Stationery / Printing",
      "Other",
    ],
  },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export function getCategory(name: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.name === name);
}

export const PAYMENT_MODES = [
  "Cash",
  "UPI",
  "Cheque",
  "Bank Transfer",
  "Card",
  "Other",
] as const;
