import Chai from 'chai';
import { SinonStatic } from 'sinon';
import Proxyquire from 'proxyquire/lib/proxyquire';

declare global {
    const expect: Chai.ExpectStatic;
    const sinon: SinonStatic;
    const proxyquire: Proxyquire;
}

export {};
