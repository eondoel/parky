/**
 * Curated Wikimedia Commons image URLs for popular attractions.
 * Keys are lowercased attraction name substrings. Checked before
 * falling back to the live Wikipedia search API.
 */
const CURATED: [string, string][] = [
  // ── Disneyland ────────────────────────────────────────────────────
  ["haunted mansion",         "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Disneyland_Haunted_Mansion.jpg/640px-Disneyland_Haunted_Mansion.jpg"],
  ["pirates of the caribbean","https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Pirates_of_the_Caribbean_Disneyland.jpg/640px-Pirates_of_the_Caribbean_Disneyland.jpg"],
  ["indiana jones",           "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Indiana_Jones_Adventure_exterior.jpg/640px-Indiana_Jones_Adventure_exterior.jpg"],
  ["jungle cruise",           "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Jungle_Cruise_at_Disneyland.jpg/640px-Jungle_Cruise_at_Disneyland.jpg"],
  ["matterhorn",              "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Matterhorn_Bobsleds_Disneyland.jpg/640px-Matterhorn_Bobsleds_Disneyland.jpg"],
  ["space mountain",          "https://upload.wikimedia.org/wikipedia/commons/a/a1/Space_mountain.jpg"],
  ["big thunder",             "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Big_Thunder_Mountain_Disneyland.jpg/640px-Big_Thunder_Mountain_Disneyland.jpg"],
  ["small world",             "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/It%27s_a_Small_World_logo.svg/640px-It%27s_a_Small_World_logo.svg.png"],
  ["peter pan",               "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Peter_Pan%27s_Flight_Disneyland.jpg/640px-Peter_Pan%27s_Flight_Disneyland.jpg"],
  ["millennium falcon",       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Millennium_Falcon_Smugglers_Run.jpg/640px-Millennium_Falcon_Smugglers_Run.jpg"],
  ["rise of the resistance",  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Star_Wars_Rise_of_the_Resistance.jpg/640px-Star_Wars_Rise_of_the_Resistance.jpg"],
  ["buzz lightyear",          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Buzz_Lightyear_Astro_Blasters.jpg/640px-Buzz_Lightyear_Astro_Blasters.jpg"],
  ["mark twain",              "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Mark_Twain_Riverboat_Disneyland.jpg/640px-Mark_Twain_Riverboat_Disneyland.jpg"],
  ["tiana's bayou",           "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Tiana%27s_Bayou_Adventure_exterior.jpg/640px-Tiana%27s_Bayou_Adventure_exterior.jpg"],
  ["dumbo",                   "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Dumbo_the_Flying_Elephant_WDW.jpg/640px-Dumbo_the_Flying_Elephant_WDW.jpg"],
  ["mad tea party",           "https://upload.wikimedia.org/wikipedia/commons/8/80/TeacupsMadTeaParty_wb.jpg"],
  ["astro orbiter",           "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Dlp_astro_orbitor.jpg/640px-Dlp_astro_orbitor.jpg"],
  ["autopia",                 "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Autopia_at_Disneyland%2C_Nov_2005_-_DL05_039.jpg/640px-Autopia_at_Disneyland%2C_Nov_2005_-_DL05_039.jpg"],

  // ── California Adventure ──────────────────────────────────────────
  ["guardians of the galaxy", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Guardians_of_the_Galaxy_Mission_Breakout.jpg/640px-Guardians_of_the_Galaxy_Mission_Breakout.jpg"],
  ["incredicoaster",          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Incredicoaster_at_Pixar_Pier.jpg/640px-Incredicoaster_at_Pixar_Pier.jpg"],
  ["radiator springs",        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Radiator_Springs_Racers.jpg/640px-Radiator_Springs_Racers.jpg"],
  ["soarin",                  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Soarin%27_Around_the_World_EPCOT.jpg/640px-Soarin%27_Around_the_World_EPCOT.jpg"],
  ["webslingers",             "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/WEB_SLINGERS_A_Spider-Man_Adventure.jpg/640px-WEB_SLINGERS_A_Spider-Man_Adventure.jpg"],
  ["grizzly river",           "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Grizzly_River_Run_DCA.jpg/640px-Grizzly_River_Run_DCA.jpg"],
  ["pixar pal-a-round",       "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Pixar_Pal-A-Round_2019.jpg/640px-Pixar_Pal-A-Round_2019.jpg"],

  // ── Magic Kingdom ─────────────────────────────────────────────────
  ["seven dwarfs",            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Seven_Dwarfs_Mine_Train_roller_coaster.jpg/640px-Seven_Dwarfs_Mine_Train_roller_coaster.jpg"],
  ["tron",                    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/TRON_Lightcycle_Run_Magic_Kingdom.jpg/640px-TRON_Lightcycle_Run_Magic_Kingdom.jpg"],
  ["barnstormer",             "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/The_Barnstormer_at_Storybook_Circus.jpg/640px-The_Barnstormer_at_Storybook_Circus.jpg"],
  ["philharmagic",            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Mickey%27s_PhilharMagic.jpg/640px-Mickey%27s_PhilharMagic.jpg"],
  ["little mermaid",          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/The_Little_Mermaid_-_Ariels_Undersea_Adventure_entrance.jpg/640px-The_Little_Mermaid_-_Ariels_Undersea_Adventure_entrance.jpg"],
  ["under the sea",           "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/The_Little_Mermaid_-_Ariels_Undersea_Adventure_entrance.jpg/640px-The_Little_Mermaid_-_Ariels_Undersea_Adventure_entrance.jpg"],
  ["enchanted tales",         "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Be_Our_Guest_Restaurant_at_Magic_Kingdom_%2811700703084%29.jpg/640px-Be_Our_Guest_Restaurant_at_Magic_Kingdom_%2811700703084%29.jpg"],
  ["walt disney world railroad","https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Walt_Disney_World_Railroad_at_Main_Street_station.jpg/640px-Walt_Disney_World_Railroad_at_Main_Street_station.jpg"],
  ["railroad",                "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Walt_Disney_World_Railroad_at_Main_Street_station.jpg/640px-Walt_Disney_World_Railroad_at_Main_Street_station.jpg"],
  ["winnie the pooh",         "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/The_Many_Adventures_of_Winnie_the_Pooh_entrance.jpg/640px-The_Many_Adventures_of_Winnie_the_Pooh_entrance.jpg"],
  ["pirates adventure",       "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Pirates_of_the_Caribbean_Disneyland.jpg/640px-Pirates_of_the_Caribbean_Disneyland.jpg"],
  ["tomorrowland speedway",   "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Autopia_at_Disneyland%2C_Nov_2005_-_DL05_039.jpg/640px-Autopia_at_Disneyland%2C_Nov_2005_-_DL05_039.jpg"],

  // ── EPCOT ─────────────────────────────────────────────────────────
  ["spaceship earth",         "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Spaceship_Earth%2C_EPCOT.jpg/640px-Spaceship_Earth%2C_EPCOT.jpg"],
  ["frozen ever after",       "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Frozen_Ever_After_ride_exterior.jpg/640px-Frozen_Ever_After_ride_exterior.jpg"],
  ["test track",              "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Test_Track_EPCOT.jpg/640px-Test_Track_EPCOT.jpg"],
  ["remy",                    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Remy%27s_Ratatouille_Adventure.jpg/640px-Remy%27s_Ratatouille_Adventure.jpg"],
  ["mission: space",          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mission_SPACE_at_Epcot.jpg/640px-Mission_SPACE_at_Epcot.jpg"],
  ["living with the land",    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Living_with_the_Land_EPCOT.jpg/640px-Living_with_the_Land_EPCOT.jpg"],
  ["turtle talk",             "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Turtle_Talk_with_Crush%2C_Epcot.jpg/640px-Turtle_Talk_with_Crush%2C_Epcot.jpg"],
  ["seas with nemo",          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Epcot_The_Seas_pavilion_logo.svg/640px-Epcot_The_Seas_pavilion_logo.svg.png"],
  ["gran fiesta",             "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Gran_Fiesta_Boat_Ride_Sign_Mexico_Pavilion_Epcot_Center_%282541198505%29.jpg/640px-Gran_Fiesta_Boat_Ride_Sign_Mexico_Pavilion_Epcot_Center_%282541198505%29.jpg"],
  ["figment",                 "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Journey_into_Imagination_ride_logo.jpg/640px-Journey_into_Imagination_ride_logo.jpg"],
  ["imagination",             "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Journey_into_Imagination_ride_logo.jpg/640px-Journey_into_Imagination_ride_logo.jpg"],
  ["guardians of the galaxy cosmic rewind", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Guardians_of_the_Galaxy_Cosmic_Rewind.jpg/640px-Guardians_of_the_Galaxy_Cosmic_Rewind.jpg"],

  // ── Hollywood Studios ─────────────────────────────────────────────
  ["tower of terror",         "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/The_Twilight_Zone_Tower_of_Terror%2C_2024.jpg/640px-The_Twilight_Zone_Tower_of_Terror%2C_2024.jpg"],
  ["rock 'n' roller",         "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Rock_N_Roller_Coaster_Hollywood_Studios.jpg/640px-Rock_N_Roller_Coaster_Hollywood_Studios.jpg"],
  ["slinky dog",              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Slinky_Dog_Dash_roller_coaster.jpg/640px-Slinky_Dog_Dash_roller_coaster.jpg"],
  ["mickey & minnie",         "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Mickey_and_Minnie%27s_Runaway_Railway.jpg/640px-Mickey_and_Minnie%27s_Runaway_Railway.jpg"],
  ["runaway railway",         "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Mickey_and_Minnie%27s_Runaway_Railway.jpg/640px-Mickey_and_Minnie%27s_Runaway_Railway.jpg"],
  ["star tours",              "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Star_Tours_Hollywood_Studios.jpg/640px-Star_Tours_Hollywood_Studios.jpg"],
  ["toy story mania",         "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toy_Story_Midway_Mania.jpg/640px-Toy_Story_Midway_Mania.jpg"],
  ["alien swirling",          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toy_Story_Midway_Mania.jpg/640px-Toy_Story_Midway_Mania.jpg"],

  // ── Animal Kingdom ────────────────────────────────────────────────
  ["expedition everest",      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Expedition_Everest_Animal_Kingdom.jpg/640px-Expedition_Everest_Animal_Kingdom.jpg"],
  ["flight of passage",       "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Avatar_Flight_of_Passage_exterior.jpg/640px-Avatar_Flight_of_Passage_exterior.jpg"],
  ["kilimanjaro",             "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Kilimanjaro_Safaris_Animal_Kingdom.jpg/640px-Kilimanjaro_Safaris_Animal_Kingdom.jpg"],
  ["kali river",              "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Kali_River_Rapids_Animal_Kingdom.jpg/640px-Kali_River_Rapids_Animal_Kingdom.jpg"],
  ["na'vi river",             "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Navi_River_Journey_Animal_Kingdom.jpg/640px-Navi_River_Journey_Animal_Kingdom.jpg"],

  // ── Universal Hollywood ───────────────────────────────────────────
  ["forbidden journey",       "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Harry_Potter_and_the_Forbidden_Journey.jpg/640px-Harry_Potter_and_the_Forbidden_Journey.jpg"],
  ["flight of the hippogriff","https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flight_of_the_Hippogriff_roller_coaster.jpg/640px-Flight_of_the_Hippogriff_roller_coaster.jpg"],
  ["revenge of the mummy",    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Revenge_of_the_Mummy_Universal_Studios.jpg/640px-Revenge_of_the_Mummy_Universal_Studios.jpg"],
  ["jurassic world",          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Jurassic_World_The_Ride_Universal_Hollywood.jpg/640px-Jurassic_World_The_Ride_Universal_Hollywood.jpg"],
  ["transformers",            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Transformers_The_Ride_3D_Universal_Studios.jpg/640px-Transformers_The_Ride_3D_Universal_Studios.jpg"],
  ["despicable me",           "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Despicable_Me_Minion_Mayhem_entrance.jpg/640px-Despicable_Me_Minion_Mayhem_entrance.jpg"],
  ["mario kart",              "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Mario_Kart_Bowsers_Challenge_USH.jpg/640px-Mario_Kart_Bowsers_Challenge_USH.jpg"],
  ["kung fu panda",           "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Kung_Fu_Panda_Adventure_USH.jpg/640px-Kung_Fu_Panda_Adventure_USH.jpg"],
  ["studio tour",             "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Universal_Studio_Tour_tram.jpg/640px-Universal_Studio_Tour_tram.jpg"],
  ["waterworld",              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/WaterWorld_Universal_Studios_Hollywood.jpg/640px-WaterWorld_Universal_Studios_Hollywood.jpg"],
  ["water world",             "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/WaterWorld_Universal_Studios_Hollywood.jpg/640px-WaterWorld_Universal_Studios_Hollywood.jpg"],

  // ── Islands of Adventure ──────────────────────────────────────────
  ["velocicoaster",           "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/VelociCoaster_Islands_of_Adventure.jpg/640px-VelociCoaster_Islands_of_Adventure.jpg"],
  ["incredible hulk",         "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Incredible_Hulk_Coaster_IOA.jpg/640px-Incredible_Hulk_Coaster_IOA.jpg"],
  ["doctor doom",             "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Doctor_Doom%27s_Fearfall.jpg/640px-Doctor_Doom%27s_Fearfall.jpg"],
  ["hagrid",                  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Hagrid%27s_Magical_Creatures_Motorbike_Adventure.jpg/640px-Hagrid%27s_Magical_Creatures_Motorbike_Adventure.jpg"],
  ["jurassic park river",     "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Jurassic_Park_River_Adventure.jpg/640px-Jurassic_Park_River_Adventure.jpg"],

  // ── Epic Universe ─────────────────────────────────────────────────
  ["starfall racers",         "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Starfall_Racers_Epic_Universe.jpg/640px-Starfall_Racers_Epic_Universe.jpg"],
];

export function getCuratedImage(attractionName: string): string | null {
  const lower = attractionName.toLowerCase();
  for (const [keyword, url] of CURATED) {
    if (lower.includes(keyword)) return url;
  }
  return null;
}
