
-- Add new RSVP columns to track event attendance confirmation
ALTER TABLE guests 
ADD COLUMN friday_dinner_rsvp boolean DEFAULT NULL,
ADD COLUMN sunday_brunch_rsvp boolean DEFAULT NULL,
ADD COLUMN main_event_rsvp boolean DEFAULT NULL,
ADD COLUMN afterparty_rsvp boolean DEFAULT NULL;

-- Add comment to clarify the purpose of these columns
COMMENT ON COLUMN guests.friday_dinner_rsvp IS 'Tracks whether guest confirmed attendance for Friday dinner after RSVPing Yes';
COMMENT ON COLUMN guests.sunday_brunch_rsvp IS 'Tracks whether guest confirmed attendance for Sunday brunch after RSVPing Yes';
COMMENT ON COLUMN guests.main_event_rsvp IS 'Tracks whether guest confirmed attendance for main event after RSVPing Yes';
COMMENT ON COLUMN guests.afterparty_rsvp IS 'Tracks whether guest confirmed attendance for afterparty after RSVPing Yes';
