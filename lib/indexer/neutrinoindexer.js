/*!
 * filterindexer.js - neutrino indexer
 * Copyright (c) 2023, the bcoin developers (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

const Indexer = require('./indexer');
const path = require('path');
const layout = require('./layout');
const bdb = require('bdb');
const assert = require('bsert');
const {filters} = require('../blockstore/common');

Object.assign(layout, {
    f: bdb.key('f', ['hash256']),
    h: bdb.key('h', ['uint32'])
});

class NeutrinoIndexer extends Indexer {
    constructor(options) {
        super(path.join('filter', options.filterType), options);

        this.db = bdb.create(this.options);
        this.filterType = filters[options.filterType];
    }

    async saveFilterHeader(blockhash, filterHeader) {
        assert(blockhash);
        assert(filterHeader);
        await this.blocks.writeFilterHeader(
            blockhash, filterHeader, this.filterType
        );
        this.put(layout.f.encode(blockhash), filterHeader);
    }
}

module.exports = NeutrinoIndexer;
