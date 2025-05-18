
export type InvitationType = 'main event' | 'afterparty' | 'admin';

export interface Guest {
  id: string;
  first_name: string;
  last_name?: string | null;
  email: string;
  phone_number?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  invitation_type: InvitationType;
  created_at?: string;
  updated_at?: string;
  party_id?: string | null;
  attending?: string | null;
}

export interface Party {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  members?: Guest[];
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
  created_at?: string;
  updated_at?: string;
}

export interface Communication {
  id: string;
  title: string;
  trigger: string;
  send_date: string;
  invitation_type: InvitationType[];
  prompt?: string;
  copy?: string;
  code?: string;
  created_at?: string;
  updated_at?: string;
}
