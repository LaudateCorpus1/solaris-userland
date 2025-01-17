"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleBlackBox = toggleBlackBox;
exports.blackBoxSources = blackBoxSources;

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

loader.lazyRequireGetter(this, "_telemetry", "devtools/client/debugger/src/utils/telemetry");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Redux actions for the sources state
 * @module actions/sources
 */
async function blackboxActors(state, client, sourceId, isBlackBoxed, range) {
  for (const actor of (0, _selectors.getSourceActorsForSource)(state, sourceId)) {
    await client.blackBox(actor, isBlackBoxed, range);
  }

  return {
    isBlackBoxed: !isBlackBoxed
  };
}

async function getSourceId(source, sourceMaps) {
  let sourceId = source.id,
      range;

  if (_prefs.features.originalBlackbox && (0, _devtoolsSourceMap.isOriginalId)(source.id)) {
    range = await sourceMaps.getFileGeneratedRange(source.id);
    sourceId = (0, _devtoolsSourceMap.originalToGeneratedId)(source.id);
  }

  return {
    sourceId,
    range
  };
}

function toggleBlackBox(cx, source) {
  return async ({
    dispatch,
    getState,
    client,
    sourceMaps
  }) => {
    const {
      isBlackBoxed
    } = source;

    if (!isBlackBoxed) {
      (0, _telemetry.recordEvent)("blackbox");
    }

    const {
      sourceId,
      range
    } = await getSourceId(source, sourceMaps);
    return dispatch({
      type: "BLACKBOX",
      cx,
      source,
      [_promise.PROMISE]: blackboxActors(getState(), client, sourceId, isBlackBoxed, range)
    });
  };
}

function blackBoxSources(cx, sourcesToBlackBox, shouldBlackBox) {
  return async ({
    dispatch,
    getState,
    client,
    sourceMaps
  }) => {
    const state = getState();
    const sources = sourcesToBlackBox.filter(source => source.isBlackBoxed !== shouldBlackBox);

    if (shouldBlackBox) {
      (0, _telemetry.recordEvent)("blackbox");
    }

    const promises = [...sources.map(async source => {
      const {
        sourceId,
        range
      } = await getSourceId(source, sourceMaps);
      return (0, _selectors.getSourceActorsForSource)(state, sourceId).map(actor => client.blackBox(actor, source.isBlackBoxed, range));
    })];
    return dispatch({
      type: "BLACKBOX_SOURCES",
      cx,
      shouldBlackBox,
      [_promise.PROMISE]: Promise.all(promises).then(() => ({
        sources
      }))
    });
  };
}