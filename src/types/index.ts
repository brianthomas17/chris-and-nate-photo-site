
export type InvitationType = 'main event' | 'afterparty' | 'admin';

export interface Guest {
  id: string;
  first_name: string;
  last_name?: string | null;
  email?: string | null;
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
  friday_dinner?: boolean | null;
  sunday_brunch?: boolean | null;
  main_event?: boolean;
  afterparty?: boolean;
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
  visible_to_friday_dinner?: boolean;
  visible_to_sunday_brunch?: boolean;
  visible_to_main_event: boolean;
  visible_to_afterparty: boolean;
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
