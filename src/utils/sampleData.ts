import { supabase } from "@/integrations/supabase/client";

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
  },
  {
    pet_name: "Mittens",
    pet_type: "cat" as const,
    description: "Gray and white cat. Indoor cat, might be scared. Has microchip.",
    last_seen_location: "Downtown Los Angeles",
    last_seen_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    contact_phone: "555-0456",
    reward: "$200",
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
  },
];

const sampleFoundReports = [
  {
    pet_type: "dog" as const,
    description: "Small white poodle found wandering. Very clean, seems well cared for. No collar.",
    found_location: "Houston Downtown",
    found_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    contact_phone: "555-1111",
  },
  {
    pet_type: "cat" as const,
    description: "Orange cat found in backyard. Friendly but no tags. Has been fed.",
    found_location: "Phoenix Suburbs",
    found_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    contact_phone: "555-2222",
    contact_email: "finder@example.com",
  },
  {
    pet_type: "dog" as const,
    description: "Dalmatian found near highway. Scared but healthy. Has pink collar.",
    found_location: "San Diego Beach Area",
    found_date: new Date().toISOString().split("T")[0],
    contact_phone: "555-3333",
  },
];

export const insertSampleData = async (userId: string) => {
  const errors: string[] = [];

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
    if (error) errors.push(`Found report: ${error.message}`);
  }

  return {
    success: errors.length === 0,
    errors,
    inserted: {
      lostReports: sampleLostReports.length,
      foundReports: sampleFoundReports.length,
    },
  };
};

export const clearSampleData = async (userId: string) => {
  await Promise.all([
    supabase.from("lost_reports").delete().eq("user_id", userId),
    supabase.from("found_reports").delete().eq("user_id", userId),
  ]);
};
