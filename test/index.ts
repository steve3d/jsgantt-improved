
import * as JSGantt from '../src/jsgantt';
import { expect } from 'chai';
import { browser, by, element } from 'protractor';

const dv = browser.driver;

describe('Browser test', () => {
  it('JSGantt exists', () => {
    expect(JSGantt).to.exist;
  });

  it('Driver exists', () => {
    expect(dv).to.exist;
  });
});
