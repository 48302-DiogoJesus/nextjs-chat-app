import { UserPublicModel } from "models/UserPublicModel";

export const userPublicModelSelection: {
  select: Record<keyof UserPublicModel, boolean>;
} = {
  select: {
    email: true,
    image: true,
    name: true,
  },
};
