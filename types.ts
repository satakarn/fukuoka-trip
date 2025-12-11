export interface TripEvent {
  id: string;
  name: string;
  day: string;
  link: string;
  notes: string;
  price: string;
  timeFrame: string;
  type: string;
}

export type TripType = 
  | 'Accomodation'
  | 'Hotel'
  | 'Food'
  | 'Transportation'
  | 'Historic'
  | 'Relax / Chill'
  | 'Fun / Touristy'
  | 'Local Places'
  | 'Cafe'
  | 'Activity'
  | 'Pictures'
  | 'Other'
  | 'Unknown';

export interface FilterState {
  day: string | 'All';
  type: string | 'All';
}