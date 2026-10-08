import type { ListStatus, ValidatedPostDto } from '@/entities/post';

import { loadPosts, type LoadPostsDeps } from './load-posts';

const dtos: ValidatedPostDto[] = [{ id: 1, title: 'title', body: 'body' }];

// An in-memory stand-in for the post store: savePostList sets the flag as saveList does.
function setup(fetchPosts: LoadPostsDeps['fetchPosts']) {
  const state = {
    isListLoaded: false,
    listStatus: 'idle' as ListStatus,
    setListStatus: (status: ListStatus) => {
      state.listStatus = status;
    },
  };
  const savePostList = jest.fn(() => {
    state.isListLoaded = true;
    state.listStatus = 'idle';
  });
  const deps = {
    getState: () => state,
    fetchPosts: jest.fn(fetchPosts),
    savePostList,
  };
  return { state, deps };
}

describe('loadPosts', () => {
  let warn: jest.SpyInstance;
  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => warn.mockRestore());

  it('saves a non-empty list once and never fetches again', async () => {
    const { state, deps } = setup(async () => dtos);

    await loadPosts(deps);
    expect(deps.savePostList).toHaveBeenCalledTimes(1);
    expect(deps.savePostList).toHaveBeenCalledWith(dtos);
    expect(state.isListLoaded).toBe(true);

    await loadPosts(deps);
    expect(deps.fetchPosts).toHaveBeenCalledTimes(1);
    // Enrichment lives inside savePostList, so it does not run again either.
    expect(deps.savePostList).toHaveBeenCalledTimes(1);
  });

  it('sets error and stores nothing when fetchPosts throws, then retries', async () => {
    // fetchPosts throws on network, HTTP and validation errors alike.
    const { state, deps } = setup(async () => {
      throw new Error('invalid response');
    });

    await loadPosts(deps);
    expect(state.listStatus).toBe('error');
    expect(state.isListLoaded).toBe(false);
    expect(deps.savePostList).not.toHaveBeenCalled();

    deps.fetchPosts.mockResolvedValueOnce(dtos);
    await loadPosts(deps);
    expect(deps.fetchPosts).toHaveBeenCalledTimes(2);
    expect(deps.savePostList).toHaveBeenCalledWith(dtos);
    expect(state.isListLoaded).toBe(true);
  });

  it('sets empty and stores nothing for an empty list', async () => {
    const { state, deps } = setup(async () => []);

    await loadPosts(deps);
    expect(state.listStatus).toBe('empty');
    expect(state.isListLoaded).toBe(false);
    expect(deps.savePostList).not.toHaveBeenCalled();

    await loadPosts(deps);
    expect(deps.fetchPosts).toHaveBeenCalledTimes(2);
  });

  it('sets error and allows retry when saving the list throws', async () => {
    const { state, deps } = setup(async () => dtos);
    deps.savePostList.mockImplementationOnce(() => {
      throw new Error('write failed');
    });

    await loadPosts(deps);
    expect(state.listStatus).toBe('error');
    expect(state.isListLoaded).toBe(false);

    await loadPosts(deps);
    expect(deps.fetchPosts).toHaveBeenCalledTimes(2);
    expect(state.isListLoaded).toBe(true);
  });

  it('does not start a second request while one is loading', async () => {
    let resolve: (value: ValidatedPostDto[]) => void = () => {};
    const { deps } = setup(
      () =>
        new Promise(res => {
          resolve = res;
        }),
    );

    const first = loadPosts(deps);
    await loadPosts(deps);
    expect(deps.fetchPosts).toHaveBeenCalledTimes(1);

    resolve(dtos);
    await first;
    expect(deps.savePostList).toHaveBeenCalledTimes(1);
  });
});
