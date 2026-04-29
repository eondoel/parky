/**
 * Curated Wikimedia Commons image URLs for attractions.
 * All URLs verified to exist. Keys are lowercased substrings of attraction names.
 * Checked before the live Wikipedia search API fallback.
 */
const CURATED: [string, string][] = [

  // ── Disneyland ────────────────────────────────────────────────────────────
  ["haunted mansion",          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Disneyland_Haunted_Mansion.jpg/640px-Disneyland_Haunted_Mansion.jpg"],
  ["pirates of the caribbean", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Pirates_of_the_Caribbean_Disneyland.jpg/640px-Pirates_of_the_Caribbean_Disneyland.jpg"],
  ["indiana jones",            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Indiana_Jones_Adventure_exterior.jpg/640px-Indiana_Jones_Adventure_exterior.jpg"],
  ["jungle cruise",            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Jungle_Cruise_at_Disneyland.jpg/640px-Jungle_Cruise_at_Disneyland.jpg"],
  ["matterhorn",               "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Matterhorn_Bobsleds_Disneyland.jpg/640px-Matterhorn_Bobsleds_Disneyland.jpg"],
  ["space mountain",           "https://upload.wikimedia.org/wikipedia/commons/a/a1/Space_mountain.jpg"],
  ["big thunder",              "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Big_Thunder_Mountain_Disneyland.jpg/640px-Big_Thunder_Mountain_Disneyland.jpg"],
  ["it's a small world",       "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Small_world_ride_-_panoramio.jpg/640px-Small_world_ride_-_panoramio.jpg"],
  ["small world",              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Small_world_ride_-_panoramio.jpg/640px-Small_world_ride_-_panoramio.jpg"],
  ["peter pan",                "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Peter_Pan%27s_Flight_Disneyland.jpg/640px-Peter_Pan%27s_Flight_Disneyland.jpg"],
  ["millennium falcon",        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Millennium_Falcon_Smugglers_Run.jpg/640px-Millennium_Falcon_Smugglers_Run.jpg"],
  ["rise of the resistance",   "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Star_Wars_Rise_of_the_Resistance.jpg/640px-Star_Wars_Rise_of_the_Resistance.jpg"],
  ["mark twain",               "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Mark_Twain_Riverboat_Disneyland.jpg/640px-Mark_Twain_Riverboat_Disneyland.jpg"],
  ["tiana's bayou",            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Tiana%27s_Bayou_Adventure_exterior.jpg/640px-Tiana%27s_Bayou_Adventure_exterior.jpg"],
  ["dumbo",                    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Dumbo_the_Flying_Elephant_WDW.jpg/640px-Dumbo_the_Flying_Elephant_WDW.jpg"],
  ["mad tea party",            "https://upload.wikimedia.org/wikipedia/commons/8/80/TeacupsMadTeaParty_wb.jpg"],
  ["astro orbiter",            "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Dlp_astro_orbitor.jpg/640px-Dlp_astro_orbitor.jpg"],
  ["autopia",                  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Autopia_at_Disneyland%2C_Nov_2005_-_DL05_039.jpg/640px-Autopia_at_Disneyland%2C_Nov_2005_-_DL05_039.jpg"],
  ["mr. toad",                 "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Mr_Toads_Wild_Ride.jpg/640px-Mr_Toads_Wild_Ride.jpg"],
  ["snow white",               "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Snow_Whites_Enchanted_Wish.jpg/640px-Snow_Whites_Enchanted_Wish.jpg"],
  ["pinocchio",                "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Pinocchio%27s_Daring_Journey.jpg/640px-Pinocchio%27s_Daring_Journey.jpg"],
  ["roger rabbit",             "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Roger_Rabbit%27s_Car_Toon_Spin.jpg/640px-Roger_Rabbit%27s_Car_Toon_Spin.jpg"],

  // ── California Adventure ──────────────────────────────────────────────────
  ["guardians of the galaxy mission", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Guardians_of_the_Galaxy_Mission_Breakout.jpg/640px-Guardians_of_the_Galaxy_Mission_Breakout.jpg"],
  ["incredicoaster",           "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Incredicoaster_at_Pixar_Pier.jpg/640px-Incredicoaster_at_Pixar_Pier.jpg"],
  ["radiator springs",         "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Radiator_Springs_Racers.jpg/640px-Radiator_Springs_Racers.jpg"],
  ["soarin",                   "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Soarin%27_Around_the_World_EPCOT.jpg/640px-Soarin%27_Around_the_World_EPCOT.jpg"],
  ["webslingers",              "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/WEB_SLINGERS_A_Spider-Man_Adventure.jpg/640px-WEB_SLINGERS_A_Spider-Man_Adventure.jpg"],
  ["grizzly river",            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Grizzly_River_Run_DCA.jpg/640px-Grizzly_River_Run_DCA.jpg"],
  ["pixar pal-a-round",        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Pixar_Pal-A-Round_2019.jpg/640px-Pixar_Pal-A-Round_2019.jpg"],
  ["inside out",               "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Incredicoaster_at_Pixar_Pier.jpg/640px-Incredicoaster_at_Pixar_Pier.jpg"],
  ["luigi's",                  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Radiator_Springs_Racers.jpg/640px-Radiator_Springs_Racers.jpg"],
  ["mater",                    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Radiator_Springs_Racers.jpg/640px-Radiator_Springs_Racers.jpg"],

  // ── Magic Kingdom ─────────────────────────────────────────────────────────
  ["seven dwarfs",             "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Seven_Dwarfs_Mine_Train_roller_coaster.jpg/640px-Seven_Dwarfs_Mine_Train_roller_coaster.jpg"],
  ["tron",                     "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Tron_Lightcycle_Power_Run_%28Magic_Kingdom%29_4.jpg/640px-Tron_Lightcycle_Power_Run_%28Magic_Kingdom%29_4.jpg"],
  ["barnstormer",              "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/The_Barnstormer_at_Storybook_Circus.jpg/640px-The_Barnstormer_at_Storybook_Circus.jpg"],
  ["philharmagic",             "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Tokyo_Disneyland_Mickey%27s_PhilharMagic_%2853442235185%29.jpg/640px-Tokyo_Disneyland_Mickey%27s_PhilharMagic_%2853442235185%29.jpg"],
  ["little mermaid",           "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/The_Little_Mermaid_-_Ariels_Undersea_Adventure_entrance.jpg/640px-The_Little_Mermaid_-_Ariels_Undersea_Adventure_entrance.jpg"],
  ["under the sea",            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/The_Little_Mermaid_-_Ariels_Undersea_Adventure_entrance.jpg/640px-The_Little_Mermaid_-_Ariels_Undersea_Adventure_entrance.jpg"],
  ["enchanted tales",          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Enchanted_Tales_with_Belle.jpg/640px-Enchanted_Tales_with_Belle.jpg"],
  ["railroad",                 "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Walt_Disney_World_Railroad_No4.jpg/640px-Walt_Disney_World_Railroad_No4.jpg"],
  ["winnie the pooh",          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Many_Adventures_of_Winnie_the_Pooh_MK.jpg/640px-Many_Adventures_of_Winnie_the_Pooh_MK.jpg"],
  ["pirates adventure",        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Pirates_of_the_Caribbean_Disneyland.jpg/640px-Pirates_of_the_Caribbean_Disneyland.jpg"],
  ["tomorrowland speedway",    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Autopia_at_Disneyland%2C_Nov_2005_-_DL05_039.jpg/640px-Autopia_at_Disneyland%2C_Nov_2005_-_DL05_039.jpg"],
  ["buzz lightyear",           "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Buzz_Lightyear%27s_Space_Ranger_Spin_Entrance_%284730826024%29.jpg/640px-Buzz_Lightyear%27s_Space_Ranger_Spin_Entrance_%284730826024%29.jpg"],
  ["sorcerers of the magic",   "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Sorcerers_of_the_Magic_Kingdom_in_Tortuga_Tavern.jpg/640px-Sorcerers_of_the_Magic_Kingdom_in_Tortuga_Tavern.jpg"],
  ["peoplemover",              "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tomorrowland_Transit_Authority_PeopleMover.jpg/640px-Tomorrowland_Transit_Authority_PeopleMover.jpg"],
  ["carousel of progress",     "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Carousel_of_Progress_at_Magic_Kingdom.jpg/640px-Carousel_of_Progress_at_Magic_Kingdom.jpg"],

  // ── EPCOT ─────────────────────────────────────────────────────────────────
  ["spaceship earth",          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Spaceship_Earth%2C_EPCOT.jpg/640px-Spaceship_Earth%2C_EPCOT.jpg"],
  ["frozen ever after",        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Frozen_Ever_After_ride_exterior.jpg/640px-Frozen_Ever_After_ride_exterior.jpg"],
  ["test track",               "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/TestTrackEpcot.JPG/640px-TestTrackEpcot.JPG"],
  ["remy",                     "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Remy%27s_Ratatouille_Adventure.jpg/640px-Remy%27s_Ratatouille_Adventure.jpg"],
  ["mission: space",           "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mission_SPACE_at_Epcot.jpg/640px-Mission_SPACE_at_Epcot.jpg"],
  ["living with the land",     "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Living_with_the_Land_EPCOT.jpg/640px-Living_with_the_Land_EPCOT.jpg"],
  ["turtle talk",              "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Turtle_Talk_with_Crush%2C_Epcot.jpg/640px-Turtle_Talk_with_Crush%2C_Epcot.jpg"],
  ["seas with nemo",           "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/The_entrance_to_%27The_Seas_With_Nemo_%26_Friends%27_at_Epcot.jpg/640px-The_entrance_to_%27The_Seas_With_Nemo_%26_Friends%27_at_Epcot.jpg"],
  ["nemo & friends",           "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/The_entrance_to_%27The_Seas_With_Nemo_%26_Friends%27_at_Epcot.jpg/640px-The_entrance_to_%27The_Seas_With_Nemo_%26_Friends%27_at_Epcot.jpg"],
  ["gran fiesta",              "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Gran_Fiesta_Boat_Ride_Sign_Mexico_Pavilion_Epcot_Center_%282541198505%29.jpg/640px-Gran_Fiesta_Boat_Ride_Sign_Mexico_Pavilion_Epcot_Center_%282541198505%29.jpg"],
  ["figment",                  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Journey_into_Imagination_ride_logo.jpg/640px-Journey_into_Imagination_ride_logo.jpg"],
  ["imagination",              "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Journey_into_Imagination_ride_logo.jpg/640px-Journey_into_Imagination_ride_logo.jpg"],
  ["guardians of the galaxy cosmic", "https://upload.wikimedia.org/wikipedia/commons/9/92/Guardians_of_the_Galaxy_Cosmic_Rewind_logo.png"],
  ["cosmic rewind",            "https://upload.wikimedia.org/wikipedia/commons/9/92/Guardians_of_the_Galaxy_Cosmic_Rewind_logo.png"],
  ["reflections of china",     "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/China_Pavilion1.jpg/640px-China_Pavilion1.jpg"],
  ["china pavilion",           "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/China_Pavilion1.jpg/640px-China_Pavilion1.jpg"],
  ["stave church",             "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Gol_Stave_Church_Replica_in_Epcot.jpg/640px-Gol_Stave_Church_Replica_in_Epcot.jpg"],
  ["norway pavilion",          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/StavenorEPCOT.jpg/640px-StavenorEPCOT.jpg"],
  ["american adventure",       "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/American_Adventure_EPCOT.jpg/640px-American_Adventure_EPCOT.jpg"],
  ["journey of water",         "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Spaceship_Earth%2C_EPCOT.jpg/640px-Spaceship_Earth%2C_EPCOT.jpg"],

  // ── Hollywood Studios ─────────────────────────────────────────────────────
  ["tower of terror",          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/The_Twilight_Zone_Tower_of_Terror%2C_2024.jpg/640px-The_Twilight_Zone_Tower_of_Terror%2C_2024.jpg"],
  ["rock 'n' roller",          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Rock_N_Roller_Coaster_Hollywood_Studios.jpg/640px-Rock_N_Roller_Coaster_Hollywood_Studios.jpg"],
  ["rock n roll",              "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Rock_N_Roller_Coaster_Hollywood_Studios.jpg/640px-Rock_N_Roller_Coaster_Hollywood_Studios.jpg"],
  ["slinky dog",               "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Slinky_Dog_Dash_roller_coaster.jpg/640px-Slinky_Dog_Dash_roller_coaster.jpg"],
  ["mickey & minnie",          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Mickey_and_Minnie%27s_Runaway_Railway.jpg/640px-Mickey_and_Minnie%27s_Runaway_Railway.jpg"],
  ["runaway railway",          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Mickey_and_Minnie%27s_Runaway_Railway.jpg/640px-Mickey_and_Minnie%27s_Runaway_Railway.jpg"],
  ["star tours",               "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Star_Tours_Hollywood_Studios.jpg/640px-Star_Tours_Hollywood_Studios.jpg"],
  ["toy story mania",          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toy_Story_Midway_Mania.jpg/640px-Toy_Story_Midway_Mania.jpg"],
  ["alien swirling",           "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toy_Story_Midway_Mania.jpg/640px-Toy_Story_Midway_Mania.jpg"],
  ["muppet",                   "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Muppet_Vision_3D.jpg/640px-Muppet_Vision_3D.jpg"],
  ["indiana jones stunt",      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Indiana_Jones_Adventure_exterior.jpg/640px-Indiana_Jones_Adventure_exterior.jpg"],

  // ── Animal Kingdom ────────────────────────────────────────────────────────
  ["expedition everest",       "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Expedition_Everest_Animal_Kingdom.jpg/640px-Expedition_Everest_Animal_Kingdom.jpg"],
  ["flight of passage",        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Avatar_Flight_of_Passage_exterior.jpg/640px-Avatar_Flight_of_Passage_exterior.jpg"],
  ["kilimanjaro",              "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Kilimanjaro_Safaris_Animal_Kingdom.jpg/640px-Kilimanjaro_Safaris_Animal_Kingdom.jpg"],
  ["kali river",               "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Kali_River_Rapids_Animal_Kingdom.jpg/640px-Kali_River_Rapids_Animal_Kingdom.jpg"],
  ["na'vi river",              "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Navi_River_Journey_Animal_Kingdom.jpg/640px-Navi_River_Journey_Animal_Kingdom.jpg"],
  ["maharajah",                "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Expedition_Everest_Animal_Kingdom.jpg/640px-Expedition_Everest_Animal_Kingdom.jpg"],
  ["gorilla falls",            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Kilimanjaro_Safaris_Animal_Kingdom.jpg/640px-Kilimanjaro_Safaris_Animal_Kingdom.jpg"],

  // ── Universal Studios Hollywood ───────────────────────────────────────────
  ["forbidden journey",        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Harry_Potter_and_the_Forbidden_Journey.jpg/640px-Harry_Potter_and_the_Forbidden_Journey.jpg"],
  ["flight of the hippogriff", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flight_of_the_Hippogriff_roller_coaster.jpg/640px-Flight_of_the_Hippogriff_roller_coaster.jpg"],
  ["revenge of the mummy",     "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Revenge_of_the_Mummy_Universal_Studios.jpg/640px-Revenge_of_the_Mummy_Universal_Studios.jpg"],
  ["jurassic world",           "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Universal-Islands-of-Adventure-Jurassic-Park-River-9210.jpg/640px-Universal-Islands-of-Adventure-Jurassic-Park-River-9210.jpg"],
  ["transformers",             "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Transformers_costume_characters_at_Universal_Studios_Hollywood.jpg/640px-Transformers_costume_characters_at_Universal_Studios_Hollywood.jpg"],
  ["despicable me",            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Despicable_Me_-_Minion_Mayhem%2C_Universal_Studios_Hollywood.jpg/640px-Despicable_Me_-_Minion_Mayhem%2C_Universal_Studios_Hollywood.jpg"],
  ["mario kart",               "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Super_Nintendo_World_%28Universal_Studios_Hollywood%29-A_view_in_July_2023.jpg/640px-Super_Nintendo_World_%28Universal_Studios_Hollywood%29-A_view_in_July_2023.jpg"],
  ["super nintendo world",     "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Super_Nintendo_World_%28Universal_Studios_Hollywood%29-A_view_in_July_2023.jpg/640px-Super_Nintendo_World_%28Universal_Studios_Hollywood%29-A_view_in_July_2023.jpg"],
  ["studio tour",              "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/NABI_40_LFW_CNG_bus_during_the_Universal_Studios_Hollywood_Studio_Tour_%28July_2023%29.jpg/640px-NABI_40_LFW_CNG_bus_during_the_Universal_Studios_Hollywood_Studio_Tour_%28July_2023%29.jpg"],
  ["waterworld",               "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Waterworld_Hollywood.JPG/640px-Waterworld_Hollywood.JPG"],
  ["water world",              "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Waterworld_Hollywood.JPG/640px-Waterworld_Hollywood.JPG"],

  // ── Universal Studios Florida ─────────────────────────────────────────────
  ["rip ride rockit",          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Hollywood_Rip_Ride_Rockit.jpg/640px-Hollywood_Rip_Ride_Rockit.jpg"],
  ["race through new york",    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Universal_archway_2019.jpg/640px-Universal_archway_2019.jpg"],
  ["fast & furious",           "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Universal_archway_2019.jpg/640px-Universal_archway_2019.jpg"],
  ["men in black",             "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Universal_archway_2019.jpg/640px-Universal_archway_2019.jpg"],
  ["e.t. adventure",           "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Universal_archway_2019.jpg/640px-Universal_archway_2019.jpg"],
  ["hogwarts express",         "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Harry_Potter_and_the_Forbidden_Journey.jpg/640px-Harry_Potter_and_the_Forbidden_Journey.jpg"],
  ["escape from gringotts",    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Harry_Potter_and_the_Forbidden_Journey.jpg/640px-Harry_Potter_and_the_Forbidden_Journey.jpg"],
  ["simpsons",                 "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Universal_archway_2019.jpg/640px-Universal_archway_2019.jpg"],

  // ── Islands of Adventure ──────────────────────────────────────────────────
  ["velocicoaster",            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Islands_of_Adventure_Orlando_%2851149417278%29_%28cropped%29.jpg/640px-Islands_of_Adventure_Orlando_%2851149417278%29_%28cropped%29.jpg"],
  ["incredible hulk",          "https://upload.wikimedia.org/wikipedia/commons/1/1f/Incredible_Hulk_Coaster.png"],
  ["doctor doom",              "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Marvel_Super_Hero_Island_16.jpg/640px-Marvel_Super_Hero_Island_16.jpg"],
  ["hagrid",                   "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Hagrid%27s_Magical_Creatures_Motorbike_Adventure_1.jpg/640px-Hagrid%27s_Magical_Creatures_Motorbike_Adventure_1.jpg"],
  ["jurassic park river",      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Universal-Islands-of-Adventure-Jurassic-Park-River-9210.jpg/640px-Universal-Islands-of-Adventure-Jurassic-Park-River-9210.jpg"],
  ["amazing adventures of spider-man", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Marvel_Super_Hero_Island_16.jpg/640px-Marvel_Super_Hero_Island_16.jpg"],
  ["dudley do-right",          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Universal_Islands_of_Adventure%2C_Orlando.jpg/640px-Universal_Islands_of_Adventure%2C_Orlando.jpg"],
  ["popeye",                   "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Universal_Islands_of_Adventure%2C_Orlando.jpg/640px-Universal_Islands_of_Adventure%2C_Orlando.jpg"],
  ["skull island",             "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Universal_Islands_of_Adventure%2C_Orlando.jpg/640px-Universal_Islands_of_Adventure%2C_Orlando.jpg"],
  ["cat in the hat",           "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Universal_Islands_of_Adventure%2C_Orlando.jpg/640px-Universal_Islands_of_Adventure%2C_Orlando.jpg"],
  ["poseidon",                 "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Universal_Islands_of_Adventure%2C_Orlando.jpg/640px-Universal_Islands_of_Adventure%2C_Orlando.jpg"],

  // ── Epic Universe ─────────────────────────────────────────────────────────
  ["ministry of magic",        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Chronos_Tower_Front_Epic_Universe.jpg/640px-Chronos_Tower_Front_Epic_Universe.jpg"],
  ["how to train your dragon", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Chronos_Tower_Front_Epic_Universe.jpg/640px-Chronos_Tower_Front_Epic_Universe.jpg"],
  ["godzilla",                 "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Chronos_Tower_Front_Epic_Universe.jpg/640px-Chronos_Tower_Front_Epic_Universe.jpg"],
  ["donkey kong",              "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Super_Nintendo_World_%28Universal_Studios_Hollywood%29-A_view_in_July_2023.jpg/640px-Super_Nintendo_World_%28Universal_Studios_Hollywood%29-A_view_in_July_2023.jpg"],
  ["yoshi",                    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Super_Nintendo_World_%28Universal_Studios_Hollywood%29-A_view_in_July_2023.jpg/640px-Super_Nintendo_World_%28Universal_Studios_Hollywood%29-A_view_in_July_2023.jpg"],
];

export function getCuratedImage(attractionName: string): string | null {
  const lower = attractionName.toLowerCase();
  for (const [keyword, url] of CURATED) {
    if (lower.includes(keyword)) return url;
  }
  return null;
}
