import { TRage2Page } from './app.po';

describe('trage2 App', () => {
  let page: TRage2Page;

  beforeEach(() => {
    page = new TRage2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
