import { Post, User } from '../types';

const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Peter Anteater',
    email: 'peter@uci.edu',
    gender: 'Male',
    major: 'Computer Science',
    year: 'Junior',
    isOnboarded: true,
    role: 'driver',
    city: 'Irvine'
  },
  {
    id: 'u2',
    name: 'Sarah Kim',
    email: 'skim@uci.edu',
    gender: 'Female',
    major: 'Biology',
    year: 'Senior',
    isOnboarded: true,
    role: 'passenger',
    city: 'Fullerton'
  },
  {
    id: 'u3',
    name: 'Marcus Johnson',
    email: 'mjohnson@uci.edu',
    gender: 'Male',
    major: 'Mechanical Engineering',
    year: 'Sophomore',
    isOnboarded: true,
    role: 'driver',
    city: 'Long Beach'
  },
  {
    id: 'u4',
    name: 'Emily Chen',
    email: 'echen@uci.edu',
    gender: 'Female',
    major: 'Psychology',
    year: 'Freshman',
    isOnboarded: true,
    role: 'passenger',
    city: 'Anaheim'
  },
  {
    id: 'u5',
    name: 'David Rodriguez',
    email: 'davidr@uci.edu',
    gender: 'Male',
    major: 'Business Admin',
    year: 'Senior',
    isOnboarded: true,
    role: 'both',
    city: 'Tustin'
  },
  {
    id: 'u6',
    name: 'Jessica Lee',
    email: 'jessl@uci.edu',
    gender: 'Female',
    major: 'Nursing',
    year: 'Junior',
    isOnboarded: true,
    role: 'passenger',
    city: 'Los Angeles'
  }
];

export const generateMockPosts = (): Post[] => {
  return [
    {
      id: 'p1',
      userId: 'u1',
      user: MOCK_USERS[0],
      type: 'driver',
      origin: 'UTC Apartments, Irvine',
      destination: 'UCI Flagpoles',
      schedule: {
        days: ['Mon', 'Wed', 'Fri'],
        timeStart: '08:30',
        timeEnd: '17:00',
        isRecurring: true
      },
      details: {
        carType: 'Toyota Prius',
        seats: 3,
        cleanliness: 5,
        yearsDriving: 3,
        costType: 'split_gas',
        notes: 'Listening to calm lo-fi in the mornings. Prompt departure.'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'p2',
      userId: 'u2',
      user: MOCK_USERS[1],
      type: 'passenger',
      origin: 'Sunny Hills, Fullerton',
      destination: 'UCI Science Library',
      schedule: {
        days: ['Tue', 'Thu'],
        timeStart: '09:00',
        timeEnd: '15:30',
        isRecurring: true
      },
      details: {
        genderPreference: 'same',
        notes: 'Happy to chip in for gas! I usually sleep on the way there.'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'p3',
      userId: 'u3',
      user: MOCK_USERS[2],
      type: 'driver',
      origin: 'Downtown Long Beach',
      destination: 'UCI Engineering Hall',
      schedule: {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        timeStart: '07:00',
        timeEnd: '16:00',
        isRecurring: true
      },
      details: {
        carType: 'Honda Civic',
        seats: 2,
        cleanliness: 4,
        yearsDriving: 2,
        costType: 'split_gas_parking',
        notes: 'Commuting daily. Prefer someone who likes to chat or listen to podcasts.'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'p4',
      userId: 'u4',
      user: MOCK_USERS[3],
      type: 'passenger',
      origin: 'Platinum Triangle, Anaheim',
      destination: 'UCI Aldrich Park',
      schedule: {
        days: ['Mon', 'Fri'],
        timeStart: '10:00',
        timeEnd: '14:00',
        isRecurring: false
      },
      details: {
        genderPreference: 'any',
        notes: 'Just need a ride for a few weeks while my car is in the shop.'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'p5',
      userId: 'u5',
      user: MOCK_USERS[4],
      type: 'driver',
      origin: 'The District, Tustin',
      destination: 'UCI Social Science',
      schedule: {
        days: ['Tue', 'Thu'],
        timeStart: '12:00',
        timeEnd: '18:00',
        isRecurring: true
      },
      details: {
        carType: 'Tesla Model 3',
        seats: 4,
        cleanliness: 5,
        yearsDriving: 5,
        costType: 'free',
        notes: 'EV charging is free for me so ride is free for you!'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'p6',
      userId: 'u6',
      user: MOCK_USERS[5],
      type: 'passenger',
      origin: 'Koreatown, Los Angeles',
      destination: 'UCI Arts',
      schedule: {
        days: ['Wed'],
        timeStart: '06:00',
        timeEnd: '20:00',
        isRecurring: true
      },
      details: {
        genderPreference: 'same',
        notes: 'Long commute, looking for a reliable driver.'
      },
      createdAt: new Date().toISOString()
    }
  ];
};