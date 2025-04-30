
export type InvitationType = 'full day' | 'evening' | 'admin';

export interface Guest {
  id: string;
  firstName: string;
  email: string;
  invitationType: InvitationType;
  rsvp?: {
    attending: boolean;
    plusOne: boolean;
    dietaryRestrictions?: string;
  };
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  visibleTo: InvitationType[];
  order: number;
}

export interface Photo {
  id: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}
