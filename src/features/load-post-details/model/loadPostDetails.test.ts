import type { PostDetails, ValidatedPostDto } from '@/entities/post';

import { loadPostDetails, type LoadPostDetailsDeps } from './loadPostDetails';

const POST_ID = 7;
const dto: ValidatedPostDto = { id: POST_ID, title: 'title', body: 'body' };

// An in-memory details cache: savePostDetails writes to it as the store does.
function setup(fetchPost: LoadPostDetailsDeps['fetchPost']) {
  const cache: Record<number, PostDetails> = {};
  const deps = {
    getDetails: (postId: number) => cache[postId],
    fetchPost: jest.fn(fetchPost),
    savePostDetails: jest.fn((postId: number, saved: ValidatedPostDto) => {
      cache[postId] = { ...saved, imageUrl: 'url' };
    }),
    inFlight: new Set<number>(),
  };
  return { cache, deps };
}

describe('loadPostDetails', () => {
  let warn: jest.SpyInstance;
  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => warn.mockRestore());

  it('does not fetch when the details are cached', async () => {
    const { cache, deps } = setup(async () => dto);
    cache[POST_ID] = { ...dto, imageUrl: 'url' };

    await loadPostDetails(POST_ID, deps);
    expect(deps.fetchPost).not.toHaveBeenCalled();
  });

  it('stores nothing on error and fetches again on the next call', async () => {
    const { cache, deps } = setup(async () => {
      throw new Error('network');
    });

    await loadPostDetails(POST_ID, deps);
    expect(deps.savePostDetails).not.toHaveBeenCalled();
    expect(cache[POST_ID]).toBeUndefined();

    await loadPostDetails(POST_ID, deps);
    expect(deps.fetchPost).toHaveBeenCalledTimes(2);
  });

  it('treats a response with another id as an error', async () => {
    // fetchPost rejects when validatePost sees id !== postId, see validate.test.ts.
    const { deps } = setup(async () => {
      throw new Error(`Invalid post response: id 8, expected ${POST_ID}`);
    });

    await loadPostDetails(POST_ID, deps);
    expect(deps.savePostDetails).not.toHaveBeenCalled();

    await loadPostDetails(POST_ID, deps);
    expect(deps.fetchPost).toHaveBeenCalledTimes(2);
  });

  it('saves under the requested postId and never fetches again', async () => {
    const { deps } = setup(async () => dto);

    await loadPostDetails(POST_ID, deps);
    expect(deps.fetchPost).toHaveBeenCalledWith(POST_ID);
    expect(deps.savePostDetails).toHaveBeenCalledWith(POST_ID, dto);

    await loadPostDetails(POST_ID, deps);
    expect(deps.fetchPost).toHaveBeenCalledTimes(1);
  });

  it('makes one request for two parallel calls', async () => {
    const { deps } = setup(async () => dto);

    await Promise.all([
      loadPostDetails(POST_ID, deps),
      loadPostDetails(POST_ID, deps),
    ]);
    expect(deps.fetchPost).toHaveBeenCalledTimes(1);
    expect(deps.savePostDetails).toHaveBeenCalledTimes(1);
  });
});
