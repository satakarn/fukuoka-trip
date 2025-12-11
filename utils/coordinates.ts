// Approximate coordinates for Fukuoka trip locations
// Format: [lat, lng]
export const getCoordinates = (name: string, query: string): [number, number] | null => {
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const searchStr = normalize(name) + normalize(query);

  const locations: Record<string, [number, number]> = {
    'airport': [33.5859, 130.4507],
    'fukuokacoffee': [33.5912, 130.4038], // Fuk Coffee approx
    'coffee': [33.5912, 130.4038],
    'gion': [33.5960, 130.4116],
    'ichiran': [33.5930, 130.4045],
    'nakaima': [33.5957, 130.4137],
    'kuju': [33.1099, 131.2464], // Ski
    'ski': [33.1099, 131.2464],
    'dazaifu': [33.5215, 130.5349],
    'hinata': [33.5190, 130.5330],
    'aso': [32.8842, 131.1039],
    'kumamotocity': [32.8031, 130.7079],
    'kumamoto': [32.8031, 130.7079],
    'kasumi': [32.7900, 130.7000], // Approx
    'nanzoin': [33.6186, 130.5735],
    'karato': [33.9576, 130.9413],
    'kinrin': [33.2665, 131.3697],
    'yufuin': [33.2665, 131.3697],
    'kumamotocastle': [32.8062, 130.7058],
    'yame': [33.2267, 130.5900],
    'kurume': [33.3188, 130.5085],
    'kora': [33.3039, 130.5753],
    'sakurai': [33.6425, 130.2057],
    'futamigaura': [33.6425, 130.2057],
    'momochi': [33.5936, 130.3515],
    'yatai': [33.5920, 130.4080],
    'nakasu': [33.5920, 130.4080],
    'christmas': [33.5900, 130.4206], // Hakata station
    'sarakura': [33.8436, 130.7937],
    'miyajidake': [33.7806, 130.4851],
    'railway': [33.9450, 130.9608],
    'tenjin': [33.5900, 130.4000],
    'kushida': [33.5930, 130.4106],
    'tochoji': [33.5954, 130.4158],
    'kawabata': [33.5940, 130.4090],
    'daimyo': [33.5880, 130.3960],
    'donquijote': [33.5930, 130.4080], // Generic central
    'mojiko': [33.9450, 130.9600],
    'ohori': [33.5860, 130.3760],
    'milk': [32.9500, 131.0500],
    'mina': [33.5930, 130.3990],
    'yodobashi': [33.5880, 130.4220],
    'donut': [33.5900, 130.4000],
    'bayside': [33.6050, 130.4020],
    'rental': [33.5859, 130.4507], // Airport
  };

  // Check strict keys first
  for (const key in locations) {
    if (searchStr.includes(key)) {
      return locations[key];
    }
  }

  return null;
};