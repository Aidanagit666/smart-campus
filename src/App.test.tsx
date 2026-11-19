// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from '@/App';

afterEach(cleanup);

function setCurrentTime(value: string) {
  fireEvent.change(screen.getByLabelText('Current time'), { target: { value } });
}

function setAttendees(value: string) {
  fireEvent.change(screen.getByLabelText('Number of attendees'), { target: { value } });
}

function toggleEquipment(name: string) {
  fireEvent.click(screen.getByLabelText(name));
}

function visibleRoomNames(): string[] {
  return screen
    .queryAllByRole('button', { name: /^Room \d+/ })
    .map((button) => button.querySelector('h3')?.textContent ?? '');
}

function startValue() {
  return (screen.getByLabelText('Start time') as HTMLInputElement).value;
}

function quickSetButton(label: string) {
  return screen.getByRole('button', { name: label }) as HTMLButtonElement;
}

describe('F1: attendee count filters visible rooms', () => {
  it('hides rooms with fewer seats than the attendee count', () => {
    render(<App />);
    setAttendees('50');
    expect(visibleRoomNames()).toEqual(['Room 201']);
  });

  it('keeps a room whose capacity exactly matches the attendee count', () => {
    render(<App />);
    setAttendees('25');
    expect(visibleRoomNames()).toEqual(['Room 101', 'Room 102', 'Room 103', 'Room 201']);
  });
});

describe('F2: required equipment filters visible rooms', () => {
  it('shows only rooms that contain every selected item', () => {
    render(<App />);
    toggleEquipment('Projector');
    toggleEquipment('Video conferencing');
    expect(visibleRoomNames()).toEqual(['Room 103', 'Room 201']);
  });

  it('narrows the list when a second item is added', () => {
    render(<App />);
    toggleEquipment('Projector');
    expect(visibleRoomNames()).toEqual(['Room 101', 'Room 103', 'Room 201']);
    toggleEquipment('Whiteboard');
    expect(visibleRoomNames()).toEqual(['Room 101', 'Room 201']);
  });
});

describe('F4: empty state', () => {
  it('shows a clear message when no rooms match', () => {
    render(<App />);
    setAttendees('100');
    expect(visibleRoomNames()).toEqual([]);
    expect(screen.getByText(/No rooms match these filters/)).toBeTruthy();
  });
});

describe('F5: changing rooms clears the previous result', () => {
  it('removes the availability result when another room is selected', () => {
    render(<App />);
    setCurrentTime('08:00');
    fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));
    expect(screen.getByText('Unavailable')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /^Room 102/ }));
    expect(screen.queryByText('Unavailable')).toBeNull();
    expect(screen.getByText(/Select a room and enter a time interval/)).toBeTruthy();
  });
});

describe('quick-set buttons', () => {
  it('clears a previous result when a quick-set button changes the times', () => {
    render(<App />);
    setCurrentTime('08:00');
    fireEvent.click(screen.getByRole('button', { name: 'Check Availability' }));
    expect(screen.getByText('Unavailable')).toBeTruthy();

    fireEvent.click(quickSetButton('In 1 hour'));
    expect(screen.queryByText('Unavailable')).toBeNull();
  });

  it('starts the next quarter hour when the current time is already on one', () => {
    render(<App />);
    setCurrentTime('15:00');
    fireEvent.click(quickSetButton('Next 15 min'));
    expect(startValue()).toBe('15:15');
  });

  it('disables quick-set buttons whose interval would end after midnight', () => {
    render(<App />);
    setCurrentTime('23:50');
    expect(quickSetButton('Next 15 min').disabled).toBe(true);
    expect(quickSetButton('In 1 hour').disabled).toBe(true);
  });

  it('disables only the quick-set button that would overflow midnight', () => {
    render(<App />);
    setCurrentTime('22:00');
    expect(quickSetButton('Next 15 min').disabled).toBe(false);
    expect(quickSetButton('In 1 hour').disabled).toBe(true);
  });
});
