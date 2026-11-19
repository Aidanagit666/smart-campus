import type { Room } from '@/types';

export const SAMPLE_ROOMS: Room[] = [
  {
    id: 'room-101',
    name: 'Room 101',
    building: 'Engineering Block A',
    capacity: 40,
    equipment: ['Projector', 'Whiteboard'],
    blocked: false,
    bookings: [
      { start: 600, end: 660, bookedBy: 'Dr. Chen', purpose: 'Algorithms Lecture' },
      { start: 840, end: 900, bookedBy: 'Ms. Patel', purpose: 'Faculty Meeting' },
    ],
  },
  {
    id: 'room-102',
    name: 'Room 102',
    building: 'Engineering Block A',
    capacity: 30,
    equipment: ['Whiteboard', 'Video conferencing'],
    blocked: false,
    bookings: [
      { start: 540, end: 600, bookedBy: 'Prof. Lee', purpose: 'Calculus Tutorial' },
      { start: 720, end: 780, bookedBy: 'Study Group', purpose: 'Project Work' },
    ],
  },
  {
    id: 'room-103',
    name: 'Room 103',
    building: 'Science Block B',
    capacity: 25,
    equipment: ['Projector', 'Video conferencing'],
    blocked: true,
    blockedReason: 'Under maintenance — HVAC repair',
    bookings: [],
  },
  {
    id: 'room-201',
    name: 'Room 201',
    building: 'Library Wing',
    capacity: 60,
    equipment: ['Projector', 'Whiteboard', 'Video conferencing'],
    blocked: false,
    bookings: [
      { start: 480, end: 540, bookedBy: 'Dr. Garcia', purpose: 'Research Seminar' },
      { start: 960, end: 1020, bookedBy: 'Career Services', purpose: 'Resume Workshop' },
    ],
  },
  {
    id: 'room-205',
    name: 'Room 205',
    building: 'Library Wing',
    capacity: 20,
    equipment: ['Lab computers', 'Whiteboard'],
    blocked: false,
    bookings: [
      { start: 660, end: 720, bookedBy: 'Debate Club', purpose: 'Practice Session' },
    ],
  },
];
