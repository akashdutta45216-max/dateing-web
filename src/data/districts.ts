export interface DistrictData {
  district: string;
  popularCities: string[];
}

export const WEST_BENGAL_DISTRICTS: DistrictData[] = [
  {
    district: 'Kolkata',
    popularCities: ['South Kolkata (Ballygunge/Alipore)', 'North Kolkata (Shyambazar)', 'Salt Lake City (Bidhannagar)', 'New Town', 'Jadavpur / Garia', 'Park Street / Esplanade', 'Behala', 'Dum Dum']
  },
  {
    district: 'Howrah',
    popularCities: ['Howrah Central', 'Shibpur', 'Bally', 'Uluberia', 'Santragachi', 'Liluah']
  },
  {
    district: 'North 24 Parganas',
    popularCities: ['Barasat', 'Barrackpore', 'Rajarhat', 'Habra', 'Bongaon', 'Kanchrapara', 'Basirhat', 'Naihati']
  },
  {
    district: 'South 24 Parganas',
    popularCities: ['Baruipur', 'Sonarpur', 'Diamond Harbour', 'Canning', 'Budge Budge', 'Jayanagar']
  },
  {
    district: 'Hooghly',
    popularCities: ['Chinsurah', 'Chandannagar', 'Serampore', 'Uttarpara', 'Bandel', 'Tarakeswar', 'Rishra']
  },
  {
    district: 'Darjeeling',
    popularCities: ['Darjeeling Town', 'Kurseong', 'Mirik', 'Batasia', 'Ghum']
  },
  {
    district: 'Siliguri (Sub-division)',
    popularCities: ['Siliguri Central', 'Matigara', 'Sevoke Road', 'Pradhan Nagar', 'Hakim Para']
  },
  {
    district: 'Jalpaiguri',
    popularCities: ['Jalpaiguri Town', 'Malbazar', 'Dhupguri', 'Maynaguri']
  },
  {
    district: 'Kalimpong',
    popularCities: ['Kalimpong Town', 'Pedong', 'Lava', 'Rishi']
  },
  {
    district: 'Paschim Bardhaman',
    popularCities: ['Durgapur', 'Asansol', 'Raniganj', 'Kulti', 'Andal']
  },
  {
    district: 'Purba Bardhaman',
    popularCities: ['Bardhaman Town', 'Katwa', 'Kalna', 'Memari']
  },
  {
    district: 'Malda',
    popularCities: ['English Bazar (Malda Town)', 'Old Malda', 'Chanchal', 'Gazole']
  },
  {
    district: 'Murshidabad',
    popularCities: ['Baharampur', 'Lalgola', 'Jangipur', 'Kandi', 'Jiaganj']
  },
  {
    district: 'Nadia',
    popularCities: ['Kalyani', 'Krishnanagar', 'Ranaghat', 'Nabadwip', 'Santipur', 'Chakdaha']
  },
  {
    district: 'Birbhum',
    popularCities: ['Bolpur (Shantiniketan)', 'Suri', 'Rampurhat', 'Dubrajpur', 'Sainthia']
  },
  {
    district: 'Bankura',
    popularCities: ['Bankura Town', 'Bishnupur', 'Khatra', 'Barjora']
  },
  {
    district: 'Purulia',
    popularCities: ['Purulia Town', 'Raghunathpur', 'Jhalda', 'Adra']
  },
  {
    district: 'Paschim Medinipur',
    popularCities: ['Kharagpur', 'Medinipur Town', 'Ghatal', 'Jhargram Border']
  },
  {
    district: 'Purba Medinipur',
    popularCities: ['Tamluk', 'Haldia', 'Contai (Kanthi)', 'Digha / Mandarmani', 'Mahisadal']
  },
  {
    district: 'Cooch Behar',
    popularCities: ['Cooch Behar Town', 'Dinhata', 'Mathabhanga', 'Tufanganj']
  },
  {
    district: 'Alipurduar',
    popularCities: ['Alipurduar Town', 'Falakata', 'Jaigaon', 'Birpara']
  },
  {
    district: 'Uttar Dinajpur',
    popularCities: ['Raiganj', 'Islampur', 'Dalkhola', 'Kaliyaganj']
  },
  {
    district: 'Dakshin Dinajpur',
    popularCities: ['Balurghat', 'Gangarampur', 'Buniadpur']
  },
  {
    district: 'Jhargram',
    popularCities: ['Jhargram Town', 'Belpahari', 'Gopiballavpur']
  }
];

export const POPULAR_INTERESTS = [
  'Rabindrasangeet 🎶',
  'Coffee House Adda ☕',
  'Street Food & Puchka 🌶️',
  'Satyajit Ray Cinema 🎬',
  'Darjeeling Tea Trips 🏔️',
  'Durga Puja Pandals ✨',
  'Photography 📷',
  'Reading Bengali Novels 📚',
  'Coding & Tech 💻',
  'Culinary & Cooking 🍲',
  'Football & Mohun Bagan / East Bengal ⚽',
  'Live Theatre & Natok 🎭',
  'Weekend Long Drives 🚗',
  'Poetry & Writing ✍️',
  'Yoga & Fitness 🧘',
  'Travel & Backpacking 🎒'
];

export const RELATIONSHIP_GOAL_LABELS: Record<string, string> = {
  long_term: 'Long-term connection & romance',
  dating: 'Dating leading to marriage',
  marriage: 'Committed matrimonial intent',
  friendship: 'Meaningful adda & companionship',
  casual: 'Casual conversations & coffee dates'
};
