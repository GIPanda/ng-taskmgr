import { AppPage } from './app.po';
import { createWriteStream } from 'fs';

function writeScreenShot(data, filename) {
  const stream = createWriteStream(filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}

describe('ng-taskmgr App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display app name', () => {
    page.navigateTo();
    page.fillInfo().then(result => writeScreenShot(result, 'screenshots/sc001.jpg'));
    expect(page.getParagraphText()).toContain('Enterprise Collaboration Platform');
  });
});
