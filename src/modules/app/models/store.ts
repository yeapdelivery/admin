import StoreTypeEnum from "../enums/store-type";
import { Address } from "./address";
import OwnerModal from "./owner";

export interface DeliveryStore {
  price: number;
  estimatedMaxTime: number;
  estimatedMinTime: number;
}

interface DayHours {
  openHour: string;
  closeHour: string;
}

export interface OpeningHours {
  sunday: DayHours;
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
}

export default interface StoreModel {
  id: string;
  name: string;
  email: string;
  address: Address;
  ownerInfo: OwnerModal;
  type: StoreTypeEnum;
  specialties: string[];
  documentNumber: string;
  documentType: string;
  logo: string;
  cover: string;
  delivery: DeliveryStore;
  openingHours: OpeningHours;
}
