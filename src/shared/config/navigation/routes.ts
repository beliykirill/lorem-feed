export const ROUTES = {
  Posts: 'Posts',
  Details: 'Details',
} as const;

export type RootStackParamList = {
  [ROUTES.Posts]: undefined;
  [ROUTES.Details]: { postId: number };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
