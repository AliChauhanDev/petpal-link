import { supabase } from "@/integrations/supabase/client";

const samplePets = [
  {
    name: "Max",
    pet_type: "dog" as const,
    breed: "Golden Retriever",
    age: "3 years",
    color: "Golden",
    gender: "Male",
    description: "Friendly and playful golden retriever. Loves playing fetch and swimming.",
    image_url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
  },
  {
    name: "Luna",
    pet_type: "cat" as const,
    breed: "Persian",
    age: "2 years",
    color: "White",
    gender: "Female",
    description: "Beautiful white Persian cat. Very calm and loves cuddles.",
    image_url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
  },
  {
    name: "Charlie",
    pet_type: "dog" as const,
    breed: "Labrador",
    age: "4 years",
    color: "Black",
    gender: "Male",
    description: "Energetic black lab. Great with kids and other dogs.",
    image_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
  },
  {
    name: "Whiskers",
    pet_type: "cat" as const,
    breed: "Tabby",
    age: "1 year",
    color: "Orange",
    gender: "Male",
    description: "Curious orange tabby. Indoor cat who loves window watching.",
    image_url: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400",
  },
  {
    name: "Tweety",
    pet_type: "bird" as const,
    breed: "Cockatiel",
    age: "6 months",
    color: "Yellow",
    gender: "Male",
    description: "Friendly cockatiel who loves to whistle and sing.",
    image_url: "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=400",
  },
  {
    name: "Snowball",
    pet_type: "rabbit" as const,
    breed: "Holland Lop",
    age: "1 year",
    color: "White",
    gender: "Female",
    description: "Adorable white bunny with floppy ears. Very gentle.",
    image_url: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400",
  },
];

const sampleLostReports = [
  {
    pet_name: "Buddy",
    pet_type: "dog" as const,
    description: "Brown beagle with white chest. Wearing blue collar. Very friendly.",
    last_seen_location: "Central Park, New York",
    last_seen_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    contact_phone: "555-0123",
    contact_email: "owner@example.com",
    reward: "$500",
    image_url: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400",
  },
  {
    pet_name: "Mittens",
    pet_type: "cat" as const,
    description: "Gray and white cat. Indoor cat, might be scared. Has microchip.",
    last_seen_location: "Downtown Los Angeles",
    last_seen_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    contact_phone: "555-0456",
    reward: "$200",
    image_url: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400",
  },
  {
    pet_name: "Rocky",
    pet_type: "dog" as const,
    description: "German Shepherd, 5 years old. Responds to name. Has red collar.",
    last_seen_location: "Lincoln Park, Chicago",
    last_seen_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    contact_phone: "555-0789",
    contact_email: "rocky.owner@example.com",
    reward: "$1000",
    image_url: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=400",
  },
];

const sampleFoundReports = [
  {
    pet_name: "Unknown",
    pet_type: "dog" as const,
    description: "Small white poodle found wandering. Very clean, seems well cared for. No collar.",
    found_location: "Houston Downtown",
    found_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    contact_phone: "555-1111",
    image_url: "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400",
  },
  {
    pet_name: null,
    pet_type: "cat" as const,
    description: "Orange cat found in backyard. Friendly but no tags. Has been fed.",
    found_location: "Phoenix Suburbs",
    found_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    contact_phone: "555-2222",
    contact_email: "finder@example.com",
    image_url: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400",
  },
  {
    pet_name: "Possibly 'Bella'",
    pet_type: "dog" as const,
    description: "Dalmatian found near highway. Scared but healthy. Has pink collar.",
    found_location: "San Diego Beach Area",
    found_date: new Date().toISOString().split("T")[0],
    contact_phone: "555-3333",
    image_url: "https://images.unsplash.com/photo-1550091720-2c437a01cbfc?w=400",
  },
];

export const insertSampleData = async (userId: string) => {
  const errors: string[] = [];

  // Insert pets
  for (const pet of samplePets) {
    const { error } = await supabase.from("pets").insert({
      ...pet,
      user_id: userId,
    });
    if (error) errors.push(`Pet ${pet.name}: ${error.message}`);
  }

  // Insert lost reports
  for (const report of sampleLostReports) {
    const { error } = await supabase.from("lost_reports").insert({
      ...report,
      user_id: userId,
      status: "active",
    });
    if (error) errors.push(`Lost ${report.pet_name}: ${error.message}`);
  }

  // Insert found reports
  for (const report of sampleFoundReports) {
    const { error } = await supabase.from("found_reports").insert({
      ...report,
      user_id: userId,
      status: "active",
    });
    if (error) errors.push(`Found ${report.pet_name || "Unknown"}: ${error.message}`);
  }

  return {
    success: errors.length === 0,
    errors,
    inserted: {
      pets: samplePets.length,
      lostReports: sampleLostReports.length,
      foundReports: sampleFoundReports.length,
    },
  };
};

export const clearSampleData = async (userId: string) => {
  await Promise.all([
    supabase.from("pets").delete().eq("user_id", userId),
    supabase.from("lost_reports").delete().eq("user_id", userId),
    supabase.from("found_reports").delete().eq("user_id", userId),
  ]);
};
