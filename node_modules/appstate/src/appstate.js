module.exports = {
  /**
   * Signal factory. Create signal functions with deep analyzed structure.
   * Every signal run, have full meta information about every action called within signal.
   * Before create, signal will be analyzed for correct definition.
   *
   * @example:
   *  var actions = [
   *    syncAction,
   *    [
   *      asyncAction,
   *      {
   *        success: [successSyncAction],
   *        error: [errorSyncAction]
   *      }
   *    ]
   *  ];
   *
   *  var signal = appstate.create(actions);
   *  var tree = new Baobab();
   *
   *  // You can run signal as function that return Promise with results
   *  signal(tree);
   *
   * That have 4 args: signalArgs, state, output, services.
   * All args passed automatically when you run signal.
   *
   * @param {Array} actions
   * @return {Function}
   */
  create (actions) {
    analyze(actions);

    return (state, services = {}, args = {}, asyncActionResults = []) => {
      return new Promise((resolve, reject) => {
        var promise = { resolve, reject };
        var start = Date.now();

        checkArgs(args, promise);
        // Transform signal definition to flatten array
        var tree = staticTree(actions);

        // Create signal definition
        var signal = {
          args,
          asyncActionResults,
          branches: tree.branches,
          isExecuting: true,
          duration: 0
        };

        // Start recursive run tree branches
        runBranch(0, { tree, args, signal, promise, start, state, services });
      });
    };
  }
};

/**
 * Run tree branch, or resolve signal
 * if no more branches in recursion.
 * @param {Number} index
 * @param {Object} options
 * @param {Object} options.tree
 * @param {Object} options.args
 * @param {Object} options.signal
 * @param {Object} options.promise
 * @param {Date}   options.start
 * @param {Baobab} options.state
 * @param {Object} options.services
 */
function runBranch (index, options) {
  var { tree, signal, start, promise } = options;
  var currentBranch = tree.branches[index];

  if (!currentBranch && tree.branches === signal.branches) {
    if (tree.branches[index - 1]) {
      tree.branches[index - 1].duration = Date.now() - start;
    }

    signal.isExecuting = false;

    if (promise) {
      promise.resolve(signal);
    }

    return;
  }

  if (!currentBranch) {
    return;
  }

  if (Array.isArray(currentBranch)) {
    return runAsyncBranch(index, currentBranch, options);
  } else {
    return runSyncBranch(index, currentBranch, options);
  }
}

/**
 * Run async branch
 * @param {Number} index
 * @param {Object} currentBranch
 * @param {Object} options
 * @param {Object} options.tree
 * @param {Object} options.args
 * @param {Object} options.signal
 * @param {Object} options.promise
 * @param {Date}   options.start
 * @param {Baobab} options.state
 * @param {Object} options.services
 * @returns {Promise}
 */
function runAsyncBranch (index, currentBranch, options) {
  var { tree, args, signal, state, promise, start, services } = options;

  var promises = currentBranch
    .map(action => {
      var actionFunc = tree.actions[action.actionIndex];
      var actionArgs = createActionArgs(args, action, state, true);
      var outputs = action.outputs ? Object.keys(action.outputs) : [];

      action.isExecuting = true;
      action.args = merge({}, args);

      var nextActionPromise;
      var foundResult = signal.asyncActionResults.find((result) => isEqualArrays(result.outputPath, action.path));

      // If actions results provided, you run it in replay mode
      if (foundResult) {
        nextActionPromise = Promise.resolve(foundResult);
      } else {
        var next = createNextAsyncAction(actionFunc, outputs);
        actionFunc.apply(null, actionArgs.concat(next.fn, services));
        nextActionPromise = next.promise;
      }

      return nextActionPromise
        .then(result => {
          action.hasExecuted = true;
          action.isExecuting = false;
          action.output = result.args;

          // Save short results snippet for replay
          signal.asyncActionResults.push({
            outputPath: action.path,
            path: result.path,
            args: result.args
          });

          merge(args, result.args);

          if (result.path) {
            action.outputPath = result.path;
            var output = action.outputs[result.path];

            return runBranch(0, {
              args, signal, state, start, promise, services,
              tree: {
                actions: tree.actions,
                branches: output
              }
            });
          }
        })
        .catch((e) => promise.reject(e));
    });

  return Promise.all(promises)
    .then(() => runBranch(index + 1, options));
}

/**
 * Run sync branch
 * @param {Number} index
 * @param {Object} currentBranch
 * @param {Object} options
 * @param {Object} options.tree
 * @param {Object} options.args
 * @param {Object} options.signal
 * @param {Object} options.promise
 * @param {Date}   options.start
 * @param {Baobab} options.state
 * @param {Object} options.services
 * @returns {Promise|undefined}
 */
function runSyncBranch (index, currentBranch, options) {
  var { args, tree, signal, state, start, promise, services } = options;

  try {
    var action = currentBranch;
    var actionFunc = tree.actions[action.actionIndex];
    var actionArgs = createActionArgs(args, action, state, false);
    var outputs = action.outputs ? Object.keys(action.outputs) : [];

    action.mutations = [];
    action.args = merge({}, args);

    var next = createNextSyncAction(actionFunc, outputs);
    actionFunc.apply(null, actionArgs.concat(next, services));

    var result = next._result || {};
    merge(args, result.args);

    action.isExecuting = false;
    action.hasExecuted = true;
    action.output = result.args;

    if (result.path) {
      action.outputPath = result.path;
      var output = action.outputs[result.path];

      var runResult = runBranch(0, {
        args, signal, state, start, promise, services,
        tree: {
          actions: tree.actions,
          branches: output
        }
      });

      if (runResult && runResult.then) {
        return runResult.then(() => {
          return runBranch(index + 1, options);
        });
      }

      return runBranch(index + 1, options);
    }
    return runBranch(index + 1, options);
  } catch (e) {
    promise.reject(e);
  }
}

/**
 * Add output paths to next function.
 *
 * Outputs takes from branches tree object.
 * @example:
 *  var actions = [
 *    syncAction,
 *    [
 *      asyncAction,
 *      {
 *        custom1: [custom1SyncAction],
 *        custom2: [custom2SyncAction]
 *      }
 *    ]
 *  ];
 *
 *  function asyncAction ({}, state, output) {
 *    if ( ... ) {
 *      output.custom1();
 *    } else {
 *      output.custom2();
 *    }
 *  }
 *
 * @param {Function} next
 * @param {Array} outputs
 * @returns {*}
 */
function addOutputs (next, outputs) {
  if (Array.isArray(outputs)) {
    outputs.forEach(key => {
      next[key] = next.bind(null, key);
    });
  }

  return next;
}

/**
 * Create next function in signal chain.
 * It's unified method for async and sync actions.
 * @param {Function} action
 * @param {Function} [resolver]
 * @returns {Function}
 */
function createNextFunction (action, resolver) {
  return function next (...args) {
    var path = typeof args[0] === 'string' ? args[0] : null;
    var arg = path ? args[1] : args[0];

    var result = {
      path: path ? path : action.defaultOutput,
      args: arg
    };

    if (resolver) {
      resolver(result);
    } else {
      next._result = result;
    }
  };
}

/**
 * Create next sync action
 * @param {Function} actionFunc
 * @param {Array} outputs
 * @returns {Function}
 */
function createNextSyncAction (actionFunc, outputs) {
  var next = createNextFunction(actionFunc);
  next = addOutputs(next, outputs);

  return next;
}

/**
 * Create next sync action
 * @param {Function} actionFunc
 * @param {Array} outputs
 * @returns {{}}
 */
function createNextAsyncAction (actionFunc, outputs) {
  var resolver = null;
  var promise = new Promise((resolve) => resolver = resolve);
  var fn = createNextFunction(actionFunc, resolver);
  addOutputs(fn, outputs);

  return { fn, promise };
}

/**
 * Create action arguments for every action.
 * State object exposed as special patched collection of
 * mutation/accessors functions of Baobab Tree.
 * @param {*} args
 * @param {Object} action
 * @param {Object} state
 * @param {Boolean} isAsync
 * @returns {Array}
 */
function createActionArgs (args, action, state, isAsync) {
  var stateMethods = getStateMutatorsAndAccessors(state, action, isAsync);
  return [ args, stateMethods ];
}

/**
 * Get state mutators and accessors
 * Each mutation will save in action descriptor.
 * This method allow add ability
 * to gather information about call every function.
 * @param {Object} state
 * @param {Object} action
 * @param {Boolean} isAsync
 * @return {Object}
 */
function getStateMutatorsAndAccessors (state, action, isAsync) {
  var mutators = [
    'apply',
    'concat',
    'deepMerge',
    'push',
    'merge',
    'unset',
    'set',
    'splice',
    'unshift'
  ];

  var accessors = [
    'get',
    'exists'
  ];

  var methods = [];

  if (isAsync) {
    methods = methods.concat(accessors);
  } else {
    methods = methods.concat(mutators);
    methods = methods.concat(accessors);
  }

  return methods.reduce((stateMethods, methodName) => {
    var method = state[methodName].bind(state);

    stateMethods[methodName] = (...args) => {
      var path = [];
      var firstArg = args[0];

      if (Array.isArray(firstArg)) {
        path = args.shift();
      } else if (typeof firstArg === 'string') {
        path = [args.shift()];
      }

      if (args.length === 0) {
        return method.apply(null, [path.slice()]);
      }

      action.mutations.push({
        name: methodName,
        path: path.slice(),
        args: args
      });

      return method.apply(null, [path.slice()].concat(args));
    };

    return stateMethods;
  }, Object.create(null));
}

/**
 * Transform signal actions to static tree.
 * Every function will be exposed as object definition,
 * that will store meta information and function call results.
 * @param {Array} signalActions
 * @returns {{ actions: [], branches: [] }}
 */
function staticTree (signalActions) {
  var actions = [];
  var branches = transformBranch(signalActions, [], [], actions, false);
  return { actions, branches };
}

/**
 * Transform tree branch
 * @param {Function} action
 * @param {Array}    args
 * @param {Array|Function}    args.parentAction
 * @param {Array}    args.path
 * @param {Array}    args.actions
 * @param {Boolean}  args.isSync
 * @return {Object}
 */
function transformBranch (action, ...args) {
  return Array.isArray(action) ?
    transformAsyncBranch.apply(null, [action, ...args]) :
    transformSyncBranch.apply(null, [action, ...args]);
}

/**
 * Transform action to async branch
 * @param {Function} action
 * @param {Array|Function} parentAction
 * @param {Array} path
 * @param {Array} actions
 * @param {Boolean} isSync
 * @returns {*}
 */
function transformAsyncBranch (action, parentAction, path, actions, isSync) {
  action = action.slice();
  isSync = !isSync;
  return action
    .map((subAction, index) => {
      path.push(index);
      var result = transformBranch(subAction, action, path, actions, isSync);
      path.pop();
      return result;
    })
    .filter(branch => !!branch);
}

/**
 * Transform action to sync branch
 * @param {Function} action
 * @param {Array|Function} parentAction
 * @param {Array} path
 * @param {Array} actions
 * @param {Boolean} isSync
 * @returns {{
 *    name: *, args: {}, output: null, duration: number,
 *    mutations: Array, isAsync: boolean, outputPath: null,
 *    isExecuting: boolean, hasExecuted: boolean,
 *    path: *, outputs: null, actionIndex: number
 *  }|undefined}
 */
function transformSyncBranch (action, parentAction, path, actions, isSync) {
  var branch = {
    name: getFunctionName(action),
    args: {},
    output: null,
    duration: 0,
    mutations: [],
    isAsync: !isSync,
    outputPath: null,
    isExecuting: false,
    hasExecuted: false,
    path: path.slice(),
    outputs: null,
    actionIndex: actions.indexOf(action) === -1 ? actions.push(action) - 1 : actions.indexOf(action)
  };

  var nextAction = parentAction[parentAction.indexOf(action) + 1];
  if (!Array.isArray(nextAction) && typeof nextAction === 'object') {
    parentAction.splice(parentAction.indexOf(nextAction), 1);

    branch.outputs = Object.keys(nextAction)
      .reduce((paths, key) => {
        path = path.concat('outputs', key);
        paths[key] = transformBranch(nextAction[key], parentAction, path, actions, false);
        path.pop();
        path.pop();
        return paths;
      }, {});
  }

  return branch;
}

/**
 * Analyze actions for errors
 * @param {Array} actions
 */
function analyze (actions) {
  if (!Array.isArray(actions)) {
    throw new Error('State: Signal actions should be array');
  }

  actions.forEach((action, index) => {
    if (typeof action === 'undefined' || typeof action === 'string') {
      throw new Error(
        `
            State: Action number "${index}" in signal does not exist.
            Check that you have spelled it correctly!
          `
      );
    }

    if (Array.isArray(action)) {
      analyze(action);
    } else if (Object.prototype.toString.call(action) === "[object Object]") {
      Object.keys(action).forEach(function (output) {
        analyze(action[output]);
      });
    }
  });
}

/**
 * Check arguments
 * @param {*} args
 * @param {Object} promise
 */
function checkArgs (args, promise) {
  try {
    JSON.stringify(args);
  } catch (e) {
    promise.reject(`State - Could not serialize arguments to signal. Please check signal.`);
  }
}

/**
 * Get function name
 * @param {Function} fn
 * @returns {String}
 */
function getFunctionName (fn) {
  var name = fn.toString();
  name = name.substr('function '.length);
  name = name.substr(0, name.indexOf('('));
  return name;
}

/**
 * Merge two objects
 * @param {Object} target
 * @param {Object} source
 * @returns {Object}
 */
function merge (target, source) {
  source = source || {};
  return Object.keys(source).reduce((targetKey, key) => {
    targetKey[key] = source[key];
    return target;
  }, target);
}

function isEqualArrays (first, second) {
  if (!Array.isArray(first) || !Array.isArray(second)) {
    return false;
  }

  if (first.length !== second.length) {
    return false;
  }

  return first.every(function(element, index) {
    return element === second[index];
  });
}
