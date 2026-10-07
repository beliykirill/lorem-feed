import { ROUTES } from './routes';

describe('ROUTES', () => {
  it('names every screen of the root stack', () => {
    expect(ROUTES).toEqual({ Posts: 'Posts', Details: 'Details' });
  });
});
