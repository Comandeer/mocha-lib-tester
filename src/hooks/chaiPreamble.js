/* eslint-disable no-unused-vars */

import { expect } from 'chai';
import { use as chaiUse } from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { noCallThru as pqNoCallThru } from 'proxyquire';

chaiUse( chaiAsPromised );
chaiUse( sinonChai );

const proxyquire = pqNoCallThru();
