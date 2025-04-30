
export type InvitationType = 'full day' | 'evening' | 'admin';

export interface Guest {
  id: string;
  first_name: string;
  email: string;
  invitation_type: InvitationType;
  created_at?: string;
  updated_at?: string;
  rsvp?: {
    attending: boolean;
    plus_one: boolean;
    dietary_restrictions?: string;
  };
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  visible_to: InvitationType[];
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface Photo {
  id: string;
  url: string;
  uploaded_by: string;
  created_at?: string;
}

export interface RSVP {
  id: string;
  guest_id: string;
  attending: boolean;
  plus_one: boolean;
  dietary_restrictions?: string;
  created_at?: string;
  updated_at?: string;
}
