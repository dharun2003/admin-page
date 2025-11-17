
export interface Subscription {
  id: number;
  username: string;
  companyName: string;
  registrationDate: string;
  subscriptionPlan: 'Basic' | 'Pro' | 'Enterprise';
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  totalUploads: number;
  uploadsUsed: number;
  isActive: boolean;
}

export interface Payment {
  id: number;
  username: string;
  companyName: string;
  totalAmountPaid: number;
}
