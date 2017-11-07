import React from 'react';
import { Random } from 'meteor/random';
import { expect } from 'meteor/practicalmeteor:chai';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';
import jsxChai from 'jsx-chai';
import LearningPathEditor from '../LearningPathEditor';

chai.use(jsxChai);

describe('LearningPathEditor.jsx', function () {
  it('Learning path editor renders', function () {

    const renderer = TestUtils.createRenderer();
    renderer.render(<LearningPathEditor history={{}} />);
    const actual = renderer.getRenderOutput();

    const expected = (
      <h4>Add Skills Learned</h4>
    );
    expect(actual).to.include(expected);
  });
})
