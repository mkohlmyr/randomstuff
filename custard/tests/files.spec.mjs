import { stream, parse, collect } from '../src/files.mjs';
import { ReadStream } from 'fs';
import { expect, assert } from 'chai';

describe('file.mjs', () => {
  describe('stream', () => {
    it('should create an array of read streams', () => {
      const streams = stream('./fixtures/001.txt', './fixtures/002.txt');

      expect(streams).to.have.lengthOf(2);
      streams.forEach(stream => expect(stream).to.be.an.instanceof(ReadStream));
    });

    it('should emit an error for missing files', (done) => {
      const [rs] = stream('./fixtures/999.txt');

      rs.on('error', () => done());
      rs.on('end', () => assert.fail());
    });
  });

  describe('parse', () => {
    it('should return an array of promises', () => {
      const streams = stream('./fixtures/001.txt', './fixtures/002.txt');
      const todo = streams.map(parse);

      expect(streams).to.have.lengthOf(2);
      todo.forEach(work => expect(work).to.be.an.instanceof(Promise));
    });

    it('should throw an exception for missing files', async () => {
      const streams = stream('./fixtures/001.txt', './fixtures/999.txt');
      const todo = streams.map(parse);

      try {
        await Promise.all(todo);
        assert.fail('expected an exception to be thrown');
      } catch (ex) {
        expect(ex.code).to.equal('ENOENT');
        expect(ex.syscall).to.equal('open');
        expect(ex.path).to.contain('999.txt');
      }
    });

    it('should finish parsing valid JSON', async () => {
      const streams = stream('./fixtures/001.txt', './fixtures/002.txt');
      const todo = streams.map(parse);
      const results = await Promise.all(todo);

      expect(results).to.be.instanceof(Array);
    });

    it('should finish parsing empty file', async () => {
      const streams = stream('./fixtures/007.txt');
      const todo = streams.map(parse);
      const results = await Promise.all(todo);

      expect(results).to.be.instanceof(Array);
    });

    it('should throw an exception for invalid JSON', async () => {
      const streams = stream('./fixtures/001.txt', './fixtures/006.txt');
      const todo = streams.map(parse);

      try {
        await Promise.all(todo);
        assert.fail('expected an exception to be thrown');
      } catch (ex) {
        expect(ex.message).to.include('JSON');
        expect(ex.lineNumber).to.equal(1);
        expect(ex.fileName).to.contain('006.txt');
      }
    });

    it('should throw an exception for non object rows', async () => {
      const streams = stream('./fixtures/001.txt', './fixtures/008.txt');
      const todo = streams.map(parse);

      try {
        await Promise.all(todo);
        assert.fail('expected an exception to be thrown');
      } catch (ex) {
        expect(ex.message).to.include('Invalid record');
        expect(ex.lineNumber).to.equal(0);
        expect(ex.fileName).to.contain('008.txt');
      }
    });
  });

  describe('collect', () => {
    it('should flatten the parsing results', async () => {
      const records = await collect(stream('./fixtures/001.txt', './fixtures/002.txt').map(parse));

      expect(records).to.be.instanceof(Array);
      expect(records).to.have.lengthOf(4);
    });
  });
});
