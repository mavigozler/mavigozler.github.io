'use strict';


const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

/* fast-serve
const { addFastServe } = require("spfx-fast-serve-helpers");
addFastServe(build);
/* end of fast-serve

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    if (!generatedConfiguration.resolve.alias) {
      generatedConfiguration.resolve.alias = {};
    }

    // GenLib folder
    generatedConfiguration.resolve.alias['@GenLib'] = path.resolve(
      __dirname,
      'lib/GenLib'
    );

    // webparts folder
    generatedConfiguration.resolve.alias['@webparts'] = path.resolve(
      __dirname,
      'lib/webparts'
    );

    // components folder
    generatedConfiguration.resolve.alias['@components'] = path.resolve(
      __dirname,
      'lib/components'
    );

    //root src folder
    generatedConfiguration.resolve.alias['@src'] = path.resolve(
      __dirname,
      'lib'
    );

    return generatedConfiguration;
  }
}); */

build.initialize(require('gulp'));

