import createTemplateParser from '../createTemplateParser';

describe('createTemplateParser', () => {
  it('should create compiled grammar', () => {
    expect(createTemplateParser()).toBeTruthy();
  });
});
