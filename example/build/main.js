/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "2964d4dea42212d55d2b"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./index.js")(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/@webcomponents/custom-elements/src/AlreadyConstructedMarker.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This class exists only to work around Closure's lack of a way to describe
 * singletons. It represents the 'already constructed marker' used in custom
 * element construction stacks.
 *
 * https://html.spec.whatwg.org/#concept-already-constructed-marker
 */
var AlreadyConstructedMarker = function AlreadyConstructedMarker() {
  _classCallCheck(this, AlreadyConstructedMarker);
};

exports.default = new AlreadyConstructedMarker();

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utilities = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");

var Utilities = _interopRequireWildcard(_Utilities);

var _CustomElementState = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementState.js");

var _CustomElementState2 = _interopRequireDefault(_CustomElementState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CustomElementInternals = function () {
  function CustomElementInternals() {
    _classCallCheck(this, CustomElementInternals);

    /** @type {!Map<string, !CustomElementDefinition>} */
    this._localNameToDefinition = new Map();

    /** @type {!Map<!Function, !CustomElementDefinition>} */
    this._constructorToDefinition = new Map();

    /** @type {!Array<!function(!Node)>} */
    this._patches = [];

    /** @type {boolean} */
    this._hasPatches = false;
  }

  /**
   * @param {string} localName
   * @param {!CustomElementDefinition} definition
   */


  _createClass(CustomElementInternals, [{
    key: 'setDefinition',
    value: function setDefinition(localName, definition) {
      this._localNameToDefinition.set(localName, definition);
      this._constructorToDefinition.set(definition.constructor, definition);
    }

    /**
     * @param {string} localName
     * @return {!CustomElementDefinition|undefined}
     */

  }, {
    key: 'localNameToDefinition',
    value: function localNameToDefinition(localName) {
      return this._localNameToDefinition.get(localName);
    }

    /**
     * @param {!Function} constructor
     * @return {!CustomElementDefinition|undefined}
     */

  }, {
    key: 'constructorToDefinition',
    value: function constructorToDefinition(constructor) {
      return this._constructorToDefinition.get(constructor);
    }

    /**
     * @param {!function(!Node)} listener
     */

  }, {
    key: 'addPatch',
    value: function addPatch(listener) {
      this._hasPatches = true;
      this._patches.push(listener);
    }

    /**
     * @param {!Node} node
     */

  }, {
    key: 'patchTree',
    value: function patchTree(node) {
      var _this = this;

      if (!this._hasPatches) return;

      Utilities.walkDeepDescendantElements(node, function (element) {
        return _this.patch(element);
      });
    }

    /**
     * @param {!Node} node
     */

  }, {
    key: 'patch',
    value: function patch(node) {
      if (!this._hasPatches) return;

      if (node.__CE_patched) return;
      node.__CE_patched = true;

      for (var i = 0; i < this._patches.length; i++) {
        this._patches[i](node);
      }
    }

    /**
     * @param {!Node} root
     */

  }, {
    key: 'connectTree',
    value: function connectTree(root) {
      var elements = [];

      Utilities.walkDeepDescendantElements(root, function (element) {
        return elements.push(element);
      });

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.__CE_state === _CustomElementState2.default.custom) {
          this.connectedCallback(element);
        } else {
          this.upgradeElement(element);
        }
      }
    }

    /**
     * @param {!Node} root
     */

  }, {
    key: 'disconnectTree',
    value: function disconnectTree(root) {
      var elements = [];

      Utilities.walkDeepDescendantElements(root, function (element) {
        return elements.push(element);
      });

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.__CE_state === _CustomElementState2.default.custom) {
          this.disconnectedCallback(element);
        }
      }
    }

    /**
     * Upgrades all uncustomized custom elements at and below a root node for
     * which there is a definition. When custom element reaction callbacks are
     * assumed to be called synchronously (which, by the current DOM / HTML spec
     * definitions, they are *not*), callbacks for both elements customized
     * synchronously by the parser and elements being upgraded occur in the same
     * relative order.
     *
     * NOTE: This function, when used to simulate the construction of a tree that
     * is already created but not customized (i.e. by the parser), does *not*
     * prevent the element from reading the 'final' (true) state of the tree. For
     * example, the element, during truly synchronous parsing / construction would
     * see that it contains no children as they have not yet been inserted.
     * However, this function does not modify the tree, the element will
     * (incorrectly) have children. Additionally, self-modification restrictions
     * for custom element constructors imposed by the DOM spec are *not* enforced.
     *
     *
     * The following nested list shows the steps extending down from the HTML
     * spec's parsing section that cause elements to be synchronously created and
     * upgraded:
     *
     * The "in body" insertion mode:
     * https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
     * - Switch on token:
     *   .. other cases ..
     *   -> Any other start tag
     *      - [Insert an HTML element](below) for the token.
     *
     * Insert an HTML element:
     * https://html.spec.whatwg.org/multipage/syntax.html#insert-an-html-element
     * - Insert a foreign element for the token in the HTML namespace:
     *   https://html.spec.whatwg.org/multipage/syntax.html#insert-a-foreign-element
     *   - Create an element for a token:
     *     https://html.spec.whatwg.org/multipage/syntax.html#create-an-element-for-the-token
     *     - Will execute script flag is true?
     *       - (Element queue pushed to the custom element reactions stack.)
     *     - Create an element:
     *       https://dom.spec.whatwg.org/#concept-create-element
     *       - Sync CE flag is true?
     *         - Constructor called.
     *         - Self-modification restrictions enforced.
     *       - Sync CE flag is false?
     *         - (Upgrade reaction enqueued.)
     *     - Attributes appended to element.
     *       (`attributeChangedCallback` reactions enqueued.)
     *     - Will execute script flag is true?
     *       - (Element queue popped from the custom element reactions stack.
     *         Reactions in the popped stack are invoked.)
     *   - (Element queue pushed to the custom element reactions stack.)
     *   - Insert the element:
     *     https://dom.spec.whatwg.org/#concept-node-insert
     *     - Shadow-including descendants are connected. During parsing
     *       construction, there are no shadow-*excluding* descendants.
     *       However, the constructor may have validly attached a shadow
     *       tree to itself and added descendants to that shadow tree.
     *       (`connectedCallback` reactions enqueued.)
     *   - (Element queue popped from the custom element reactions stack.
     *     Reactions in the popped stack are invoked.)
     *
     * @param {!Node} root
     * @param {{
     *   visitedImports: (!Set<!Node>|undefined),
     *   upgrade: (!function(!Element)|undefined),
     * }=} options
     */

  }, {
    key: 'patchAndUpgradeTree',
    value: function patchAndUpgradeTree(root) {
      var _this2 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var visitedImports = options.visitedImports || new Set();
      var upgrade = options.upgrade || function (element) {
        return _this2.upgradeElement(element);
      };

      var elements = [];

      var gatherElements = function gatherElements(element) {
        if (element.localName === 'link' && element.getAttribute('rel') === 'import') {
          // The HTML Imports polyfill sets a descendant element of the link to
          // the `import` property, specifically this is *not* a Document.
          var importNode = /** @type {?Node} */element.import;

          if (importNode instanceof Node && importNode.readyState === 'complete') {
            importNode.__CE_isImportDocument = true;

            // Connected links are associated with the registry.
            importNode.__CE_hasRegistry = true;
          } else {
            // If this link's import root is not available, its contents can't be
            // walked. Wait for 'load' and walk it when it's ready.
            element.addEventListener('load', function () {
              var importNode = /** @type {!Node} */element.import;

              if (importNode.__CE_documentLoadHandled) return;
              importNode.__CE_documentLoadHandled = true;

              importNode.__CE_isImportDocument = true;

              // Connected links are associated with the registry.
              importNode.__CE_hasRegistry = true;

              // Clone the `visitedImports` set that was populated sync during
              // the `patchAndUpgradeTree` call that caused this 'load' handler to
              // be added. Then, remove *this* link's import node so that we can
              // walk that import again, even if it was partially walked later
              // during the same `patchAndUpgradeTree` call.
              var clonedVisitedImports = new Set(visitedImports);
              clonedVisitedImports.delete(importNode);

              _this2.patchAndUpgradeTree(importNode, { visitedImports: clonedVisitedImports, upgrade: upgrade });
            });
          }
        } else {
          elements.push(element);
        }
      };

      // `walkDeepDescendantElements` populates (and internally checks against)
      // `visitedImports` when traversing a loaded import.
      Utilities.walkDeepDescendantElements(root, gatherElements, visitedImports);

      if (this._hasPatches) {
        for (var i = 0; i < elements.length; i++) {
          this.patch(elements[i]);
        }
      }

      for (var _i = 0; _i < elements.length; _i++) {
        upgrade(elements[_i]);
      }
    }

    /**
     * @param {!Element} element
     */

  }, {
    key: 'upgradeElement',
    value: function upgradeElement(element) {
      var currentState = element.__CE_state;
      if (currentState !== undefined) return;

      var definition = this.localNameToDefinition(element.localName);
      if (!definition) return;

      definition.constructionStack.push(element);

      var constructor = definition.constructor;
      try {
        try {
          var result = new constructor();
          if (result !== element) {
            throw new Error('The custom element constructor did not produce the element being upgraded.');
          }
        } finally {
          definition.constructionStack.pop();
        }
      } catch (e) {
        element.__CE_state = _CustomElementState2.default.failed;
        throw e;
      }

      element.__CE_state = _CustomElementState2.default.custom;
      element.__CE_definition = definition;

      if (definition.attributeChangedCallback) {
        var observedAttributes = definition.observedAttributes;
        for (var i = 0; i < observedAttributes.length; i++) {
          var name = observedAttributes[i];
          var value = element.getAttribute(name);
          if (value !== null) {
            this.attributeChangedCallback(element, name, null, value, null);
          }
        }
      }

      if (Utilities.isConnected(element)) {
        this.connectedCallback(element);
      }
    }

    /**
     * @param {!Element} element
     */

  }, {
    key: 'connectedCallback',
    value: function connectedCallback(element) {
      var definition = element.__CE_definition;
      if (definition.connectedCallback) {
        definition.connectedCallback.call(element);
      }
    }

    /**
     * @param {!Element} element
     */

  }, {
    key: 'disconnectedCallback',
    value: function disconnectedCallback(element) {
      var definition = element.__CE_definition;
      if (definition.disconnectedCallback) {
        definition.disconnectedCallback.call(element);
      }
    }

    /**
     * @param {!Element} element
     * @param {string} name
     * @param {?string} oldValue
     * @param {?string} newValue
     * @param {?string} namespace
     */

  }, {
    key: 'attributeChangedCallback',
    value: function attributeChangedCallback(element, name, oldValue, newValue, namespace) {
      var definition = element.__CE_definition;
      if (definition.attributeChangedCallback && definition.observedAttributes.indexOf(name) > -1) {
        definition.attributeChangedCallback.call(element, name, oldValue, newValue, namespace);
      }
    }
  }]);

  return CustomElementInternals;
}();

exports.default = CustomElementInternals;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/CustomElementRegistry.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _DocumentConstructionObserver = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/DocumentConstructionObserver.js");

var _DocumentConstructionObserver2 = _interopRequireDefault(_DocumentConstructionObserver);

var _Deferred = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Deferred.js");

var _Deferred2 = _interopRequireDefault(_Deferred);

var _Utilities = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");

var Utilities = _interopRequireWildcard(_Utilities);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @unrestricted
 */
var CustomElementRegistry = function () {

  /**
   * @param {!CustomElementInternals} internals
   */
  function CustomElementRegistry(internals) {
    _classCallCheck(this, CustomElementRegistry);

    /**
     * @private
     * @type {boolean}
     */
    this._elementDefinitionIsRunning = false;

    /**
     * @private
     * @type {!CustomElementInternals}
     */
    this._internals = internals;

    /**
     * @private
     * @type {!Map<string, !Deferred<undefined>>}
     */
    this._whenDefinedDeferred = new Map();

    /**
     * The default flush callback triggers the document walk synchronously.
     * @private
     * @type {!Function}
     */
    this._flushCallback = function (fn) {
      return fn();
    };

    /**
     * @private
     * @type {boolean}
     */
    this._flushPending = false;

    /**
     * @private
     * @type {!Array<!CustomElementDefinition>}
     */
    this._pendingDefinitions = [];

    /**
     * @private
     * @type {!DocumentConstructionObserver}
     */
    this._documentConstructionObserver = new _DocumentConstructionObserver2.default(internals, document);
  }

  /**
   * @param {string} localName
   * @param {!Function} constructor
   */


  _createClass(CustomElementRegistry, [{
    key: 'define',
    value: function define(localName, constructor) {
      var _this = this;

      if (!(constructor instanceof Function)) {
        throw new TypeError('Custom element constructors must be functions.');
      }

      if (!Utilities.isValidCustomElementName(localName)) {
        throw new SyntaxError('The element name \'' + localName + '\' is not valid.');
      }

      if (this._internals.localNameToDefinition(localName)) {
        throw new Error('A custom element with name \'' + localName + '\' has already been defined.');
      }

      if (this._elementDefinitionIsRunning) {
        throw new Error('A custom element is already being defined.');
      }
      this._elementDefinitionIsRunning = true;

      var connectedCallback = void 0;
      var disconnectedCallback = void 0;
      var adoptedCallback = void 0;
      var attributeChangedCallback = void 0;
      var observedAttributes = void 0;
      try {
        var getCallback = function getCallback(name) {
          var callbackValue = prototype[name];
          if (callbackValue !== undefined && !(callbackValue instanceof Function)) {
            throw new Error('The \'' + name + '\' callback must be a function.');
          }
          return callbackValue;
        };

        /** @type {!Object} */
        var prototype = constructor.prototype;
        if (!(prototype instanceof Object)) {
          throw new TypeError('The custom element constructor\'s prototype is not an object.');
        }

        connectedCallback = getCallback('connectedCallback');
        disconnectedCallback = getCallback('disconnectedCallback');
        adoptedCallback = getCallback('adoptedCallback');
        attributeChangedCallback = getCallback('attributeChangedCallback');
        observedAttributes = constructor['observedAttributes'] || [];
      } catch (e) {
        return;
      } finally {
        this._elementDefinitionIsRunning = false;
      }

      var definition = {
        localName: localName,
        constructor: constructor,
        connectedCallback: connectedCallback,
        disconnectedCallback: disconnectedCallback,
        adoptedCallback: adoptedCallback,
        attributeChangedCallback: attributeChangedCallback,
        observedAttributes: observedAttributes,
        constructionStack: []
      };

      this._internals.setDefinition(localName, definition);
      this._pendingDefinitions.push(definition);

      // If we've already called the flush callback and it hasn't called back yet,
      // don't call it again.
      if (!this._flushPending) {
        this._flushPending = true;
        this._flushCallback(function () {
          return _this._flush();
        });
      }
    }
  }, {
    key: '_flush',
    value: function _flush() {
      var _this2 = this;

      // If no new definitions were defined, don't attempt to flush. This could
      // happen if a flush callback keeps the function it is given and calls it
      // multiple times.
      if (this._flushPending === false) return;
      this._flushPending = false;

      var pendingDefinitions = this._pendingDefinitions;

      /**
       * Unupgraded elements with definitions that were defined *before* the last
       * flush, in document order.
       * @type {!Array<!Element>}
       */
      var elementsWithStableDefinitions = [];

      /**
       * A map from `localName`s of definitions that were defined *after* the last
       * flush to unupgraded elements matching that definition, in document order.
       * @type {!Map<string, !Array<!Element>>}
       */
      var elementsWithPendingDefinitions = new Map();
      for (var i = 0; i < pendingDefinitions.length; i++) {
        elementsWithPendingDefinitions.set(pendingDefinitions[i].localName, []);
      }

      this._internals.patchAndUpgradeTree(document, {
        upgrade: function upgrade(element) {
          // Ignore the element if it has already upgraded or failed to upgrade.
          if (element.__CE_state !== undefined) return;

          var localName = element.localName;

          // If there is an applicable pending definition for the element, add the
          // element to the list of elements to be upgraded with that definition.
          var pendingElements = elementsWithPendingDefinitions.get(localName);
          if (pendingElements) {
            pendingElements.push(element);
            // If there is *any other* applicable definition for the element, add it
            // to the list of elements with stable definitions that need to be upgraded.
          } else if (_this2._internals.localNameToDefinition(localName)) {
            elementsWithStableDefinitions.push(element);
          }
        }
      });

      // Upgrade elements with 'stable' definitions first.
      for (var _i = 0; _i < elementsWithStableDefinitions.length; _i++) {
        this._internals.upgradeElement(elementsWithStableDefinitions[_i]);
      }

      // Upgrade elements with 'pending' definitions in the order they were defined.
      while (pendingDefinitions.length > 0) {
        var definition = pendingDefinitions.shift();
        var localName = definition.localName;

        // Attempt to upgrade all applicable elements.
        var pendingUpgradableElements = elementsWithPendingDefinitions.get(definition.localName);
        for (var _i2 = 0; _i2 < pendingUpgradableElements.length; _i2++) {
          this._internals.upgradeElement(pendingUpgradableElements[_i2]);
        }

        // Resolve any promises created by `whenDefined` for the definition.
        var deferred = this._whenDefinedDeferred.get(localName);
        if (deferred) {
          deferred.resolve(undefined);
        }
      }
    }

    /**
     * @param {string} localName
     * @return {Function|undefined}
     */

  }, {
    key: 'get',
    value: function get(localName) {
      var definition = this._internals.localNameToDefinition(localName);
      if (definition) {
        return definition.constructor;
      }

      return undefined;
    }

    /**
     * @param {string} localName
     * @return {!Promise<undefined>}
     */

  }, {
    key: 'whenDefined',
    value: function whenDefined(localName) {
      if (!Utilities.isValidCustomElementName(localName)) {
        return Promise.reject(new SyntaxError('\'' + localName + '\' is not a valid custom element name.'));
      }

      var prior = this._whenDefinedDeferred.get(localName);
      if (prior) {
        return prior.toPromise();
      }

      var deferred = new _Deferred2.default();
      this._whenDefinedDeferred.set(localName, deferred);

      var definition = this._internals.localNameToDefinition(localName);
      // Resolve immediately only if the given local name has a definition *and*
      // the full document walk to upgrade elements with that local name has
      // already happened.
      if (definition && !this._pendingDefinitions.some(function (d) {
        return d.localName === localName;
      })) {
        deferred.resolve(undefined);
      }

      return deferred.toPromise();
    }
  }, {
    key: 'polyfillWrapFlushCallback',
    value: function polyfillWrapFlushCallback(outer) {
      this._documentConstructionObserver.disconnect();
      var inner = this._flushCallback;
      this._flushCallback = function (flush) {
        return outer(function () {
          return inner(flush);
        });
      };
    }
  }]);

  return CustomElementRegistry;
}();

// Closure compiler exports.


exports.default = CustomElementRegistry;
window['CustomElementRegistry'] = CustomElementRegistry;
CustomElementRegistry.prototype['define'] = CustomElementRegistry.prototype.define;
CustomElementRegistry.prototype['get'] = CustomElementRegistry.prototype.get;
CustomElementRegistry.prototype['whenDefined'] = CustomElementRegistry.prototype.whenDefined;
CustomElementRegistry.prototype['polyfillWrapFlushCallback'] = CustomElementRegistry.prototype.polyfillWrapFlushCallback;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/CustomElementState.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @enum {number}
 */
var CustomElementState = {
  custom: 1,
  failed: 2
};

exports.default = CustomElementState;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Deferred.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @template T
 */
var Deferred = function () {
  function Deferred() {
    var _this = this;

    _classCallCheck(this, Deferred);

    /**
     * @private
     * @type {T|undefined}
     */
    this._value = undefined;

    /**
     * @private
     * @type {Function|undefined}
     */
    this._resolve = undefined;

    /**
     * @private
     * @type {!Promise<T>}
     */
    this._promise = new Promise(function (resolve) {
      _this._resolve = resolve;

      if (_this._value) {
        resolve(_this._value);
      }
    });
  }

  /**
   * @param {T} value
   */


  _createClass(Deferred, [{
    key: 'resolve',
    value: function resolve(value) {
      if (this._value) {
        throw new Error('Already resolved.');
      }

      this._value = value;

      if (this._resolve) {
        this._resolve(value);
      }
    }

    /**
     * @return {!Promise<T>}
     */

  }, {
    key: 'toPromise',
    value: function toPromise() {
      return this._promise;
    }
  }]);

  return Deferred;
}();

exports.default = Deferred;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/DocumentConstructionObserver.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DocumentConstructionObserver = function () {
  function DocumentConstructionObserver(internals, doc) {
    _classCallCheck(this, DocumentConstructionObserver);

    /**
     * @type {!CustomElementInternals}
     */
    this._internals = internals;

    /**
     * @type {!Document}
     */
    this._document = doc;

    /**
     * @type {MutationObserver|undefined}
     */
    this._observer = undefined;

    // Simulate tree construction for all currently accessible nodes in the
    // document.
    this._internals.patchAndUpgradeTree(this._document);

    if (this._document.readyState === 'loading') {
      this._observer = new MutationObserver(this._handleMutations.bind(this));

      // Nodes created by the parser are given to the observer *before* the next
      // task runs. Inline scripts are run in a new task. This means that the
      // observer will be able to handle the newly parsed nodes before the inline
      // script is run.
      this._observer.observe(this._document, {
        childList: true,
        subtree: true
      });
    }
  }

  _createClass(DocumentConstructionObserver, [{
    key: 'disconnect',
    value: function disconnect() {
      if (this._observer) {
        this._observer.disconnect();
      }
    }

    /**
     * @param {!Array<!MutationRecord>} mutations
     */

  }, {
    key: '_handleMutations',
    value: function _handleMutations(mutations) {
      // Once the document's `readyState` is 'interactive' or 'complete', all new
      // nodes created within that document will be the result of script and
      // should be handled by patching.
      var readyState = this._document.readyState;
      if (readyState === 'interactive' || readyState === 'complete') {
        this.disconnect();
      }

      for (var i = 0; i < mutations.length; i++) {
        var addedNodes = mutations[i].addedNodes;
        for (var j = 0; j < addedNodes.length; j++) {
          var node = addedNodes[j];
          this._internals.patchAndUpgradeTree(node);
        }
      }
    }
  }]);

  return DocumentConstructionObserver;
}();

exports.default = DocumentConstructionObserver;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Document.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (internals) {
  Utilities.setPropertyUnchecked(Document.prototype, 'createElement',
  /**
   * @this {Document}
   * @param {string} localName
   * @return {!Element}
   */
  function (localName) {
    // Only create custom elements if this document is associated with the registry.
    if (this.__CE_hasRegistry) {
      var definition = internals.localNameToDefinition(localName);
      if (definition) {
        return new definition.constructor();
      }
    }

    var result = /** @type {!Element} */
    _Native2.default.Document_createElement.call(this, localName);
    internals.patch(result);
    return result;
  });

  Utilities.setPropertyUnchecked(Document.prototype, 'importNode',
  /**
   * @this {Document}
   * @param {!Node} node
   * @param {boolean=} deep
   * @return {!Node}
   */
  function (node, deep) {
    var clone = _Native2.default.Document_importNode.call(this, node, deep);
    // Only create custom elements if this document is associated with the registry.
    if (!this.__CE_hasRegistry) {
      internals.patchTree(clone);
    } else {
      internals.patchAndUpgradeTree(clone);
    }
    return clone;
  });

  var NS_HTML = "http://www.w3.org/1999/xhtml";

  Utilities.setPropertyUnchecked(Document.prototype, 'createElementNS',
  /**
   * @this {Document}
   * @param {?string} namespace
   * @param {string} localName
   * @return {!Element}
   */
  function (namespace, localName) {
    // Only create custom elements if this document is associated with the registry.
    if (this.__CE_hasRegistry && (namespace === null || namespace === NS_HTML)) {
      var definition = internals.localNameToDefinition(localName);
      if (definition) {
        return new definition.constructor();
      }
    }

    var result = /** @type {!Element} */
    _Native2.default.Document_createElementNS.call(this, namespace, localName);
    internals.patch(result);
    return result;
  });

  (0, _ParentNode2.default)(internals, Document.prototype, {
    prepend: _Native2.default.Document_prepend,
    append: _Native2.default.Document_append
  });
};

var _Native = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Native.js");

var _Native2 = _interopRequireDefault(_Native);

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _Utilities = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");

var Utilities = _interopRequireWildcard(_Utilities);

var _ParentNode = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ParentNode.js");

var _ParentNode2 = _interopRequireDefault(_ParentNode);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/**
 * @param {!CustomElementInternals} internals
 */

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/DocumentFragment.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (internals) {
  (0, _ParentNode2.default)(internals, DocumentFragment.prototype, {
    prepend: _Native2.default.DocumentFragment_prepend,
    append: _Native2.default.DocumentFragment_append
  });
};

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _Native = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Native.js");

var _Native2 = _interopRequireDefault(_Native);

var _ParentNode = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ParentNode.js");

var _ParentNode2 = _interopRequireDefault(_ParentNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/**
 * @param {!CustomElementInternals} internals
 */

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Element.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (internals) {
  if (_Native2.default.Element_attachShadow) {
    Utilities.setPropertyUnchecked(Element.prototype, 'attachShadow',
    /**
     * @this {Element}
     * @param {!{mode: string}} init
     * @return {ShadowRoot}
     */
    function (init) {
      var shadowRoot = _Native2.default.Element_attachShadow.call(this, init);
      this.__CE_shadowRoot = shadowRoot;
      return shadowRoot;
    });
  }

  function patch_innerHTML(destination, baseDescriptor) {
    Object.defineProperty(destination, 'innerHTML', {
      enumerable: baseDescriptor.enumerable,
      configurable: true,
      get: baseDescriptor.get,
      set: /** @this {Element} */function set(htmlString) {
        var _this = this;

        var isConnected = Utilities.isConnected(this);

        // NOTE: In IE11, when using the native `innerHTML` setter, all nodes
        // that were previously descendants of the context element have all of
        // their children removed as part of the set - the entire subtree is
        // 'disassembled'. This work around walks the subtree *before* using the
        // native setter.
        /** @type {!Array<!Element>|undefined} */
        var removedElements = undefined;
        if (isConnected) {
          removedElements = [];
          Utilities.walkDeepDescendantElements(this, function (element) {
            if (element !== _this) {
              removedElements.push(element);
            }
          });
        }

        baseDescriptor.set.call(this, htmlString);

        if (removedElements) {
          for (var i = 0; i < removedElements.length; i++) {
            var element = removedElements[i];
            if (element.__CE_state === _CustomElementState2.default.custom) {
              internals.disconnectedCallback(element);
            }
          }
        }

        // Only create custom elements if this element's owner document is
        // associated with the registry.
        if (!this.ownerDocument.__CE_hasRegistry) {
          internals.patchTree(this);
        } else {
          internals.patchAndUpgradeTree(this);
        }
        return htmlString;
      }
    });
  }

  if (_Native2.default.Element_innerHTML && _Native2.default.Element_innerHTML.get) {
    patch_innerHTML(Element.prototype, _Native2.default.Element_innerHTML);
  } else if (_Native2.default.HTMLElement_innerHTML && _Native2.default.HTMLElement_innerHTML.get) {
    patch_innerHTML(HTMLElement.prototype, _Native2.default.HTMLElement_innerHTML);
  } else {

    /** @type {HTMLDivElement} */
    var rawDiv = _Native2.default.Document_createElement.call(document, 'div');

    internals.addPatch(function (element) {
      patch_innerHTML(element, {
        enumerable: true,
        configurable: true,
        // Implements getting `innerHTML` by performing an unpatched `cloneNode`
        // of the element and returning the resulting element's `innerHTML`.
        // TODO: Is this too expensive?
        get: /** @this {Element} */function get() {
          return _Native2.default.Node_cloneNode.call(this, true).innerHTML;
        },
        // Implements setting `innerHTML` by creating an unpatched element,
        // setting `innerHTML` of that element and replacing the target
        // element's children with those of the unpatched element.
        set: /** @this {Element} */function set(assignedValue) {
          // NOTE: re-route to `content` for `template` elements.
          // We need to do this because `template.appendChild` does not
          // route into `template.content`.
          /** @type {!Node} */
          var content = this.localName === 'template' ? /** @type {!HTMLTemplateElement} */this.content : this;
          rawDiv.innerHTML = assignedValue;

          while (content.childNodes.length > 0) {
            _Native2.default.Node_removeChild.call(content, content.childNodes[0]);
          }
          while (rawDiv.childNodes.length > 0) {
            _Native2.default.Node_appendChild.call(content, rawDiv.childNodes[0]);
          }
        }
      });
    });
  }

  Utilities.setPropertyUnchecked(Element.prototype, 'setAttribute',
  /**
   * @this {Element}
   * @param {string} name
   * @param {string} newValue
   */
  function (name, newValue) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== _CustomElementState2.default.custom) {
      return _Native2.default.Element_setAttribute.call(this, name, newValue);
    }

    var oldValue = _Native2.default.Element_getAttribute.call(this, name);
    _Native2.default.Element_setAttribute.call(this, name, newValue);
    newValue = _Native2.default.Element_getAttribute.call(this, name);
    internals.attributeChangedCallback(this, name, oldValue, newValue, null);
  });

  Utilities.setPropertyUnchecked(Element.prototype, 'setAttributeNS',
  /**
   * @this {Element}
   * @param {?string} namespace
   * @param {string} name
   * @param {string} newValue
   */
  function (namespace, name, newValue) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== _CustomElementState2.default.custom) {
      return _Native2.default.Element_setAttributeNS.call(this, namespace, name, newValue);
    }

    var oldValue = _Native2.default.Element_getAttributeNS.call(this, namespace, name);
    _Native2.default.Element_setAttributeNS.call(this, namespace, name, newValue);
    newValue = _Native2.default.Element_getAttributeNS.call(this, namespace, name);
    internals.attributeChangedCallback(this, name, oldValue, newValue, namespace);
  });

  Utilities.setPropertyUnchecked(Element.prototype, 'removeAttribute',
  /**
   * @this {Element}
   * @param {string} name
   */
  function (name) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== _CustomElementState2.default.custom) {
      return _Native2.default.Element_removeAttribute.call(this, name);
    }

    var oldValue = _Native2.default.Element_getAttribute.call(this, name);
    _Native2.default.Element_removeAttribute.call(this, name);
    if (oldValue !== null) {
      internals.attributeChangedCallback(this, name, oldValue, null, null);
    }
  });

  Utilities.setPropertyUnchecked(Element.prototype, 'removeAttributeNS',
  /**
   * @this {Element}
   * @param {?string} namespace
   * @param {string} name
   */
  function (namespace, name) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== _CustomElementState2.default.custom) {
      return _Native2.default.Element_removeAttributeNS.call(this, namespace, name);
    }

    var oldValue = _Native2.default.Element_getAttributeNS.call(this, namespace, name);
    _Native2.default.Element_removeAttributeNS.call(this, namespace, name);
    // In older browsers, `Element#getAttributeNS` may return the empty string
    // instead of null if the attribute does not exist. For details, see;
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNS#Notes
    var newValue = _Native2.default.Element_getAttributeNS.call(this, namespace, name);
    if (oldValue !== newValue) {
      internals.attributeChangedCallback(this, name, oldValue, newValue, namespace);
    }
  });

  function patch_insertAdjacentElement(destination, baseMethod) {
    Utilities.setPropertyUnchecked(destination, 'insertAdjacentElement',
    /**
     * @this {Element}
     * @param {string} where
     * @param {!Element} element
     * @return {?Element}
     */
    function (where, element) {
      var wasConnected = Utilities.isConnected(element);
      var insertedElement = /** @type {!Element} */
      baseMethod.call(this, where, element);

      if (wasConnected) {
        internals.disconnectTree(element);
      }

      if (Utilities.isConnected(insertedElement)) {
        internals.connectTree(element);
      }
      return insertedElement;
    });
  }

  if (_Native2.default.HTMLElement_insertAdjacentElement) {
    patch_insertAdjacentElement(HTMLElement.prototype, _Native2.default.HTMLElement_insertAdjacentElement);
  } else if (_Native2.default.Element_insertAdjacentElement) {
    patch_insertAdjacentElement(Element.prototype, _Native2.default.Element_insertAdjacentElement);
  } else {
    console.warn('Custom Elements: `Element#insertAdjacentElement` was not patched.');
  }

  (0, _ParentNode2.default)(internals, Element.prototype, {
    prepend: _Native2.default.Element_prepend,
    append: _Native2.default.Element_append
  });

  (0, _ChildNode2.default)(internals, Element.prototype, {
    before: _Native2.default.Element_before,
    after: _Native2.default.Element_after,
    replaceWith: _Native2.default.Element_replaceWith,
    remove: _Native2.default.Element_remove
  });
};

var _Native = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Native.js");

var _Native2 = _interopRequireDefault(_Native);

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _CustomElementState = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementState.js");

var _CustomElementState2 = _interopRequireDefault(_CustomElementState);

var _Utilities = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");

var Utilities = _interopRequireWildcard(_Utilities);

var _ParentNode = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ParentNode.js");

var _ParentNode2 = _interopRequireDefault(_ParentNode);

var _ChildNode = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ChildNode.js");

var _ChildNode2 = _interopRequireDefault(_ChildNode);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/**
 * @param {!CustomElementInternals} internals
 */

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/HTMLElement.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (internals) {
  window['HTMLElement'] = function () {
    /**
     * @type {function(new: HTMLElement): !HTMLElement}
     */
    function HTMLElement() {
      // This should really be `new.target` but `new.target` can't be emulated
      // in ES5. Assuming the user keeps the default value of the constructor's
      // prototype's `constructor` property, this is equivalent.
      /** @type {!Function} */
      var constructor = this.constructor;

      var definition = internals.constructorToDefinition(constructor);
      if (!definition) {
        throw new Error('The custom element being constructed was not registered with `customElements`.');
      }

      var constructionStack = definition.constructionStack;

      if (constructionStack.length === 0) {
        var _element = _Native2.default.Document_createElement.call(document, definition.localName);
        Object.setPrototypeOf(_element, constructor.prototype);
        _element.__CE_state = _CustomElementState2.default.custom;
        _element.__CE_definition = definition;
        internals.patch(_element);
        return _element;
      }

      var lastIndex = constructionStack.length - 1;
      var element = constructionStack[lastIndex];
      if (element === _AlreadyConstructedMarker2.default) {
        throw new Error('The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.');
      }
      constructionStack[lastIndex] = _AlreadyConstructedMarker2.default;

      Object.setPrototypeOf(element, constructor.prototype);
      internals.patch( /** @type {!HTMLElement} */element);

      return element;
    }

    HTMLElement.prototype = _Native2.default.HTMLElement.prototype;

    return HTMLElement;
  }();
};

var _Native = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Native.js");

var _Native2 = _interopRequireDefault(_Native);

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _CustomElementState = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementState.js");

var _CustomElementState2 = _interopRequireDefault(_CustomElementState);

var _AlreadyConstructedMarker = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/AlreadyConstructedMarker.js");

var _AlreadyConstructedMarker2 = _interopRequireDefault(_AlreadyConstructedMarker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/**
 * @param {!CustomElementInternals} internals
 */

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ChildNode.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (internals, destination, builtIn) {
  /**
   * @param {!function(...(!Node|string))} builtInMethod
   * @return {!function(...(!Node|string))}
   */
  function beforeAfterPatch(builtInMethod) {
    return function () {
      /**
       * A copy of `nodes`, with any DocumentFragment replaced by its children.
       * @type {!Array<!Node>}
       */
      var flattenedNodes = [];

      /**
       * Elements in `nodes` that were connected before this call.
       * @type {!Array<!Node>}
       */
      var connectedElements = [];

      for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
        nodes[_key] = arguments[_key];
      }

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];

        if (node instanceof Element && Utilities.isConnected(node)) {
          connectedElements.push(node);
        }

        if (node instanceof DocumentFragment) {
          for (var child = node.firstChild; child; child = child.nextSibling) {
            flattenedNodes.push(child);
          }
        } else {
          flattenedNodes.push(node);
        }
      }

      builtInMethod.apply(this, nodes);

      for (var _i = 0; _i < connectedElements.length; _i++) {
        internals.disconnectTree(connectedElements[_i]);
      }

      if (Utilities.isConnected(this)) {
        for (var _i2 = 0; _i2 < flattenedNodes.length; _i2++) {
          var _node = flattenedNodes[_i2];
          if (_node instanceof Element) {
            internals.connectTree(_node);
          }
        }
      }
    };
  }

  if (builtIn.before !== undefined) {
    Utilities.setPropertyUnchecked(destination, 'before', beforeAfterPatch(builtIn.before));
  }

  if (builtIn.before !== undefined) {
    Utilities.setPropertyUnchecked(destination, 'after', beforeAfterPatch(builtIn.after));
  }

  if (builtIn.replaceWith !== undefined) {
    Utilities.setPropertyUnchecked(destination, 'replaceWith',
    /**
     * @param {...(!Node|string)} nodes
     */
    function () {
      /**
       * A copy of `nodes`, with any DocumentFragment replaced by its children.
       * @type {!Array<!Node>}
       */
      var flattenedNodes = [];

      /**
       * Elements in `nodes` that were connected before this call.
       * @type {!Array<!Node>}
       */
      var connectedElements = [];

      for (var _len2 = arguments.length, nodes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        nodes[_key2] = arguments[_key2];
      }

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];

        if (node instanceof Element && Utilities.isConnected(node)) {
          connectedElements.push(node);
        }

        if (node instanceof DocumentFragment) {
          for (var child = node.firstChild; child; child = child.nextSibling) {
            flattenedNodes.push(child);
          }
        } else {
          flattenedNodes.push(node);
        }
      }

      var wasConnected = Utilities.isConnected(this);

      builtIn.replaceWith.apply(this, nodes);

      for (var _i3 = 0; _i3 < connectedElements.length; _i3++) {
        internals.disconnectTree(connectedElements[_i3]);
      }

      if (wasConnected) {
        internals.disconnectTree(this);
        for (var _i4 = 0; _i4 < flattenedNodes.length; _i4++) {
          var _node2 = flattenedNodes[_i4];
          if (_node2 instanceof Element) {
            internals.connectTree(_node2);
          }
        }
      }
    });
  }

  if (builtIn.remove !== undefined) {
    Utilities.setPropertyUnchecked(destination, 'remove', function () {
      var wasConnected = Utilities.isConnected(this);

      builtIn.remove.call(this);

      if (wasConnected) {
        internals.disconnectTree(this);
      }
    });
  }
};

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _Utilities = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");

var Utilities = _interopRequireWildcard(_Utilities);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {{
 *   before: !function(...(!Node|string)),
 *   after: !function(...(!Node|string)),
 *   replaceWith: !function(...(!Node|string)),
 *   remove: !function(),
 * }}
 */
var ChildNodeNativeMethods = void 0;

/**
 * @param {!CustomElementInternals} internals
 * @param {!Object} destination
 * @param {!ChildNodeNativeMethods} builtIn
 */
;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ParentNode.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (internals, destination, builtIn) {
  /**
   * @param {!function(...(!Node|string))} builtInMethod
   * @return {!function(...(!Node|string))}
   */
  function appendPrependPatch(builtInMethod) {
    return function () {
      /**
       * A copy of `nodes`, with any DocumentFragment replaced by its children.
       * @type {!Array<!Node>}
       */
      var flattenedNodes = [];

      /**
       * Elements in `nodes` that were connected before this call.
       * @type {!Array<!Node>}
       */
      var connectedElements = [];

      for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
        nodes[_key] = arguments[_key];
      }

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];

        if (node instanceof Element && Utilities.isConnected(node)) {
          connectedElements.push(node);
        }

        if (node instanceof DocumentFragment) {
          for (var child = node.firstChild; child; child = child.nextSibling) {
            flattenedNodes.push(child);
          }
        } else {
          flattenedNodes.push(node);
        }
      }

      builtInMethod.apply(this, nodes);

      for (var _i = 0; _i < connectedElements.length; _i++) {
        internals.disconnectTree(connectedElements[_i]);
      }

      if (Utilities.isConnected(this)) {
        for (var _i2 = 0; _i2 < flattenedNodes.length; _i2++) {
          var _node = flattenedNodes[_i2];
          if (_node instanceof Element) {
            internals.connectTree(_node);
          }
        }
      }
    };
  }

  if (builtIn.prepend !== undefined) {
    Utilities.setPropertyUnchecked(destination, 'prepend', appendPrependPatch(builtIn.prepend));
  }

  if (builtIn.append !== undefined) {
    Utilities.setPropertyUnchecked(destination, 'append', appendPrependPatch(builtIn.append));
  }
};

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _Utilities = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");

var Utilities = _interopRequireWildcard(_Utilities);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {{
 *   prepend: !function(...(!Node|string)),
  *  append: !function(...(!Node|string)),
 * }}
 */
var ParentNodeNativeMethods = void 0;

/**
 * @param {!CustomElementInternals} internals
 * @param {!Object} destination
 * @param {!ParentNodeNativeMethods} builtIn
 */
;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Native.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  Document_createElement: window.Document.prototype.createElement,
  Document_createElementNS: window.Document.prototype.createElementNS,
  Document_importNode: window.Document.prototype.importNode,
  Document_prepend: window.Document.prototype['prepend'],
  Document_append: window.Document.prototype['append'],
  DocumentFragment_prepend: window.DocumentFragment.prototype['prepend'],
  DocumentFragment_append: window.DocumentFragment.prototype['append'],
  Node_cloneNode: window.Node.prototype.cloneNode,
  Node_appendChild: window.Node.prototype.appendChild,
  Node_insertBefore: window.Node.prototype.insertBefore,
  Node_removeChild: window.Node.prototype.removeChild,
  Node_replaceChild: window.Node.prototype.replaceChild,
  Node_textContent: Object.getOwnPropertyDescriptor(window.Node.prototype, 'textContent'),
  Element_attachShadow: window.Element.prototype['attachShadow'],
  Element_innerHTML: Object.getOwnPropertyDescriptor(window.Element.prototype, 'innerHTML'),
  Element_getAttribute: window.Element.prototype.getAttribute,
  Element_setAttribute: window.Element.prototype.setAttribute,
  Element_removeAttribute: window.Element.prototype.removeAttribute,
  Element_getAttributeNS: window.Element.prototype.getAttributeNS,
  Element_setAttributeNS: window.Element.prototype.setAttributeNS,
  Element_removeAttributeNS: window.Element.prototype.removeAttributeNS,
  Element_insertAdjacentElement: window.Element.prototype['insertAdjacentElement'],
  Element_prepend: window.Element.prototype['prepend'],
  Element_append: window.Element.prototype['append'],
  Element_before: window.Element.prototype['before'],
  Element_after: window.Element.prototype['after'],
  Element_replaceWith: window.Element.prototype['replaceWith'],
  Element_remove: window.Element.prototype['remove'],
  HTMLElement: window.HTMLElement,
  HTMLElement_innerHTML: Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerHTML'),
  HTMLElement_insertAdjacentElement: window.HTMLElement.prototype['insertAdjacentElement']
};

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Node.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (internals) {
  // `Node#nodeValue` is implemented on `Attr`.
  // `Node#textContent` is implemented on `Attr`, `Element`.

  Utilities.setPropertyUnchecked(Node.prototype, 'insertBefore',
  /**
   * @this {Node}
   * @param {!Node} node
   * @param {?Node} refNode
   * @return {!Node}
   */
  function (node, refNode) {
    if (node instanceof DocumentFragment) {
      var insertedNodes = Array.prototype.slice.apply(node.childNodes);
      var _nativeResult = _Native2.default.Node_insertBefore.call(this, node, refNode);

      // DocumentFragments can't be connected, so `disconnectTree` will never
      // need to be called on a DocumentFragment's children after inserting it.

      if (Utilities.isConnected(this)) {
        for (var i = 0; i < insertedNodes.length; i++) {
          internals.connectTree(insertedNodes[i]);
        }
      }

      return _nativeResult;
    }

    var nodeWasConnected = Utilities.isConnected(node);
    var nativeResult = _Native2.default.Node_insertBefore.call(this, node, refNode);

    if (nodeWasConnected) {
      internals.disconnectTree(node);
    }

    if (Utilities.isConnected(this)) {
      internals.connectTree(node);
    }

    return nativeResult;
  });

  Utilities.setPropertyUnchecked(Node.prototype, 'appendChild',
  /**
   * @this {Node}
   * @param {!Node} node
   * @return {!Node}
   */
  function (node) {
    if (node instanceof DocumentFragment) {
      var insertedNodes = Array.prototype.slice.apply(node.childNodes);
      var _nativeResult2 = _Native2.default.Node_appendChild.call(this, node);

      // DocumentFragments can't be connected, so `disconnectTree` will never
      // need to be called on a DocumentFragment's children after inserting it.

      if (Utilities.isConnected(this)) {
        for (var i = 0; i < insertedNodes.length; i++) {
          internals.connectTree(insertedNodes[i]);
        }
      }

      return _nativeResult2;
    }

    var nodeWasConnected = Utilities.isConnected(node);
    var nativeResult = _Native2.default.Node_appendChild.call(this, node);

    if (nodeWasConnected) {
      internals.disconnectTree(node);
    }

    if (Utilities.isConnected(this)) {
      internals.connectTree(node);
    }

    return nativeResult;
  });

  Utilities.setPropertyUnchecked(Node.prototype, 'cloneNode',
  /**
   * @this {Node}
   * @param {boolean=} deep
   * @return {!Node}
   */
  function (deep) {
    var clone = _Native2.default.Node_cloneNode.call(this, deep);
    // Only create custom elements if this element's owner document is
    // associated with the registry.
    if (!this.ownerDocument.__CE_hasRegistry) {
      internals.patchTree(clone);
    } else {
      internals.patchAndUpgradeTree(clone);
    }
    return clone;
  });

  Utilities.setPropertyUnchecked(Node.prototype, 'removeChild',
  /**
   * @this {Node}
   * @param {!Node} node
   * @return {!Node}
   */
  function (node) {
    var nodeWasConnected = Utilities.isConnected(node);
    var nativeResult = _Native2.default.Node_removeChild.call(this, node);

    if (nodeWasConnected) {
      internals.disconnectTree(node);
    }

    return nativeResult;
  });

  Utilities.setPropertyUnchecked(Node.prototype, 'replaceChild',
  /**
   * @this {Node}
   * @param {!Node} nodeToInsert
   * @param {!Node} nodeToRemove
   * @return {!Node}
   */
  function (nodeToInsert, nodeToRemove) {
    if (nodeToInsert instanceof DocumentFragment) {
      var insertedNodes = Array.prototype.slice.apply(nodeToInsert.childNodes);
      var _nativeResult3 = _Native2.default.Node_replaceChild.call(this, nodeToInsert, nodeToRemove);

      // DocumentFragments can't be connected, so `disconnectTree` will never
      // need to be called on a DocumentFragment's children after inserting it.

      if (Utilities.isConnected(this)) {
        internals.disconnectTree(nodeToRemove);
        for (var i = 0; i < insertedNodes.length; i++) {
          internals.connectTree(insertedNodes[i]);
        }
      }

      return _nativeResult3;
    }

    var nodeToInsertWasConnected = Utilities.isConnected(nodeToInsert);
    var nativeResult = _Native2.default.Node_replaceChild.call(this, nodeToInsert, nodeToRemove);
    var thisIsConnected = Utilities.isConnected(this);

    if (thisIsConnected) {
      internals.disconnectTree(nodeToRemove);
    }

    if (nodeToInsertWasConnected) {
      internals.disconnectTree(nodeToInsert);
    }

    if (thisIsConnected) {
      internals.connectTree(nodeToInsert);
    }

    return nativeResult;
  });

  function patch_textContent(destination, baseDescriptor) {
    Object.defineProperty(destination, 'textContent', {
      enumerable: baseDescriptor.enumerable,
      configurable: true,
      get: baseDescriptor.get,
      set: /** @this {Node} */function set(assignedValue) {
        // If this is a text node then there are no nodes to disconnect.
        if (this.nodeType === Node.TEXT_NODE) {
          baseDescriptor.set.call(this, assignedValue);
          return;
        }

        var removedNodes = undefined;
        // Checking for `firstChild` is faster than reading `childNodes.length`
        // to compare with 0.
        if (this.firstChild) {
          // Using `childNodes` is faster than `children`, even though we only
          // care about elements.
          var childNodes = this.childNodes;
          var childNodesLength = childNodes.length;
          if (childNodesLength > 0 && Utilities.isConnected(this)) {
            // Copying an array by iterating is faster than using slice.
            removedNodes = new Array(childNodesLength);
            for (var i = 0; i < childNodesLength; i++) {
              removedNodes[i] = childNodes[i];
            }
          }
        }

        baseDescriptor.set.call(this, assignedValue);

        if (removedNodes) {
          for (var _i = 0; _i < removedNodes.length; _i++) {
            internals.disconnectTree(removedNodes[_i]);
          }
        }
      }
    });
  }

  if (_Native2.default.Node_textContent && _Native2.default.Node_textContent.get) {
    patch_textContent(Node.prototype, _Native2.default.Node_textContent);
  } else {
    internals.addPatch(function (element) {
      patch_textContent(element, {
        enumerable: true,
        configurable: true,
        // NOTE: This implementation of the `textContent` getter assumes that
        // text nodes' `textContent` getter will not be patched.
        get: /** @this {Node} */function get() {
          /** @type {!Array<string>} */
          var parts = [];

          for (var i = 0; i < this.childNodes.length; i++) {
            parts.push(this.childNodes[i].textContent);
          }

          return parts.join('');
        },
        set: /** @this {Node} */function set(assignedValue) {
          while (this.firstChild) {
            _Native2.default.Node_removeChild.call(this, this.firstChild);
          }
          _Native2.default.Node_appendChild.call(this, document.createTextNode(assignedValue));
        }
      });
    });
  }
};

var _Native = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Native.js");

var _Native2 = _interopRequireDefault(_Native);

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _Utilities = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");

var Utilities = _interopRequireWildcard(_Utilities);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/**
 * @param {!CustomElementInternals} internals
 */

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Utilities.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidCustomElementName = isValidCustomElementName;
exports.isConnected = isConnected;
exports.walkDeepDescendantElements = walkDeepDescendantElements;
exports.setPropertyUnchecked = setPropertyUnchecked;
var reservedTagList = new Set(['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph']);

/**
 * @param {string} localName
 * @returns {boolean}
 */
function isValidCustomElementName(localName) {
  var reserved = reservedTagList.has(localName);
  var validForm = /^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(localName);
  return !reserved && validForm;
}

/**
 * @private
 * @param {!Node} node
 * @return {boolean}
 */
function isConnected(node) {
  // Use `Node#isConnected`, if defined.
  var nativeValue = node.isConnected;
  if (nativeValue !== undefined) {
    return nativeValue;
  }

  /** @type {?Node|undefined} */
  var current = node;
  while (current && !(current.__CE_isImportDocument || current instanceof Document)) {
    current = current.parentNode || (window.ShadowRoot && current instanceof ShadowRoot ? current.host : undefined);
  }
  return !!(current && (current.__CE_isImportDocument || current instanceof Document));
}

/**
 * @param {!Node} root
 * @param {!Node} start
 * @return {?Node}
 */
function nextSiblingOrAncestorSibling(root, start) {
  var node = start;
  while (node && node !== root && !node.nextSibling) {
    node = node.parentNode;
  }
  return !node || node === root ? null : node.nextSibling;
}

/**
 * @param {!Node} root
 * @param {!Node} start
 * @return {?Node}
 */
function nextNode(root, start) {
  return start.firstChild ? start.firstChild : nextSiblingOrAncestorSibling(root, start);
}

/**
 * @param {!Node} root
 * @param {!function(!Element)} callback
 * @param {!Set<Node>=} visitedImports
 */
function walkDeepDescendantElements(root, callback) {
  var visitedImports = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Set();

  var node = root;
  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      var element = /** @type {!Element} */node;

      callback(element);

      var localName = element.localName;
      if (localName === 'link' && element.getAttribute('rel') === 'import') {
        // If this import (polyfilled or not) has it's root node available,
        // walk it.
        var importNode = /** @type {!Node} */element.import;
        if (importNode instanceof Node && !visitedImports.has(importNode)) {
          // Prevent multiple walks of the same import root.
          visitedImports.add(importNode);

          for (var child = importNode.firstChild; child; child = child.nextSibling) {
            walkDeepDescendantElements(child, callback, visitedImports);
          }
        }

        // Ignore descendants of import links to prevent attempting to walk the
        // elements created by the HTML Imports polyfill that we just walked
        // above.
        node = nextSiblingOrAncestorSibling(root, element);
        continue;
      } else if (localName === 'template') {
        // Ignore descendants of templates. There shouldn't be any descendants
        // because they will be moved into `.content` during construction in
        // browsers that support template but, in case they exist and are still
        // waiting to be moved by a polyfill, they will be ignored.
        node = nextSiblingOrAncestorSibling(root, element);
        continue;
      }

      // Walk shadow roots.
      var shadowRoot = element.__CE_shadowRoot;
      if (shadowRoot) {
        for (var _child = shadowRoot.firstChild; _child; _child = _child.nextSibling) {
          walkDeepDescendantElements(_child, callback, visitedImports);
        }
      }
    }

    node = nextNode(root, node);
  }
}

/**
 * Used to suppress Closure's "Modifying the prototype is only allowed if the
 * constructor is in the same scope" warning without using
 * `@suppress {newCheckTypes, duplicate}` because `newCheckTypes` is too broad.
 *
 * @param {!Object} destination
 * @param {string} name
 * @param {*} value
 */
function setPropertyUnchecked(destination, name, value) {
  destination[name] = value;
}

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/custom-elements.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _CustomElementRegistry = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementRegistry.js");

var _CustomElementRegistry2 = _interopRequireDefault(_CustomElementRegistry);

var _HTMLElement = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/HTMLElement.js");

var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

var _Document = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Document.js");

var _Document2 = _interopRequireDefault(_Document);

var _DocumentFragment = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/DocumentFragment.js");

var _DocumentFragment2 = _interopRequireDefault(_DocumentFragment);

var _Node = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Node.js");

var _Node2 = _interopRequireDefault(_Node);

var _Element = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Element.js");

var _Element2 = _interopRequireDefault(_Element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var priorCustomElements = window['customElements']; /**
                                                     * @license
                                                     * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
                                                     * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
                                                     * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
                                                     * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
                                                     * Code distributed by Google as part of the polymer project is also
                                                     * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
                                                     */

if (!priorCustomElements || priorCustomElements['forcePolyfill'] || typeof priorCustomElements['define'] != 'function' || typeof priorCustomElements['get'] != 'function') {
  /** @type {!CustomElementInternals} */
  var internals = new _CustomElementInternals2.default();

  (0, _HTMLElement2.default)(internals);
  (0, _Document2.default)(internals);
  (0, _DocumentFragment2.default)(internals);
  (0, _Node2.default)(internals);
  (0, _Element2.default)(internals);

  // The main document is always associated with the registry.
  document.__CE_hasRegistry = true;

  /** @type {!CustomElementRegistry} */
  var customElements = new _CustomElementRegistry2.default(internals);

  Object.defineProperty(window, 'customElements', {
    configurable: true,
    enumerable: true,
    value: customElements
  });
}

/***/ }),

/***/ "../node_modules/@webcomponents/shadycss/apply-shim.min.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  /*
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  'use strict';
  var k = {};function n() {
    this.end = this.start = 0;this.rules = this.parent = this.previous = null;this.cssText = this.parsedCssText = "";this.atRule = !1;this.type = 0;this.parsedSelector = this.selector = this.keyframesName = "";
  }
  function p(a) {
    a = a.replace(aa, "").replace(ba, "");var b = q,
        c = a,
        d = new n();d.start = 0;d.end = c.length;for (var e = d, f = 0, h = c.length; f < h; f++) {
      if ("{" === c[f]) {
        e.rules || (e.rules = []);var g = e,
            m = g.rules[g.rules.length - 1] || null;e = new n();e.start = f + 1;e.parent = g;e.previous = m;g.rules.push(e);
      } else "}" === c[f] && (e.end = f + 1, e = e.parent || d);
    }return b(d, a);
  }
  function q(a, b) {
    var c = b.substring(a.start, a.end - 1);a.parsedCssText = a.cssText = c.trim();a.parent && (c = b.substring(a.previous ? a.previous.end : a.parent.start, a.start - 1), c = ca(c), c = c.replace(r, " "), c = c.substring(c.lastIndexOf(";") + 1), c = a.parsedSelector = a.selector = c.trim(), a.atRule = 0 === c.indexOf("@"), a.atRule ? 0 === c.indexOf("@media") ? a.type = t : c.match(da) && (a.type = u, a.keyframesName = a.selector.split(r).pop()) : a.type = 0 === c.indexOf("--") ? v : x);if (c = a.rules) for (var d = 0, e = c.length, f; d < e && (f = c[d]); d++) {
      q(f, b);
    }return a;
  }
  function ca(a) {
    return a.replace(/\\([0-9a-f]{1,6})\s/gi, function (a, c) {
      a = c;for (c = 6 - a.length; c--;) {
        a = "0" + a;
      }return "\\" + a;
    });
  }
  function y(a, b, c) {
    c = void 0 === c ? "" : c;var d = "";if (a.cssText || a.rules) {
      var e = a.rules,
          f;if (f = e) f = e[0], f = !(f && f.selector && 0 === f.selector.indexOf("--"));if (f) {
        f = 0;for (var h = e.length, g; f < h && (g = e[f]); f++) {
          d = y(g, b, d);
        }
      } else b ? b = a.cssText : (b = a.cssText, b = b.replace(ea, "").replace(fa, ""), b = b.replace(ha, "").replace(ia, "")), (d = b.trim()) && (d = "  " + d + "\n");
    }d && (a.selector && (c += a.selector + " {\n"), c += d, a.selector && (c += "}\n\n"));return c;
  }
  var x = 1,
      u = 7,
      t = 4,
      v = 1E3,
      aa = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
      ba = /@import[^;]*;/gim,
      ea = /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
      fa = /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
      ha = /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
      ia = /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
      da = /^@[^\s]*keyframes/,
      r = /\s+/g;var ja = Promise.resolve();function ka(a) {
    if (a = k[a]) a._applyShimCurrentVersion = a._applyShimCurrentVersion || 0, a._applyShimValidatingVersion = a._applyShimValidatingVersion || 0, a._applyShimNextVersion = (a._applyShimNextVersion || 0) + 1;
  }function z(a) {
    return a._applyShimCurrentVersion === a._applyShimNextVersion;
  }function la(a) {
    a._applyShimValidatingVersion = a._applyShimNextVersion;a.a || (a.a = !0, ja.then(function () {
      a._applyShimCurrentVersion = a._applyShimNextVersion;a.a = !1;
    }));
  };var A = !(window.ShadyDOM && window.ShadyDOM.inUse),
      B;function C(a) {
    B = a && a.shimcssproperties ? !1 : A || !(navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) || !window.CSS || !CSS.supports || !CSS.supports("box-shadow", "0 0 0 var(--foo)"));
  }window.ShadyCSS && void 0 !== window.ShadyCSS.nativeCss ? B = window.ShadyCSS.nativeCss : window.ShadyCSS ? (C(window.ShadyCSS), window.ShadyCSS = void 0) : C(window.WebComponents && window.WebComponents.flags);var E = B;var F = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi,
      G = /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,
      ma = /@media\s(.*)/;function H(a) {
    if (!a) return "";"string" === typeof a && (a = p(a));return y(a, E);
  }function I(a) {
    !a.__cssRules && a.textContent && (a.__cssRules = p(a.textContent));return a.__cssRules || null;
  }function J(a, b, c, d) {
    if (a) {
      var e = !1,
          f = a.type;if (d && f === t) {
        var h = a.selector.match(ma);h && (window.matchMedia(h[1]).matches || (e = !0));
      }f === x ? b(a) : c && f === u ? c(a) : f === v && (e = !0);if ((a = a.rules) && !e) {
        e = 0;f = a.length;for (var g; e < f && (g = a[e]); e++) {
          J(g, b, c, d);
        }
      }
    }
  }
  function K(a, b) {
    var c = a.indexOf("var(");if (-1 === c) return b(a, "", "", "");a: {
      var d = 0;var e = c + 3;for (var f = a.length; e < f; e++) {
        if ("(" === a[e]) d++;else if (")" === a[e] && 0 === --d) break a;
      }e = -1;
    }d = a.substring(c + 4, e);c = a.substring(0, c);a = K(a.substring(e + 1), b);e = d.indexOf(",");return -1 === e ? b(c, d.trim(), "", a) : b(c, d.substring(0, e).trim(), d.substring(e + 1).trim(), a);
  };var na = /;\s*/m,
      oa = /^\s*(initial)|(inherit)\s*$/;function L() {
    this.a = {};
  }L.prototype.set = function (a, b) {
    a = a.trim();this.a[a] = { h: b, i: {} };
  };L.prototype.get = function (a) {
    a = a.trim();return this.a[a] || null;
  };var M = null;function N() {
    this.b = this.c = null;this.a = new L();
  }N.prototype.o = function (a) {
    a = G.test(a) || F.test(a);G.lastIndex = 0;F.lastIndex = 0;return a;
  };N.prototype.m = function (a, b) {
    a = a.content.querySelector("style");var c = null;a && (c = this.j(a, b));return c;
  };
  N.prototype.j = function (a, b) {
    b = void 0 === b ? "" : b;var c = I(a);this.l(c, b);a.textContent = H(c);return c;
  };N.prototype.f = function (a) {
    var b = this,
        c = I(a);J(c, function (a) {
      ":root" === a.selector && (a.selector = "html");b.g(a);
    });a.textContent = H(c);return c;
  };N.prototype.l = function (a, b) {
    var c = this;this.c = b;J(a, function (a) {
      c.g(a);
    });this.c = null;
  };N.prototype.g = function (a) {
    a.cssText = pa(this, a.parsedCssText);":root" === a.selector && (a.selector = ":host > *");
  };
  function pa(a, b) {
    b = b.replace(F, function (b, d, e, f) {
      return qa(a, b, d, e, f);
    });return O(a, b);
  }function O(a, b) {
    for (var c; c = G.exec(b);) {
      var d = c[0],
          e = c[1];c = c.index;var f = b.slice(0, c + d.indexOf("@apply"));b = b.slice(c + d.length);var h = P(a, f);d = void 0;var g = a;e = e.replace(na, "");var m = [];var l = g.a.get(e);l || (g.a.set(e, {}), l = g.a.get(e));if (l) for (d in g.c && (l.i[g.c] = !0), l.h) {
        g = h && h[d], l = [d, ": var(", e, "_-_", d], g && l.push(",", g), l.push(")"), m.push(l.join(""));
      }d = m.join("; ");b = "" + f + d + b;G.lastIndex = c + d.length;
    }return b;
  }
  function P(a, b) {
    b = b.split(";");for (var c, d, e = {}, f = 0, h; f < b.length; f++) {
      if (c = b[f]) if (h = c.split(":"), 1 < h.length) {
        c = h[0].trim();var g = a;d = c;h = h.slice(1).join(":");var m = oa.exec(h);m && (m[1] ? (g.b || (g.b = document.createElement("meta"), g.b.setAttribute("apply-shim-measure", ""), g.b.style.all = "initial", document.head.appendChild(g.b)), d = window.getComputedStyle(g.b).getPropertyValue(d)) : d = "apply-shim-inherit", h = d);d = h;e[c] = d;
      }
    }return e;
  }function ra(a, b) {
    if (M) for (var c in b.i) {
      c !== a.c && M(c);
    }
  }
  function qa(a, b, c, d, e) {
    d && K(d, function (b, c) {
      c && a.a.get(c) && (e = "@apply " + c + ";");
    });if (!e) return b;var f = O(a, e),
        h = b.slice(0, b.indexOf("--")),
        g = f = P(a, f),
        m = a.a.get(c),
        l = m && m.h;l ? g = Object.assign(Object.create(l), f) : a.a.set(c, g);var X = [],
        w,
        Y = !1;for (w in g) {
      var D = f[w];void 0 === D && (D = "initial");!l || w in l || (Y = !0);X.push("" + c + "_-_" + w + ": " + D);
    }Y && ra(a, m);m && (m.h = g);d && (h = b + ";" + h);return "" + h + X.join("; ") + ";";
  }N.prototype.detectMixin = N.prototype.o;N.prototype.transformStyle = N.prototype.j;
  N.prototype.transformCustomStyle = N.prototype.f;N.prototype.transformRules = N.prototype.l;N.prototype.transformRule = N.prototype.g;N.prototype.transformTemplate = N.prototype.m;N.prototype._separator = "_-_";Object.defineProperty(N.prototype, "invalidCallback", { get: function get() {
      return M;
    }, set: function set(a) {
      M = a;
    } });var Q = null,
      R = window.HTMLImports && window.HTMLImports.whenReady || null,
      S;function sa(a) {
    requestAnimationFrame(function () {
      R ? R(a) : (Q || (Q = new Promise(function (a) {
        S = a;
      }), "complete" === document.readyState ? S() : document.addEventListener("readystatechange", function () {
        "complete" === document.readyState && S();
      })), Q.then(function () {
        a && a();
      }));
    });
  };var T = new N();function U() {
    var a = this;this.a = null;sa(function () {
      V(a);
    });T.invalidCallback = ka;
  }function V(a) {
    a.a || (a.a = window.ShadyCSS.CustomStyleInterface, a.a && (a.a.transformCallback = function (a) {
      T.f(a);
    }, a.a.validateCallback = function () {
      requestAnimationFrame(function () {
        a.a.enqueued && W(a);
      });
    }));
  }U.prototype.prepareTemplate = function (a, b) {
    V(this);k[b] = a;b = T.m(a, b);a._styleAst = b;
  };
  function W(a) {
    V(a);if (a.a) {
      var b = a.a.processStyles();if (a.a.enqueued) {
        for (var c = 0; c < b.length; c++) {
          var d = a.a.getStyleForCustomStyle(b[c]);d && T.f(d);
        }a.a.enqueued = !1;
      }
    }
  }U.prototype.styleSubtree = function (a, b) {
    V(this);if (b) for (var c in b) {
      null === c ? a.style.removeProperty(c) : a.style.setProperty(c, b[c]);
    }if (a.shadowRoot) for (this.styleElement(a), a = a.shadowRoot.children || a.shadowRoot.childNodes, b = 0; b < a.length; b++) {
      this.styleSubtree(a[b]);
    } else for (a = a.children || a.childNodes, b = 0; b < a.length; b++) {
      this.styleSubtree(a[b]);
    }
  };
  U.prototype.styleElement = function (a) {
    V(this);var b = a.localName,
        c;b ? -1 < b.indexOf("-") ? c = b : c = a.getAttribute && a.getAttribute("is") || "" : c = a.is;if ((b = k[c]) && !z(b)) {
      if (z(b) || b._applyShimValidatingVersion !== b._applyShimNextVersion) this.prepareTemplate(b, c), la(b);if (a = a.shadowRoot) if (a = a.querySelector("style")) a.__cssRules = b._styleAst, a.textContent = H(b._styleAst);
    }
  };U.prototype.styleDocument = function (a) {
    V(this);this.styleSubtree(document.body, a);
  };
  if (!window.ShadyCSS || !window.ShadyCSS.ScopingShim) {
    var Z = new U(),
        ta = window.ShadyCSS && window.ShadyCSS.CustomStyleInterface;window.ShadyCSS = { prepareTemplate: function prepareTemplate(a, b) {
        W(Z);Z.prepareTemplate(a, b);
      }, styleSubtree: function styleSubtree(a, b) {
        W(Z);Z.styleSubtree(a, b);
      }, styleElement: function styleElement(a) {
        W(Z);Z.styleElement(a);
      }, styleDocument: function styleDocument(a) {
        W(Z);Z.styleDocument(a);
      }, getComputedStyleValue: function getComputedStyleValue(a, b) {
        return (a = window.getComputedStyle(a).getPropertyValue(b)) ? a.trim() : "";
      }, nativeCss: E, nativeShadow: A };ta && (window.ShadyCSS.CustomStyleInterface = ta);
  }window.ShadyCSS.ApplyShim = T;
}).call(undefined);

//# sourceMappingURL=apply-shim.min.js.map

/***/ }),

/***/ "../node_modules/@webcomponents/shadycss/custom-style-interface.min.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  /*
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  'use strict';
  var c = !(window.ShadyDOM && window.ShadyDOM.inUse),
      f;function g(a) {
    f = a && a.shimcssproperties ? !1 : c || !(navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) || !window.CSS || !CSS.supports || !CSS.supports("box-shadow", "0 0 0 var(--foo)"));
  }window.ShadyCSS && void 0 !== window.ShadyCSS.nativeCss ? f = window.ShadyCSS.nativeCss : window.ShadyCSS ? (g(window.ShadyCSS), window.ShadyCSS = void 0) : g(window.WebComponents && window.WebComponents.flags);var h = f;function k(a, b) {
    for (var d in b) {
      null === d ? a.style.removeProperty(d) : a.style.setProperty(d, b[d]);
    }
  };var l = null,
      m = window.HTMLImports && window.HTMLImports.whenReady || null,
      n;function p() {
    var a = q;requestAnimationFrame(function () {
      m ? m(a) : (l || (l = new Promise(function (a) {
        n = a;
      }), "complete" === document.readyState ? n() : document.addEventListener("readystatechange", function () {
        "complete" === document.readyState && n();
      })), l.then(function () {
        a && a();
      }));
    });
  };var r = null,
      q = null;function t() {
    this.customStyles = [];this.enqueued = !1;
  }function u(a) {
    !a.enqueued && q && (a.enqueued = !0, p());
  }t.prototype.c = function (a) {
    a.__seenByShadyCSS || (a.__seenByShadyCSS = !0, this.customStyles.push(a), u(this));
  };t.prototype.b = function (a) {
    if (a.__shadyCSSCachedStyle) return a.__shadyCSSCachedStyle;var b;a.getStyle ? b = a.getStyle() : b = a;return b;
  };
  t.prototype.a = function () {
    for (var a = this.customStyles, b = 0; b < a.length; b++) {
      var d = a[b];if (!d.__shadyCSSCachedStyle) {
        var e = this.b(d);e && (e = e.__appliedElement || e, r && r(e), d.__shadyCSSCachedStyle = e);
      }
    }return a;
  };t.prototype.addCustomStyle = t.prototype.c;t.prototype.getStyleForCustomStyle = t.prototype.b;t.prototype.processStyles = t.prototype.a;
  Object.defineProperties(t.prototype, { transformCallback: { get: function get() {
        return r;
      }, set: function set(a) {
        r = a;
      } }, validateCallback: { get: function get() {
        return q;
      }, set: function set(a) {
        var b = !1;q || (b = !0);q = a;b && u(this);
      } } });var v = new t();window.ShadyCSS || (window.ShadyCSS = { prepareTemplate: function prepareTemplate() {}, styleSubtree: function styleSubtree(a, b) {
      v.a();k(a, b);
    }, styleElement: function styleElement() {
      v.a();
    }, styleDocument: function styleDocument(a) {
      v.a();k(document.body, a);
    }, getComputedStyleValue: function getComputedStyleValue(a, b) {
      return (a = window.getComputedStyle(a).getPropertyValue(b)) ? a.trim() : "";
    }, nativeCss: h, nativeShadow: c });window.ShadyCSS.CustomStyleInterface = v;
}).call(undefined);

//# sourceMappingURL=custom-style-interface.min.js.map

/***/ }),

/***/ "../node_modules/@webcomponents/shadycss/scoping-shim.min.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

(function () {
  /*
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  'use strict';
  var l,
      aa = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this,
      m = {};function n() {
    this.end = this.start = 0;this.rules = this.parent = this.previous = null;this.cssText = this.parsedCssText = "";this.atRule = !1;this.type = 0;this.parsedSelector = this.selector = this.keyframesName = "";
  }
  function p(a) {
    a = a.replace(ba, "").replace(ca, "");var b = da,
        c = a,
        e = new n();e.start = 0;e.end = c.length;for (var d = e, f = 0, g = c.length; f < g; f++) {
      if ("{" === c[f]) {
        d.rules || (d.rules = []);var h = d,
            k = h.rules[h.rules.length - 1] || null;d = new n();d.start = f + 1;d.parent = h;d.previous = k;h.rules.push(d);
      } else "}" === c[f] && (d.end = f + 1, d = d.parent || e);
    }return b(e, a);
  }
  function da(a, b) {
    var c = b.substring(a.start, a.end - 1);a.parsedCssText = a.cssText = c.trim();a.parent && (c = b.substring(a.previous ? a.previous.end : a.parent.start, a.start - 1), c = ea(c), c = c.replace(fa, " "), c = c.substring(c.lastIndexOf(";") + 1), c = a.parsedSelector = a.selector = c.trim(), a.atRule = 0 === c.indexOf("@"), a.atRule ? 0 === c.indexOf("@media") ? a.type = ha : c.match(ia) && (a.type = r, a.keyframesName = a.selector.split(fa).pop()) : a.type = 0 === c.indexOf("--") ? ja : ka);if (c = a.rules) for (var e = 0, d = c.length, f; e < d && (f = c[e]); e++) {
      da(f, b);
    }return a;
  }function ea(a) {
    return a.replace(/\\([0-9a-f]{1,6})\s/gi, function (a, c) {
      a = c;for (c = 6 - a.length; c--;) {
        a = "0" + a;
      }return "\\" + a;
    });
  }
  function la(a, b, c) {
    c = void 0 === c ? "" : c;var e = "";if (a.cssText || a.rules) {
      var d = a.rules,
          f;if (f = d) f = d[0], f = !(f && f.selector && 0 === f.selector.indexOf("--"));if (f) {
        f = 0;for (var g = d.length, h; f < g && (h = d[f]); f++) {
          e = la(h, b, e);
        }
      } else b ? b = a.cssText : (b = a.cssText, b = b.replace(ma, "").replace(na, ""), b = b.replace(oa, "").replace(pa, "")), (e = b.trim()) && (e = "  " + e + "\n");
    }e && (a.selector && (c += a.selector + " {\n"), c += e, a.selector && (c += "}\n\n"));return c;
  }
  var ka = 1,
      r = 7,
      ha = 4,
      ja = 1E3,
      ba = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
      ca = /@import[^;]*;/gim,
      ma = /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
      na = /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
      oa = /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
      pa = /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
      ia = /^@[^\s]*keyframes/,
      fa = /\s+/g;var qa = Promise.resolve();function ra(a) {
    if (a = m[a]) a._applyShimCurrentVersion = a._applyShimCurrentVersion || 0, a._applyShimValidatingVersion = a._applyShimValidatingVersion || 0, a._applyShimNextVersion = (a._applyShimNextVersion || 0) + 1;
  }function sa(a) {
    return a._applyShimCurrentVersion === a._applyShimNextVersion;
  }function ta(a) {
    a._applyShimValidatingVersion = a._applyShimNextVersion;a.b || (a.b = !0, qa.then(function () {
      a._applyShimCurrentVersion = a._applyShimNextVersion;a.b = !1;
    }));
  };var t = !(window.ShadyDOM && window.ShadyDOM.inUse),
      u;function ua(a) {
    u = a && a.shimcssproperties ? !1 : t || !(navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) || !window.CSS || !CSS.supports || !CSS.supports("box-shadow", "0 0 0 var(--foo)"));
  }window.ShadyCSS && void 0 !== window.ShadyCSS.nativeCss ? u = window.ShadyCSS.nativeCss : window.ShadyCSS ? (ua(window.ShadyCSS), window.ShadyCSS = void 0) : ua(window.WebComponents && window.WebComponents.flags);var v = u;var w = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi,
      y = /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,
      va = /(--[\w-]+)\s*([:,;)]|$)/gi,
      wa = /(animation\s*:)|(animation-name\s*:)/,
      xa = /@media\s(.*)/,
      ya = /\{[^}]*\}/g;function z(a, b) {
    if (!a) return "";"string" === typeof a && (a = p(a));b && A(a, b);return la(a, v);
  }function B(a) {
    !a.__cssRules && a.textContent && (a.__cssRules = p(a.textContent));return a.__cssRules || null;
  }function za(a) {
    return !!a.parent && a.parent.type === r;
  }function A(a, b, c, e) {
    if (a) {
      var d = !1,
          f = a.type;if (e && f === ha) {
        var g = a.selector.match(xa);g && (window.matchMedia(g[1]).matches || (d = !0));
      }f === ka ? b(a) : c && f === r ? c(a) : f === ja && (d = !0);if ((a = a.rules) && !d) {
        d = 0;f = a.length;for (var h; d < f && (h = a[d]); d++) {
          A(h, b, c, e);
        }
      }
    }
  }
  function C(a, b, c, e) {
    var d = document.createElement("style");b && d.setAttribute("scope", b);d.textContent = a;Aa(d, c, e);return d;
  }var D = null;function Aa(a, b, c) {
    b = b || document.head;b.insertBefore(a, c && c.nextSibling || b.firstChild);D ? a.compareDocumentPosition(D) === Node.DOCUMENT_POSITION_PRECEDING && (D = a) : D = a;
  }
  function Ba(a, b) {
    var c = a.indexOf("var(");if (-1 === c) return b(a, "", "", "");a: {
      var e = 0;var d = c + 3;for (var f = a.length; d < f; d++) {
        if ("(" === a[d]) e++;else if (")" === a[d] && 0 === --e) break a;
      }d = -1;
    }e = a.substring(c + 4, d);c = a.substring(0, c);a = Ba(a.substring(d + 1), b);d = e.indexOf(",");return -1 === d ? b(c, e.trim(), "", a) : b(c, e.substring(0, d).trim(), e.substring(d + 1).trim(), a);
  }function E(a, b) {
    t ? a.setAttribute("class", b) : window.ShadyDOM.nativeMethods.setAttribute.call(a, "class", b);
  }
  function F(a) {
    var b = a.localName,
        c = "";b ? -1 < b.indexOf("-") || (c = b, b = a.getAttribute && a.getAttribute("is") || "") : (b = a.is, c = a.extends);return { is: b, u: c };
  };var G = null,
      Ca = window.HTMLImports && window.HTMLImports.whenReady || null,
      H;function Da(a) {
    requestAnimationFrame(function () {
      Ca ? Ca(a) : (G || (G = new Promise(function (a) {
        H = a;
      }), "complete" === document.readyState ? H() : document.addEventListener("readystatechange", function () {
        "complete" === document.readyState && H();
      })), G.then(function () {
        a && a();
      }));
    });
  };function I() {}function J(a, b, c) {
    var e = K;a.__styleScoped ? a.__styleScoped = null : Ea(e, a, b || "", c);
  }
  function Ea(a, b, c, e) {
    if (b.nodeType === Node.ELEMENT_NODE && c) if (b.classList) e ? (b.classList.remove("style-scope"), b.classList.remove(c)) : (b.classList.add("style-scope"), b.classList.add(c));else if (b.getAttribute) {
      var d = b.getAttribute(Fa);e ? d && (d = d.replace("style-scope", "").replace(c, ""), E(b, d)) : E(b, (d ? d + " " : "") + "style-scope " + c);
    }if (b = "template" === b.localName ? (b.content || b.R).childNodes : b.children || b.childNodes) for (d = 0; d < b.length; d++) {
      Ea(a, b[d], c, e);
    }
  }
  function L(a, b, c) {
    var e = K,
        d = a.__cssBuild;t || "shady" === d ? b = z(b, c) : (a = F(a), b = Ga(e, b, a.is, a.u, c) + "\n\n");return b.trim();
  }function Ga(a, b, c, e, d) {
    var f = M(c, e);c = c ? Ha + c : "";return z(b, function (b) {
      b.c || (b.selector = b.g = Ia(a, b, a.b, c, f), b.c = !0);d && d(b, c, f);
    });
  }function M(a, b) {
    return b ? "[is=" + a + "]" : a;
  }function Ia(a, b, c, e, d) {
    var f = b.selector.split(Ja);if (!za(b)) {
      b = 0;for (var g = f.length, h; b < g && (h = f[b]); b++) {
        f[b] = c.call(a, h, e, d);
      }
    }return f.join(Ja);
  }
  function Ka(a) {
    return a.replace(La, function (a, c, e) {
      -1 < e.indexOf("+") ? e = e.replace(/\+/g, "___") : -1 < e.indexOf("___") && (e = e.replace(/___/g, "+"));return ":" + c + "(" + e + ")";
    });
  }I.prototype.b = function (a, b, c) {
    var e = !1;a = a.trim();var d = La.test(a);d && (a = a.replace(La, function (a, b, c) {
      return ":" + b + "(" + c.replace(/\s/g, "") + ")";
    }), a = Ka(a));a = a.replace(Ma, Na + " $1");a = a.replace(Oa, function (a, d, h) {
      e || (a = Pa(h, d, b, c), e = e || a.stop, d = a.H, h = a.value);return d + h;
    });d && (a = Ka(a));return a;
  };
  function Pa(a, b, c, e) {
    var d = a.indexOf(Qa);0 <= a.indexOf(Na) ? a = Ra(a, e) : 0 !== d && (a = c ? Sa(a, c) : a);c = !1;0 <= d && (b = "", c = !0);if (c) {
      var f = !0;c && (a = a.replace(Ta, function (a, b) {
        return " > " + b;
      }));
    }a = a.replace(Ua, function (a, b, c) {
      return '[dir="' + c + '"] ' + b + ", " + b + '[dir="' + c + '"]';
    });return { value: a, H: b, stop: f };
  }function Sa(a, b) {
    a = a.split(Va);a[0] += b;return a.join(Va);
  }
  function Ra(a, b) {
    var c = a.match(Wa);return (c = c && c[2].trim() || "") ? c[0].match(Xa) ? a.replace(Wa, function (a, c, f) {
      return b + f;
    }) : c.split(Xa)[0] === b ? c : Ya : a.replace(Na, b);
  }function Za(a) {
    a.selector === $a && (a.selector = "html");
  }I.prototype.c = function (a) {
    return a.match(Qa) ? this.b(a, ab) : Sa(a.trim(), ab);
  };aa.Object.defineProperties(I.prototype, { a: { configurable: !0, enumerable: !0, get: function get() {
        return "style-scope";
      } } });
  var La = /:(nth[-\w]+)\(([^)]+)\)/,
      ab = ":not(.style-scope)",
      Ja = ",",
      Oa = /(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=[])+)/g,
      Xa = /[[.:#*]/,
      Na = ":host",
      $a = ":root",
      Qa = "::slotted",
      Ma = new RegExp("^(" + Qa + ")"),
      Wa = /(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,
      Ta = /(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,
      Ua = /(.*):dir\((?:(ltr|rtl))\)/,
      Ha = ".",
      Va = ":",
      Fa = "class",
      Ya = "should_not_match",
      K = new I();function bb() {}
  function cb(a) {
    for (var b = 0; b < a.length; b++) {
      var c = a[b];if (c.target !== document.documentElement && c.target !== document.head) for (var e = 0; e < c.addedNodes.length; e++) {
        var d = c.addedNodes[e];if (d.nodeType === Node.ELEMENT_NODE) {
          var f = d.getRootNode();var g = d;var h = [];g.classList ? h = Array.from(g.classList) : g instanceof window.SVGElement && g.hasAttribute("class") && (h = g.getAttribute("class").split(/\s+/));g = h;h = g.indexOf(K.a);(g = -1 < h ? g[h + 1] : "") && f === d.ownerDocument ? J(d, g, !0) : f.nodeType === Node.DOCUMENT_FRAGMENT_NODE && (f = f.host) && (f = F(f).is, g !== f && (g && J(d, g, !0), J(d, f)));
        }
      }
    }
  }
  if (!t) {
    var db = new MutationObserver(cb),
        eb = function eb(a) {
      db.observe(a, { childList: !0, subtree: !0 });
    };if (window.customElements && !window.customElements.polyfillWrapFlushCallback) eb(document);else {
      var fb = function fb() {
        eb(document.body);
      };window.HTMLImports ? window.HTMLImports.whenReady(fb) : requestAnimationFrame(function () {
        if ("loading" === document.readyState) {
          var a = function a() {
            fb();document.removeEventListener("readystatechange", a);
          };document.addEventListener("readystatechange", a);
        } else fb();
      });
    }bb = function bb() {
      cb(db.takeRecords());
    };
  }
  var gb = bb;function N(a, b, c, e, d) {
    this.j = a || null;this.b = b || null;this.B = c || [];this.s = null;this.u = d || "";this.a = this.h = this.m = null;
  }function O(a) {
    return a ? a.__styleInfo : null;
  }function hb(a, b) {
    return a.__styleInfo = b;
  }N.prototype.c = function () {
    return this.j;
  };N.prototype._getStyleRules = N.prototype.c;var Q = window.Element.prototype,
      ib = Q.matches || Q.matchesSelector || Q.mozMatchesSelector || Q.msMatchesSelector || Q.oMatchesSelector || Q.webkitMatchesSelector,
      jb = navigator.userAgent.match("Trident");function kb() {}function lb(a) {
    var b = {},
        c = [],
        e = 0;A(a, function (a) {
      R(a);a.index = e++;a = a.f.cssText;for (var c; c = va.exec(a);) {
        var d = c[1];":" !== c[2] && (b[d] = !0);
      }
    }, function (a) {
      c.push(a);
    });a.b = c;a = [];for (var d in b) {
      a.push(d);
    }return a;
  }
  function R(a) {
    if (!a.f) {
      var b = {},
          c = {};S(a, c) && (b.i = c, a.rules = null);b.cssText = a.parsedCssText.replace(ya, "").replace(w, "");a.f = b;
    }
  }function S(a, b) {
    var c = a.f;if (c) {
      if (c.i) return Object.assign(b, c.i), !0;
    } else {
      c = a.parsedCssText;for (var e; a = w.exec(c);) {
        e = (a[2] || a[3]).trim();if ("inherit" !== e || "unset" !== e) b[a[1].trim()] = e;e = !0;
      }return e;
    }
  }
  function T(a, b, c) {
    b && (b = 0 <= b.indexOf(";") ? mb(a, b, c) : Ba(b, function (b, d, f, g) {
      if (!d) return b + g;(d = T(a, c[d], c)) && "initial" !== d ? "apply-shim-inherit" === d && (d = "inherit") : d = T(a, c[f] || f, c) || f;return b + (d || "") + g;
    }));return b && b.trim() || "";
  }
  function mb(a, b, c) {
    b = b.split(";");for (var e = 0, d, f; e < b.length; e++) {
      if (d = b[e]) {
        y.lastIndex = 0;if (f = y.exec(d)) d = T(a, c[f[1]], c);else if (f = d.indexOf(":"), -1 !== f) {
          var g = d.substring(f);g = g.trim();g = T(a, g, c) || g;d = d.substring(0, f) + g;
        }b[e] = d && d.lastIndexOf(";") === d.length - 1 ? d.slice(0, -1) : d || "";
      }
    }return b.join(";");
  }
  function nb(a, b) {
    var c = {},
        e = [];A(a, function (a) {
      a.f || R(a);var d = a.g || a.parsedSelector;b && a.f.i && d && ib.call(b, d) && (S(a, c), a = a.index, d = parseInt(a / 32, 10), e[d] = (e[d] || 0) | 1 << a % 32);
    }, null, !0);return { i: c, key: e };
  }
  function ob(a, b, c, e, d) {
    c.f || R(c);if (c.f.i) {
      b = F(b);a = b.is;b = b.u;b = a ? M(a, b) : "html";var f = c.parsedSelector,
          g = ":host > *" === f || "html" === f,
          h = 0 === f.indexOf(":host") && !g;"shady" === e && (g = f === b + " > *." + b || -1 !== f.indexOf("html"), h = !g && 0 === f.indexOf(b));"shadow" === e && (g = ":host > *" === f || "html" === f, h = h && !g);if (g || h) e = b, h && (t && !c.g && (c.g = Ia(K, c, K.b, a ? Ha + a : "", b)), e = c.g || b), d({ M: e, K: h, S: g });
    }
  }
  function pb(a, b) {
    var c = {},
        e = {},
        d = U,
        f = b && b.__cssBuild;A(b, function (b) {
      ob(d, a, b, f, function (d) {
        ib.call(a.A || a, d.M) && (d.K ? S(b, c) : S(b, e));
      });
    }, null, !0);return { L: e, J: c };
  }
  function qb(a, b, c, e) {
    var d = F(b),
        f = M(d.is, d.u),
        g = new RegExp("(?:^|[^.#[:])" + (b.extends ? "\\" + f.slice(0, -1) + "\\]" : f) + "($|[.:[\\s>+~])");d = O(b).j;var h = rb(d, e);return L(b, d, function (b) {
      var d = "";b.f || R(b);b.f.cssText && (d = mb(a, b.f.cssText, c));b.cssText = d;if (!t && !za(b) && b.cssText) {
        var k = d = b.cssText;null == b.C && (b.C = wa.test(d));if (b.C) if (null == b.w) {
          b.w = [];for (var q in h) {
            k = h[q], k = k(d), d !== k && (d = k, b.w.push(q));
          }
        } else {
          for (q = 0; q < b.w.length; ++q) {
            k = h[b.w[q]], d = k(d);
          }k = d;
        }b.cssText = k;b.g = b.g || b.selector;d = "." + e;q = b.g.split(",");
        k = 0;for (var xb = q.length, P; k < xb && (P = q[k]); k++) {
          q[k] = P.match(g) ? P.replace(f, d) : d + " " + P;
        }b.selector = q.join(",");
      }
    });
  }function rb(a, b) {
    a = a.b;var c = {};if (!t && a) for (var e = 0, d = a[e]; e < a.length; d = a[++e]) {
      var f = d,
          g = b;f.l = new RegExp(f.keyframesName, "g");f.a = f.keyframesName + "-" + g;f.g = f.g || f.selector;f.selector = f.g.replace(f.keyframesName, f.a);c[d.keyframesName] = sb(d);
    }return c;
  }function sb(a) {
    return function (b) {
      return b.replace(a.l, a.a);
    };
  }
  function tb(a, b) {
    var c = U,
        e = B(a);a.textContent = z(e, function (a) {
      var d = a.cssText = a.parsedCssText;a.f && a.f.cssText && (d = d.replace(ma, "").replace(na, ""), a.cssText = mb(c, d, b));
    });
  }aa.Object.defineProperties(kb.prototype, { a: { configurable: !0, enumerable: !0, get: function get() {
        return "x-scope";
      } } });var U = new kb();var ub = {},
      V = window.customElements;if (V && !t) {
    var vb = V.define;V.define = function (a, b, c) {
      var e = document.createComment(" Shady DOM styles for " + a + " "),
          d = document.head;d.insertBefore(e, (D ? D.nextSibling : null) || d.firstChild);D = e;ub[a] = e;return vb.call(V, a, b, c);
    };
  };var W = new function () {
    this.cache = {};this.a = 100;
  }();function X() {
    var a = this;this.A = {};this.c = document.documentElement;var b = new n();b.rules = [];this.l = hb(this.c, new N(b));this.v = !1;this.b = this.a = null;Da(function () {
      Y(a);
    });
  }l = X.prototype;l.F = function () {
    gb();
  };l.I = function (a) {
    return B(a);
  };l.O = function (a) {
    return z(a);
  };
  l.prepareTemplate = function (a, b, c) {
    if (!a.l) {
      a.l = !0;a.name = b;a.extends = c;m[b] = a;var e = (e = a.content.querySelector("style")) ? e.getAttribute("css-build") || "" : "";var d = a.content.querySelectorAll("style");for (var f = [], g = 0; g < d.length; g++) {
        var h = d[g];f.push(h.textContent);h.parentNode.removeChild(h);
      }d = f.join("").trim();c = { is: b, extends: c, P: e };t || J(a.content, b);Y(this);f = y.test(d) || w.test(d);y.lastIndex = 0;w.lastIndex = 0;d = p(d);f && v && this.a && this.a.transformRules(d, b);a._styleAst = d;a.v = e;e = [];v || (e = lb(a._styleAst));
      if (!e.length || v) d = t ? a.content : null, b = ub[b], f = L(c, a._styleAst), b = f.length ? C(f, c.is, d, b) : void 0, a.a = b;a.c = e;
    }
  };function wb(a) {
    !a.b && window.ShadyCSS && window.ShadyCSS.CustomStyleInterface && (a.b = window.ShadyCSS.CustomStyleInterface, a.b.transformCallback = function (b) {
      a.D(b);
    }, a.b.validateCallback = function () {
      requestAnimationFrame(function () {
        (a.b.enqueued || a.v) && a.o();
      });
    });
  }function Y(a) {
    !a.a && window.ShadyCSS && window.ShadyCSS.ApplyShim && (a.a = window.ShadyCSS.ApplyShim, a.a.invalidCallback = ra);wb(a);
  }
  l.o = function () {
    Y(this);if (this.b) {
      var a = this.b.processStyles();if (this.b.enqueued) {
        if (v) for (var b = 0; b < a.length; b++) {
          var c = this.b.getStyleForCustomStyle(a[b]);if (c && v && this.a) {
            var e = B(c);Y(this);this.a.transformRules(e);c.textContent = z(e);
          }
        } else for (yb(this, this.c, this.l), b = 0; b < a.length; b++) {
          (c = this.b.getStyleForCustomStyle(a[b])) && tb(c, this.l.m);
        }this.b.enqueued = !1;this.v && !v && this.styleDocument();
      }
    }
  };
  l.styleElement = function (a, b) {
    var c = F(a).is,
        e = O(a);if (!e) {
      var d = F(a);e = d.is;d = d.u;var f = ub[e];e = m[e];if (e) {
        var g = e._styleAst;var h = e.c;
      }e = hb(a, new N(g, f, h, 0, d));
    }a !== this.c && (this.v = !0);b && (e.s = e.s || {}, Object.assign(e.s, b));if (v) {
      if (e.s) {
        b = e.s;for (var k in b) {
          null === k ? a.style.removeProperty(k) : a.style.setProperty(k, b[k]);
        }
      }if (((k = m[c]) || a === this.c) && k && k.a && !sa(k)) {
        if (sa(k) || k._applyShimValidatingVersion !== k._applyShimNextVersion) Y(this), this.a && this.a.transformRules(k._styleAst, c), k.a.textContent = L(a, e.j), ta(k);t && (c = a.shadowRoot) && (c.querySelector("style").textContent = L(a, e.j));e.j = k._styleAst;
      }
    } else if (yb(this, a, e), e.B && e.B.length) {
      c = e;k = F(a).is;a: {
        if (b = W.cache[k]) for (g = b.length - 1; 0 <= g; g--) {
          h = b[g];b: {
            e = c.B;for (d = 0; d < e.length; d++) {
              if (f = e[d], h.i[f] !== c.m[f]) {
                e = !1;break b;
              }
            }e = !0;
          }if (e) {
            b = h;break a;
          }
        }b = void 0;
      }e = b ? b.styleElement : null;g = c.h;(h = b && b.h) || (h = this.A[k] = (this.A[k] || 0) + 1, h = k + "-" + h);c.h = h;h = c.h;d = U;d = e ? e.textContent || "" : qb(d, a, c.m, h);f = O(a);var x = f.a;x && !t && x !== e && (x._useCount--, 0 >= x._useCount && x.parentNode && x.parentNode.removeChild(x));t ? f.a ? (f.a.textContent = d, e = f.a) : d && (e = C(d, h, a.shadowRoot, f.b)) : e ? e.parentNode || (jb && -1 < d.indexOf("@media") && (e.textContent = d), Aa(e, null, f.b)) : d && (e = C(d, h, null, f.b));e && (e._useCount = e._useCount || 0, f.a != e && e._useCount++, f.a = e);h = e;t || (e = c.h, f = d = a.getAttribute("class") || "", g && (f = d.replace(new RegExp("\\s*x-scope\\s*" + g + "\\s*", "g"), " ")), f += (f ? " " : "") + "x-scope " + e, d !== f && E(a, f));b || (a = W.cache[k] || [], a.push({ i: c.m, styleElement: h, h: c.h }), a.length > W.a && a.shift(), W.cache[k] = a);
    }
  };function zb(a, b) {
    return (b = b.getRootNode().host) ? O(b) ? b : zb(a, b) : a.c;
  }function yb(a, b, c) {
    a = zb(a, b);var e = O(a);a = Object.create(e.m || null);var d = pb(b, c.j);b = nb(e.j, b).i;Object.assign(a, d.J, b, d.L);b = c.s;for (var f in b) {
      if ((d = b[f]) || 0 === d) a[f] = d;
    }f = U;b = Object.getOwnPropertyNames(a);for (d = 0; d < b.length; d++) {
      e = b[d], a[e] = T(f, a[e], a);
    }c.m = a;
  }l.styleDocument = function (a) {
    this.styleSubtree(this.c, a);
  };
  l.styleSubtree = function (a, b) {
    var c = a.shadowRoot;(c || a === this.c) && this.styleElement(a, b);if (b = c && (c.children || c.childNodes)) for (a = 0; a < b.length; a++) {
      this.styleSubtree(b[a]);
    } else if (a = a.children || a.childNodes) for (b = 0; b < a.length; b++) {
      this.styleSubtree(a[b]);
    }
  };l.D = function (a) {
    var b = this,
        c = B(a);A(c, function (a) {
      if (t) Za(a);else {
        var c = K;a.selector = a.parsedSelector;Za(a);a.selector = a.g = Ia(c, a, c.c, void 0, void 0);
      }v && (Y(b), b.a && b.a.transformRule(a));
    });v ? a.textContent = z(c) : this.l.j.rules.push(c);
  };
  l.getComputedStyleValue = function (a, b) {
    var c;v || (c = (O(a) || O(zb(this, a))).m[b]);return (c = c || window.getComputedStyle(a).getPropertyValue(b)) ? c.trim() : "";
  };l.N = function (a, b) {
    var c = a.getRootNode();b = b ? b.split(/\s/) : [];c = c.host && c.host.localName;if (!c) {
      var e = a.getAttribute("class");if (e) {
        e = e.split(/\s/);for (var d = 0; d < e.length; d++) {
          if (e[d] === K.a) {
            c = e[d + 1];break;
          }
        }
      }
    }c && b.push(K.a, c);v || (c = O(a)) && c.h && b.push(U.a, c.h);E(a, b.join(" "));
  };l.G = function (a) {
    return O(a);
  };X.prototype.flush = X.prototype.F;
  X.prototype.prepareTemplate = X.prototype.prepareTemplate;X.prototype.styleElement = X.prototype.styleElement;X.prototype.styleDocument = X.prototype.styleDocument;X.prototype.styleSubtree = X.prototype.styleSubtree;X.prototype.getComputedStyleValue = X.prototype.getComputedStyleValue;X.prototype.setElementClass = X.prototype.N;X.prototype._styleInfoForNode = X.prototype.G;X.prototype.transformCustomStyleForDocument = X.prototype.D;X.prototype.getStyleAst = X.prototype.I;X.prototype.styleAstToString = X.prototype.O;
  X.prototype.flushCustomStyles = X.prototype.o;Object.defineProperties(X.prototype, { nativeShadow: { get: function get() {
        return t;
      } }, nativeCss: { get: function get() {
        return v;
      } } });var Z = new X(),
      Ab,
      Bb;window.ShadyCSS && (Ab = window.ShadyCSS.ApplyShim, Bb = window.ShadyCSS.CustomStyleInterface);window.ShadyCSS = { ScopingShim: Z, prepareTemplate: function prepareTemplate(a, b, c) {
      Z.o();Z.prepareTemplate(a, b, c);
    }, styleSubtree: function styleSubtree(a, b) {
      Z.o();Z.styleSubtree(a, b);
    }, styleElement: function styleElement(a) {
      Z.o();Z.styleElement(a);
    }, styleDocument: function styleDocument(a) {
      Z.o();Z.styleDocument(a);
    }, getComputedStyleValue: function getComputedStyleValue(a, b) {
      return Z.getComputedStyleValue(a, b);
    }, nativeCss: v, nativeShadow: t };Ab && (window.ShadyCSS.ApplyShim = Ab);
  Bb && (window.ShadyCSS.CustomStyleInterface = Bb);
}).call(undefined);

//# sourceMappingURL=scoping-shim.min.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/@webcomponents/shadycss/src/common-regex.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

var VAR_ASSIGN = exports.VAR_ASSIGN = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi;
var MIXIN_MATCH = exports.MIXIN_MATCH = /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi;
var VAR_CONSUMED = exports.VAR_CONSUMED = /(--[\w-]+)\s*([:,;)]|$)/gi;
var ANIMATION_MATCH = exports.ANIMATION_MATCH = /(animation\s*:)|(animation-name\s*:)/;
var MEDIA_MATCH = exports.MEDIA_MATCH = /@media\s(.*)/;
var IS_VAR = exports.IS_VAR = /^--/;
var BRACKETED = exports.BRACKETED = /\{[^}]*\}/g;
var HOST_PREFIX = exports.HOST_PREFIX = '(?:^|[^.#[:])';
var HOST_SUFFIX = exports.HOST_SUFFIX = '($|[.:[\\s>+~])';

/***/ }),

/***/ "../node_modules/@webcomponents/shadycss/src/css-parse.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/*
Extremely simple css parser. Intended to be not more than what we need
and definitely not necessarily correct =).
*/



/** @unrestricted */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.stringify = stringify;
exports.removeCustomPropAssignment = removeCustomPropAssignment;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StyleNode = function StyleNode() {
  _classCallCheck(this, StyleNode);

  /** @type {number} */
  this['start'] = 0;
  /** @type {number} */
  this['end'] = 0;
  /** @type {StyleNode} */
  this['previous'] = null;
  /** @type {StyleNode} */
  this['parent'] = null;
  /** @type {Array<StyleNode>} */
  this['rules'] = null;
  /** @type {string} */
  this['parsedCssText'] = '';
  /** @type {string} */
  this['cssText'] = '';
  /** @type {boolean} */
  this['atRule'] = false;
  /** @type {number} */
  this['type'] = 0;
  /** @type {string} */
  this['keyframesName'] = '';
  /** @type {string} */
  this['selector'] = '';
  /** @type {string} */
  this['parsedSelector'] = '';
};

exports.StyleNode = StyleNode;

// given a string of css, return a simple rule tree
/**
 * @param {string} text
 * @return {StyleNode}
 */

function parse(text) {
  text = clean(text);
  return parseCss(lex(text), text);
}

// remove stuff we don't care about that may hinder parsing
/**
 * @param {string} cssText
 * @return {string}
 */
function clean(cssText) {
  return cssText.replace(RX.comments, '').replace(RX.port, '');
}

// super simple {...} lexer that returns a node tree
/**
 * @param {string} text
 * @return {StyleNode}
 */
function lex(text) {
  var root = new StyleNode();
  root['start'] = 0;
  root['end'] = text.length;
  var n = root;
  for (var i = 0, l = text.length; i < l; i++) {
    if (text[i] === OPEN_BRACE) {
      if (!n['rules']) {
        n['rules'] = [];
      }
      var p = n;
      var previous = p['rules'][p['rules'].length - 1] || null;
      n = new StyleNode();
      n['start'] = i + 1;
      n['parent'] = p;
      n['previous'] = previous;
      p['rules'].push(n);
    } else if (text[i] === CLOSE_BRACE) {
      n['end'] = i + 1;
      n = n['parent'] || root;
    }
  }
  return root;
}

// add selectors/cssText to node tree
/**
 * @param {StyleNode} node
 * @param {string} text
 * @return {StyleNode}
 */
function parseCss(node, text) {
  var t = text.substring(node['start'], node['end'] - 1);
  node['parsedCssText'] = node['cssText'] = t.trim();
  if (node['parent']) {
    var ss = node['previous'] ? node['previous']['end'] : node['parent']['start'];
    t = text.substring(ss, node['start'] - 1);
    t = _expandUnicodeEscapes(t);
    t = t.replace(RX.multipleSpaces, ' ');
    // TODO(sorvell): ad hoc; make selector include only after last ;
    // helps with mixin syntax
    t = t.substring(t.lastIndexOf(';') + 1);
    var s = node['parsedSelector'] = node['selector'] = t.trim();
    node['atRule'] = s.indexOf(AT_START) === 0;
    // note, support a subset of rule types...
    if (node['atRule']) {
      if (s.indexOf(MEDIA_START) === 0) {
        node['type'] = types.MEDIA_RULE;
      } else if (s.match(RX.keyframesRule)) {
        node['type'] = types.KEYFRAMES_RULE;
        node['keyframesName'] = node['selector'].split(RX.multipleSpaces).pop();
      }
    } else {
      if (s.indexOf(VAR_START) === 0) {
        node['type'] = types.MIXIN_RULE;
      } else {
        node['type'] = types.STYLE_RULE;
      }
    }
  }
  var r$ = node['rules'];
  if (r$) {
    for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
      parseCss(r, text);
    }
  }
  return node;
}

/**
 * conversion of sort unicode escapes with spaces like `\33 ` (and longer) into
 * expanded form that doesn't require trailing space `\000033`
 * @param {string} s
 * @return {string}
 */
function _expandUnicodeEscapes(s) {
  return s.replace(/\\([0-9a-f]{1,6})\s/gi, function () {
    var code = arguments[1],
        repeat = 6 - code.length;
    while (repeat--) {
      code = '0' + code;
    }
    return '\\' + code;
  });
}

/**
 * stringify parsed css.
 * @param {StyleNode} node
 * @param {boolean=} preserveProperties
 * @param {string=} text
 * @return {string}
 */
function stringify(node, preserveProperties) {
  var text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  // calc rule cssText
  var cssText = '';
  if (node['cssText'] || node['rules']) {
    var r$ = node['rules'];
    if (r$ && !_hasMixinRules(r$)) {
      for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
        cssText = stringify(r, preserveProperties, cssText);
      }
    } else {
      cssText = preserveProperties ? node['cssText'] : removeCustomProps(node['cssText']);
      cssText = cssText.trim();
      if (cssText) {
        cssText = '  ' + cssText + '\n';
      }
    }
  }
  // emit rule if there is cssText
  if (cssText) {
    if (node['selector']) {
      text += node['selector'] + ' ' + OPEN_BRACE + '\n';
    }
    text += cssText;
    if (node['selector']) {
      text += CLOSE_BRACE + '\n\n';
    }
  }
  return text;
}

/**
 * @param {Array<StyleNode>} rules
 * @return {boolean}
 */
function _hasMixinRules(rules) {
  var r = rules[0];
  return Boolean(r) && Boolean(r['selector']) && r['selector'].indexOf(VAR_START) === 0;
}

/**
 * @param {string} cssText
 * @return {string}
 */
function removeCustomProps(cssText) {
  cssText = removeCustomPropAssignment(cssText);
  return removeCustomPropApply(cssText);
}

/**
 * @param {string} cssText
 * @return {string}
 */
function removeCustomPropAssignment(cssText) {
  return cssText.replace(RX.customProp, '').replace(RX.mixinProp, '');
}

/**
 * @param {string} cssText
 * @return {string}
 */
function removeCustomPropApply(cssText) {
  return cssText.replace(RX.mixinApply, '').replace(RX.varApply, '');
}

/** @enum {number} */
var types = exports.types = {
  STYLE_RULE: 1,
  KEYFRAMES_RULE: 7,
  MEDIA_RULE: 4,
  MIXIN_RULE: 1000
};

var OPEN_BRACE = '{';
var CLOSE_BRACE = '}';

// helper regexp's
var RX = {
  comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
  port: /@import[^;]*;/gim,
  customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
  mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
  mixinApply: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
  varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
  keyframesRule: /^@[^\s]*keyframes/,
  multipleSpaces: /\s+/g
};

var VAR_START = '--';
var MEDIA_START = '@media';
var AT_START = '@';

/***/ }),

/***/ "../node_modules/@webcomponents/shadycss/src/style-settings.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/



Object.defineProperty(exports, "__esModule", {
  value: true
});
var nativeShadow = exports.nativeShadow = !(window['ShadyDOM'] && window['ShadyDOM']['inUse']);
var nativeCssVariables = exports.nativeCssVariables = void 0;

/**
 * @param {(ShadyCSSOptions | ShadyCSSInterface)=} settings
 */
function calcCssVariables(settings) {
  if (settings && settings['shimcssproperties']) {
    exports.nativeCssVariables = nativeCssVariables = false;
  } else {
    // chrome 49 has semi-working css vars, check if box-shadow works
    // safari 9.1 has a recalc bug: https://bugs.webkit.org/show_bug.cgi?id=155782
    // However, shim css custom properties are only supported with ShadyDOM enabled,
    // so fall back on native if we do not detect ShadyDOM
    // Edge 15: custom properties used in ::before and ::after will also be used in the parent element
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12414257/
    exports.nativeCssVariables = nativeCssVariables = nativeShadow || Boolean(!navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) && window.CSS && CSS.supports && CSS.supports('box-shadow', '0 0 0 var(--foo)'));
  }
}

if (window.ShadyCSS && window.ShadyCSS.nativeCss !== undefined) {
  exports.nativeCssVariables = nativeCssVariables = window.ShadyCSS.nativeCss;
} else if (window.ShadyCSS) {
  calcCssVariables(window.ShadyCSS);
  // reset window variable to let ShadyCSS API take its place
  window.ShadyCSS = undefined;
} else {
  calcCssVariables(window['WebComponents'] && window['WebComponents']['flags']);
}

/***/ }),

/***/ "../node_modules/@webcomponents/shadycss/src/style-util.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toCssText = toCssText;
exports.rulesForStyle = rulesForStyle;
exports.isKeyframesSelector = isKeyframesSelector;
exports.forEachRule = forEachRule;
exports.applyCss = applyCss;
exports.createScopeStyle = createScopeStyle;
exports.applyStylePlaceHolder = applyStylePlaceHolder;
exports.applyStyle = applyStyle;
exports.isTargetedBuild = isTargetedBuild;
exports.getCssBuildType = getCssBuildType;
exports.processVariableAndFallback = processVariableAndFallback;
exports.setElementClassRaw = setElementClassRaw;
exports.getIsExtends = getIsExtends;

var _styleSettings = __webpack_require__("../node_modules/@webcomponents/shadycss/src/style-settings.js");

var _cssParse = __webpack_require__("../node_modules/@webcomponents/shadycss/src/css-parse.js");

var _commonRegex = __webpack_require__("../node_modules/@webcomponents/shadycss/src/common-regex.js");

/**
 * @param {string|StyleNode} rules
 * @param {function(StyleNode)=} callback
 * @return {string}
 */
function toCssText(rules, callback) {
  if (!rules) {
    return '';
  }
  if (typeof rules === 'string') {
    rules = (0, _cssParse.parse)(rules);
  }
  if (callback) {
    forEachRule(rules, callback);
  }
  return (0, _cssParse.stringify)(rules, _styleSettings.nativeCssVariables);
}

/**
 * @param {HTMLStyleElement} style
 * @return {StyleNode}
 */
// eslint-disable-line no-unused-vars
function rulesForStyle(style) {
  if (!style['__cssRules'] && style.textContent) {
    style['__cssRules'] = (0, _cssParse.parse)(style.textContent);
  }
  return style['__cssRules'] || null;
}

// Tests if a rule is a keyframes selector, which looks almost exactly
// like a normal selector but is not (it has nothing to do with scoping
// for example).
/**
 * @param {StyleNode} rule
 * @return {boolean}
 */
function isKeyframesSelector(rule) {
  return Boolean(rule['parent']) && rule['parent']['type'] === _cssParse.types.KEYFRAMES_RULE;
}

/**
 * @param {StyleNode} node
 * @param {Function=} styleRuleCallback
 * @param {Function=} keyframesRuleCallback
 * @param {boolean=} onlyActiveRules
 */
function forEachRule(node, styleRuleCallback, keyframesRuleCallback, onlyActiveRules) {
  if (!node) {
    return;
  }
  var skipRules = false;
  var type = node['type'];
  if (onlyActiveRules) {
    if (type === _cssParse.types.MEDIA_RULE) {
      var matchMedia = node['selector'].match(_commonRegex.MEDIA_MATCH);
      if (matchMedia) {
        // if rule is a non matching @media rule, skip subrules
        if (!window.matchMedia(matchMedia[1]).matches) {
          skipRules = true;
        }
      }
    }
  }
  if (type === _cssParse.types.STYLE_RULE) {
    styleRuleCallback(node);
  } else if (keyframesRuleCallback && type === _cssParse.types.KEYFRAMES_RULE) {
    keyframesRuleCallback(node);
  } else if (type === _cssParse.types.MIXIN_RULE) {
    skipRules = true;
  }
  var r$ = node['rules'];
  if (r$ && !skipRules) {
    for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
      forEachRule(r, styleRuleCallback, keyframesRuleCallback, onlyActiveRules);
    }
  }
}

// add a string of cssText to the document.
/**
 * @param {string} cssText
 * @param {string} moniker
 * @param {Node} target
 * @param {Node} contextNode
 * @return {HTMLStyleElement}
 */
function applyCss(cssText, moniker, target, contextNode) {
  var style = createScopeStyle(cssText, moniker);
  applyStyle(style, target, contextNode);
  return style;
}

/**
 * @param {string} cssText
 * @param {string} moniker
 * @return {HTMLStyleElement}
 */
function createScopeStyle(cssText, moniker) {
  var style = /** @type {HTMLStyleElement} */document.createElement('style');
  if (moniker) {
    style.setAttribute('scope', moniker);
  }
  style.textContent = cssText;
  return style;
}

/**
 * Track the position of the last added style for placing placeholders
 * @type {Node}
 */
var lastHeadApplyNode = null;

// insert a comment node as a styling position placeholder.
/**
 * @param {string} moniker
 * @return {!Comment}
 */
function applyStylePlaceHolder(moniker) {
  var placeHolder = document.createComment(' Shady DOM styles for ' + moniker + ' ');
  var after = lastHeadApplyNode ? lastHeadApplyNode['nextSibling'] : null;
  var scope = document.head;
  scope.insertBefore(placeHolder, after || scope.firstChild);
  lastHeadApplyNode = placeHolder;
  return placeHolder;
}

/**
 * @param {HTMLStyleElement} style
 * @param {?Node} target
 * @param {?Node} contextNode
 */
function applyStyle(style, target, contextNode) {
  target = target || document.head;
  var after = contextNode && contextNode.nextSibling || target.firstChild;
  target.insertBefore(style, after);
  if (!lastHeadApplyNode) {
    lastHeadApplyNode = style;
  } else {
    // only update lastHeadApplyNode if the new style is inserted after the old lastHeadApplyNode
    var position = style.compareDocumentPosition(lastHeadApplyNode);
    if (position === Node.DOCUMENT_POSITION_PRECEDING) {
      lastHeadApplyNode = style;
    }
  }
}

/**
 * @param {string} buildType
 * @return {boolean}
 */
function isTargetedBuild(buildType) {
  return _styleSettings.nativeShadow ? buildType === 'shadow' : buildType === 'shady';
}

/**
 * @param {Element} element
 * @return {?string}
 */
function getCssBuildType(element) {
  return element.getAttribute('css-build');
}

/**
 * Walk from text[start] matching parens and
 * returns position of the outer end paren
 * @param {string} text
 * @param {number} start
 * @return {number}
 */
function findMatchingParen(text, start) {
  var level = 0;
  for (var i = start, l = text.length; i < l; i++) {
    if (text[i] === '(') {
      level++;
    } else if (text[i] === ')') {
      if (--level === 0) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * @param {string} str
 * @param {function(string, string, string, string)} callback
 */
function processVariableAndFallback(str, callback) {
  // find 'var('
  var start = str.indexOf('var(');
  if (start === -1) {
    // no var?, everything is prefix
    return callback(str, '', '', '');
  }
  //${prefix}var(${inner})${suffix}
  var end = findMatchingParen(str, start + 3);
  var inner = str.substring(start + 4, end);
  var prefix = str.substring(0, start);
  // suffix may have other variables
  var suffix = processVariableAndFallback(str.substring(end + 1), callback);
  var comma = inner.indexOf(',');
  // value and fallback args should be trimmed to match in property lookup
  if (comma === -1) {
    // variable, no fallback
    return callback(prefix, inner.trim(), '', suffix);
  }
  // var(${value},${fallback})
  var value = inner.substring(0, comma).trim();
  var fallback = inner.substring(comma + 1).trim();
  return callback(prefix, value, fallback, suffix);
}

/**
 * @param {Element} element
 * @param {string} value
 */
function setElementClassRaw(element, value) {
  // use native setAttribute provided by ShadyDOM when setAttribute is patched
  if (_styleSettings.nativeShadow) {
    element.setAttribute('class', value);
  } else {
    window['ShadyDOM']['nativeMethods']['setAttribute'].call(element, 'class', value);
  }
}

/**
 * @param {Element | {is: string, extends: string}} element
 * @return {{is: string, typeExtension: string}}
 */
function getIsExtends(element) {
  var localName = element['localName'];
  var is = '',
      typeExtension = '';
  /*
  NOTE: technically, this can be wrong for certain svg elements
  with `-` in the name like `<font-face>`
  */
  if (localName) {
    if (localName.indexOf('-') > -1) {
      is = localName;
    } else {
      typeExtension = localName;
      is = element.getAttribute && element.getAttribute('is') || '';
    }
  } else {
    is = /** @type {?} */element.is;
    typeExtension = /** @type {?} */element.extends;
  }
  return { is: is, typeExtension: typeExtension };
}

/***/ }),

/***/ "../node_modules/@webcomponents/shadydom/shadydom.min.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
  /*
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  'use strict';
  function n(a, b) {
    return { index: a, j: [], l: b };
  }
  function aa(a, b, c, d) {
    var e = 0,
        g = 0,
        h = 0,
        f = 0,
        k = Math.min(b - e, d - g);if (0 == e && 0 == g) a: {
      for (h = 0; h < k; h++) {
        if (a[h] !== c[h]) break a;
      }h = k;
    }if (b == a.length && d == c.length) {
      f = a.length;for (var l = c.length, m = 0; m < k - h && ba(a[--f], c[--l]);) {
        m++;
      }f = m;
    }e += h;g += h;b -= f;d -= f;if (0 == b - e && 0 == d - g) return [];if (e == b) {
      for (b = n(e, 0); g < d;) {
        b.j.push(c[g++]);
      }return [b];
    }if (g == d) return [n(e, b - e)];k = e;h = g;d = d - h + 1;f = b - k + 1;b = Array(d);for (l = 0; l < d; l++) {
      b[l] = Array(f), b[l][0] = l;
    }for (l = 0; l < f; l++) {
      b[0][l] = l;
    }for (l = 1; l < d; l++) {
      for (m = 1; m < f; m++) {
        if (a[k + m - 1] === c[h + l - 1]) b[l][m] = b[l - 1][m - 1];else {
          var q = b[l - 1][m] + 1,
              z = b[l][m - 1] + 1;b[l][m] = q < z ? q : z;
        }
      }
    }k = b.length - 1;h = b[0].length - 1;d = b[k][h];for (a = []; 0 < k || 0 < h;) {
      0 == k ? (a.push(2), h--) : 0 == h ? (a.push(3), k--) : (f = b[k - 1][h - 1], l = b[k - 1][h], m = b[k][h - 1], q = l < m ? l < f ? l : f : m < f ? m : f, q == f ? (f == d ? a.push(0) : (a.push(1), d = f), k--, h--) : q == l ? (a.push(3), k--, d = l) : (a.push(2), h--, d = m));
    }a.reverse();b = void 0;k = [];for (h = 0; h < a.length; h++) {
      switch (a[h]) {case 0:
          b && (k.push(b), b = void 0);e++;g++;break;case 1:
          b || (b = n(e, 0));b.l++;e++;b.j.push(c[g]);g++;break;case 2:
          b || (b = n(e, 0));
          b.l++;e++;break;case 3:
          b || (b = n(e, 0)), b.j.push(c[g]), g++;}
    }b && k.push(b);return k;
  }function ba(a, b) {
    return a === b;
  };var p = window.ShadyDOM || {};p.P = !(!Element.prototype.attachShadow || !Node.prototype.getRootNode);var r = Object.getOwnPropertyDescriptor(Node.prototype, "firstChild");p.h = !!(r && r.configurable && r.get);p.G = p.force || !p.P;function t(a) {
    return a.__shady && void 0 !== a.__shady.firstChild;
  }function u(a) {
    return "ShadyRoot" === a.J;
  }function v(a) {
    a = a.getRootNode();if (u(a)) return a;
  }var w = Element.prototype,
      ca = w.matches || w.matchesSelector || w.mozMatchesSelector || w.msMatchesSelector || w.oMatchesSelector || w.webkitMatchesSelector;
  function x(a, b) {
    if (a && b) for (var c = Object.getOwnPropertyNames(b), d = 0, e; d < c.length && (e = c[d]); d++) {
      var g = Object.getOwnPropertyDescriptor(b, e);g && Object.defineProperty(a, e, g);
    }
  }function y(a, b) {
    for (var c = [], d = 1; d < arguments.length; ++d) {
      c[d - 1] = arguments[d];
    }for (d = 0; d < c.length; d++) {
      x(a, c[d]);
    }return a;
  }function da(a, b) {
    for (var c in b) {
      a[c] = b[c];
    }
  }var A = document.createTextNode(""),
      ea = 0,
      B = [];new MutationObserver(function () {
    for (; B.length;) {
      try {
        B.shift()();
      } catch (a) {
        throw A.textContent = ea++, a;
      }
    }
  }).observe(A, { characterData: !0 });
  function fa(a) {
    B.push(a);A.textContent = ea++;
  };var ha = /[&\u00A0"]/g,
      ia = /[&\u00A0<>]/g;function ja(a) {
    switch (a) {case "&":
        return "&amp;";case "<":
        return "&lt;";case ">":
        return "&gt;";case '"':
        return "&quot;";case "\xA0":
        return "&nbsp;";}
  }function ka(a) {
    for (var b = {}, c = 0; c < a.length; c++) {
      b[a[c]] = !0;
    }return b;
  }var la = ka("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),
      na = ka("style script xmp iframe noembed noframes plaintext noscript".split(" "));
  function C(a, b) {
    "template" === a.localName && (a = a.content);for (var c = "", d = b ? b(a) : a.childNodes, e = 0, g = d.length, h; e < g && (h = d[e]); e++) {
      a: {
        var f = h;var k = a;var l = b;switch (f.nodeType) {case Node.ELEMENT_NODE:
            for (var m = f.localName, q = "<" + m, z = f.attributes, ma = 0; k = z[ma]; ma++) {
              q += " " + k.name + '="' + k.value.replace(ha, ja) + '"';
            }q += ">";f = la[m] ? q : q + C(f, l) + "</" + m + ">";break a;case Node.TEXT_NODE:
            f = f.data;f = k && na[k.localName] ? f : f.replace(ia, ja);break a;case Node.COMMENT_NODE:
            f = "\x3c!--" + f.data + "--\x3e";break a;default:
            throw window.console.error(f), Error("not implemented");}
      }c += f;
    }return c;
  };var D = {},
      E = document.createTreeWalker(document, NodeFilter.SHOW_ALL, null, !1),
      F = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, null, !1);function oa(a) {
    var b = [];E.currentNode = a;for (a = E.firstChild(); a;) {
      b.push(a), a = E.nextSibling();
    }return b;
  }D.parentNode = function (a) {
    E.currentNode = a;return E.parentNode();
  };D.firstChild = function (a) {
    E.currentNode = a;return E.firstChild();
  };D.lastChild = function (a) {
    E.currentNode = a;return E.lastChild();
  };D.previousSibling = function (a) {
    E.currentNode = a;return E.previousSibling();
  };
  D.nextSibling = function (a) {
    E.currentNode = a;return E.nextSibling();
  };D.childNodes = oa;D.parentElement = function (a) {
    F.currentNode = a;return F.parentNode();
  };D.firstElementChild = function (a) {
    F.currentNode = a;return F.firstChild();
  };D.lastElementChild = function (a) {
    F.currentNode = a;return F.lastChild();
  };D.previousElementSibling = function (a) {
    F.currentNode = a;return F.previousSibling();
  };D.nextElementSibling = function (a) {
    F.currentNode = a;return F.nextSibling();
  };
  D.children = function (a) {
    var b = [];F.currentNode = a;for (a = F.firstChild(); a;) {
      b.push(a), a = F.nextSibling();
    }return b;
  };D.innerHTML = function (a) {
    return C(a, function (a) {
      return oa(a);
    });
  };D.textContent = function (a) {
    switch (a.nodeType) {case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:
        a = document.createTreeWalker(a, NodeFilter.SHOW_TEXT, null, !1);for (var b = "", c; c = a.nextNode();) {
          b += c.nodeValue;
        }return b;default:
        return a.nodeValue;}
  };var G = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML") || Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerHTML"),
      H = document.implementation.createHTMLDocument("inert").createElement("div"),
      I = Object.getOwnPropertyDescriptor(Document.prototype, "activeElement"),
      pa = { parentElement: { get: function get() {
        var a = this.__shady && this.__shady.parentNode;a && a.nodeType !== Node.ELEMENT_NODE && (a = null);return void 0 !== a ? a : D.parentElement(this);
      }, configurable: !0 }, parentNode: { get: function get() {
        var a = this.__shady && this.__shady.parentNode;return void 0 !== a ? a : D.parentNode(this);
      }, configurable: !0 }, nextSibling: { get: function get() {
        var a = this.__shady && this.__shady.nextSibling;return void 0 !== a ? a : D.nextSibling(this);
      }, configurable: !0 }, previousSibling: { get: function get() {
        var a = this.__shady && this.__shady.previousSibling;return void 0 !== a ? a : D.previousSibling(this);
      }, configurable: !0 }, className: { get: function get() {
        return this.getAttribute("class") || "";
      }, set: function set(a) {
        this.setAttribute("class", a);
      }, configurable: !0 }, nextElementSibling: { get: function get() {
        if (this.__shady && void 0 !== this.__shady.nextSibling) {
          for (var a = this.nextSibling; a && a.nodeType !== Node.ELEMENT_NODE;) {
            a = a.nextSibling;
          }return a;
        }return D.nextElementSibling(this);
      }, configurable: !0 }, previousElementSibling: { get: function get() {
        if (this.__shady && void 0 !== this.__shady.previousSibling) {
          for (var a = this.previousSibling; a && a.nodeType !== Node.ELEMENT_NODE;) {
            a = a.previousSibling;
          }return a;
        }return D.previousElementSibling(this);
      }, configurable: !0 } },
      J = { childNodes: { get: function get() {
        if (t(this)) {
          if (!this.__shady.childNodes) {
            this.__shady.childNodes = [];for (var a = this.firstChild; a; a = a.nextSibling) {
              this.__shady.childNodes.push(a);
            }
          }var b = this.__shady.childNodes;
        } else b = D.childNodes(this);b.item = function (a) {
          return b[a];
        };return b;
      }, configurable: !0 }, childElementCount: { get: function get() {
        return this.children.length;
      }, configurable: !0 }, firstChild: { get: function get() {
        var a = this.__shady && this.__shady.firstChild;return void 0 !== a ? a : D.firstChild(this);
      }, configurable: !0 }, lastChild: { get: function get() {
        var a = this.__shady && this.__shady.lastChild;return void 0 !== a ? a : D.lastChild(this);
      },
      configurable: !0 }, textContent: { get: function get() {
        if (t(this)) {
          for (var a = [], b = 0, c = this.childNodes, d; d = c[b]; b++) {
            d.nodeType !== Node.COMMENT_NODE && a.push(d.textContent);
          }return a.join("");
        }return D.textContent(this);
      }, set: function set(a) {
        switch (this.nodeType) {case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:
            for (; this.firstChild;) {
              this.removeChild(this.firstChild);
            }(0 < a.length || this.nodeType === Node.ELEMENT_NODE) && this.appendChild(document.createTextNode(a));break;default:
            this.nodeValue = a;}
      }, configurable: !0 }, firstElementChild: { get: function get() {
        if (this.__shady && void 0 !== this.__shady.firstChild) {
          for (var a = this.firstChild; a && a.nodeType !== Node.ELEMENT_NODE;) {
            a = a.nextSibling;
          }return a;
        }return D.firstElementChild(this);
      }, configurable: !0 }, lastElementChild: { get: function get() {
        if (this.__shady && void 0 !== this.__shady.lastChild) {
          for (var a = this.lastChild; a && a.nodeType !== Node.ELEMENT_NODE;) {
            a = a.previousSibling;
          }return a;
        }return D.lastElementChild(this);
      }, configurable: !0 }, children: { get: function get() {
        var a;t(this) ? a = Array.prototype.filter.call(this.childNodes, function (a) {
          return a.nodeType === Node.ELEMENT_NODE;
        }) : a = D.children(this);a.item = function (b) {
          return a[b];
        };return a;
      }, configurable: !0 }, innerHTML: { get: function get() {
        var a = "template" === this.localName ? this.content : this;return t(this) ? C(a) : D.innerHTML(a);
      }, set: function set(a) {
        for (var b = "template" === this.localName ? this.content : this; b.firstChild;) {
          b.removeChild(b.firstChild);
        }for (G && G.set ? G.set.call(H, a) : H.innerHTML = a; H.firstChild;) {
          b.appendChild(H.firstChild);
        }
      }, configurable: !0 } },
      qa = { shadowRoot: { get: function get() {
        return this.__shady && this.__shady.R || null;
      },
      configurable: !0 } },
      K = { activeElement: { get: function get() {
        var a = I && I.get ? I.get.call(document) : p.h ? void 0 : document.activeElement;if (a && a.nodeType) {
          var b = !!u(this);if (this === document || b && this.host !== a && this.host.contains(a)) {
            for (b = v(a); b && b !== this;) {
              a = b.host, b = v(a);
            }a = this === document ? b ? null : a : b === this ? a : null;
          } else a = null;
        } else a = null;return a;
      }, set: function set() {}, configurable: !0 } };
  function L(a, b, c) {
    for (var d in b) {
      var e = Object.getOwnPropertyDescriptor(a, d);e && e.configurable || !e && c ? Object.defineProperty(a, d, b[d]) : c && console.warn("Could not define", d, "on", a);
    }
  }function M(a) {
    L(a, pa);L(a, J);L(a, K);
  }var ra = p.h ? function () {} : function (a) {
    a.__shady && a.__shady.K || (a.__shady = a.__shady || {}, a.__shady.K = !0, L(a, pa, !0));
  },
      sa = p.h ? function () {} : function (a) {
    a.__shady && a.__shady.I || (a.__shady = a.__shady || {}, a.__shady.I = !0, L(a, J, !0), L(a, qa, !0));
  };function ta(a, b, c) {
    ra(a);c = c || null;a.__shady = a.__shady || {};b.__shady = b.__shady || {};c && (c.__shady = c.__shady || {});a.__shady.previousSibling = c ? c.__shady.previousSibling : b.lastChild;var d = a.__shady.previousSibling;d && d.__shady && (d.__shady.nextSibling = a);(d = a.__shady.nextSibling = c) && d.__shady && (d.__shady.previousSibling = a);a.__shady.parentNode = b;c ? c === b.__shady.firstChild && (b.__shady.firstChild = a) : (b.__shady.lastChild = a, b.__shady.firstChild || (b.__shady.firstChild = a));b.__shady.childNodes = null;
  }
  function N(a) {
    if (!a.__shady || void 0 === a.__shady.firstChild) {
      a.__shady = a.__shady || {};a.__shady.firstChild = D.firstChild(a);a.__shady.lastChild = D.lastChild(a);sa(a);for (var b = a.__shady.childNodes = D.childNodes(a), c = 0, d; c < b.length && (d = b[c]); c++) {
        d.__shady = d.__shady || {}, d.__shady.parentNode = a, d.__shady.nextSibling = b[c + 1] || null, d.__shady.previousSibling = b[c - 1] || null, ra(d);
      }
    }
  };var O = {},
      ua = Element.prototype.insertBefore,
      va = Element.prototype.removeChild,
      wa = Element.prototype.setAttribute,
      xa = Element.prototype.removeAttribute,
      ya = Element.prototype.cloneNode,
      za = Document.prototype.importNode,
      Aa = Element.prototype.addEventListener,
      Ba = Element.prototype.removeEventListener,
      Ca = Window.prototype.addEventListener,
      Da = Window.prototype.removeEventListener,
      Ea = Element.prototype.dispatchEvent,
      Fa = Element.prototype.querySelector,
      Ga = Element.prototype.querySelectorAll;O.appendChild = Element.prototype.appendChild;
  O.insertBefore = ua;O.removeChild = va;O.setAttribute = wa;O.removeAttribute = xa;O.cloneNode = ya;O.importNode = za;O.addEventListener = Aa;O.removeEventListener = Ba;O.S = Ca;O.T = Da;O.dispatchEvent = Ea;O.querySelector = Fa;O.querySelectorAll = Ga;function P(a, b, c) {
    if (b === a) throw Error("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");if (c) {
      var d = c.__shady && c.__shady.parentNode;if (void 0 !== d && d !== a || void 0 === d && D.parentNode(c) !== a) throw Error("Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.");
    }if (c === b) return b;b.parentNode && Q(b.parentNode, b);d = v(a);var e;if (e = d) a: {
      if (!b.__noInsertionPoint) {
        var g;"slot" === b.localName ? g = [b] : b.querySelectorAll && (g = b.querySelectorAll("slot"));if (g && g.length) {
          e = g;break a;
        }
      }e = void 0;
    }g = e;d && ("slot" === a.localName || g) && R(d);if (t(a)) {
      e = c;sa(a);a.__shady = a.__shady || {};void 0 !== a.__shady.firstChild && (a.__shady.childNodes = null);if (b.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        for (var h = b.childNodes, f = 0; f < h.length; f++) {
          ta(h[f], a, e);
        }b.__shady = b.__shady || {};e = void 0 !== b.__shady.firstChild ? null : void 0;b.__shady.firstChild = b.__shady.lastChild = e;b.__shady.childNodes = e;
      } else ta(b, a, e);if (S(a)) {
        R(a.__shady.root);var k = !0;
      } else a.__shady.root && (k = !0);
    }k || (k = u(a) ? a.host : a, c ? (c = Ha(c), O.insertBefore.call(k, b, c)) : O.appendChild.call(k, b));Ia(a, b);if (g) {
      d.a = d.a || {};d.b = d.b || [];for (a = 0; a < g.length; a++) {
        c = g[a];c.__shady = c.__shady || {};N(c);N(c.parentNode);k = Ja(c);if (d.a[k]) {
          var l = l || {};l[k] = !0;d.a[k].push(c);
        } else d.a[k] = [c];d.b.push(c);
      }if (l) for (var m in l) {
        d.a[m] = Ka(d.a[m]);
      }
    }return b;
  }
  function Q(a, b) {
    if (b.parentNode !== a) throw Error("The node to be removed is not a child of this node: " + b);var c = v(b);if (t(a)) {
      b.__shady = b.__shady || {};a.__shady = a.__shady || {};b === a.__shady.firstChild && (a.__shady.firstChild = b.__shady.nextSibling);b === a.__shady.lastChild && (a.__shady.lastChild = b.__shady.previousSibling);var d = b.__shady.previousSibling,
          e = b.__shady.nextSibling;d && (d.__shady = d.__shady || {}, d.__shady.nextSibling = e);e && (e.__shady = e.__shady || {}, e.__shady.previousSibling = d);b.__shady.parentNode = b.__shady.previousSibling = b.__shady.nextSibling = void 0;void 0 !== a.__shady.childNodes && (a.__shady.childNodes = null);if (S(a)) {
        R(a.__shady.root);var g = !0;
      }
    }La(b);if (c) {
      (d = a && "slot" === a.localName) && (g = !0);c.a = c.a || {};c.b = c.b || [];e = c.a;for (var h in e) {
        for (var f = e[h], k = 0; k < f.length; k++) {
          var l = f[k],
              m;a: {
            for (m = l; m;) {
              if (m == b) {
                m = !0;break a;
              }m = m.parentNode;
            }m = void 0;
          }if (m) {
            f.splice(k, 1);var q = c.b.indexOf(l);0 <= q && c.b.splice(q, 1);k--;if (q = l.__shady.g) for (l = 0; l < q.length; l++) {
              m = q[l];var z = D.parentNode(m);z && O.removeChild.call(z, m);
            }q = !0;
          }
        }
      }(q || d) && R(c);
    }g || (g = u(a) ? a.host : a, (!a.__shady.root && "slot" !== b.localName || g === D.parentNode(b)) && O.removeChild.call(g, b));Ia(a, null, b);return b;
  }function La(a) {
    if (a.__shady && void 0 !== a.__shady.A) for (var b = a.childNodes, c = 0, d = b.length, e; c < d && (e = b[c]); c++) {
      La(e);
    }a.__shady && (a.__shady.A = void 0);
  }function Ha(a) {
    var b = a;a && "slot" === a.localName && (b = (b = a.__shady && a.__shady.g) && b.length ? b[0] : Ha(a.nextSibling));return b;
  }function S(a) {
    return (a = a && a.__shady && a.__shady.root) && !!a.b.length;
  }
  function Ma(a, b) {
    if ("slot" === b) a = a.parentNode, S(a) && R(a.__shady.root);else if ("slot" === a.localName && "name" === b && (b = v(a))) {
      var c = a.L,
          d = Ja(a);if (d !== c) {
        c = b.a[c];var e = c.indexOf(a);0 <= e && c.splice(e, 1);c = b.a[d] || (b.a[d] = []);c.push(a);1 < c.length && (b.a[d] = Ka(c));
      }R(b);
    }
  }function Ia(a, b, c) {
    if (a = a.__shady && a.__shady.i) b && a.addedNodes.push(b), c && a.removedNodes.push(c), Na(a);
  }
  function Oa(a) {
    if (a && a.nodeType) {
      a.__shady = a.__shady || {};var b = a.__shady.A;void 0 === b && (u(a) ? b = a : b = (b = a.parentNode) ? Oa(b) : a, document.documentElement.contains(a) && (a.__shady.A = b));return b;
    }
  }function T(a, b, c) {
    var d = [];Pa(a.childNodes, b, c, d);return d;
  }function Pa(a, b, c, d) {
    for (var e = 0, g = a.length, h; e < g && (h = a[e]); e++) {
      var f;if (f = h.nodeType === Node.ELEMENT_NODE) {
        f = h;var k = b,
            l = c,
            m = d,
            q = k(f);q && m.push(f);l && l(q) ? f = q : (Pa(f.childNodes, k, l, m), f = void 0);
      }if (f) break;
    }
  }var U = null;
  function Qa(a, b, c) {
    U || (U = window.ShadyCSS && window.ShadyCSS.ScopingShim);U && "class" === b ? U.setElementClass(a, c) : (O.setAttribute.call(a, b, c), Ma(a, b));
  }function Ra(a, b) {
    if (a.ownerDocument !== document) return O.importNode.call(document, a, b);var c = O.importNode.call(document, a, !1);if (b) {
      a = a.childNodes;b = 0;for (var d; b < a.length; b++) {
        d = Ra(a[b], !0), c.appendChild(d);
      }
    }return c;
  };var V = [],
      Sa;function Ta(a) {
    Sa || (Sa = !0, fa(W));V.push(a);
  }function W() {
    Sa = !1;for (var a = !!V.length; V.length;) {
      V.shift()();
    }return a;
  }W.list = V;var Ua = {};function X(a, b, c) {
    if (a !== Ua) throw new TypeError("Illegal constructor");a = document.createDocumentFragment();a.__proto__ = X.prototype;a.J = "ShadyRoot";N(b);N(a);a.host = b;a.c = c && c.mode;b.__shady = b.__shady || {};b.__shady.root = a;b.__shady.R = "closed" !== a.c ? a : null;a.f = !1;a.b = [];a.a = null;c = D.childNodes(b);for (var d = 0, e = c.length; d < e; d++) {
      O.removeChild.call(b, c[d]);
    }return a;
  }X.prototype = Object.create(DocumentFragment.prototype);function R(a) {
    a.f || (a.f = !0, Ta(function () {
      return Va(a);
    }));
  }
  function Va(a) {
    if (a.f) {
      for (var b = a; a;) {
        a.f && (b = a);a: {
          var c = a;a = c.host.getRootNode();if (u(a)) for (var d = c.host.childNodes, e = 0; e < d.length; e++) {
            if (c = d[e], "slot" == c.localName) break a;
          }a = void 0;
        }
      }b._renderRoot();
    }
  }
  X.prototype._renderRoot = function () {
    this.f = !1;for (var a = 0, b; a < this.b.length; a++) {
      b = this.b[a];var c = b.__shady.assignedNodes;b.__shady.assignedNodes = [];b.__shady.g = [];if (b.__shady.F = c) for (var d = 0; d < c.length; d++) {
        var e = c[d];e.__shady.v = e.__shady.assignedSlot;e.__shady.assignedSlot === b && (e.__shady.assignedSlot = null);
      }
    }for (b = this.host.firstChild; b; b = b.nextSibling) {
      Wa(this, b);
    }for (a = 0; a < this.b.length; a++) {
      b = this.b[a];if (!b.__shady.assignedNodes.length) for (c = b.firstChild; c; c = c.nextSibling) {
        Wa(this, c, b);
      }c = b.parentNode;
      (c = c.__shady && c.__shady.root) && c.b.length && c._renderRoot();Xa(this, b.__shady.g, b.__shady.assignedNodes);if (c = b.__shady.F) {
        for (d = 0; d < c.length; d++) {
          c[d].__shady.v = null;
        }b.__shady.F = null;c.length > b.__shady.assignedNodes.length && (b.__shady.w = !0);
      }b.__shady.w && (b.__shady.w = !1, Ya(this, b));
    }a = this.b;b = [];for (c = 0; c < a.length; c++) {
      d = a[c].parentNode, d.__shady && d.__shady.root || !(0 > b.indexOf(d)) || b.push(d);
    }for (a = 0; a < b.length; a++) {
      c = b[a];d = c === this ? this.host : c;e = [];c = c.childNodes;for (var g = 0; g < c.length; g++) {
        var h = c[g];
        if ("slot" == h.localName) {
          h = h.__shady.g;for (var f = 0; f < h.length; f++) {
            e.push(h[f]);
          }
        } else e.push(h);
      }c = void 0;g = D.childNodes(d);h = aa(e, e.length, g, g.length);for (var k = f = 0; f < h.length && (c = h[f]); f++) {
        for (var l = 0, m; l < c.j.length && (m = c.j[l]); l++) {
          D.parentNode(m) === d && O.removeChild.call(d, m), g.splice(c.index + k, 1);
        }k -= c.l;
      }for (k = 0; k < h.length && (c = h[k]); k++) {
        for (f = g[c.index], l = c.index; l < c.index + c.l; l++) {
          m = e[l], O.insertBefore.call(d, m, f), g.splice(l, 0, m);
        }
      }
    }
  };
  function Wa(a, b, c) {
    b.__shady = b.__shady || {};var d = b.__shady.v;b.__shady.v = null;c || (c = (a = a.a[b.slot || "__catchall"]) && a[0]);c ? (c.__shady.assignedNodes.push(b), b.__shady.assignedSlot = c) : b.__shady.assignedSlot = void 0;d !== b.__shady.assignedSlot && b.__shady.assignedSlot && (b.__shady.assignedSlot.__shady.w = !0);
  }function Xa(a, b, c) {
    for (var d = 0, e; d < c.length && (e = c[d]); d++) {
      "slot" == e.localName ? Xa(a, b, e.__shady.assignedNodes) : b.push(c[d]);
    }
  }
  function Ya(a, b) {
    O.dispatchEvent.call(b, new Event("slotchange"));b.__shady.assignedSlot && Ya(a, b.__shady.assignedSlot);
  }function Ja(a) {
    var b = a.name || a.getAttribute("name") || "__catchall";return a.L = b;
  }function Ka(a) {
    return a.sort(function (a, c) {
      a = Za(a);for (var b = Za(c), e = 0; e < a.length; e++) {
        c = a[e];var g = b[e];if (c !== g) return a = Array.from(c.parentNode.childNodes), a.indexOf(c) - a.indexOf(g);
      }
    });
  }function Za(a) {
    var b = [];do {
      b.unshift(a);
    } while (a = a.parentNode);return b;
  }
  X.prototype.addEventListener = function (a, b, c) {
    "object" !== (typeof c === "undefined" ? "undefined" : _typeof(c)) && (c = { capture: !!c });c.u = this;this.host.addEventListener(a, b, c);
  };X.prototype.removeEventListener = function (a, b, c) {
    "object" !== (typeof c === "undefined" ? "undefined" : _typeof(c)) && (c = { capture: !!c });c.u = this;this.host.removeEventListener(a, b, c);
  };X.prototype.getElementById = function (a) {
    return T(this, function (b) {
      return b.id == a;
    }, function (a) {
      return !!a;
    })[0] || null;
  };var $a = X.prototype;L($a, J, !0);L($a, K, !0);function ab() {
    this.c = !1;this.addedNodes = [];this.removedNodes = [];this.m = new Set();
  }function Na(a) {
    a.c || (a.c = !0, fa(function () {
      bb(a);
    }));
  }function bb(a) {
    if (a.c) {
      a.c = !1;var b = a.takeRecords();b.length && a.m.forEach(function (a) {
        a(b);
      });
    }
  }ab.prototype.takeRecords = function () {
    if (this.addedNodes.length || this.removedNodes.length) {
      var a = [{ addedNodes: this.addedNodes, removedNodes: this.removedNodes }];this.addedNodes = [];this.removedNodes = [];return a;
    }return [];
  };
  function cb(a, b) {
    a.__shady = a.__shady || {};a.__shady.i || (a.__shady.i = new ab());a.__shady.i.m.add(b);var c = a.__shady.i;return { M: b, O: c, N: a, takeRecords: function takeRecords() {
        return c.takeRecords();
      } };
  }function db(a) {
    var b = a && a.O;b && (b.m.delete(a.M), b.m.size || (a.N.__shady.i = null));
  }
  function eb(a, b) {
    var c = b.getRootNode();return a.map(function (a) {
      var b = c === a.target.getRootNode();if (b && a.addedNodes) {
        if (b = Array.from(a.addedNodes).filter(function (a) {
          return c === a.getRootNode();
        }), b.length) return a = Object.create(a), Object.defineProperty(a, "addedNodes", { value: b, configurable: !0 }), a;
      } else if (b) return a;
    }).filter(function (a) {
      return a;
    });
  };var Y = "__eventWrappers" + Date.now(),
      fb = { blur: !0, focus: !0, focusin: !0, focusout: !0, click: !0, dblclick: !0, mousedown: !0, mouseenter: !0, mouseleave: !0, mousemove: !0, mouseout: !0, mouseover: !0, mouseup: !0, wheel: !0, beforeinput: !0, input: !0, keydown: !0, keyup: !0, compositionstart: !0, compositionupdate: !0, compositionend: !0, touchstart: !0, touchend: !0, touchmove: !0, touchcancel: !0, pointerover: !0, pointerenter: !0, pointerdown: !0, pointermove: !0, pointerup: !0, pointercancel: !0, pointerout: !0, pointerleave: !0, gotpointercapture: !0, lostpointercapture: !0,
    dragstart: !0, drag: !0, dragenter: !0, dragleave: !0, dragover: !0, drop: !0, dragend: !0, DOMActivate: !0, DOMFocusIn: !0, DOMFocusOut: !0, keypress: !0 };function gb(a, b) {
    var c = [],
        d = a;for (a = a === window ? window : a.getRootNode(); d;) {
      c.push(d), d = d.assignedSlot ? d.assignedSlot : d.nodeType === Node.DOCUMENT_FRAGMENT_NODE && d.host && (b || d !== a) ? d.host : d.parentNode;
    }c[c.length - 1] === document && c.push(window);return c;
  }
  function hb(a, b) {
    if (!u) return a;a = gb(a, !0);for (var c = 0, d, e, g, h; c < b.length; c++) {
      if (d = b[c], g = d === window ? window : d.getRootNode(), g !== e && (h = a.indexOf(g), e = g), !u(g) || -1 < h) return d;
    }
  }
  var ib = { get composed() {
      !1 !== this.isTrusted && void 0 === this.o && (this.o = fb[this.type]);return this.o || !1;
    }, composedPath: function composedPath() {
      this.B || (this.B = gb(this.__target, this.composed));return this.B;
    }, get target() {
      return hb(this.currentTarget, this.composedPath());
    }, get relatedTarget() {
      if (!this.C) return null;this.D || (this.D = gb(this.C, !0));return hb(this.currentTarget, this.D);
    }, stopPropagation: function stopPropagation() {
      Event.prototype.stopPropagation.call(this);this.s = !0;
    }, stopImmediatePropagation: function stopImmediatePropagation() {
      Event.prototype.stopImmediatePropagation.call(this);
      this.s = this.H = !0;
    } };function jb(a) {
    function b(b, d) {
      b = new a(b, d);b.o = d && !!d.composed;return b;
    }da(b, a);b.prototype = a.prototype;return b;
  }var kb = { focus: !0, blur: !0 };function lb(a, b, c) {
    if (c = b.__handlers && b.__handlers[a.type] && b.__handlers[a.type][c]) for (var d = 0, e; (e = c[d]) && a.target !== a.relatedTarget && (e.call(b, a), !a.H); d++) {}
  }
  function mb(a) {
    var b = a.composedPath();Object.defineProperty(a, "currentTarget", { get: function get() {
        return d;
      }, configurable: !0 });for (var c = b.length - 1; 0 <= c; c--) {
      var d = b[c];lb(a, d, "capture");if (a.s) return;
    }Object.defineProperty(a, "eventPhase", { get: function get() {
        return Event.AT_TARGET;
      } });var e;for (c = 0; c < b.length; c++) {
      d = b[c];var g = d.__shady && d.__shady.root;if (0 === c || g && g === e) if (lb(a, d, "bubble"), d !== window && (e = d.getRootNode()), a.s) break;
    }
  }
  function nb(a, b, c, d, e, g) {
    for (var h = 0; h < a.length; h++) {
      var f = a[h],
          k = f.type,
          l = f.capture,
          m = f.once,
          q = f.passive;if (b === f.node && c === k && d === l && e === m && g === q) return h;
    }return -1;
  }
  function ob(a, b, c) {
    if (b) {
      if ("object" === (typeof c === "undefined" ? "undefined" : _typeof(c))) {
        var d = !!c.capture;var e = !!c.once;var g = !!c.passive;
      } else d = !!c, g = e = !1;var h = c && c.u || this,
          f = b[Y];if (f) {
        if (-1 < nb(f, h, a, d, e, g)) return;
      } else b[Y] = [];f = function f(d) {
        e && this.removeEventListener(a, b, c);d.__target || pb(d);if (h !== this) {
          var f = Object.getOwnPropertyDescriptor(d, "currentTarget");Object.defineProperty(d, "currentTarget", { get: function get() {
              return h;
            }, configurable: !0 });
        }if (d.composed || -1 < d.composedPath().indexOf(h)) if (d.target === d.relatedTarget) d.eventPhase === Event.BUBBLING_PHASE && d.stopImmediatePropagation();else if (d.eventPhase === Event.CAPTURING_PHASE || d.bubbles || d.target === h) {
          var g = "object" === (typeof b === "undefined" ? "undefined" : _typeof(b)) && b.handleEvent ? b.handleEvent(d) : b.call(h, d);h !== this && (f ? (Object.defineProperty(d, "currentTarget", f), f = null) : delete d.currentTarget);return g;
        }
      };b[Y].push({ node: this, type: a, capture: d, once: e, passive: g, U: f });kb[a] ? (this.__handlers = this.__handlers || {}, this.__handlers[a] = this.__handlers[a] || { capture: [], bubble: [] }, this.__handlers[a][d ? "capture" : "bubble"].push(f)) : (this instanceof Window ? O.S : O.addEventListener).call(this, a, f, c);
    }
  }
  function qb(a, b, c) {
    if (b) {
      if ("object" === (typeof c === "undefined" ? "undefined" : _typeof(c))) {
        var d = !!c.capture;var e = !!c.once;var g = !!c.passive;
      } else d = !!c, g = e = !1;var h = c && c.u || this,
          f = void 0;var k = null;try {
        k = b[Y];
      } catch (l) {}k && (e = nb(k, h, a, d, e, g), -1 < e && (f = k.splice(e, 1)[0].U, k.length || (b[Y] = void 0)));(this instanceof Window ? O.T : O.removeEventListener).call(this, a, f || b, c);f && kb[a] && this.__handlers && this.__handlers[a] && (a = this.__handlers[a][d ? "capture" : "bubble"], f = a.indexOf(f), -1 < f && a.splice(f, 1));
    }
  }
  function rb() {
    for (var a in kb) {
      window.addEventListener(a, function (a) {
        a.__target || (pb(a), mb(a));
      }, !0);
    }
  }function pb(a) {
    a.__target = a.target;a.C = a.relatedTarget;if (p.h) {
      var b = Object.getPrototypeOf(a);if (!b.hasOwnProperty("__patchProto")) {
        var c = Object.create(b);c.V = b;x(c, ib);b.__patchProto = c;
      }a.__proto__ = b.__patchProto;
    } else x(a, ib);
  }var sb = jb(window.Event),
      tb = jb(window.CustomEvent),
      ub = jb(window.MouseEvent);function vb(a) {
    var b = a.getRootNode();u(b) && Va(b);return a.__shady && a.__shady.assignedSlot || null;
  }
  var wb = { addEventListener: ob.bind(window), removeEventListener: qb.bind(window) },
      xb = { addEventListener: ob, removeEventListener: qb, appendChild: function appendChild(a) {
      return P(this, a);
    }, insertBefore: function insertBefore(a, b) {
      return P(this, a, b);
    }, removeChild: function removeChild(a) {
      return Q(this, a);
    }, replaceChild: function replaceChild(a, b) {
      P(this, a, b);Q(this, b);return a;
    }, cloneNode: function cloneNode(a) {
      if ("template" == this.localName) var b = O.cloneNode.call(this, a);else if (b = O.cloneNode.call(this, !1), a) {
        a = this.childNodes;for (var c = 0, d; c < a.length; c++) {
          d = a[c].cloneNode(!0), b.appendChild(d);
        }
      }return b;
    }, getRootNode: function getRootNode() {
      return Oa(this);
    }, get isConnected() {
      var a = this.ownerDocument;if (a && a.contains && a.contains(this) || (a = a.documentElement) && a.contains && a.contains(this)) return !0;for (a = this; a && !(a instanceof Document);) {
        a = a.parentNode || (a instanceof X ? a.host : void 0);
      }return !!(a && a instanceof Document);
    }, dispatchEvent: function dispatchEvent(a) {
      W();return O.dispatchEvent.call(this, a);
    } },
      yb = { get assignedSlot() {
      return vb(this);
    } },
      zb = { querySelector: function querySelector(a) {
      return T(this, function (b) {
        return ca.call(b, a);
      }, function (a) {
        return !!a;
      })[0] || null;
    }, querySelectorAll: function querySelectorAll(a) {
      return T(this, function (b) {
        return ca.call(b, a);
      });
    } },
      Ab = { assignedNodes: function assignedNodes(a) {
      if ("slot" === this.localName) {
        var b = this.getRootNode();u(b) && Va(b);return this.__shady ? (a && a.flatten ? this.__shady.g : this.__shady.assignedNodes) || [] : [];
      }
    } },
      Bb = y({ setAttribute: function setAttribute(a, b) {
      Qa(this, a, b);
    }, removeAttribute: function removeAttribute(a) {
      O.removeAttribute.call(this, a);Ma(this, a);
    }, attachShadow: function attachShadow(a) {
      if (!this) throw "Must provide a host.";if (!a) throw "Not enough arguments.";
      return new X(Ua, this, a);
    }, get slot() {
      return this.getAttribute("slot");
    }, set slot(a) {
      Qa(this, "slot", a);
    }, get assignedSlot() {
      return vb(this);
    } }, zb, Ab);Object.defineProperties(Bb, qa);var Cb = y({ importNode: function importNode(a, b) {
      return Ra(a, b);
    }, getElementById: function getElementById(a) {
      return T(this, function (b) {
        return b.id == a;
      }, function (a) {
        return !!a;
      })[0] || null;
    } }, zb);Object.defineProperties(Cb, { _activeElement: K.activeElement });
  var Db = HTMLElement.prototype.blur,
      Eb = y({ blur: function blur() {
      var a = this.__shady && this.__shady.root;(a = a && a.activeElement) ? a.blur() : Db.call(this);
    } });function Z(a, b) {
    for (var c = Object.getOwnPropertyNames(b), d = 0; d < c.length; d++) {
      var e = c[d],
          g = Object.getOwnPropertyDescriptor(b, e);g.value ? a[e] = g.value : Object.defineProperty(a, e, g);
    }
  };if (p.G) {
    window.ShadyDOM = { inUse: p.G, patch: function patch(a) {
        return a;
      }, isShadyRoot: u, enqueue: Ta, flush: W, settings: p, filterMutations: eb, observeChildren: cb, unobserveChildren: db, nativeMethods: O, nativeTree: D };window.Event = sb;window.CustomEvent = tb;window.MouseEvent = ub;rb();var Fb = window.customElements && window.customElements.nativeHTMLElement || HTMLElement;Z(window.Node.prototype, xb);Z(window.Window.prototype, wb);Z(window.Text.prototype, yb);Z(window.DocumentFragment.prototype, zb);Z(window.Element.prototype, Bb);Z(window.Document.prototype, Cb);window.HTMLSlotElement && Z(window.HTMLSlotElement.prototype, Ab);Z(Fb.prototype, Eb);p.h && (M(window.Node.prototype), M(window.Text.prototype), M(window.DocumentFragment.prototype), M(window.Element.prototype), M(Fb.prototype), M(window.Document.prototype), window.HTMLSlotElement && M(window.HTMLSlotElement.prototype));window.ShadowRoot = X;
  };
}).call(undefined);

//# sourceMappingURL=shadydom.min.js.map

/***/ }),

/***/ "../node_modules/@webcomponents/template/template.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// minimal template polyfill
(function () {

  var needsTemplate = typeof HTMLTemplateElement === 'undefined';

  // NOTE: Patch document.importNode to work around IE11 bug that
  // casues children of a document fragment imported while
  // there is a mutation observer to not have a parentNode (!?!)
  // It's important that this is the first patch to `importNode` so that
  // dom produced for later patches is correct.
  if (/Trident/.test(navigator.userAgent)) {
    (function () {
      var Native_importNode = Document.prototype.importNode;
      Document.prototype.importNode = function () {
        var n = Native_importNode.apply(this, arguments);
        // Copy all children to a new document fragment since
        // this one may be broken
        if (n.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          var f = this.createDocumentFragment();
          f.appendChild(n);
          return f;
        } else {
          return n;
        }
      };
    })();
  }

  // NOTE: we rely on this cloneNode not causing element upgrade.
  // This means this polyfill must load before the CE polyfill and
  // this would need to be re-worked if a browser supports native CE
  // but not <template>.
  var Native_cloneNode = Node.prototype.cloneNode;
  var Native_createElement = Document.prototype.createElement;
  var Native_importNode = Document.prototype.importNode;

  // returns true if nested templates cannot be cloned (they cannot be on
  // some impl's like Safari 8 and Edge)
  // OR if cloning a document fragment does not result in a document fragment
  var needsCloning = function () {
    if (!needsTemplate) {
      var t = document.createElement('template');
      var t2 = document.createElement('template');
      t2.content.appendChild(document.createElement('div'));
      t.content.appendChild(t2);
      var clone = t.cloneNode(true);
      return clone.content.childNodes.length === 0 || clone.content.firstChild.content.childNodes.length === 0 || !(document.createDocumentFragment().cloneNode() instanceof DocumentFragment);
    }
  }();

  var TEMPLATE_TAG = 'template';
  var PolyfilledHTMLTemplateElement = function PolyfilledHTMLTemplateElement() {};

  if (needsTemplate) {
    var defineInnerHTML = function defineInnerHTML(obj) {
      Object.defineProperty(obj, 'innerHTML', {
        get: function get() {
          var o = '';
          for (var e = this.content.firstChild; e; e = e.nextSibling) {
            o += e.outerHTML || escapeData(e.data);
          }
          return o;
        },
        set: function set(text) {
          contentDoc.body.innerHTML = text;
          PolyfilledHTMLTemplateElement.bootstrap(contentDoc);
          while (this.content.firstChild) {
            this.content.removeChild(this.content.firstChild);
          }
          while (contentDoc.body.firstChild) {
            this.content.appendChild(contentDoc.body.firstChild);
          }
        },
        configurable: true
      });
    };

    var escapeReplace = function escapeReplace(c) {
      switch (c) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '\xA0':
          return '&nbsp;';
      }
    };

    var escapeData = function escapeData(s) {
      return s.replace(escapeDataRegExp, escapeReplace);
    };

    var contentDoc = document.implementation.createHTMLDocument('template');
    var canDecorate = true;

    var templateStyle = document.createElement('style');
    templateStyle.textContent = TEMPLATE_TAG + '{display:none;}';

    var head = document.head;
    head.insertBefore(templateStyle, head.firstElementChild);

    /**
      Provides a minimal shim for the <template> element.
    */
    PolyfilledHTMLTemplateElement.prototype = Object.create(HTMLElement.prototype);

    // if elements do not have `innerHTML` on instances, then
    // templates can be patched by swizzling their prototypes.
    var canProtoPatch = !document.createElement('div').hasOwnProperty('innerHTML');

    /**
      The `decorate` method moves element children to the template's `content`.
      NOTE: there is no support for dynamically adding elements to templates.
    */
    PolyfilledHTMLTemplateElement.decorate = function (template) {
      // if the template is decorated, return fast
      if (template.content) {
        return;
      }
      template.content = contentDoc.createDocumentFragment();
      var child;
      while (child = template.firstChild) {
        template.content.appendChild(child);
      }
      // NOTE: prefer prototype patching for performance and
      // because on some browsers (IE11), re-defining `innerHTML`
      // can result in intermittent errors.
      if (canProtoPatch) {
        template.__proto__ = PolyfilledHTMLTemplateElement.prototype;
      } else {
        template.cloneNode = function (deep) {
          return PolyfilledHTMLTemplateElement._cloneNode(this, deep);
        };
        // add innerHTML to template, if possible
        // Note: this throws on Safari 7
        if (canDecorate) {
          try {
            defineInnerHTML(template);
          } catch (err) {
            canDecorate = false;
          }
        }
      }
      // bootstrap recursively
      PolyfilledHTMLTemplateElement.bootstrap(template.content);
    };

    defineInnerHTML(PolyfilledHTMLTemplateElement.prototype);

    /**
      The `bootstrap` method is called automatically and "fixes" all
      <template> elements in the document referenced by the `doc` argument.
    */
    PolyfilledHTMLTemplateElement.bootstrap = function (doc) {
      var templates = doc.querySelectorAll(TEMPLATE_TAG);
      for (var i = 0, l = templates.length, t; i < l && (t = templates[i]); i++) {
        PolyfilledHTMLTemplateElement.decorate(t);
      }
    };

    // auto-bootstrapping for main document
    document.addEventListener('DOMContentLoaded', function () {
      PolyfilledHTMLTemplateElement.bootstrap(document);
    });

    // Patch document.createElement to ensure newly created templates have content
    Document.prototype.createElement = function () {
      'use strict';

      var el = Native_createElement.apply(this, arguments);
      if (el.localName === 'template') {
        PolyfilledHTMLTemplateElement.decorate(el);
      }
      return el;
    };

    var escapeDataRegExp = /[&\u00A0<>]/g;
  }

  // make cloning/importing work!
  if (needsTemplate || needsCloning) {

    PolyfilledHTMLTemplateElement._cloneNode = function (template, deep) {
      var clone = Native_cloneNode.call(template, false);
      // NOTE: decorate doesn't auto-fix children because they are already
      // decorated so they need special clone fixup.
      if (this.decorate) {
        this.decorate(clone);
      }
      if (deep) {
        // NOTE: use native clone node to make sure CE's wrapped
        // cloneNode does not cause elements to upgrade.
        clone.content.appendChild(Native_cloneNode.call(template.content, true));
        // now ensure nested templates are cloned correctly.
        this.fixClonedDom(clone.content, template.content);
      }
      return clone;
    };

    PolyfilledHTMLTemplateElement.prototype.cloneNode = function (deep) {
      return PolyfilledHTMLTemplateElement._cloneNode(this, deep);
    };

    // Given a source and cloned subtree, find <template>'s in the cloned
    // subtree and replace them with cloned <template>'s from source.
    // We must do this because only the source templates have proper .content.
    PolyfilledHTMLTemplateElement.fixClonedDom = function (clone, source) {
      // do nothing if cloned node is not an element
      if (!source.querySelectorAll) return;
      // these two lists should be coincident
      var s$ = source.querySelectorAll(TEMPLATE_TAG);
      var t$ = clone.querySelectorAll(TEMPLATE_TAG);
      for (var i = 0, l = t$.length, t, s; i < l; i++) {
        s = s$[i];
        t = t$[i];
        if (this.decorate) {
          this.decorate(s);
        }
        t.parentNode.replaceChild(s.cloneNode(true), t);
      }
    };

    // override all cloning to fix the cloned subtree to contain properly
    // cloned templates.
    Node.prototype.cloneNode = function (deep) {
      var dom;
      // workaround for Edge bug cloning documentFragments
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8619646/
      if (this instanceof DocumentFragment) {
        if (!deep) {
          return this.ownerDocument.createDocumentFragment();
        } else {
          dom = this.ownerDocument.importNode(this, true);
        }
      } else {
        dom = Native_cloneNode.call(this, deep);
      }
      // template.content is cloned iff `deep`.
      if (deep) {
        PolyfilledHTMLTemplateElement.fixClonedDom(dom, this);
      }
      return dom;
    };

    // NOTE: we are cloning instead of importing <template>'s.
    // However, the ownerDocument of the cloned template will be correct!
    // This is because the native import node creates the right document owned
    // subtree and `fixClonedDom` inserts cloned templates into this subtree,
    // thus updating the owner doc.
    Document.prototype.importNode = function (element, deep) {
      if (element.localName === TEMPLATE_TAG) {
        return PolyfilledHTMLTemplateElement._cloneNode(element, deep);
      } else {
        var dom = Native_importNode.call(this, element, deep);
        if (deep) {
          PolyfilledHTMLTemplateElement.fixClonedDom(dom, element);
        }
        return dom;
      }
    };

    if (needsCloning) {
      window.HTMLTemplateElement.prototype.cloneNode = function (deep) {
        return PolyfilledHTMLTemplateElement._cloneNode(this, deep);
      };
    }
  }

  if (needsTemplate) {
    window.HTMLTemplateElement = PolyfilledHTMLTemplateElement;
  }
})();

/***/ }),

/***/ "../node_modules/array.from/implementation.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ES = __webpack_require__("../node_modules/es-abstract/es6.js");
var supportsDescriptors = __webpack_require__("../node_modules/define-properties/index.js").supportsDescriptors;

/*! https://mths.be/array-from v0.2.0 by @mathias */
module.exports = function from(arrayLike) {
	var defineProperty = supportsDescriptors ? Object.defineProperty : function put(object, key, descriptor) {
		object[key] = descriptor.value;
	};
	var C = this;
	if (arrayLike === null || typeof arrayLike === 'undefined') {
		throw new TypeError('`Array.from` requires an array-like object, not `null` or `undefined`');
	}
	var items = ES.ToObject(arrayLike);

	var mapFn, T;
	if (typeof arguments[1] !== 'undefined') {
		mapFn = arguments[1];
		if (!ES.IsCallable(mapFn)) {
			throw new TypeError('When provided, the second argument to `Array.from` must be a function');
		}
		if (arguments.length > 2) {
			T = arguments[2];
		}
	}

	var len = ES.ToLength(items.length);
	var A = ES.IsCallable(C) ? ES.ToObject(new C(len)) : new Array(len);
	var k = 0;
	var kValue, mappedValue;
	while (k < len) {
		kValue = items[k];
		if (mapFn) {
			mappedValue = typeof T === 'undefined' ? mapFn(kValue, k) : ES.Call(mapFn, T, [kValue, k]);
		} else {
			mappedValue = kValue;
		}
		defineProperty(A, k, {
			'configurable': true,
			'enumerable': true,
			'value': mappedValue,
			'writable': true
		});
		k += 1;
	}
	A.length = len;
	return A;
};

/***/ }),

/***/ "../node_modules/array.from/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var define = __webpack_require__("../node_modules/define-properties/index.js");

var implementation = __webpack_require__("../node_modules/array.from/implementation.js");
var getPolyfill = __webpack_require__("../node_modules/array.from/polyfill.js");
var shim = __webpack_require__("../node_modules/array.from/shim.js");

// eslint-disable-next-line no-unused-vars
var boundFromShim = function from(array) {
	// eslint-disable-next-line no-invalid-this
	return implementation.apply(this || Array, arguments);
};

define(boundFromShim, {
	'getPolyfill': getPolyfill,
	'implementation': implementation,
	'shim': shim
});

module.exports = boundFromShim;

/***/ }),

/***/ "../node_modules/array.from/polyfill.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ES = __webpack_require__("../node_modules/es-abstract/es6.js");
var implementation = __webpack_require__("../node_modules/array.from/implementation.js");

var tryCall = function tryCall(fn) {
	try {
		fn();
		return true;
	} catch (e) {
		return false;
	}
};

module.exports = function getPolyfill() {
	var implemented = ES.IsCallable(Array.from) && tryCall(function () {
		Array.from({ 'length': -Infinity });
	}) && !tryCall(function () {
		Array.from([], undefined);
	});

	return implemented ? Array.from : implementation;
};

/***/ }),

/***/ "../node_modules/array.from/shim.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var define = __webpack_require__("../node_modules/define-properties/index.js");
var getPolyfill = __webpack_require__("../node_modules/array.from/polyfill.js");

module.exports = function shimArrayFrom() {
	var polyfill = getPolyfill();

	define(Array, { 'from': polyfill }, {
		'from': function from() {
			return Array.from !== polyfill;
		}
	});

	return polyfill;
};

/***/ }),

/***/ "../node_modules/define-properties/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var keys = __webpack_require__("../node_modules/object-keys/index.js");
var foreach = __webpack_require__("../node_modules/foreach/index.js");
var hasSymbols = typeof Symbol === 'function' && _typeof(Symbol()) === 'symbol';

var toStr = Object.prototype.toString;

var isFunction = function isFunction(fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function arePropertyDescriptorsSupported() {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
		/* eslint-disable no-unused-vars, no-restricted-syntax */
		for (var _ in obj) {
			return false;
		}
		/* eslint-enable no-unused-vars, no-restricted-syntax */
		return obj.x === obj;
	} catch (e) {
		/* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty = function defineProperty(object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function defineProperties(object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = props.concat(Object.getOwnPropertySymbols(map));
	}
	foreach(props, function (name) {
		defineProperty(object, name, map[name], predicates[name]);
	});
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;

/***/ }),

/***/ "../node_modules/es-abstract/es2015.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var has = __webpack_require__("../node_modules/has/src/index.js");

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && _typeof(Symbol.iterator) === 'symbol';

var $isNaN = __webpack_require__("../node_modules/es-abstract/helpers/isNaN.js");
var $isFinite = __webpack_require__("../node_modules/es-abstract/helpers/isFinite.js");
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

var assign = __webpack_require__("../node_modules/es-abstract/helpers/assign.js");
var sign = __webpack_require__("../node_modules/es-abstract/helpers/sign.js");
var mod = __webpack_require__("../node_modules/es-abstract/helpers/mod.js");
var isPrimitive = __webpack_require__("../node_modules/es-abstract/helpers/isPrimitive.js");
var toPrimitive = __webpack_require__("../node_modules/es-to-primitive/es6.js");
var parseInteger = parseInt;
var bind = __webpack_require__("../node_modules/function-bind/index.js");
var arraySlice = bind.call(Function.call, Array.prototype.slice);
var strSlice = bind.call(Function.call, String.prototype.slice);
var isBinary = bind.call(Function.call, RegExp.prototype.test, /^0b[01]+$/i);
var isOctal = bind.call(Function.call, RegExp.prototype.test, /^0o[0-7]+$/i);
var regexExec = bind.call(Function.call, RegExp.prototype.exec);
var nonWS = ['\x85', '\u200B', '\uFFFE'].join('');
var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
var hasNonWS = bind.call(Function.call, RegExp.prototype.test, nonWSregex);
var invalidHexLiteral = /^[-+]0x[0-9a-f]+$/i;
var isInvalidHexLiteral = bind.call(Function.call, RegExp.prototype.test, invalidHexLiteral);

// whitespace from: http://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = ['\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003', '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028', '\u2029\uFEFF'].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var replace = bind.call(Function.call, String.prototype.replace);
var trim = function trim(value) {
	return replace(value, trimRegex, '');
};

var ES5 = __webpack_require__("../node_modules/es-abstract/es5.js");

var hasRegExpMatcher = __webpack_require__("../node_modules/is-regex/index.js");

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
var ES6 = assign(assign({}, ES5), {

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-call-f-v-args
	Call: function Call(F, V) {
		var args = arguments.length > 2 ? arguments[2] : [];
		if (!this.IsCallable(F)) {
			throw new TypeError(F + ' is not a function');
		}
		return F.apply(V, args);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toprimitive
	ToPrimitive: toPrimitive,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toboolean
	// ToBoolean: ES5.ToBoolean,

	// http://www.ecma-international.org/ecma-262/6.0/#sec-tonumber
	ToNumber: function ToNumber(argument) {
		var value = isPrimitive(argument) ? argument : toPrimitive(argument, Number);
		if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a number');
		}
		if (typeof value === 'string') {
			if (isBinary(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 2));
			} else if (isOctal(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 8));
			} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
				return NaN;
			} else {
				var trimmed = trim(value);
				if (trimmed !== value) {
					return this.ToNumber(trimmed);
				}
			}
		}
		return Number(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tointeger
	// ToInteger: ES5.ToNumber,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint32
	// ToInt32: ES5.ToInt32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint32
	// ToUint32: ES5.ToUint32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint16
	ToInt16: function ToInt16(argument) {
		var int16bit = this.ToUint16(argument);
		return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint16
	// ToUint16: ES5.ToUint16,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint8
	ToInt8: function ToInt8(argument) {
		var int8bit = this.ToUint8(argument);
		return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8
	ToUint8: function ToUint8(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) {
			return 0;
		}
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x100);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8clamp
	ToUint8Clamp: function ToUint8Clamp(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number <= 0) {
			return 0;
		}
		if (number >= 0xFF) {
			return 0xFF;
		}
		var f = Math.floor(argument);
		if (f + 0.5 < number) {
			return f + 1;
		}
		if (number < f + 0.5) {
			return f;
		}
		if (f % 2 !== 0) {
			return f + 1;
		}
		return f;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring
	ToString: function ToString(argument) {
		if ((typeof argument === 'undefined' ? 'undefined' : _typeof(argument)) === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a string');
		}
		return String(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toobject
	ToObject: function ToObject(value) {
		this.RequireObjectCoercible(value);
		return Object(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
	ToPropertyKey: function ToPropertyKey(argument) {
		var key = this.ToPrimitive(argument, String);
		return (typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'symbol' ? key : this.ToString(key);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	ToLength: function ToLength(argument) {
		var len = this.ToInteger(argument);
		if (len <= 0) {
			return 0;
		} // includes converting -0 to +0
		if (len > MAX_SAFE_INTEGER) {
			return MAX_SAFE_INTEGER;
		}
		return len;
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring
	CanonicalNumericIndexString: function CanonicalNumericIndexString(argument) {
		if (toStr.call(argument) !== '[object String]') {
			throw new TypeError('must be a string');
		}
		if (argument === '-0') {
			return -0;
		}
		var n = this.ToNumber(argument);
		if (this.SameValue(this.ToString(n), argument)) {
			return n;
		}
		return void 0;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-requireobjectcoercible
	RequireObjectCoercible: ES5.CheckObjectCoercible,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
	IsArray: Array.isArray || function IsArray(argument) {
		return toStr.call(argument) === '[object Array]';
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iscallable
	// IsCallable: ES5.IsCallable,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
	IsConstructor: function IsConstructor(argument) {
		return typeof argument === 'function' && !!argument.prototype; // unfortunately there's no way to truly check this without try/catch `new argument`
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isextensible-o
	IsExtensible: function IsExtensible(obj) {
		if (!Object.preventExtensions) {
			return true;
		}
		if (isPrimitive(obj)) {
			return false;
		}
		return Object.isExtensible(obj);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isinteger
	IsInteger: function IsInteger(argument) {
		if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
			return false;
		}
		var abs = Math.abs(argument);
		return Math.floor(abs) === abs;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ispropertykey
	IsPropertyKey: function IsPropertyKey(argument) {
		return typeof argument === 'string' || (typeof argument === 'undefined' ? 'undefined' : _typeof(argument)) === 'symbol';
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-isregexp
	IsRegExp: function IsRegExp(argument) {
		if (!argument || (typeof argument === 'undefined' ? 'undefined' : _typeof(argument)) !== 'object') {
			return false;
		}
		if (hasSymbols) {
			var isRegExp = argument[Symbol.match];
			if (typeof isRegExp !== 'undefined') {
				return ES5.ToBoolean(isRegExp);
			}
		}
		return hasRegExpMatcher(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue
	// SameValue: ES5.SameValue,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
	SameValueZero: function SameValueZero(x, y) {
		return x === y || $isNaN(x) && $isNaN(y);
	},

	/**
  * 7.3.2 GetV (V, P)
  * 1. Assert: IsPropertyKey(P) is true.
  * 2. Let O be ToObject(V).
  * 3. ReturnIfAbrupt(O).
  * 4. Return O.[[Get]](P, V).
  */
	GetV: function GetV(V, P) {
		// 7.3.2.1
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}

		// 7.3.2.2-3
		var O = this.ToObject(V);

		// 7.3.2.4
		return O[P];
	},

	/**
  * 7.3.9 - http://www.ecma-international.org/ecma-262/6.0/#sec-getmethod
  * 1. Assert: IsPropertyKey(P) is true.
  * 2. Let func be GetV(O, P).
  * 3. ReturnIfAbrupt(func).
  * 4. If func is either undefined or null, return undefined.
  * 5. If IsCallable(func) is false, throw a TypeError exception.
  * 6. Return func.
  */
	GetMethod: function GetMethod(O, P) {
		// 7.3.9.1
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}

		// 7.3.9.2
		var func = this.GetV(O, P);

		// 7.3.9.4
		if (func == null) {
			return undefined;
		}

		// 7.3.9.5
		if (!this.IsCallable(func)) {
			throw new TypeError(P + 'is not a function');
		}

		// 7.3.9.6
		return func;
	},

	/**
  * 7.3.1 Get (O, P) - http://www.ecma-international.org/ecma-262/6.0/#sec-get-o-p
  * 1. Assert: Type(O) is Object.
  * 2. Assert: IsPropertyKey(P) is true.
  * 3. Return O.[[Get]](P, O).
  */
	Get: function Get(O, P) {
		// 7.3.1.1
		if (this.Type(O) !== 'Object') {
			throw new TypeError('Assertion failed: Type(O) is not Object');
		}
		// 7.3.1.2
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}
		// 7.3.1.3
		return O[P];
	},

	Type: function Type(x) {
		if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'symbol') {
			return 'Symbol';
		}
		return ES5.Type(x);
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-speciesconstructor
	SpeciesConstructor: function SpeciesConstructor(O, defaultConstructor) {
		if (this.Type(O) !== 'Object') {
			throw new TypeError('Assertion failed: Type(O) is not Object');
		}
		var C = O.constructor;
		if (typeof C === 'undefined') {
			return defaultConstructor;
		}
		if (this.Type(C) !== 'Object') {
			throw new TypeError('O.constructor is not an Object');
		}
		var S = hasSymbols && Symbol.species ? C[Symbol.species] : undefined;
		if (S == null) {
			return defaultConstructor;
		}
		if (this.IsConstructor(S)) {
			return S;
		}
		throw new TypeError('no constructor found');
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-completepropertydescriptor
	CompletePropertyDescriptor: function CompletePropertyDescriptor(Desc) {
		if (!this.IsPropertyDescriptor(Desc)) {
			throw new TypeError('Desc must be a Property Descriptor');
		}

		if (this.IsGenericDescriptor(Desc) || this.IsDataDescriptor(Desc)) {
			if (!has(Desc, '[[Value]]')) {
				Desc['[[Value]]'] = void 0;
			}
			if (!has(Desc, '[[Writable]]')) {
				Desc['[[Writable]]'] = false;
			}
		} else {
			if (!has(Desc, '[[Get]]')) {
				Desc['[[Get]]'] = void 0;
			}
			if (!has(Desc, '[[Set]]')) {
				Desc['[[Set]]'] = void 0;
			}
		}
		if (!has(Desc, '[[Enumerable]]')) {
			Desc['[[Enumerable]]'] = false;
		}
		if (!has(Desc, '[[Configurable]]')) {
			Desc['[[Configurable]]'] = false;
		}
		return Desc;
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-set-o-p-v-throw
	Set: function Set(O, P, V, Throw) {
		if (this.Type(O) !== 'Object') {
			throw new TypeError('O must be an Object');
		}
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('P must be a Property Key');
		}
		if (this.Type(Throw) !== 'Boolean') {
			throw new TypeError('Throw must be a Boolean');
		}
		if (Throw) {
			O[P] = V;
			return true;
		} else {
			try {
				O[P] = V;
			} catch (e) {
				return false;
			}
		}
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-hasownproperty
	HasOwnProperty: function HasOwnProperty(O, P) {
		if (this.Type(O) !== 'Object') {
			throw new TypeError('O must be an Object');
		}
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('P must be a Property Key');
		}
		return has(O, P);
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-hasproperty
	HasProperty: function HasProperty(O, P) {
		if (this.Type(O) !== 'Object') {
			throw new TypeError('O must be an Object');
		}
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('P must be a Property Key');
		}
		return P in O;
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable
	IsConcatSpreadable: function IsConcatSpreadable(O) {
		if (this.Type(O) !== 'Object') {
			return false;
		}
		if (hasSymbols && _typeof(Symbol.isConcatSpreadable) === 'symbol') {
			var spreadable = this.Get(O, Symbol.isConcatSpreadable);
			if (typeof spreadable !== 'undefined') {
				return this.ToBoolean(spreadable);
			}
		}
		return this.IsArray(O);
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-invoke
	Invoke: function Invoke(O, P) {
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('P must be a Property Key');
		}
		var argumentsList = arraySlice(arguments, 2);
		var func = this.GetV(O, P);
		return this.Call(func, O, argumentsList);
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-createiterresultobject
	CreateIterResultObject: function CreateIterResultObject(value, done) {
		if (this.Type(done) !== 'Boolean') {
			throw new TypeError('Assertion failed: Type(done) is not Boolean');
		}
		return {
			value: value,
			done: done
		};
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-regexpexec
	RegExpExec: function RegExpExec(R, S) {
		if (this.Type(R) !== 'Object') {
			throw new TypeError('R must be an Object');
		}
		if (this.Type(S) !== 'String') {
			throw new TypeError('S must be a String');
		}
		var exec = this.Get(R, 'exec');
		if (this.IsCallable(exec)) {
			var result = this.Call(exec, R, [S]);
			if (result === null || this.Type(result) === 'Object') {
				return result;
			}
			throw new TypeError('"exec" method must return `null` or an Object');
		}
		return regexExec(R, S);
	}
});

delete ES6.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible

module.exports = ES6;

/***/ }),

/***/ "../node_modules/es-abstract/es5.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var $isNaN = __webpack_require__("../node_modules/es-abstract/helpers/isNaN.js");
var $isFinite = __webpack_require__("../node_modules/es-abstract/helpers/isFinite.js");

var sign = __webpack_require__("../node_modules/es-abstract/helpers/sign.js");
var mod = __webpack_require__("../node_modules/es-abstract/helpers/mod.js");

var IsCallable = __webpack_require__("../node_modules/is-callable/index.js");
var toPrimitive = __webpack_require__("../node_modules/es-to-primitive/es5.js");

var has = __webpack_require__("../node_modules/has/src/index.js");

// https://es5.github.io/#x9
var ES5 = {
	ToPrimitive: toPrimitive,

	ToBoolean: function ToBoolean(value) {
		return !!value;
	},
	ToNumber: function ToNumber(value) {
		return Number(value);
	},
	ToInteger: function ToInteger(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number)) {
			return 0;
		}
		if (number === 0 || !$isFinite(number)) {
			return number;
		}
		return sign(number) * Math.floor(Math.abs(number));
	},
	ToInt32: function ToInt32(x) {
		return this.ToNumber(x) >> 0;
	},
	ToUint32: function ToUint32(x) {
		return this.ToNumber(x) >>> 0;
	},
	ToUint16: function ToUint16(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) {
			return 0;
		}
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x10000);
	},
	ToString: function ToString(value) {
		return String(value);
	},
	ToObject: function ToObject(value) {
		this.CheckObjectCoercible(value);
		return Object(value);
	},
	CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
		/* jshint eqnull:true */
		if (value == null) {
			throw new TypeError(optMessage || 'Cannot call method on ' + value);
		}
		return value;
	},
	IsCallable: IsCallable,
	SameValue: function SameValue(x, y) {
		if (x === y) {
			// 0 === -0, but they are not identical.
			if (x === 0) {
				return 1 / x === 1 / y;
			}
			return true;
		}
		return $isNaN(x) && $isNaN(y);
	},

	// http://www.ecma-international.org/ecma-262/5.1/#sec-8
	Type: function Type(x) {
		if (x === null) {
			return 'Null';
		}
		if (typeof x === 'undefined') {
			return 'Undefined';
		}
		if (typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object') {
			return 'Object';
		}
		if (typeof x === 'number') {
			return 'Number';
		}
		if (typeof x === 'boolean') {
			return 'Boolean';
		}
		if (typeof x === 'string') {
			return 'String';
		}
	},

	// http://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type
	IsPropertyDescriptor: function IsPropertyDescriptor(Desc) {
		if (this.Type(Desc) !== 'Object') {
			return false;
		}
		var allowed = {
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Get]]': true,
			'[[Set]]': true,
			'[[Value]]': true,
			'[[Writable]]': true
		};
		// jscs:disable
		for (var key in Desc) {
			// eslint-disable-line
			if (has(Desc, key) && !allowed[key]) {
				return false;
			}
		}
		// jscs:enable
		var isData = has(Desc, '[[Value]]');
		var IsAccessor = has(Desc, '[[Get]]') || has(Desc, '[[Set]]');
		if (isData && IsAccessor) {
			throw new TypeError('Property Descriptors may not be both accessor and data descriptors');
		}
		return true;
	},

	// http://ecma-international.org/ecma-262/5.1/#sec-8.10.1
	IsAccessorDescriptor: function IsAccessorDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return false;
		}

		if (!this.IsPropertyDescriptor(Desc)) {
			throw new TypeError('Desc must be a Property Descriptor');
		}

		if (!has(Desc, '[[Get]]') && !has(Desc, '[[Set]]')) {
			return false;
		}

		return true;
	},

	// http://ecma-international.org/ecma-262/5.1/#sec-8.10.2
	IsDataDescriptor: function IsDataDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return false;
		}

		if (!this.IsPropertyDescriptor(Desc)) {
			throw new TypeError('Desc must be a Property Descriptor');
		}

		if (!has(Desc, '[[Value]]') && !has(Desc, '[[Writable]]')) {
			return false;
		}

		return true;
	},

	// http://ecma-international.org/ecma-262/5.1/#sec-8.10.3
	IsGenericDescriptor: function IsGenericDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return false;
		}

		if (!this.IsPropertyDescriptor(Desc)) {
			throw new TypeError('Desc must be a Property Descriptor');
		}

		if (!this.IsAccessorDescriptor(Desc) && !this.IsDataDescriptor(Desc)) {
			return true;
		}

		return false;
	},

	// http://ecma-international.org/ecma-262/5.1/#sec-8.10.4
	FromPropertyDescriptor: function FromPropertyDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return Desc;
		}

		if (!this.IsPropertyDescriptor(Desc)) {
			throw new TypeError('Desc must be a Property Descriptor');
		}

		if (this.IsDataDescriptor(Desc)) {
			return {
				value: Desc['[[Value]]'],
				writable: !!Desc['[[Writable]]'],
				enumerable: !!Desc['[[Enumerable]]'],
				configurable: !!Desc['[[Configurable]]']
			};
		} else if (this.IsAccessorDescriptor(Desc)) {
			return {
				get: Desc['[[Get]]'],
				set: Desc['[[Set]]'],
				enumerable: !!Desc['[[Enumerable]]'],
				configurable: !!Desc['[[Configurable]]']
			};
		} else {
			throw new TypeError('FromPropertyDescriptor must be called with a fully populated Property Descriptor');
		}
	},

	// http://ecma-international.org/ecma-262/5.1/#sec-8.10.5
	ToPropertyDescriptor: function ToPropertyDescriptor(Obj) {
		if (this.Type(Obj) !== 'Object') {
			throw new TypeError('ToPropertyDescriptor requires an object');
		}

		var desc = {};
		if (has(Obj, 'enumerable')) {
			desc['[[Enumerable]]'] = this.ToBoolean(Obj.enumerable);
		}
		if (has(Obj, 'configurable')) {
			desc['[[Configurable]]'] = this.ToBoolean(Obj.configurable);
		}
		if (has(Obj, 'value')) {
			desc['[[Value]]'] = Obj.value;
		}
		if (has(Obj, 'writable')) {
			desc['[[Writable]]'] = this.ToBoolean(Obj.writable);
		}
		if (has(Obj, 'get')) {
			var getter = Obj.get;
			if (typeof getter !== 'undefined' && !this.IsCallable(getter)) {
				throw new TypeError('getter must be a function');
			}
			desc['[[Get]]'] = getter;
		}
		if (has(Obj, 'set')) {
			var setter = Obj.set;
			if (typeof setter !== 'undefined' && !this.IsCallable(setter)) {
				throw new TypeError('setter must be a function');
			}
			desc['[[Set]]'] = setter;
		}

		if ((has(desc, '[[Get]]') || has(desc, '[[Set]]')) && (has(desc, '[[Value]]') || has(desc, '[[Writable]]'))) {
			throw new TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
		}
		return desc;
	}
};

module.exports = ES5;

/***/ }),

/***/ "../node_modules/es-abstract/es6.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__("../node_modules/es-abstract/es2015.js");

/***/ }),

/***/ "../node_modules/es-abstract/helpers/assign.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;
module.exports = function assign(target, source) {
	if (Object.assign) {
		return Object.assign(target, source);
	}
	for (var key in source) {
		if (has.call(source, key)) {
			target[key] = source[key];
		}
	}
	return target;
};

/***/ }),

/***/ "../node_modules/es-abstract/helpers/isFinite.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $isNaN = Number.isNaN || function (a) {
  return a !== a;
};

module.exports = Number.isFinite || function (x) {
  return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity;
};

/***/ }),

/***/ "../node_modules/es-abstract/helpers/isNaN.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = Number.isNaN || function isNaN(a) {
	return a !== a;
};

/***/ }),

/***/ "../node_modules/es-abstract/helpers/isPrimitive.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function isPrimitive(value) {
	return value === null || typeof value !== 'function' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object';
};

/***/ }),

/***/ "../node_modules/es-abstract/helpers/mod.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function mod(number, modulo) {
	var remain = number % modulo;
	return Math.floor(remain >= 0 ? remain : remain + modulo);
};

/***/ }),

/***/ "../node_modules/es-abstract/helpers/sign.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function sign(number) {
	return number >= 0 ? 1 : -1;
};

/***/ }),

/***/ "../node_modules/es-to-primitive/es5.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;

var isPrimitive = __webpack_require__("../node_modules/es-to-primitive/helpers/isPrimitive.js");

var isCallable = __webpack_require__("../node_modules/is-callable/index.js");

// https://es5.github.io/#x8.12
var ES5internalSlots = {
	'[[DefaultValue]]': function DefaultValue(O, hint) {
		var actualHint = hint || (toStr.call(O) === '[object Date]' ? String : Number);

		if (actualHint === String || actualHint === Number) {
			var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
			var value, i;
			for (i = 0; i < methods.length; ++i) {
				if (isCallable(O[methods[i]])) {
					value = O[methods[i]]();
					if (isPrimitive(value)) {
						return value;
					}
				}
			}
			throw new TypeError('No default value');
		}
		throw new TypeError('invalid [[DefaultValue]] hint supplied');
	}
};

// https://es5.github.io/#x9
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	return ES5internalSlots['[[DefaultValue]]'](input, PreferredType);
};

/***/ }),

/***/ "../node_modules/es-to-primitive/es6.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var hasSymbols = typeof Symbol === 'function' && _typeof(Symbol.iterator) === 'symbol';

var isPrimitive = __webpack_require__("../node_modules/es-to-primitive/helpers/isPrimitive.js");
var isCallable = __webpack_require__("../node_modules/is-callable/index.js");
var isDate = __webpack_require__("../node_modules/is-date-object/index.js");
var isSymbol = __webpack_require__("../node_modules/is-symbol/index.js");

var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
	if (typeof O === 'undefined' || O === null) {
		throw new TypeError('Cannot call method on ' + O);
	}
	if (typeof hint !== 'string' || hint !== 'number' && hint !== 'string') {
		throw new TypeError('hint must be "string" or "number"');
	}
	var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
	var method, result, i;
	for (i = 0; i < methodNames.length; ++i) {
		method = O[methodNames[i]];
		if (isCallable(method)) {
			result = method.call(O);
			if (isPrimitive(result)) {
				return result;
			}
		}
	}
	throw new TypeError('No default value');
};

var GetMethod = function GetMethod(O, P) {
	var func = O[P];
	if (func !== null && typeof func !== 'undefined') {
		if (!isCallable(func)) {
			throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
		}
		return func;
	}
};

// http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	var hint = 'default';
	if (arguments.length > 1) {
		if (PreferredType === String) {
			hint = 'string';
		} else if (PreferredType === Number) {
			hint = 'number';
		}
	}

	var exoticToPrim;
	if (hasSymbols) {
		if (Symbol.toPrimitive) {
			exoticToPrim = GetMethod(input, Symbol.toPrimitive);
		} else if (isSymbol(input)) {
			exoticToPrim = Symbol.prototype.valueOf;
		}
	}
	if (typeof exoticToPrim !== 'undefined') {
		var result = exoticToPrim.call(input, hint);
		if (isPrimitive(result)) {
			return result;
		}
		throw new TypeError('unable to convert exotic object to primitive');
	}
	if (hint === 'default' && (isDate(input) || isSymbol(input))) {
		hint = 'string';
	}
	return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
};

/***/ }),

/***/ "../node_modules/es-to-primitive/helpers/isPrimitive.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function isPrimitive(value) {
	return value === null || typeof value !== 'function' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object';
};

/***/ }),

/***/ "../node_modules/es6-promise/dist/es6-promise.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.1
 */

(function (global, factory) {
  ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : global.ES6Promise = factory();
})(undefined, function () {
  'use strict';

  function objectOrFunction(x) {
    var type = typeof x === 'undefined' ? 'undefined' : _typeof(x);
    return x !== null && (type === 'object' || type === 'function');
  }

  function isFunction(x) {
    return typeof x === 'function';
  }

  var _isArray = undefined;
  if (Array.isArray) {
    _isArray = Array.isArray;
  } else {
    _isArray = function _isArray(x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    };
  }

  var isArray = _isArray;

  var len = 0;
  var vertxNext = undefined;
  var customSchedulerFn = undefined;

  var asap = function asap(callback, arg) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;
    if (len === 2) {
      // If len is 2, that means that we need to schedule an async flush.
      // If additional callbacks are queued before the queue is flushed, they
      // will be processed by this flush that we are scheduling.
      if (customSchedulerFn) {
        customSchedulerFn(flush);
      } else {
        scheduleFlush();
      }
    }
  };

  function setScheduler(scheduleFn) {
    customSchedulerFn = scheduleFn;
  }

  function setAsap(asapFn) {
    asap = asapFn;
  }

  var browserWindow = typeof window !== 'undefined' ? window : undefined;
  var browserGlobal = browserWindow || {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

  // test for web worker but not in IE10
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

  // node
  function useNextTick() {
    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
    // see https://github.com/cujojs/when/issues/410 for details
    return function () {
      return process.nextTick(flush);
    };
  }

  // vertx
  function useVertxTimer() {
    if (typeof vertxNext !== 'undefined') {
      return function () {
        vertxNext(flush);
      };
    }

    return useSetTimeout();
  }

  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, { characterData: true });

    return function () {
      node.data = iterations = ++iterations % 2;
    };
  }

  // web worker
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function () {
      return channel.port2.postMessage(0);
    };
  }

  function useSetTimeout() {
    // Store setTimeout reference so es6-promise will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var globalSetTimeout = setTimeout;
    return function () {
      return globalSetTimeout(flush, 1);
    };
  }

  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < len; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];

      callback(arg);

      queue[i] = undefined;
      queue[i + 1] = undefined;
    }

    len = 0;
  }

  function attemptVertx() {
    try {
      var r = require;
      var vertx = __webpack_require__(0);
      vertxNext = vertx.runOnLoop || vertx.runOnContext;
      return useVertxTimer();
    } catch (e) {
      return useSetTimeout();
    }
  }

  var scheduleFlush = undefined;
  // Decide what async method to use to triggering processing of queued callbacks:
  if (isNode) {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else if (browserWindow === undefined && "function" === 'function') {
    scheduleFlush = attemptVertx();
  } else {
    scheduleFlush = useSetTimeout();
  }

  function then(onFulfillment, onRejection) {
    var _arguments = arguments;

    var parent = this;

    var child = new this.constructor(noop);

    if (child[PROMISE_ID] === undefined) {
      makePromise(child);
    }

    var _state = parent._state;

    if (_state) {
      (function () {
        var callback = _arguments[_state - 1];
        asap(function () {
          return invokeCallback(_state, child, callback, parent._result);
        });
      })();
    } else {
      subscribe(parent, child, onFulfillment, onRejection);
    }

    return child;
  }

  /**
    `Promise.resolve` returns a promise that will become resolved with the
    passed `value`. It is shorthand for the following:
  
    ```javascript
    let promise = new Promise(function(resolve, reject){
      resolve(1);
    });
  
    promise.then(function(value){
      // value === 1
    });
    ```
  
    Instead of writing the above, your code now simply becomes the following:
  
    ```javascript
    let promise = Promise.resolve(1);
  
    promise.then(function(value){
      // value === 1
    });
    ```
  
    @method resolve
    @static
    @param {Any} value value that the returned promise will be resolved with
    Useful for tooling.
    @return {Promise} a promise that will become fulfilled with the given
    `value`
  */
  function resolve$1(object) {
    /*jshint validthis:true */
    var Constructor = this;

    if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.constructor === Constructor) {
      return object;
    }

    var promise = new Constructor(noop);
    resolve(promise, object);
    return promise;
  }

  var PROMISE_ID = Math.random().toString(36).substring(16);

  function noop() {}

  var PENDING = void 0;
  var FULFILLED = 1;
  var REJECTED = 2;

  var GET_THEN_ERROR = new ErrorObject();

  function selfFulfillment() {
    return new TypeError("You cannot resolve a promise with itself");
  }

  function cannotReturnOwn() {
    return new TypeError('A promises callback cannot return that same promise.');
  }

  function getThen(promise) {
    try {
      return promise.then;
    } catch (error) {
      GET_THEN_ERROR.error = error;
      return GET_THEN_ERROR;
    }
  }

  function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
    try {
      then$$1.call(value, fulfillmentHandler, rejectionHandler);
    } catch (e) {
      return e;
    }
  }

  function handleForeignThenable(promise, thenable, then$$1) {
    asap(function (promise) {
      var sealed = false;
      var error = tryThen(then$$1, thenable, function (value) {
        if (sealed) {
          return;
        }
        sealed = true;
        if (thenable !== value) {
          resolve(promise, value);
        } else {
          fulfill(promise, value);
        }
      }, function (reason) {
        if (sealed) {
          return;
        }
        sealed = true;

        reject(promise, reason);
      }, 'Settle: ' + (promise._label || ' unknown promise'));

      if (!sealed && error) {
        sealed = true;
        reject(promise, error);
      }
    }, promise);
  }

  function handleOwnThenable(promise, thenable) {
    if (thenable._state === FULFILLED) {
      fulfill(promise, thenable._result);
    } else if (thenable._state === REJECTED) {
      reject(promise, thenable._result);
    } else {
      subscribe(thenable, undefined, function (value) {
        return resolve(promise, value);
      }, function (reason) {
        return reject(promise, reason);
      });
    }
  }

  function handleMaybeThenable(promise, maybeThenable, then$$1) {
    if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
      handleOwnThenable(promise, maybeThenable);
    } else {
      if (then$$1 === GET_THEN_ERROR) {
        reject(promise, GET_THEN_ERROR.error);
        GET_THEN_ERROR.error = null;
      } else if (then$$1 === undefined) {
        fulfill(promise, maybeThenable);
      } else if (isFunction(then$$1)) {
        handleForeignThenable(promise, maybeThenable, then$$1);
      } else {
        fulfill(promise, maybeThenable);
      }
    }
  }

  function resolve(promise, value) {
    if (promise === value) {
      reject(promise, selfFulfillment());
    } else if (objectOrFunction(value)) {
      handleMaybeThenable(promise, value, getThen(value));
    } else {
      fulfill(promise, value);
    }
  }

  function publishRejection(promise) {
    if (promise._onerror) {
      promise._onerror(promise._result);
    }

    publish(promise);
  }

  function fulfill(promise, value) {
    if (promise._state !== PENDING) {
      return;
    }

    promise._result = value;
    promise._state = FULFILLED;

    if (promise._subscribers.length !== 0) {
      asap(publish, promise);
    }
  }

  function reject(promise, reason) {
    if (promise._state !== PENDING) {
      return;
    }
    promise._state = REJECTED;
    promise._result = reason;

    asap(publishRejection, promise);
  }

  function subscribe(parent, child, onFulfillment, onRejection) {
    var _subscribers = parent._subscribers;
    var length = _subscribers.length;

    parent._onerror = null;

    _subscribers[length] = child;
    _subscribers[length + FULFILLED] = onFulfillment;
    _subscribers[length + REJECTED] = onRejection;

    if (length === 0 && parent._state) {
      asap(publish, parent);
    }
  }

  function publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;

    if (subscribers.length === 0) {
      return;
    }

    var child = undefined,
        callback = undefined,
        detail = promise._result;

    for (var i = 0; i < subscribers.length; i += 3) {
      child = subscribers[i];
      callback = subscribers[i + settled];

      if (child) {
        invokeCallback(settled, child, callback, detail);
      } else {
        callback(detail);
      }
    }

    promise._subscribers.length = 0;
  }

  function ErrorObject() {
    this.error = null;
  }

  var TRY_CATCH_ERROR = new ErrorObject();

  function tryCatch(callback, detail) {
    try {
      return callback(detail);
    } catch (e) {
      TRY_CATCH_ERROR.error = e;
      return TRY_CATCH_ERROR;
    }
  }

  function invokeCallback(settled, promise, callback, detail) {
    var hasCallback = isFunction(callback),
        value = undefined,
        error = undefined,
        succeeded = undefined,
        failed = undefined;

    if (hasCallback) {
      value = tryCatch(callback, detail);

      if (value === TRY_CATCH_ERROR) {
        failed = true;
        error = value.error;
        value.error = null;
      } else {
        succeeded = true;
      }

      if (promise === value) {
        reject(promise, cannotReturnOwn());
        return;
      }
    } else {
      value = detail;
      succeeded = true;
    }

    if (promise._state !== PENDING) {
      // noop
    } else if (hasCallback && succeeded) {
      resolve(promise, value);
    } else if (failed) {
      reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      reject(promise, value);
    }
  }

  function initializePromise(promise, resolver) {
    try {
      resolver(function resolvePromise(value) {
        resolve(promise, value);
      }, function rejectPromise(reason) {
        reject(promise, reason);
      });
    } catch (e) {
      reject(promise, e);
    }
  }

  var id = 0;
  function nextId() {
    return id++;
  }

  function makePromise(promise) {
    promise[PROMISE_ID] = id++;
    promise._state = undefined;
    promise._result = undefined;
    promise._subscribers = [];
  }

  function Enumerator$1(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  function validationError() {
    return new Error('Array Methods must be provided an Array');
  }

  Enumerator$1.prototype._enumerate = function (input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator$1.prototype._eachEntry = function (entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;

    if (resolve$$1 === resolve$1) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$2) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator$1.prototype._settledAt = function (state, i, value) {
    var promise = this.promise;

    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator$1.prototype._willSettleAt = function (promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  /**
    `Promise.all` accepts an array of promises, and returns a new promise which
    is fulfilled with an array of fulfillment values for the passed promises, or
    rejected with the reason of the first passed promise to be rejected. It casts all
    elements of the passed iterable to promises as it runs this algorithm.
  
    Example:
  
    ```javascript
    let promise1 = resolve(1);
    let promise2 = resolve(2);
    let promise3 = resolve(3);
    let promises = [ promise1, promise2, promise3 ];
  
    Promise.all(promises).then(function(array){
      // The array here would be [ 1, 2, 3 ];
    });
    ```
  
    If any of the `promises` given to `all` are rejected, the first promise
    that is rejected will be given as an argument to the returned promises's
    rejection handler. For example:
  
    Example:
  
    ```javascript
    let promise1 = resolve(1);
    let promise2 = reject(new Error("2"));
    let promise3 = reject(new Error("3"));
    let promises = [ promise1, promise2, promise3 ];
  
    Promise.all(promises).then(function(array){
      // Code here never runs because there are rejected promises!
    }, function(error) {
      // error.message === "2"
    });
    ```
  
    @method all
    @static
    @param {Array} entries array of promises
    @param {String} label optional string for labeling the promise.
    Useful for tooling.
    @return {Promise} promise that is fulfilled when all `promises` have been
    fulfilled, or rejected if any of them become rejected.
    @static
  */
  function all$1(entries) {
    return new Enumerator$1(this, entries).promise;
  }

  /**
    `Promise.race` returns a new promise which is settled in the same way as the
    first passed promise to settle.
  
    Example:
  
    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });
  
    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 2');
      }, 100);
    });
  
    Promise.race([promise1, promise2]).then(function(result){
      // result === 'promise 2' because it was resolved before promise1
      // was resolved.
    });
    ```
  
    `Promise.race` is deterministic in that only the state of the first
    settled promise matters. For example, even if other promises given to the
    `promises` array argument are resolved, but the first settled promise has
    become rejected before the other promises became fulfilled, the returned
    promise will become rejected:
  
    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });
  
    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        reject(new Error('promise 2'));
      }, 100);
    });
  
    Promise.race([promise1, promise2]).then(function(result){
      // Code here never runs
    }, function(reason){
      // reason.message === 'promise 2' because promise 2 became rejected before
      // promise 1 became fulfilled
    });
    ```
  
    An example real-world use case is implementing timeouts:
  
    ```javascript
    Promise.race([ajax('foo.json'), timeout(5000)])
    ```
  
    @method race
    @static
    @param {Array} promises array of promises to observe
    Useful for tooling.
    @return {Promise} a promise which settles in the same way as the first passed
    promise to settle.
  */
  function race$1(entries) {
    /*jshint validthis:true */
    var Constructor = this;

    if (!isArray(entries)) {
      return new Constructor(function (_, reject) {
        return reject(new TypeError('You must pass an array to race.'));
      });
    } else {
      return new Constructor(function (resolve, reject) {
        var length = entries.length;
        for (var i = 0; i < length; i++) {
          Constructor.resolve(entries[i]).then(resolve, reject);
        }
      });
    }
  }

  /**
    `Promise.reject` returns a promise rejected with the passed `reason`.
    It is shorthand for the following:
  
    ```javascript
    let promise = new Promise(function(resolve, reject){
      reject(new Error('WHOOPS'));
    });
  
    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```
  
    Instead of writing the above, your code now simply becomes the following:
  
    ```javascript
    let promise = Promise.reject(new Error('WHOOPS'));
  
    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```
  
    @method reject
    @static
    @param {Any} reason value that the returned promise will be rejected with.
    Useful for tooling.
    @return {Promise} a promise rejected with the given `reason`.
  */
  function reject$1(reason) {
    /*jshint validthis:true */
    var Constructor = this;
    var promise = new Constructor(noop);
    reject(promise, reason);
    return promise;
  }

  function needsResolver() {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  function needsNew() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  /**
    Promise objects represent the eventual result of an asynchronous operation. The
    primary way of interacting with a promise is through its `then` method, which
    registers callbacks to receive either a promise's eventual value or the reason
    why the promise cannot be fulfilled.
  
    Terminology
    -----------
  
    - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
    - `thenable` is an object or function that defines a `then` method.
    - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
    - `exception` is a value that is thrown using the throw statement.
    - `reason` is a value that indicates why a promise was rejected.
    - `settled` the final resting state of a promise, fulfilled or rejected.
  
    A promise can be in one of three states: pending, fulfilled, or rejected.
  
    Promises that are fulfilled have a fulfillment value and are in the fulfilled
    state.  Promises that are rejected have a rejection reason and are in the
    rejected state.  A fulfillment value is never a thenable.
  
    Promises can also be said to *resolve* a value.  If this value is also a
    promise, then the original promise's settled state will match the value's
    settled state.  So a promise that *resolves* a promise that rejects will
    itself reject, and a promise that *resolves* a promise that fulfills will
    itself fulfill.
  
  
    Basic Usage:
    ------------
  
    ```js
    let promise = new Promise(function(resolve, reject) {
      // on success
      resolve(value);
  
      // on failure
      reject(reason);
    });
  
    promise.then(function(value) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
  
    Advanced Usage:
    ---------------
  
    Promises shine when abstracting away asynchronous interactions such as
    `XMLHttpRequest`s.
  
    ```js
    function getJSON(url) {
      return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();
  
        xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();
  
        function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              resolve(this.response);
            } else {
              reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
            }
          }
        };
      });
    }
  
    getJSON('/posts.json').then(function(json) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
  
    Unlike callbacks, promises are great composable primitives.
  
    ```js
    Promise.all([
      getJSON('/posts'),
      getJSON('/comments')
    ]).then(function(values){
      values[0] // => postsJSON
      values[1] // => commentsJSON
  
      return values;
    });
    ```
  
    @class Promise
    @param {function} resolver
    Useful for tooling.
    @constructor
  */
  function Promise$2(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise$2 ? initializePromise(this, resolver) : needsNew();
    }
  }

  Promise$2.all = all$1;
  Promise$2.race = race$1;
  Promise$2.resolve = resolve$1;
  Promise$2.reject = reject$1;
  Promise$2._setScheduler = setScheduler;
  Promise$2._setAsap = setAsap;
  Promise$2._asap = asap;

  Promise$2.prototype = {
    constructor: Promise$2,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.
    
      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```
    
      Chaining
      --------
    
      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.
    
      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });
    
      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
    
      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```
    
      Assimilation
      ------------
    
      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.
    
      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```
    
      If the assimliated promise rejects, then the downstream promise will also reject.
    
      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```
    
      Simple Example
      --------------
    
      Synchronous Example
    
      ```javascript
      let result;
    
      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```
    
      Errback Example
    
      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```
    
      Promise Example;
    
      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```
    
      Advanced Example
      --------------
    
      Synchronous Example
    
      ```javascript
      let author, books;
    
      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```
    
      Errback Example
    
      ```js
    
      function foundBooks(books) {
    
      }
    
      function failure(reason) {
    
      }
    
      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```
    
      Promise Example;
    
      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```
    
      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
    then: then,

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.
    
      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }
    
      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }
    
      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```
    
      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
    'catch': function _catch(onRejection) {
      return this.then(null, onRejection);
    }
  };

  /*global self*/
  function polyfill$1() {
    var local = undefined;

    if (typeof global !== 'undefined') {
      local = global;
    } else if (typeof self !== 'undefined') {
      local = self;
    } else {
      try {
        local = Function('return this')();
      } catch (e) {
        throw new Error('polyfill failed because global object is unavailable in this environment');
      }
    }

    var P = local.Promise;

    if (P) {
      var promiseToString = null;
      try {
        promiseToString = Object.prototype.toString.call(P.resolve());
      } catch (e) {
        // silently ignored
      }

      if (promiseToString === '[object Promise]' && !P.cast) {
        return;
      }
    }

    local.Promise = Promise$2;
  }

  // Strange compat..
  Promise$2.polyfill = polyfill$1;
  Promise$2.Promise = Promise$2;

  return Promise$2;
});

//# sourceMappingURL=es6-promise.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js"), __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/foreach/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach(obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};

/***/ }),

/***/ "../node_modules/function-bind/implementation.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function binder() {
        if (this instanceof bound) {
            var result = target.apply(this, args.concat(slice.call(arguments)));
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(that, args.concat(slice.call(arguments)));
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

/***/ }),

/***/ "../node_modules/function-bind/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var implementation = __webpack_require__("../node_modules/function-bind/implementation.js");

module.exports = Function.prototype.bind || implementation;

/***/ }),

/***/ "../node_modules/has/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__("../node_modules/function-bind/index.js");

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

/***/ }),

/***/ "../node_modules/idom-util/src/anchor.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (href, key, staticProperties) {
  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  return _element2.default.apply(undefined, ['a', key, staticProperties, 'href', href].concat(args));
};

/***/ }),

/***/ "../node_modules/idom-util/src/button.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'button');

/***/ }),

/***/ "../node_modules/idom-util/src/div.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'div');

/***/ }),

/***/ "../node_modules/idom-util/src/element.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _incrementalDom = __webpack_require__("../node_modules/incremental-dom/dist/incremental-dom-cjs.js");

exports.default = function (tagName) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var renderContent = void 0;
  if (args.length > 0 && typeof args[args.length - 1] === 'function') renderContent = args.pop();

  _incrementalDom.elementOpen.apply(undefined, [tagName].concat(args));
  renderContent && renderContent();
  return (0, _incrementalDom.elementClose)(tagName);
};

/***/ }),

/***/ "../node_modules/idom-util/src/footer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'header');

/***/ }),

/***/ "../node_modules/idom-util/src/header.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'header');

/***/ }),

/***/ "../node_modules/idom-util/src/heading.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var internal = {};

internal.levels = [1, 2, 3, 4, 5, 6];

internal.renderHeading = function () {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;


  level = parseInt(level);

  if (!internal.levels.includes(level)) throw new Error('invalid heading level');

  return _element2.default.apply(undefined, ['h' + level].concat(args));
};

exports.default = internal.renderHeading;

/***/ }),

/***/ "../node_modules/idom-util/src/image.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _incrementalDom = __webpack_require__("../node_modules/incremental-dom/dist/incremental-dom-cjs.js");

exports.default = function (src) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var key = args.shift();
  var staticProperties = args.shift();

  return _incrementalDom.elementVoid.apply(undefined, ['img', key, staticProperties, 'src', src].concat(args));
};

/***/ }),

/***/ "../node_modules/idom-util/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderAnchor = exports.renderFooter = exports.renderHeader = exports.renderHeading = exports.renderPre = exports.renderInput = exports.renderLabel = exports.renderStrong = exports.renderStyle = exports.renderSection = exports.renderNav = exports.renderUl = exports.renderLi = exports.renderImage = exports.renderButton = exports.renderSpan = exports.renderDiv = exports.renderElement = undefined;

var _incrementalDom = __webpack_require__("../node_modules/incremental-dom/dist/incremental-dom-cjs.js");

Object.keys(_incrementalDom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _incrementalDom[key];
    }
  });
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

var _div = __webpack_require__("../node_modules/idom-util/src/div.js");

var _div2 = _interopRequireDefault(_div);

var _span = __webpack_require__("../node_modules/idom-util/src/span.js");

var _span2 = _interopRequireDefault(_span);

var _button = __webpack_require__("../node_modules/idom-util/src/button.js");

var _button2 = _interopRequireDefault(_button);

var _image = __webpack_require__("../node_modules/idom-util/src/image.js");

var _image2 = _interopRequireDefault(_image);

var _li = __webpack_require__("../node_modules/idom-util/src/li.js");

var _li2 = _interopRequireDefault(_li);

var _ul = __webpack_require__("../node_modules/idom-util/src/ul.js");

var _ul2 = _interopRequireDefault(_ul);

var _nav = __webpack_require__("../node_modules/idom-util/src/nav.js");

var _nav2 = _interopRequireDefault(_nav);

var _section = __webpack_require__("../node_modules/idom-util/src/section.js");

var _section2 = _interopRequireDefault(_section);

var _style = __webpack_require__("../node_modules/idom-util/src/style.js");

var _style2 = _interopRequireDefault(_style);

var _strong = __webpack_require__("../node_modules/idom-util/src/strong.js");

var _strong2 = _interopRequireDefault(_strong);

var _label = __webpack_require__("../node_modules/idom-util/src/label.js");

var _label2 = _interopRequireDefault(_label);

var _input = __webpack_require__("../node_modules/idom-util/src/input.js");

var _input2 = _interopRequireDefault(_input);

var _pre = __webpack_require__("../node_modules/idom-util/src/pre.js");

var _pre2 = _interopRequireDefault(_pre);

var _heading = __webpack_require__("../node_modules/idom-util/src/heading.js");

var _heading2 = _interopRequireDefault(_heading);

var _header = __webpack_require__("../node_modules/idom-util/src/header.js");

var _header2 = _interopRequireDefault(_header);

var _footer = __webpack_require__("../node_modules/idom-util/src/footer.js");

var _footer2 = _interopRequireDefault(_footer);

var _anchor = __webpack_require__("../node_modules/idom-util/src/anchor.js");

var _anchor2 = _interopRequireDefault(_anchor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.renderElement = _element2.default;
exports.renderDiv = _div2.default;
exports.renderSpan = _span2.default;
exports.renderButton = _button2.default;
exports.renderImage = _image2.default;
exports.renderLi = _li2.default;
exports.renderUl = _ul2.default;
exports.renderNav = _nav2.default;
exports.renderSection = _section2.default;
exports.renderStyle = _style2.default;
exports.renderStrong = _strong2.default;
exports.renderLabel = _label2.default;
exports.renderInput = _input2.default;
exports.renderPre = _pre2.default;
exports.renderHeading = _heading2.default;
exports.renderHeader = _header2.default;
exports.renderFooter = _footer2.default;
exports.renderAnchor = _anchor2.default;

/***/ }),

/***/ "../node_modules/idom-util/src/input.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'input');

/***/ }),

/***/ "../node_modules/idom-util/src/label.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'label');

/***/ }),

/***/ "../node_modules/idom-util/src/li.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'li');

/***/ }),

/***/ "../node_modules/idom-util/src/nav.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'nav');

/***/ }),

/***/ "../node_modules/idom-util/src/pre.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'pre');

/***/ }),

/***/ "../node_modules/idom-util/src/section.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'section');

/***/ }),

/***/ "../node_modules/idom-util/src/span.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'span');

/***/ }),

/***/ "../node_modules/idom-util/src/strong.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'strong');

/***/ }),

/***/ "../node_modules/idom-util/src/style.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

var _incrementalDom = __webpack_require__("../node_modules/incremental-dom/dist/incremental-dom-cjs.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (style) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return _element2.default.apply(undefined, ['style'].concat(args, [_incrementalDom.text.bind(null, style || '')]));
};

/***/ }),

/***/ "../node_modules/idom-util/src/ul.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'ul');

/***/ }),

/***/ "../node_modules/incremental-dom/dist/incremental-dom-cjs.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
/**
 * @license
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A cached reference to the hasOwnProperty function.
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * A constructor function that will create blank objects.
 * @constructor
 */
function Blank() {}

Blank.prototype = Object.create(null);

/**
 * Used to prevent property collisions between our "map" and its prototype.
 * @param {!Object<string, *>} map The map to check.
 * @param {string} property The property to check.
 * @return {boolean} Whether map has property.
 */
var has = function has(map, property) {
  return hasOwnProperty.call(map, property);
};

/**
 * Creates an map object without a prototype.
 * @return {!Object}
 */
var createMap = function createMap() {
  return new Blank();
};

/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 * @param {!string} nodeName
 * @param {?string=} key
 * @constructor
 */
function NodeData(nodeName, key) {
  /**
   * The attributes and their values.
   * @const {!Object<string, *>}
   */
  this.attrs = createMap();

  /**
   * An array of attribute name/value pairs, used for quickly diffing the
   * incomming attributes to see if the DOM node's attributes need to be
   * updated.
   * @const {Array<*>}
   */
  this.attrsArr = [];

  /**
   * The incoming attributes for this Node, before they are updated.
   * @const {!Object<string, *>}
   */
  this.newAttrs = createMap();

  /**
   * Whether or not the statics have been applied for the node yet.
   * {boolean}
   */
  this.staticsApplied = false;

  /**
   * The key used to identify this node, used to preserve DOM nodes when they
   * move within their parent.
   * @const
   */
  this.key = key;

  /**
   * Keeps track of children within this node by their key.
   * {!Object<string, !Element>}
   */
  this.keyMap = createMap();

  /**
   * Whether or not the keyMap is currently valid.
   * @type {boolean}
   */
  this.keyMapValid = true;

  /**
   * Whether or the associated node is, or contains, a focused Element.
   * @type {boolean}
   */
  this.focused = false;

  /**
   * The node name for this node.
   * @const {string}
   */
  this.nodeName = nodeName;

  /**
   * @type {?string}
   */
  this.text = null;
}

/**
 * Initializes a NodeData object for a Node.
 *
 * @param {Node} node The node to initialize data for.
 * @param {string} nodeName The node name of node.
 * @param {?string=} key The key that identifies the node.
 * @return {!NodeData} The newly initialized data object
 */
var initData = function initData(node, nodeName, key) {
  var data = new NodeData(nodeName, key);
  node['__incrementalDOMData'] = data;
  return data;
};

/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 *
 * @param {?Node} node The Node to retrieve the data for.
 * @return {!NodeData} The NodeData for this Node.
 */
var getData = function getData(node) {
  importNode(node);
  return node['__incrementalDOMData'];
};

/**
 * Imports node and its subtree, initializing caches.
 *
 * @param {?Node} node The Node to import.
 */
var importNode = function importNode(node) {
  if (node['__incrementalDOMData']) {
    return;
  }

  var isElement = node instanceof Element;
  var nodeName = isElement ? node.localName : node.nodeName;
  var key = isElement ? node.getAttribute('key') : null;
  var data = initData(node, nodeName, key);

  if (key) {
    getData(node.parentNode).keyMap[key] = node;
  }

  if (isElement) {
    var attributes = node.attributes;
    var attrs = data.attrs;
    var newAttrs = data.newAttrs;
    var attrsArr = data.attrsArr;

    for (var i = 0; i < attributes.length; i += 1) {
      var attr = attributes[i];
      var name = attr.name;
      var value = attr.value;

      attrs[name] = value;
      newAttrs[name] = undefined;
      attrsArr.push(name);
      attrsArr.push(value);
    }
  }

  for (var child = node.firstChild; child; child = child.nextSibling) {
    importNode(child);
  }
};

/**
 * Gets the namespace to create an element (of a given tag) in.
 * @param {string} tag The tag to get the namespace for.
 * @param {?Node} parent
 * @return {?string} The namespace to create the tag in.
 */
var getNamespaceForTag = function getNamespaceForTag(tag, parent) {
  if (tag === 'svg') {
    return 'http://www.w3.org/2000/svg';
  }

  if (getData(parent).nodeName === 'foreignObject') {
    return null;
  }

  return parent.namespaceURI;
};

/**
 * Creates an Element.
 * @param {Document} doc The document with which to create the Element.
 * @param {?Node} parent
 * @param {string} tag The tag for the Element.
 * @param {?string=} key A key to identify the Element.
 * @return {!Element}
 */
var createElement = function createElement(doc, parent, tag, key) {
  var namespace = getNamespaceForTag(tag, parent);
  var el = undefined;

  if (namespace) {
    el = doc.createElementNS(namespace, tag);
  } else {
    el = doc.createElement(tag);
  }

  initData(el, tag, key);

  return el;
};

/**
 * Creates a Text Node.
 * @param {Document} doc The document with which to create the Element.
 * @return {!Text}
 */
var createText = function createText(doc) {
  var node = doc.createTextNode('');
  initData(node, '#text', null);
  return node;
};

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @const */
var notifications = {
  /**
   * Called after patch has compleated with any Nodes that have been created
   * and added to the DOM.
   * @type {?function(Array<!Node>)}
   */
  nodesCreated: null,

  /**
   * Called after patch has compleated with any Nodes that have been removed
   * from the DOM.
   * Note it's an applications responsibility to handle any childNodes.
   * @type {?function(Array<!Node>)}
   */
  nodesDeleted: null
};

/**
 * Keeps track of the state of a patch.
 * @constructor
 */
function Context() {
  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.created = notifications.nodesCreated && [];

  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.deleted = notifications.nodesDeleted && [];
}

/**
 * @param {!Node} node
 */
Context.prototype.markCreated = function (node) {
  if (this.created) {
    this.created.push(node);
  }
};

/**
 * @param {!Node} node
 */
Context.prototype.markDeleted = function (node) {
  if (this.deleted) {
    this.deleted.push(node);
  }
};

/**
 * Notifies about nodes that were created during the patch opearation.
 */
Context.prototype.notifyChanges = function () {
  if (this.created && this.created.length > 0) {
    notifications.nodesCreated(this.created);
  }

  if (this.deleted && this.deleted.length > 0) {
    notifications.nodesDeleted(this.deleted);
  }
};

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
  * Keeps track whether or not we are in an attributes declaration (after
  * elementOpenStart, but before elementOpenEnd).
  * @type {boolean}
  */
var inAttributes = false;

/**
  * Keeps track whether or not we are in an element that should not have its
  * children cleared.
  * @type {boolean}
  */
var inSkip = false;

/**
 * Makes sure that there is a current patch context.
 * @param {string} functionName
 * @param {*} context
 */
var assertInPatch = function assertInPatch(functionName, context) {
  if (!context) {
    throw new Error('Cannot call ' + functionName + '() unless in patch.');
  }
};

/**
 * Makes sure that a patch closes every node that it opened.
 * @param {?Node} openElement
 * @param {!Node|!DocumentFragment} root
 */
var assertNoUnclosedTags = function assertNoUnclosedTags(openElement, root) {
  if (openElement === root) {
    return;
  }

  var currentElement = openElement;
  var openTags = [];
  while (currentElement && currentElement !== root) {
    openTags.push(currentElement.nodeName.toLowerCase());
    currentElement = currentElement.parentNode;
  }

  throw new Error('One or more tags were not closed:\n' + openTags.join('\n'));
};

/**
 * Makes sure that the caller is not where attributes are expected.
 * @param {string} functionName
 */
var assertNotInAttributes = function assertNotInAttributes(functionName) {
  if (inAttributes) {
    throw new Error(functionName + '() can not be called between ' + 'elementOpenStart() and elementOpenEnd().');
  }
};

/**
 * Makes sure that the caller is not inside an element that has declared skip.
 * @param {string} functionName
 */
var assertNotInSkip = function assertNotInSkip(functionName) {
  if (inSkip) {
    throw new Error(functionName + '() may not be called inside an element ' + 'that has called skip().');
  }
};

/**
 * Makes sure that the caller is where attributes are expected.
 * @param {string} functionName
 */
var assertInAttributes = function assertInAttributes(functionName) {
  if (!inAttributes) {
    throw new Error(functionName + '() can only be called after calling ' + 'elementOpenStart().');
  }
};

/**
 * Makes sure the patch closes virtual attributes call
 */
var assertVirtualAttributesClosed = function assertVirtualAttributesClosed() {
  if (inAttributes) {
    throw new Error('elementOpenEnd() must be called after calling ' + 'elementOpenStart().');
  }
};

/**
  * Makes sure that tags are correctly nested.
  * @param {string} nodeName
  * @param {string} tag
  */
var assertCloseMatchesOpenTag = function assertCloseMatchesOpenTag(nodeName, tag) {
  if (nodeName !== tag) {
    throw new Error('Received a call to close "' + tag + '" but "' + nodeName + '" was open.');
  }
};

/**
 * Makes sure that no children elements have been declared yet in the current
 * element.
 * @param {string} functionName
 * @param {?Node} previousNode
 */
var assertNoChildrenDeclaredYet = function assertNoChildrenDeclaredYet(functionName, previousNode) {
  if (previousNode !== null) {
    throw new Error(functionName + '() must come before any child ' + 'declarations inside the current element.');
  }
};

/**
 * Checks that a call to patchOuter actually patched the element.
 * @param {?Node} startNode The value for the currentNode when the patch
 *     started.
 * @param {?Node} currentNode The currentNode when the patch finished.
 * @param {?Node} expectedNextNode The Node that is expected to follow the
 *    currentNode after the patch;
 * @param {?Node} expectedPrevNode The Node that is expected to preceed the
 *    currentNode after the patch.
 */
var assertPatchElementNoExtras = function assertPatchElementNoExtras(startNode, currentNode, expectedNextNode, expectedPrevNode) {
  var wasUpdated = currentNode.nextSibling === expectedNextNode && currentNode.previousSibling === expectedPrevNode;
  var wasChanged = currentNode.nextSibling === startNode.nextSibling && currentNode.previousSibling === expectedPrevNode;
  var wasRemoved = currentNode === startNode;

  if (!wasUpdated && !wasChanged && !wasRemoved) {
    throw new Error('There must be exactly one top level call corresponding ' + 'to the patched element.');
  }
};

/**
 * Updates the state of being in an attribute declaration.
 * @param {boolean} value
 * @return {boolean} the previous value.
 */
var setInAttributes = function setInAttributes(value) {
  var previous = inAttributes;
  inAttributes = value;
  return previous;
};

/**
 * Updates the state of being in a skip element.
 * @param {boolean} value
 * @return {boolean} the previous value.
 */
var setInSkip = function setInSkip(value) {
  var previous = inSkip;
  inSkip = value;
  return previous;
};

/**
 * Copyright 2016 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @param {!Node} node
 * @return {boolean} True if the node the root of a document, false otherwise.
 */
var isDocumentRoot = function isDocumentRoot(node) {
  // For ShadowRoots, check if they are a DocumentFragment instead of if they
  // are a ShadowRoot so that this can work in 'use strict' if ShadowRoots are
  // not supported.
  return node instanceof Document || node instanceof DocumentFragment;
};

/**
 * @param {!Node} node The node to start at, inclusive.
 * @param {?Node} root The root ancestor to get until, exclusive.
 * @return {!Array<!Node>} The ancestry of DOM nodes.
 */
var getAncestry = function getAncestry(node, root) {
  var ancestry = [];
  var cur = node;

  while (cur !== root) {
    ancestry.push(cur);
    cur = cur.parentNode;
  }

  return ancestry;
};

/**
 * @param {!Node} node
 * @return {!Node} The root node of the DOM tree that contains node.
 */
var getRoot = function getRoot(node) {
  var cur = node;
  var prev = cur;

  while (cur) {
    prev = cur;
    cur = cur.parentNode;
  }

  return prev;
};

/**
 * @param {!Node} node The node to get the activeElement for.
 * @return {?Element} The activeElement in the Document or ShadowRoot
 *     corresponding to node, if present.
 */
var getActiveElement = function getActiveElement(node) {
  var root = getRoot(node);
  return isDocumentRoot(root) ? root.activeElement : null;
};

/**
 * Gets the path of nodes that contain the focused node in the same document as
 * a reference node, up until the root.
 * @param {!Node} node The reference node to get the activeElement for.
 * @param {?Node} root The root to get the focused path until.
 * @return {!Array<Node>}
 */
var getFocusedPath = function getFocusedPath(node, root) {
  var activeElement = getActiveElement(node);

  if (!activeElement || !node.contains(activeElement)) {
    return [];
  }

  return getAncestry(activeElement, root);
};

/**
 * Like insertBefore, but instead instead of moving the desired node, instead
 * moves all the other nodes after.
 * @param {?Node} parentNode
 * @param {!Node} node
 * @param {?Node} referenceNode
 */
var moveBefore = function moveBefore(parentNode, node, referenceNode) {
  var insertReferenceNode = node.nextSibling;
  var cur = referenceNode;

  while (cur !== node) {
    var next = cur.nextSibling;
    parentNode.insertBefore(cur, insertReferenceNode);
    cur = next;
  }
};

/** @type {?Context} */
var context = null;

/** @type {?Node} */
var currentNode = null;

/** @type {?Node} */
var currentParent = null;

/** @type {?Document} */
var doc = null;

/**
 * @param {!Array<Node>} focusPath The nodes to mark.
 * @param {boolean} focused Whether or not they are focused.
 */
var markFocused = function markFocused(focusPath, focused) {
  for (var i = 0; i < focusPath.length; i += 1) {
    getData(focusPath[i]).focused = focused;
  }
};

/**
 * Returns a patcher function that sets up and restores a patch context,
 * running the run function with the provided data.
 * @param {function((!Element|!DocumentFragment),!function(T),T=): ?Node} run
 * @return {function((!Element|!DocumentFragment),!function(T),T=): ?Node}
 * @template T
 */
var patchFactory = function patchFactory(run) {
  /**
   * TODO(moz): These annotations won't be necessary once we switch to Closure
   * Compiler's new type inference. Remove these once the switch is done.
   *
   * @param {(!Element|!DocumentFragment)} node
   * @param {!function(T)} fn
   * @param {T=} data
   * @return {?Node} node
   * @template T
   */
  var f = function f(node, fn, data) {
    var prevContext = context;
    var prevDoc = doc;
    var prevCurrentNode = currentNode;
    var prevCurrentParent = currentParent;
    var previousInAttributes = false;
    var previousInSkip = false;

    context = new Context();
    doc = node.ownerDocument;
    currentParent = node.parentNode;

    if (process.env.NODE_ENV !== 'production') {
      previousInAttributes = setInAttributes(false);
      previousInSkip = setInSkip(false);
    }

    var focusPath = getFocusedPath(node, currentParent);
    markFocused(focusPath, true);
    var retVal = run(node, fn, data);
    markFocused(focusPath, false);

    if (process.env.NODE_ENV !== 'production') {
      assertVirtualAttributesClosed();
      setInAttributes(previousInAttributes);
      setInSkip(previousInSkip);
    }

    context.notifyChanges();

    context = prevContext;
    doc = prevDoc;
    currentNode = prevCurrentNode;
    currentParent = prevCurrentParent;

    return retVal;
  };
  return f;
};

/**
 * Patches the document starting at node with the provided function. This
 * function may be called during an existing patch operation.
 * @param {!Element|!DocumentFragment} node The Element or Document
 *     to patch.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @return {!Node} The patched node.
 * @template T
 */
var patchInner = patchFactory(function (node, fn, data) {
  currentNode = node;

  enterNode();
  fn(data);
  exitNode();

  if (process.env.NODE_ENV !== 'production') {
    assertNoUnclosedTags(currentNode, node);
  }

  return node;
});

/**
 * Patches an Element with the the provided function. Exactly one top level
 * element call should be made corresponding to `node`.
 * @param {!Element} node The Element where the patch should start.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM. This should have at most one top level
 *     element call.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @return {?Node} The node if it was updated, its replacedment or null if it
 *     was removed.
 * @template T
 */
var patchOuter = patchFactory(function (node, fn, data) {
  var startNode = /** @type {!Element} */{ nextSibling: node };
  var expectedNextNode = null;
  var expectedPrevNode = null;

  if (process.env.NODE_ENV !== 'production') {
    expectedNextNode = node.nextSibling;
    expectedPrevNode = node.previousSibling;
  }

  currentNode = startNode;
  fn(data);

  if (process.env.NODE_ENV !== 'production') {
    assertPatchElementNoExtras(startNode, currentNode, expectedNextNode, expectedPrevNode);
  }

  if (node !== currentNode && node.parentNode) {
    removeChild(currentParent, node, getData(currentParent).keyMap);
  }

  return startNode === currentNode ? null : currentNode;
});

/**
 * Checks whether or not the current node matches the specified nodeName and
 * key.
 *
 * @param {!Node} matchNode A node to match the data to.
 * @param {?string} nodeName The nodeName for this node.
 * @param {?string=} key An optional key that identifies a node.
 * @return {boolean} True if the node matches, false otherwise.
 */
var matches = function matches(matchNode, nodeName, key) {
  var data = getData(matchNode);

  // Key check is done using double equals as we want to treat a null key the
  // same as undefined. This should be okay as the only values allowed are
  // strings, null and undefined so the == semantics are not too weird.
  return nodeName === data.nodeName && key == data.key;
};

/**
 * Aligns the virtual Element definition with the actual DOM, moving the
 * corresponding DOM node to the correct location or creating it if necessary.
 * @param {string} nodeName For an Element, this should be a valid tag string.
 *     For a Text, this should be #text.
 * @param {?string=} key The key used to identify this element.
 */
var alignWithDOM = function alignWithDOM(nodeName, key) {
  if (currentNode && matches(currentNode, nodeName, key)) {
    return;
  }

  var parentData = getData(currentParent);
  var currentNodeData = currentNode && getData(currentNode);
  var keyMap = parentData.keyMap;
  var node = undefined;

  // Check to see if the node has moved within the parent.
  if (key) {
    var keyNode = keyMap[key];
    if (keyNode) {
      if (matches(keyNode, nodeName, key)) {
        node = keyNode;
      } else if (keyNode === currentNode) {
        context.markDeleted(keyNode);
      } else {
        removeChild(currentParent, keyNode, keyMap);
      }
    }
  }

  // Create the node if it doesn't exist.
  if (!node) {
    if (nodeName === '#text') {
      node = createText(doc);
    } else {
      node = createElement(doc, currentParent, nodeName, key);
    }

    if (key) {
      keyMap[key] = node;
    }

    context.markCreated(node);
  }

  // Re-order the node into the right position, preserving focus if either
  // node or currentNode are focused by making sure that they are not detached
  // from the DOM.
  if (getData(node).focused) {
    // Move everything else before the node.
    moveBefore(currentParent, node, currentNode);
  } else if (currentNodeData && currentNodeData.key && !currentNodeData.focused) {
    // Remove the currentNode, which can always be added back since we hold a
    // reference through the keyMap. This prevents a large number of moves when
    // a keyed item is removed or moved backwards in the DOM.
    currentParent.replaceChild(node, currentNode);
    parentData.keyMapValid = false;
  } else {
    currentParent.insertBefore(node, currentNode);
  }

  currentNode = node;
};

/**
 * @param {?Node} node
 * @param {?Node} child
 * @param {?Object<string, !Element>} keyMap
 */
var removeChild = function removeChild(node, child, keyMap) {
  node.removeChild(child);
  context.markDeleted( /** @type {!Node}*/child);

  var key = getData(child).key;
  if (key) {
    delete keyMap[key];
  }
};

/**
 * Clears out any unvisited Nodes, as the corresponding virtual element
 * functions were never called for them.
 */
var clearUnvisitedDOM = function clearUnvisitedDOM() {
  var node = currentParent;
  var data = getData(node);
  var keyMap = data.keyMap;
  var keyMapValid = data.keyMapValid;
  var child = node.lastChild;
  var key = undefined;

  if (child === currentNode && keyMapValid) {
    return;
  }

  while (child !== currentNode) {
    removeChild(node, child, keyMap);
    child = node.lastChild;
  }

  // Clean the keyMap, removing any unusued keys.
  if (!keyMapValid) {
    for (key in keyMap) {
      child = keyMap[key];
      if (child.parentNode !== node) {
        context.markDeleted(child);
        delete keyMap[key];
      }
    }

    data.keyMapValid = true;
  }
};

/**
 * Changes to the first child of the current node.
 */
var enterNode = function enterNode() {
  currentParent = currentNode;
  currentNode = null;
};

/**
 * @return {?Node} The next Node to be patched.
 */
var getNextNode = function getNextNode() {
  if (currentNode) {
    return currentNode.nextSibling;
  } else {
    return currentParent.firstChild;
  }
};

/**
 * Changes to the next sibling of the current node.
 */
var nextNode = function nextNode() {
  currentNode = getNextNode();
};

/**
 * Changes to the parent of the current node, removing any unvisited children.
 */
var exitNode = function exitNode() {
  clearUnvisitedDOM();

  currentNode = currentParent;
  currentParent = currentParent.parentNode;
};

/**
 * Makes sure that the current node is an Element with a matching tagName and
 * key.
 *
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @return {!Element} The corresponding Element.
 */
var coreElementOpen = function coreElementOpen(tag, key) {
  nextNode();
  alignWithDOM(tag, key);
  enterNode();
  return (/** @type {!Element} */currentParent
  );
};

/**
 * Closes the currently open Element, removing any unvisited children if
 * necessary.
 *
 * @return {!Element} The corresponding Element.
 */
var coreElementClose = function coreElementClose() {
  if (process.env.NODE_ENV !== 'production') {
    setInSkip(false);
  }

  exitNode();
  return (/** @type {!Element} */currentNode
  );
};

/**
 * Makes sure the current node is a Text node and creates a Text node if it is
 * not.
 *
 * @return {!Text} The corresponding Text Node.
 */
var coreText = function coreText() {
  nextNode();
  alignWithDOM('#text', null);
  return (/** @type {!Text} */currentNode
  );
};

/**
 * Gets the current Element being patched.
 * @return {!Element}
 */
var currentElement = function currentElement() {
  if (process.env.NODE_ENV !== 'production') {
    assertInPatch('currentElement', context);
    assertNotInAttributes('currentElement');
  }
  return (/** @type {!Element} */currentParent
  );
};

/**
 * @return {Node} The Node that will be evaluated for the next instruction.
 */
var currentPointer = function currentPointer() {
  if (process.env.NODE_ENV !== 'production') {
    assertInPatch('currentPointer', context);
    assertNotInAttributes('currentPointer');
  }
  return getNextNode();
};

/**
 * Skips the children in a subtree, allowing an Element to be closed without
 * clearing out the children.
 */
var skip = function skip() {
  if (process.env.NODE_ENV !== 'production') {
    assertNoChildrenDeclaredYet('skip', currentNode);
    setInSkip(true);
  }
  currentNode = currentParent.lastChild;
};

/**
 * Skips the next Node to be patched, moving the pointer forward to the next
 * sibling of the current pointer.
 */
var skipNode = nextNode;

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @const */
var symbols = {
  default: '__default'
};

/**
 * @param {string} name
 * @return {string|undefined} The namespace to use for the attribute.
 */
var getNamespace = function getNamespace(name) {
  if (name.lastIndexOf('xml:', 0) === 0) {
    return 'http://www.w3.org/XML/1998/namespace';
  }

  if (name.lastIndexOf('xlink:', 0) === 0) {
    return 'http://www.w3.org/1999/xlink';
  }
};

/**
 * Applies an attribute or property to a given Element. If the value is null
 * or undefined, it is removed from the Element. Otherwise, the value is set
 * as an attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {?(boolean|number|string)=} value The attribute's value.
 */
var applyAttr = function applyAttr(el, name, value) {
  if (value == null) {
    el.removeAttribute(name);
  } else {
    var attrNS = getNamespace(name);
    if (attrNS) {
      el.setAttributeNS(attrNS, name, value);
    } else {
      el.setAttribute(name, value);
    }
  }
};

/**
 * Applies a property to a given Element.
 * @param {!Element} el
 * @param {string} name The property's name.
 * @param {*} value The property's value.
 */
var applyProp = function applyProp(el, name, value) {
  el[name] = value;
};

/**
 * Applies a value to a style declaration. Supports CSS custom properties by
 * setting properties containing a dash using CSSStyleDeclaration.setProperty.
 * @param {CSSStyleDeclaration} style
 * @param {!string} prop
 * @param {*} value
 */
var setStyleValue = function setStyleValue(style, prop, value) {
  if (prop.indexOf('-') >= 0) {
    style.setProperty(prop, /** @type {string} */value);
  } else {
    style[prop] = value;
  }
};

/**
 * Applies a style to an Element. No vendor prefix expansion is done for
 * property names/values.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} style The style to set. Either a string of css or an object
 *     containing property-value pairs.
 */
var applyStyle = function applyStyle(el, name, style) {
  if (typeof style === 'string') {
    el.style.cssText = style;
  } else {
    el.style.cssText = '';
    var elStyle = el.style;
    var obj = /** @type {!Object<string,string>} */style;

    for (var prop in obj) {
      if (has(obj, prop)) {
        setStyleValue(elStyle, prop, obj[prop]);
      }
    }
  }
};

/**
 * Updates a single attribute on an Element.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value. If the value is an object or
 *     function it is set on the Element, otherwise, it is set as an HTML
 *     attribute.
 */
var applyAttributeTyped = function applyAttributeTyped(el, name, value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

  if (type === 'object' || type === 'function') {
    applyProp(el, name, value);
  } else {
    applyAttr(el, name, /** @type {?(boolean|number|string)} */value);
  }
};

/**
 * Calls the appropriate attribute mutator for this attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value.
 */
var updateAttribute = function updateAttribute(el, name, value) {
  var data = getData(el);
  var attrs = data.attrs;

  if (attrs[name] === value) {
    return;
  }

  var mutator = attributes[name] || attributes[symbols.default];
  mutator(el, name, value);

  attrs[name] = value;
};

/**
 * A publicly mutable object to provide custom mutators for attributes.
 * @const {!Object<string, function(!Element, string, *)>}
 */
var attributes = createMap();

// Special generic mutator that's called for any attribute that does not
// have a specific mutator.
attributes[symbols.default] = applyAttributeTyped;

attributes['style'] = applyStyle;

/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 * @const
 */
var ATTRIBUTES_OFFSET = 3;

/**
 * Builds an array of arguments for use with elementOpenStart, attr and
 * elementOpenEnd.
 * @const {Array<*>}
 */
var argsBuilder = [];

/**
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args, Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
var elementOpen = function elementOpen(tag, key, statics, var_args) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('elementOpen');
    assertNotInSkip('elementOpen');
  }

  var node = coreElementOpen(tag, key);
  var data = getData(node);

  if (!data.staticsApplied) {
    if (statics) {
      for (var _i = 0; _i < statics.length; _i += 2) {
        var name = /** @type {string} */statics[_i];
        var value = statics[_i + 1];
        updateAttribute(node, name, value);
      }
    }
    // Down the road, we may want to keep track of the statics array to use it
    // as an additional signal about whether a node matches or not. For now,
    // just use a marker so that we do not reapply statics.
    data.staticsApplied = true;
  }

  /*
   * Checks to see if one or more attributes have changed for a given Element.
   * When no attributes have changed, this is much faster than checking each
   * individual argument. When attributes have changed, the overhead of this is
   * minimal.
   */
  var attrsArr = data.attrsArr;
  var newAttrs = data.newAttrs;
  var isNew = !attrsArr.length;
  var i = ATTRIBUTES_OFFSET;
  var j = 0;

  for (; i < arguments.length; i += 2, j += 2) {
    var _attr = arguments[i];
    if (isNew) {
      attrsArr[j] = _attr;
      newAttrs[_attr] = undefined;
    } else if (attrsArr[j] !== _attr) {
      break;
    }

    var value = arguments[i + 1];
    if (isNew || attrsArr[j + 1] !== value) {
      attrsArr[j + 1] = value;
      updateAttribute(node, _attr, value);
    }
  }

  if (i < arguments.length || j < attrsArr.length) {
    for (; i < arguments.length; i += 1, j += 1) {
      attrsArr[j] = arguments[i];
    }

    if (j < attrsArr.length) {
      attrsArr.length = j;
    }

    /*
     * Actually perform the attribute update.
     */
    for (i = 0; i < attrsArr.length; i += 2) {
      var name = /** @type {string} */attrsArr[i];
      var value = attrsArr[i + 1];
      newAttrs[name] = value;
    }

    for (var _attr2 in newAttrs) {
      updateAttribute(node, _attr2, newAttrs[_attr2]);
      newAttrs[_attr2] = undefined;
    }
  }

  return node;
};

/**
 * Declares a virtual Element at the current location in the document. This
 * corresponds to an opening tag and a elementClose tag is required. This is
 * like elementOpen, but the attributes are defined using the attr function
 * rather than being passed as arguments. Must be folllowed by 0 or more calls
 * to attr, then a call to elementOpenEnd.
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 */
var elementOpenStart = function elementOpenStart(tag, key, statics) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('elementOpenStart');
    setInAttributes(true);
  }

  argsBuilder[0] = tag;
  argsBuilder[1] = key;
  argsBuilder[2] = statics;
};

/***
 * Defines a virtual attribute at this point of the DOM. This is only valid
 * when called between elementOpenStart and elementOpenEnd.
 *
 * @param {string} name
 * @param {*} value
 */
var attr = function attr(name, value) {
  if (process.env.NODE_ENV !== 'production') {
    assertInAttributes('attr');
  }

  argsBuilder.push(name);
  argsBuilder.push(value);
};

/**
 * Closes an open tag started with elementOpenStart.
 * @return {!Element} The corresponding Element.
 */
var elementOpenEnd = function elementOpenEnd() {
  if (process.env.NODE_ENV !== 'production') {
    assertInAttributes('elementOpenEnd');
    setInAttributes(false);
  }

  var node = elementOpen.apply(null, argsBuilder);
  argsBuilder.length = 0;
  return node;
};

/**
 * Closes an open virtual Element.
 *
 * @param {string} tag The element's tag.
 * @return {!Element} The corresponding Element.
 */
var elementClose = function elementClose(tag) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('elementClose');
  }

  var node = coreElementClose();

  if (process.env.NODE_ENV !== 'production') {
    assertCloseMatchesOpenTag(getData(node).nodeName, tag);
  }

  return node;
};

/**
 * Declares a virtual Element at the current location in the document that has
 * no children.
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
var elementVoid = function elementVoid(tag, key, statics, var_args) {
  elementOpen.apply(null, arguments);
  return elementClose(tag);
};

/**
 * Declares a virtual Text at this point in the document.
 *
 * @param {string|number|boolean} value The value of the Text.
 * @param {...(function((string|number|boolean)):string)} var_args
 *     Functions to format the value which are called only when the value has
 *     changed.
 * @return {!Text} The corresponding text node.
 */
var text = function text(value, var_args) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('text');
    assertNotInSkip('text');
  }

  var node = coreText();
  var data = getData(node);

  if (data.text !== value) {
    data.text = /** @type {string} */value;

    var formatted = value;
    for (var i = 1; i < arguments.length; i += 1) {
      /*
       * Call the formatter function directly to prevent leaking arguments.
       * https://github.com/google/incremental-dom/pull/204#issuecomment-178223574
       */
      var fn = arguments[i];
      formatted = fn(formatted);
    }

    node.data = formatted;
  }

  return node;
};

exports.patch = patchInner;
exports.patchInner = patchInner;
exports.patchOuter = patchOuter;
exports.currentElement = currentElement;
exports.currentPointer = currentPointer;
exports.skip = skip;
exports.skipNode = skipNode;
exports.elementVoid = elementVoid;
exports.elementOpenStart = elementOpenStart;
exports.elementOpenEnd = elementOpenEnd;
exports.elementOpen = elementOpen;
exports.elementClose = elementClose;
exports.text = text;
exports.attr = attr;
exports.symbols = symbols;
exports.attributes = attributes;
exports.applyAttr = applyAttr;
exports.applyProp = applyProp;
exports.notifications = notifications;
exports.importNode = importNode;

//# sourceMappingURL=incremental-dom-cjs.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "../node_modules/is-callable/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var fnToStr = Function.prototype.toString;

var constructorRegex = /^\s*class /;
var isES6ClassFn = function isES6ClassFn(value) {
	try {
		var fnStr = fnToStr.call(value);
		var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
		var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
		var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
		return constructorRegex.test(spaceStripped);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionObject(value) {
	try {
		if (isES6ClassFn(value)) {
			return false;
		}
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && _typeof(Symbol.toStringTag) === 'symbol';

module.exports = function isCallable(value) {
	if (!value) {
		return false;
	}
	if (typeof value !== 'function' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
		return false;
	}
	if (hasToStringTag) {
		return tryFunctionObject(value);
	}
	if (isES6ClassFn(value)) {
		return false;
	}
	var strClass = toStr.call(value);
	return strClass === fnClass || strClass === genClass;
};

/***/ }),

/***/ "../node_modules/is-date-object/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateObject(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = typeof Symbol === 'function' && _typeof(Symbol.toStringTag) === 'symbol';

module.exports = function isDateObject(value) {
	if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' || value === null) {
		return false;
	}
	return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};

/***/ }),

/***/ "../node_modules/is-regex/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var has = __webpack_require__("../node_modules/has/src/index.js");
var regexExec = RegExp.prototype.exec;
var gOPD = Object.getOwnPropertyDescriptor;

var tryRegexExecCall = function tryRegexExec(value) {
	try {
		var lastIndex = value.lastIndex;
		value.lastIndex = 0;

		regexExec.call(value);
		return true;
	} catch (e) {
		return false;
	} finally {
		value.lastIndex = lastIndex;
	}
};
var toStr = Object.prototype.toString;
var regexClass = '[object RegExp]';
var hasToStringTag = typeof Symbol === 'function' && _typeof(Symbol.toStringTag) === 'symbol';

module.exports = function isRegex(value) {
	if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
		return false;
	}
	if (!hasToStringTag) {
		return toStr.call(value) === regexClass;
	}

	var descriptor = gOPD(value, 'lastIndex');
	var hasLastIndexDataProperty = descriptor && has(descriptor, 'value');
	if (!hasLastIndexDataProperty) {
		return false;
	}

	return tryRegexExecCall(value);
};

/***/ }),

/***/ "../node_modules/is-symbol/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && _typeof(Symbol()) === 'symbol';

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isSymbolObject(value) {
		if (_typeof(value.valueOf()) !== 'symbol') {
			return false;
		}
		return symStringRegex.test(symToStr.call(value));
	};
	module.exports = function isSymbol(value) {
		if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'symbol') {
			return true;
		}
		if (toStr.call(value) !== '[object Symbol]') {
			return false;
		}
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {
	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return false;
	};
}

/***/ }),

/***/ "../node_modules/kwak/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUnknownElement = exports.isElement = exports.isComponent = exports.isInteger = exports.isNumber = exports.isFunction = exports.isString = exports.isBoolean = exports.isEmpty = exports.isPlainObject = exports.isObject = exports.isOfType = exports.isArray = exports.isInstanceOf = exports.isNull = exports.isUndefined = exports.isTrue = exports.isEqualTo = exports.isDeeplyEqual = exports.assert = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = __webpack_require__("../node_modules/lodash.isequal/index.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = __webpack_require__("../node_modules/lodash.isplainobject/index.js");

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = exports.assert = function assert(condition, message) {

  if (condition) return condition;

  throw new Error(message);
};

var isDeeplyEqual = exports.isDeeplyEqual = _lodash2.default;
var isEqualTo = exports.isEqualTo = function isEqualTo(value, input) {
  return input === value;
};
var isTrue = exports.isTrue = function isTrue(input) {
  return isEqualTo(true, input);
};
var isUndefined = exports.isUndefined = function isUndefined(input) {
  return isEqualTo(void 0, input);
};
var isNull = exports.isNull = function isNull(input) {
  return isEqualTo(null, input);
};
var isInstanceOf = exports.isInstanceOf = function isInstanceOf(type, input) {
  return input instanceof type;
};
var isArray = exports.isArray = function isArray(input) {
  return isInstanceOf(Array, input);
};
var isOfType = exports.isOfType = function isOfType(type, input) {
  return isEqualTo(type, typeof input === 'undefined' ? 'undefined' : _typeof(input));
};
var isObject = exports.isObject = function isObject(input) {
  return isOfType('object', input);
};
var isPlainObject = exports.isPlainObject = _lodash4.default;
var isEmpty = exports.isEmpty = function isEmpty(input) {
  return input.length < 1;
};
var isBoolean = exports.isBoolean = function isBoolean(input) {
  return isOfType('boolean', input);
};
var isString = exports.isString = function isString(input) {

  return isOfType('string', input);
};
var isFunction = exports.isFunction = function isFunction(input) {
  return isOfType('function', input) && input;
};
var isNumber = exports.isNumber = function isNumber(input) {
  return isOfType('number', input);
};
var isInteger = exports.isInteger = function isInteger(input) {
  return Number.isInteger(input);
};
var isComponent = exports.isComponent = function isComponent(input) {
  return isObject(input) && input.isPwetComponent === true;
};
var isElement = exports.isElement = function isElement(input) {
  return isInstanceOf(HTMLElement, input);
};
var isUnknownElement = exports.isUnknownElement = function isUnknownElement(input) {
  return Object.prototype.toString.call(input) === '[object HTMLUnknownElement]';
};

/***/ }),

/***/ "../node_modules/lodash.camelcase/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match words composed of alphanumeric characters. */
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

/** Used to match Latin Unicode letters (excluding mathematical operators). */
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0',
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

/** Used to compose unicode capture groups. */
var rsApos = '[\'\u2019]',
    rsAstral = '[' + rsAstralRange + ']',
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
    rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptLowerContr = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
    rsOptUpperContr = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match apostrophes. */
var reApos = RegExp(rsApos, 'g');

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo, 'g');

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/** Used to match complex or compound words. */
var reUnicodeWord = RegExp([rsUpper + '?' + rsLower + '+' + rsOptLowerContr + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')', rsUpperMisc + '+' + rsOptUpperContr + '(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')', rsUpper + '?' + rsLowerMisc + '+' + rsOptLowerContr, rsUpper + '+' + rsOptUpperContr, rsDigits, rsEmoji].join('|'), 'g');

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

/** Used to detect strings that need a more robust regexp to match words. */
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

/** Used to map Latin Unicode letters to basic Latin letters. */
var deburredLetters = {
  // Latin-1 Supplement block.
  '\xc0': 'A', '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a', '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C', '\xe7': 'c',
  '\xd0': 'D', '\xf0': 'd',
  '\xc8': 'E', '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e', '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcc': 'I', '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xec': 'i', '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N', '\xf1': 'n',
  '\xd2': 'O', '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o', '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U', '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u', '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y', '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss',
  // Latin Extended-A block.
  '\u0100': 'A', '\u0102': 'A', '\u0104': 'A',
  '\u0101': 'a', '\u0103': 'a', '\u0105': 'a',
  '\u0106': 'C', '\u0108': 'C', '\u010A': 'C', '\u010C': 'C',
  '\u0107': 'c', '\u0109': 'c', '\u010B': 'c', '\u010D': 'c',
  '\u010E': 'D', '\u0110': 'D', '\u010F': 'd', '\u0111': 'd',
  '\u0112': 'E', '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011A': 'E',
  '\u0113': 'e', '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011B': 'e',
  '\u011C': 'G', '\u011E': 'G', '\u0120': 'G', '\u0122': 'G',
  '\u011D': 'g', '\u011F': 'g', '\u0121': 'g', '\u0123': 'g',
  '\u0124': 'H', '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
  '\u0128': 'I', '\u012A': 'I', '\u012C': 'I', '\u012E': 'I', '\u0130': 'I',
  '\u0129': 'i', '\u012B': 'i', '\u012D': 'i', '\u012F': 'i', '\u0131': 'i',
  '\u0134': 'J', '\u0135': 'j',
  '\u0136': 'K', '\u0137': 'k', '\u0138': 'k',
  '\u0139': 'L', '\u013B': 'L', '\u013D': 'L', '\u013F': 'L', '\u0141': 'L',
  '\u013A': 'l', '\u013C': 'l', '\u013E': 'l', '\u0140': 'l', '\u0142': 'l',
  '\u0143': 'N', '\u0145': 'N', '\u0147': 'N', '\u014A': 'N',
  '\u0144': 'n', '\u0146': 'n', '\u0148': 'n', '\u014B': 'n',
  '\u014C': 'O', '\u014E': 'O', '\u0150': 'O',
  '\u014D': 'o', '\u014F': 'o', '\u0151': 'o',
  '\u0154': 'R', '\u0156': 'R', '\u0158': 'R',
  '\u0155': 'r', '\u0157': 'r', '\u0159': 'r',
  '\u015A': 'S', '\u015C': 'S', '\u015E': 'S', '\u0160': 'S',
  '\u015B': 's', '\u015D': 's', '\u015F': 's', '\u0161': 's',
  '\u0162': 'T', '\u0164': 'T', '\u0166': 'T',
  '\u0163': 't', '\u0165': 't', '\u0167': 't',
  '\u0168': 'U', '\u016A': 'U', '\u016C': 'U', '\u016E': 'U', '\u0170': 'U', '\u0172': 'U',
  '\u0169': 'u', '\u016B': 'u', '\u016D': 'u', '\u016F': 'u', '\u0171': 'u', '\u0173': 'u',
  '\u0174': 'W', '\u0175': 'w',
  '\u0176': 'Y', '\u0177': 'y', '\u0178': 'Y',
  '\u0179': 'Z', '\u017B': 'Z', '\u017D': 'Z',
  '\u017A': 'z', '\u017C': 'z', '\u017E': 'z',
  '\u0132': 'IJ', '\u0133': 'ij',
  '\u0152': 'Oe', '\u0153': 'oe',
  '\u0149': "'n", '\u017F': 'ss'
};

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

/**
 * Splits an ASCII `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function asciiWords(string) {
  return string.match(reAsciiWord) || [];
}

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function (key) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
var deburrLetter = basePropertyOf(deburredLetters);

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */
function hasUnicodeWord(string) {
  return reHasUnicodeWord.test(string);
}

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
}

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function unicodeWords(string) {
  return string.match(reUnicodeWord) || [];
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var _Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : end - start >>> 0;
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return !start && end >= length ? array : baseSlice(array, start, end);
}

/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst(methodName) {
  return function (string) {
    string = toString(string);

    var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined;

    var chr = strSymbols ? strSymbols[0] : string.charAt(0);

    var trailing = strSymbols ? castSlice(strSymbols, 1).join('') : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

/**
 * Creates a function like `_.camelCase`.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */
function createCompounder(callback) {
  return function (string) {
    return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
  };
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the camel cased string.
 * @example
 *
 * _.camelCase('Foo Bar');
 * // => 'fooBar'
 *
 * _.camelCase('--foo-bar--');
 * // => 'fooBar'
 *
 * _.camelCase('__FOO_BAR__');
 * // => 'fooBar'
 */
var camelCase = createCompounder(function (result, word, index) {
  word = word.toLowerCase();
  return result + (index ? capitalize(word) : word);
});

/**
 * Converts the first character of `string` to upper case and the remaining
 * to lower case.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to capitalize.
 * @returns {string} Returns the capitalized string.
 * @example
 *
 * _.capitalize('FRED');
 * // => 'Fred'
 */
function capitalize(string) {
  return upperFirst(toString(string).toLowerCase());
}

/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = toString(string);
  return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
}

/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst = createCaseFirst('toUpperCase');

/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */
function words(string, pattern, guard) {
  string = toString(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
  }
  return string.match(pattern) || [];
}

module.exports = camelCase;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/lodash.clonedeep/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = ( false ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && ( false ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    _Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map || ListCache)(),
    'string': new Hash()
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache();
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || isFunc && !object) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function (subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor());
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor());
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
  getTag = function getTag(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;
        case mapCtorString:
          return mapTag;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag:case float64Tag:
    case int8Tag:case int16Tag:case int32Tag:
    case uint8Tag:case uint8ClampedTag:case uint16Tag:case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, true, true);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = cloneDeep;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js"), __webpack_require__("./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "../node_modules/lodash.debounce/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function now() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

module.exports = debounce;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/lodash.isequal/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = ( false ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && ( false ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = function () {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}();

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    _Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map || ListCache)(),
    'string': new Hash()
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache();
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache();
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (
    // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' ||
    // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') ||
    // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
    // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack());
    return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack());
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function (othValue, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == other + '';

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function (object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function (symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
  getTag = function getTag(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;
        case mapCtorString:
          return mapTag;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;

  return value === proto;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function () {
  return arguments;
}()) ? baseIsArguments : function (value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEqual;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js"), __webpack_require__("./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "../node_modules/lodash.isplainobject/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;

/***/ }),

/***/ "../node_modules/lodash.kebabcase/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match words composed of alphanumeric characters. */
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

/** Used to match Latin Unicode letters (excluding mathematical operators). */
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0',
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

/** Used to compose unicode capture groups. */
var rsApos = '[\'\u2019]',
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
    rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptLowerContr = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
    rsOptUpperContr = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq;

/** Used to match apostrophes. */
var reApos = RegExp(rsApos, 'g');

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo, 'g');

/** Used to match complex or compound words. */
var reUnicodeWord = RegExp([rsUpper + '?' + rsLower + '+' + rsOptLowerContr + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')', rsUpperMisc + '+' + rsOptUpperContr + '(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')', rsUpper + '?' + rsLowerMisc + '+' + rsOptLowerContr, rsUpper + '+' + rsOptUpperContr, rsDigits, rsEmoji].join('|'), 'g');

/** Used to detect strings that need a more robust regexp to match words. */
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

/** Used to map Latin Unicode letters to basic Latin letters. */
var deburredLetters = {
  // Latin-1 Supplement block.
  '\xc0': 'A', '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a', '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C', '\xe7': 'c',
  '\xd0': 'D', '\xf0': 'd',
  '\xc8': 'E', '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e', '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcc': 'I', '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xec': 'i', '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N', '\xf1': 'n',
  '\xd2': 'O', '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o', '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U', '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u', '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y', '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss',
  // Latin Extended-A block.
  '\u0100': 'A', '\u0102': 'A', '\u0104': 'A',
  '\u0101': 'a', '\u0103': 'a', '\u0105': 'a',
  '\u0106': 'C', '\u0108': 'C', '\u010A': 'C', '\u010C': 'C',
  '\u0107': 'c', '\u0109': 'c', '\u010B': 'c', '\u010D': 'c',
  '\u010E': 'D', '\u0110': 'D', '\u010F': 'd', '\u0111': 'd',
  '\u0112': 'E', '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011A': 'E',
  '\u0113': 'e', '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011B': 'e',
  '\u011C': 'G', '\u011E': 'G', '\u0120': 'G', '\u0122': 'G',
  '\u011D': 'g', '\u011F': 'g', '\u0121': 'g', '\u0123': 'g',
  '\u0124': 'H', '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
  '\u0128': 'I', '\u012A': 'I', '\u012C': 'I', '\u012E': 'I', '\u0130': 'I',
  '\u0129': 'i', '\u012B': 'i', '\u012D': 'i', '\u012F': 'i', '\u0131': 'i',
  '\u0134': 'J', '\u0135': 'j',
  '\u0136': 'K', '\u0137': 'k', '\u0138': 'k',
  '\u0139': 'L', '\u013B': 'L', '\u013D': 'L', '\u013F': 'L', '\u0141': 'L',
  '\u013A': 'l', '\u013C': 'l', '\u013E': 'l', '\u0140': 'l', '\u0142': 'l',
  '\u0143': 'N', '\u0145': 'N', '\u0147': 'N', '\u014A': 'N',
  '\u0144': 'n', '\u0146': 'n', '\u0148': 'n', '\u014B': 'n',
  '\u014C': 'O', '\u014E': 'O', '\u0150': 'O',
  '\u014D': 'o', '\u014F': 'o', '\u0151': 'o',
  '\u0154': 'R', '\u0156': 'R', '\u0158': 'R',
  '\u0155': 'r', '\u0157': 'r', '\u0159': 'r',
  '\u015A': 'S', '\u015C': 'S', '\u015E': 'S', '\u0160': 'S',
  '\u015B': 's', '\u015D': 's', '\u015F': 's', '\u0161': 's',
  '\u0162': 'T', '\u0164': 'T', '\u0166': 'T',
  '\u0163': 't', '\u0165': 't', '\u0167': 't',
  '\u0168': 'U', '\u016A': 'U', '\u016C': 'U', '\u016E': 'U', '\u0170': 'U', '\u0172': 'U',
  '\u0169': 'u', '\u016B': 'u', '\u016D': 'u', '\u016F': 'u', '\u0171': 'u', '\u0173': 'u',
  '\u0174': 'W', '\u0175': 'w',
  '\u0176': 'Y', '\u0177': 'y', '\u0178': 'Y',
  '\u0179': 'Z', '\u017B': 'Z', '\u017D': 'Z',
  '\u017A': 'z', '\u017C': 'z', '\u017E': 'z',
  '\u0132': 'IJ', '\u0133': 'ij',
  '\u0152': 'Oe', '\u0153': 'oe',
  '\u0149': "'n", '\u017F': 'ss'
};

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * Splits an ASCII `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function asciiWords(string) {
  return string.match(reAsciiWord) || [];
}

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function (key) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
var deburrLetter = basePropertyOf(deburredLetters);

/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */
function hasUnicodeWord(string) {
  return reHasUnicodeWord.test(string);
}

/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function unicodeWords(string) {
  return string.match(reUnicodeWord) || [];
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var _Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

/**
 * Creates a function like `_.camelCase`.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */
function createCompounder(callback) {
  return function (string) {
    return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
  };
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = toString(string);
  return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
}

/**
 * Converts `string` to
 * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the kebab cased string.
 * @example
 *
 * _.kebabCase('Foo Bar');
 * // => 'foo-bar'
 *
 * _.kebabCase('fooBar');
 * // => 'foo-bar'
 *
 * _.kebabCase('__FOO_BAR__');
 * // => 'foo-bar'
 */
var kebabCase = createCompounder(function (result, word, index) {
  return result + (index ? '-' : '') + word.toLowerCase();
});

/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */
function words(string, pattern, guard) {
  string = toString(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
  }
  return string.match(pattern) || [];
}

module.exports = kebabCase;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/object-keys/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// modified from https://github.com/es-shims/es5-shim

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = __webpack_require__("../node_modules/object-keys/isArguments.js");
var isEnumerable = Object.prototype.propertyIsEnumerable;
var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
var equalsConstructorPrototype = function equalsConstructorPrototype(o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var excludedKeys = {
	$console: true,
	$external: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$innerHeight: true,
	$innerWidth: true,
	$outerHeight: true,
	$outerWidth: true,
	$pageXOffset: true,
	$pageYOffset: true,
	$parent: true,
	$scrollLeft: true,
	$scrollTop: true,
	$scrollX: true,
	$scrollY: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = function () {
	/* global window */
	if (typeof window === 'undefined') {
		return false;
	}
	for (var k in window) {
		try {
			if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && _typeof(window[k]) === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}();
var equalsConstructorPrototypeIfNotBuggy = function equalsConstructorPrototypeIfNotBuggy(o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2);
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

/***/ }),

/***/ "../node_modules/object-keys/isArguments.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' && value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

/***/ }),

/***/ "../node_modules/object.assign/hasSymbols.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var keys = __webpack_require__("../node_modules/object-keys/index.js");

module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
		return false;
	}
	if (_typeof(Symbol.iterator) === 'symbol') {
		return true;
	}

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') {
		return false;
	}

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
		return false;
	}
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
		return false;
	}

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) {
		return false;
	}
	if (keys(obj).length !== 0) {
		return false;
	}
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
		return false;
	}

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
		return false;
	}

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) {
		return false;
	}

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
		return false;
	}

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) {
			return false;
		}
	}

	return true;
};

/***/ }),

/***/ "../node_modules/object.assign/implementation.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// modified from https://github.com/es-shims/es6-shim

var keys = __webpack_require__("../node_modules/object-keys/index.js");
var bind = __webpack_require__("../node_modules/function-bind/index.js");
var canBeObject = function canBeObject(obj) {
	return typeof obj !== 'undefined' && obj !== null;
};
var hasSymbols = __webpack_require__("../node_modules/object.assign/hasSymbols.js")();
var toObject = Object;
var push = bind.call(Function.call, Array.prototype.push);
var propIsEnumerable = bind.call(Function.call, Object.prototype.propertyIsEnumerable);
var originalGetSymbols = hasSymbols ? Object.getOwnPropertySymbols : null;

module.exports = function assign(target, source1) {
	if (!canBeObject(target)) {
		throw new TypeError('target must be an object');
	}
	var objTarget = toObject(target);
	var s, source, i, props, syms, value, key;
	for (s = 1; s < arguments.length; ++s) {
		source = toObject(arguments[s]);
		props = keys(source);
		var getSymbols = hasSymbols && (Object.getOwnPropertySymbols || originalGetSymbols);
		if (getSymbols) {
			syms = getSymbols(source);
			for (i = 0; i < syms.length; ++i) {
				key = syms[i];
				if (propIsEnumerable(source, key)) {
					push(props, key);
				}
			}
		}
		for (i = 0; i < props.length; ++i) {
			key = props[i];
			value = source[key];
			if (propIsEnumerable(source, key)) {
				objTarget[key] = value;
			}
		}
	}
	return objTarget;
};

/***/ }),

/***/ "../node_modules/object.assign/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defineProperties = __webpack_require__("../node_modules/define-properties/index.js");

var implementation = __webpack_require__("../node_modules/object.assign/implementation.js");
var getPolyfill = __webpack_require__("../node_modules/object.assign/polyfill.js");
var shim = __webpack_require__("../node_modules/object.assign/shim.js");

var polyfill = getPolyfill();

defineProperties(polyfill, {
	implementation: implementation,
	getPolyfill: getPolyfill,
	shim: shim
});

module.exports = polyfill;

/***/ }),

/***/ "../node_modules/object.assign/polyfill.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var implementation = __webpack_require__("../node_modules/object.assign/implementation.js");

var lacksProperEnumerationOrder = function lacksProperEnumerationOrder() {
	if (!Object.assign) {
		return false;
	}
	// v8, specifically in node 4.x, has a bug with incorrect property enumeration order
	// note: this does not detect the bug unless there's 20 characters
	var str = 'abcdefghijklmnopqrst';
	var letters = str.split('');
	var map = {};
	for (var i = 0; i < letters.length; ++i) {
		map[letters[i]] = letters[i];
	}
	var obj = Object.assign({}, map);
	var actual = '';
	for (var k in obj) {
		actual += k;
	}
	return str !== actual;
};

var assignHasPendingExceptions = function assignHasPendingExceptions() {
	if (!Object.assign || !Object.preventExtensions) {
		return false;
	}
	// Firefox 37 still has "pending exception" logic in its Object.assign implementation,
	// which is 72% slower than our shim, and Firefox 40's native implementation.
	var thrower = Object.preventExtensions({ 1: 2 });
	try {
		Object.assign(thrower, 'xy');
	} catch (e) {
		return thrower[1] === 'y';
	}
	return false;
};

module.exports = function getPolyfill() {
	if (!Object.assign) {
		return implementation;
	}
	if (lacksProperEnumerationOrder()) {
		return implementation;
	}
	if (assignHasPendingExceptions()) {
		return implementation;
	}
	return Object.assign;
};

/***/ }),

/***/ "../node_modules/object.assign/shim.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var define = __webpack_require__("../node_modules/define-properties/index.js");
var getPolyfill = __webpack_require__("../node_modules/object.assign/polyfill.js");

module.exports = function shimAssign() {
	var polyfill = getPolyfill();
	define(Object, { assign: polyfill }, { assign: function assign() {
			return Object.assign !== polyfill;
		} });
	return polyfill;
};

/***/ }),

/***/ "../node_modules/pwet-idom/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderComponent = exports.patch = exports.default = undefined;

var _idomUtil = __webpack_require__("../node_modules/idom-util/src/index.js");

var _kwak = __webpack_require__("../node_modules/kwak/lib/index.js");

var _utilities = __webpack_require__("../node_modules/pwet/src/utilities.js");

var _pwet = __webpack_require__("../node_modules/pwet/src/component.js");

var _lodash = __webpack_require__("../node_modules/lodash.debounce/index.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _incrementalDom = __webpack_require__("../node_modules/incremental-dom/dist/incremental-dom-cjs.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tagNames = [];

var $initialize = Symbol('$initialize');
var $properties = Symbol('$properties');
var $template = Symbol('$template');
var applyAttributeTyped = _incrementalDom.attributes[_incrementalDom.symbols.default];

_incrementalDom.attributes[_incrementalDom.symbols.default] = function (element, name, value) {

  if (name.startsWith('on-') && (0, _kwak.isFunction)(value)) element.addEventListener(name.slice(3), value);

  // return void applyAttributeTyped(element, name, value);
  if (!(_pwet.$pwet in element) || !tagNames.includes(element.tagName)) return void applyAttributeTyped(element, name, value);

  var factory = element[_pwet.$pwet].factory;


  var foundProperty = factory.properties.find(function (_ref) {
    var propertyName = _ref.name,
        isDataAttribute = _ref.isDataAttribute;

    return propertyName === name;
  });

  if (factory.logLevel > 0) console.error("[" + factory.tagName + "]", 'IDOM', name, value, foundProperty);

  if ((0, _kwak.isUndefined)(foundProperty)) return void applyAttributeTyped(element, name, value);

  if (!element[$initialize]) element[$initialize] = (0, _lodash2.default)(function () {

    element.initialize(Object.assign(element.properties, element[$properties]));

    element[$properties] = {};
  }, 0);

  if (!element[$properties]) element[$properties] = {};

  element[$properties][name] = value;

  element[$initialize]();
};

var patch = function patch(element, renderMarkup) {

  if ((0, _kwak.isNull)(element.shadowRoot)) return (0, _idomUtil.patch)(element, renderMarkup);
  var template = element[$template] = element[$template] || document.createElement('template');
  if (template.content.children.length > 0) {
    return (0, _idomUtil.patch)(template.content, renderMarkup);

    // return;
    // } else {
    // return _patch(element.shadowRoot, renderMarkup);
  }

  // if (ShadyCSS.nativeShadow) {
  //   console.log('element.shadowRoot.children=', element.shadowRoot.children)
  //   console.log('template.content.children=', template.content.children)
  //
  //   if (element.shadowRoot.children.length < 1) {
  //     _patch(template.content, renderMarkup);
  //
  //     element.shadowRoot.appendChild(template.content);
  //     return;
  //   }
  //
  //   return _patch(element.shadowRoot, renderMarkup);
  // }


  if (element.shadowRoot.children.length < 1) {
    (0, _idomUtil.patch)(template.content, renderMarkup);
    if (!ShadyCSS.nativeShadow) {

      ShadyCSS.prepareTemplate(template, element.localName);

      ShadyCSS.styleElement(element);
    }
    element.shadowRoot.appendChild(template.content);
    return;
  }

  return (0, _idomUtil.patch)(element.shadowRoot, renderMarkup);

  // _patch(template.content, renderMarkup);

  // if (!ShadyCSS.nativeShadow) {

  // }

  // if (element.shadowRoot.children.length < 1)
  //   element.shadowRoot.appendChild(template.content);
  // else
  //   element.shadowRoot.replaceChild(template.content.cloneNode(true), element.shadowRoot.firstChild);
};

var IDOMComponent = function IDOMComponent(factory) {

  factory.render = (0, _utilities.decorate)(factory.render, function (next, component) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    patch(component.element, function () {
      return next.apply(undefined, [component].concat(args));
    });
  });

  factory.create = (0, _utilities.decorate)(factory.create, function (next, component) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    var hooks = next.apply(undefined, [component].concat(args));

    if (!(0, _kwak.isObject)(hooks) || (0, _kwak.isNull)(hooks)) hooks = {};

    if ((0, _kwak.isFunction)(hooks.render)) {
      hooks.render = (0, _utilities.decorate)(hooks.render, function (next) {
        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        patch(component.element, function () {
          return next.apply(undefined, args);
        });
      });
    }

    return hooks;
  });

  tagNames.push(factory.tagName.toUpperCase());

  return factory;
};

var renderComponent = function renderComponent() {
  for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  return _idomUtil.renderElement.apply(undefined, args.concat([_idomUtil.skip]));
};

exports.default = IDOMComponent;
exports.patch = patch;
exports.renderComponent = renderComponent;

/***/ }),

/***/ "../node_modules/pwet/src/attribute.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _property = __webpack_require__("../node_modules/pwet/src/property.js");

var _property2 = _interopRequireDefault(_property);

var _utilities = __webpack_require__("../node_modules/pwet/src/utilities.js");

var _kwak = __webpack_require__("../node_modules/kwak/lib/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _nullOrType = function _nullOrType(type) {
  return function (val) {
    return !val ? null : type(val);
  };
};
var _zeroOrNumber = function _zeroOrNumber(val) {
  return !val ? 0 : Number(val);
};

var Attribute = module.exports = function (attribute) {

  (0, _kwak.assert)((0, _kwak.isObject)(attribute), '\'attribute\' must be an object');

  var _attribute$stringify = attribute.stringify,
      stringify = _attribute$stringify === undefined ? JSON.stringify : _attribute$stringify,
      _attribute$parse = attribute.parse,
      parse = _attribute$parse === undefined ? JSON.parse : _attribute$parse,
      coerce = attribute.coerce,
      _attribute$isDataAttr = attribute.isDataAttribute,
      isDataAttribute = _attribute$isDataAttr === undefined ? true : _attribute$isDataAttr,
      defaultValue = attribute.defaultValue;


  (0, _kwak.assert)((0, _kwak.isFunction)(stringify), '\'stringify\' must be a function');
  (0, _kwak.assert)((0, _kwak.isFunction)(parse), '\'parse\' must be a function');

  return Object.assign(attribute, {
    isAttribute: true,
    isDataAttribute: isDataAttribute,
    stringify: stringify,
    parse: parse,
    coerce: coerce,
    defaultValue: defaultValue
  });
};

Attribute.array = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Attribute(_property2.default.array(options));
};
Attribute.plain = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Attribute(_property2.default.plain(options));
};
Attribute.boolean = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Attribute(Object.assign(_property2.default.boolean(options), {
    parse: function parse(val) {
      console.log('parse', val);
      return val === '';
    },
    stringify: function stringify(val) {
      return val ? '' : null;
    }
  }));
};

Attribute.number = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Attribute(Object.assign({
    defaultValue: 0,
    coerce: _zeroOrNumber,
    parse: _zeroOrNumber,
    stringify: _nullOrType(Number)
  }, options));
};

Attribute.integer = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Attribute.number(Object.assign(options, {
    coerce: parseInt,
    parse: parseInt
  }));
};

Attribute.float = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Attribute.number(Object.assign(options, {
    coerce: parseFloat,
    parse: parseFloat
  }));
};

Attribute.object = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Attribute(_property2.default.object(options));
};

Attribute.string = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Attribute(Object.assign({
    defaultValue: '',
    coerce: String,
    parse: _nullOrType(String),
    stringify: _nullOrType(String)
  }, options));
};

exports.default = Attribute;

/***/ }),

/***/ "../node_modules/pwet/src/component.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ThinComponent = exports.$pwet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = __webpack_require__("../node_modules/lodash.kebabcase/index.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = __webpack_require__("../node_modules/lodash.camelcase/index.js");

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = __webpack_require__("../node_modules/lodash.clonedeep/index.js");

var _lodash6 = _interopRequireDefault(_lodash5);

var _property = __webpack_require__("../node_modules/pwet/src/property.js");

var _property2 = _interopRequireDefault(_property);

var _utilities = __webpack_require__("../node_modules/pwet/src/utilities.js");

var _filters = __webpack_require__("../node_modules/pwet/src/filters.js");

var _kwak = __webpack_require__("../node_modules/kwak/lib/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var internal = {
  factories: [],
  allowedHooks: ['attach', 'detach', 'initialize', 'render']
};

var $pwet = Symbol('pwet');

internal.parseProperties = function (input) {

  var properties = [];

  if (!(0, _kwak.isObject)(input)) return properties;

  var keys = Object.keys(input);

  if ((0, _kwak.isEmpty)(keys)) return properties;

  return keys.reduce(function (properties, key) {

    var property = input[key];

    if (!(0, _kwak.isObject)(property)) property = { defaultValue: property };

    property.name = key;

    property = (0, _property2.default)(property);

    properties.push(property);

    return properties;
  }, properties);
};

internal.StatelessError = function () {
  throw new Error('Component is Stateless');
};

internal.defaultsHooks = {
  attach: function attach(component, _attach) {

    _attach(true);
  },

  initialize: function initialize(component, newProperties, _initialize) {
    return _initialize(true);
  }
};

var Component = function Component(factory, element, dependencies) {

  (0, _kwak.assert)(Component.get(factory), '\'factory\' must be a defined component factory');
  (0, _kwak.assert)((0, _kwak.isElement)(element), '\'element\' must be a HTMLElement');

  if (element[$pwet] !== void 0) return;

  if (factory.logLevel > 0) console.log('[' + factory.tagName + ']', 'create()');

  var _isCreated = false;
  var _isAttached = false;
  var _isRendered = false;
  var _isInitializing = false;
  var _isInitialized = false;
  var _properties = {};

  if (factory.shadow) element.attachShadow(factory.shadow);

  var attach = function attach() {

    if (factory.logLevel > 0) console.log('[' + factory.tagName + ']', 'attach()');

    if (_isAttached) return;

    component.hooks.attach(function (shouldRender) {
      _isAttached = true;

      if (!_isRendered && shouldRender) component.render();
    });
  };

  attach.after = function () {
    var shouldUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;


    // console.log('Component.attach.after()', { shouldUpdate, _isAttached });

    if (shouldUpdate) component.render();
  };

  var detach = function detach() {

    if (factory.logLevel > 0) console.log('[' + factory.tagName + ']', 'detach()');

    if (!_isAttached) return;

    _isAttached = false;

    component.hooks.detach();
  };

  var initialize = function initialize() {
    var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    if (_isInitializing) return;

    if (factory.logLevel > 0) console.log('[' + factory.tagName + ']', 'initialize()', { new: properties, old: _properties });

    (0, _kwak.assert)((0, _kwak.isObject)(properties) && !(0, _kwak.isNull)(properties), '\'properties\' must be an object');

    properties = factory.properties.reduce(function (newProperties, _ref) {
      var name = _ref.name,
          coerce = _ref.coerce,
          defaultValue = _ref.defaultValue,
          isDataAttribute = _ref.isDataAttribute;


      var oldValue = _properties[name];
      var newValue = properties[name];

      if ((0, _kwak.isUndefined)(newValue) && isDataAttribute) newValue = properties['data-' + name];

      // console.log('HEY', name, oldValue, newValue);

      // newValue = isUndefined(newValue)
      //   ? (_properties.hasOwnProperty(name) ? oldValue : defaultValue)
      //   : newValue;

      // if (isUndefined(newValue) && _properties.hasOwnProperty(name))
      //   newValue = _properties[name];


      newValue = !(0, _kwak.isUndefined)(newValue) ? coerce(newValue) : defaultValue;

      return Object.assign(newProperties, _defineProperty({}, name, newValue));
    }, {});

    if ((0, _kwak.isDeeplyEqual)(properties, _properties)) {
      if (factory.logLevel > 0) console.warn('[' + factory.tagName + ']', 'aborted initialization (properties are unchanged)', properties, _properties);
      return;
    }

    // console.log(`[${factory.tagName}]`, 'initializing...', newProperties);

    _isInitializing = true;

    //console.log(`[${factory.tagName}]`, 'aaaaa', component.hooks.initialize);

    component.hooks.initialize(properties, function (shouldRender) {
      _properties = properties;
      // Object.assign(_properties, properties);

      _isInitializing = false;
      _isInitialized = true;

      if (shouldRender) component.render();

      // console.log(`[${factory.tagName}]`, 'initialized', properties);
    });
  };

  var render = function render() {

    if (factory.logLevel > 0) console.log('[' + factory.tagName + ']', 'render()', _extends({ _isAttached: _isAttached }, _properties));

    if (!_isAttached) return;

    component.hooks.render();

    _isRendered = true;
  };

  var component = element[$pwet] = {
    isPwetComponent: true,
    element: element,
    factory: factory,
    attach: attach,
    render: render,
    detach: detach,
    get isRendered() {
      return _isRendered;
    },
    get isAttached() {
      return _isAttached;
    },
    get isInitializing() {
      return _isInitializing;
    },
    get isInitialized() {
      return _isInitialized;
    },
    get hooks() {
      return _hooks;
    }
    // get state() {
    //   return _hooks
    // },
    // set properties(newValue) {
    //   return _hooks
    // }
  };

  Object.assign(element, {
    initialize: initialize
  });

  var _hooks = factory.allowedHooks.reduce(function (hooks, key) {
    return Object.assign(hooks, _defineProperty({}, key, factory[key].bind(null, component)));
  }, {});

  Object.defineProperty(element, 'properties', {
    get: function get() {
      return (0, _lodash6.default)(_properties);
    },

    set: initialize
  });

  var returned = factory.create(component, factory.dependencies);

  if (!(0, _kwak.isObject)(returned) || (0, _kwak.isNull)(returned)) return component;

  Object.keys(returned).forEach(function (key) {

    if (!factory.allowedHooks.includes(key)) return;

    var hook = returned[key];

    (0, _kwak.assert)((0, _kwak.isFunction)(hook), '\'' + key + '\' hook must be a function');

    _hooks[key] = hook;
  });

  (0, _kwak.assert)(_hooks.render !== _utilities.noop, '\'render\' method is required');

  initialize(factory.properties.reduce(function (properties, _ref2) {
    var name = _ref2.name,
        isDataAttribute = _ref2.isDataAttribute,
        parse = _ref2.parse,
        defaultValue = _ref2.defaultValue;


    Object.defineProperty(element, name, {
      get: function get() {
        return _properties[name];
      },
      set: function set(newValue) {

        initialize(Object.assign(element.properties, _defineProperty({}, name, newValue)));
      }
    });

    var value = defaultValue;

    if (isDataAttribute) {

      var attributeValue = element.dataset[name];

      if (!(0, _kwak.isUndefined)(attributeValue)) value = parse(attributeValue);
    }

    return Object.assign(properties, _defineProperty({}, name, value));
  }, {}));

  var _attributes = factory.properties.filter(function (property) {
    return property.isAttribute === true;
  }).reduce(function (attributes, attribute) {

    var name = (0, _lodash2.default)(attribute.name);

    if (attribute.isDataAttribute) name = 'data-' + name;

    return Object.assign(attributes, _defineProperty({}, name, attribute));
  }, {});

  var _attributesName = Object.keys(_attributes);

  var _observer = new MutationObserver(function (mutations) {

    mutations = mutations.filter(function (_ref3) {
      var attributeName = _ref3.attributeName;
      return _attributesName.includes(attributeName);
    }).map(function (_ref4) {
      var name = _ref4.attributeName,
          oldValue = _ref4.oldValue;
      return {
        name: name,
        oldValue: oldValue,
        value: element.getAttribute(name)
      };
    }).filter(function (_ref5) {
      var value = _ref5.value,
          oldValue = _ref5.oldValue;
      return !(0, _kwak.isEqualTo)(value, oldValue);
    });

    if ((0, _kwak.isEmpty)(mutations)) return;

    console.error('[' + factory.tagName + ']', 'ATTRIBUTES MUTATIONS', mutations.map(function (_ref6) {
      var name = _ref6.name,
          value = _ref6.value;
      return name + '=' + value;
    }));
    var properties = element.properties;


    initialize(Object.assign(properties, mutations.reduce(function (attributes, _ref7) {
      var name = _ref7.name,
          value = _ref7.value;
      var _attributes$name = _attributes[name],
          parse = _attributes$name.parse,
          isDataAttribute = _attributes$name.isDataAttribute;


      name = (0, _lodash4.default)(isDataAttribute ? name.slice(5) : name);

      return Object.assign(attributes, _defineProperty({}, name, parse(value)));
    }, {})));

    // const { name, parse, isDataAttribute } = _attributes[attributeName];
    //
    // // console.error(`[${factory.tagName}]`, 'attributeChangedCallback', name, typeof newValue, this.pages);
    //
    // properties[name] = parse(newValue);
    //
    // this.initialize(properties);
  });

  _observer.observe(element, { attributes: true, attributeOldValue: true });

  return component;
};

Component.get = function (input) {
  return internal.factories.find((0, _filters.EqualFilter)(input));
};

var ThinComponent = function ThinComponent(factory) {
  // console.log(`ThinComponent(${factory.tagName})`);

  // const factory = (component, factory, dependencies) => {
  //
  //   console.log('ThinComponent()', component);
  //
  //   return {
  //     render: render.bind(null, component, dependencies)
  //   }
  // };

  factory.create = (0, _utilities.decorate)(factory.create, function (next, component) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    // let hooks = next(component, ...args);


    // if (!isObject(hooks))
    //   hooks = {};

    return {
      // ...hooks,
      render: function render() {
        return next.apply(undefined, [component].concat(args));
      }
    };
  });

  return factory;
};

Component.define = function (tagName, factory) {

  if ((0, _kwak.isFunction)(tagName)) {
    factory = tagName;
    tagName = factory.tagName || factory.name;
  }

  (0, _kwak.assert)((0, _kwak.isFunction)(factory), '\'factory\' must be a function');

  var _factory = factory,
      _factory$dependencies = _factory.dependencies,
      dependencies = _factory$dependencies === undefined ? {} : _factory$dependencies;


  (0, _kwak.assert)((0, _kwak.isString)(tagName) && tagName.length > 0, '\'tagName\' must be a string');

  tagName = (0, _lodash2.default)(tagName);

  if (!tagName.includes('-')) tagName = 'x-' + tagName;

  (0, _kwak.assert)(!Component.get(factory), 'That component factory is already defined');
  (0, _kwak.assert)(!internal.factories.find((0, _filters.ByFilter)('tagName', tagName)), '\'' + tagName + '\' component is already defined');
  (0, _kwak.assert)((0, _kwak.isObject)(dependencies) && !(0, _kwak.isNull)(dependencies), '\'dependencies\' must be an object');

  factory.tagName = tagName;
  factory.allowedHooks = [];

  if (!(0, _kwak.isFunction)(factory.create)) factory.create = factory;
  if (!(0, _kwak.isFunction)(factory.attach)) factory.attach = internal.defaultsHooks.attach;
  if (!(0, _kwak.isFunction)(factory.initialize)) factory.initialize = internal.defaultsHooks.initialize;
  if (!(0, _kwak.isFunction)(factory.detach)) factory.detach = _utilities.noop;
  if (!(0, _kwak.isFunction)(factory.render)) factory.render = _utilities.noop;

  if (!(0, _kwak.isUndefined)(factory.decorators)) {

    if (!(0, _kwak.isArray)(factory.decorators)) factory.decorators = [factory.decorators];

    factory.decorators.forEach(function (decorator) {
      (0, _kwak.assert)((0, _kwak.isFunction)(decorator), '\'decorator\' must be a function');
      decorator(factory, dependencies);
    });

    // if (isFunction(factory.define)) {
    //   // factory.define = ThinComponent;
    //   factory = factory.define(factory);
    //
    //   // if (isObject(factory.properties) && !isNull(factory.properties)) {
    //   //   factory.define = ThickComponent;
    //   // }
    // }
  }
  if (!(0, _kwak.isUndefined)(factory.shadow)) (0, _kwak.assert)((0, _kwak.isPlainObject)(factory.shadow), '\'shadow\' must be a plain object');

  (0, _kwak.assert)((0, _kwak.isFunction)(factory.create), '\'create\' must be a function');
  (0, _kwak.assert)((0, _kwak.isFunction)(factory.attach), '\'attach\' must be a function');
  (0, _kwak.assert)((0, _kwak.isFunction)(factory.initialize), '\'initialize\' must be a function');
  (0, _kwak.assert)((0, _kwak.isFunction)(factory.detach), '\'detach\' must be a function');
  (0, _kwak.assert)((0, _kwak.isFunction)(factory.render), '\'render\' must be a function');

  factory.tagName = tagName;
  factory.dependencies = dependencies;

  factory.properties = internal.parseProperties(factory.properties);

  factory.allowedHooks = factory.allowedHooks.reduce(function (hooks, hook) {

    (0, _kwak.assert)((0, _kwak.isString)(hook), '\'hook\' must be a string');

    if ((0, _kwak.isString)(hook) && !internal.allowedHooks.includes(hook)) hooks.push(hook);

    return hooks;
  }, []).concat(internal.allowedHooks);

  internal.factories.push(factory);

  console.log('Component.define(' + factory.tagName + ')', factory.allowedHooks);

  customElements.define(tagName, function (_HTMLElement) {
    _inherits(_class, _HTMLElement);

    function _class() {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

      Component(factory, _this, dependencies);
      return _this;
    }
    // attributeChangedCallback(attributeName, oldValue, newValue) {
    //
    //   const { properties } = this.pwet;
    //
    //   const { name, parse, isDataAttribute } = _attributes[attributeName];
    //
    //   console.error(`[${factory.tagName}]`, 'attributeChangedCallback', name, typeof newValue, this.pages);
    //
    //   properties[name] = parse(newValue);
    //
    //   this.initialize(properties);
    //
    // }

    // static get observedAttributes() {
    //
    //   return _attributesNames;
    // }


    _createClass(_class, [{
      key: 'connectedCallback',
      value: function connectedCallback() {

        this[$pwet].attach();
      }
    }, {
      key: 'disconnectedCallback',
      value: function disconnectedCallback() {

        this[$pwet].detach();
      }
    }]);

    return _class;
  }(HTMLElement));
};

exports.$pwet = $pwet;
exports.ThinComponent = ThinComponent;
exports.default = Component;

/***/ }),

/***/ "../node_modules/pwet/src/filters.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ByFilter = exports.ByFilter = function ByFilter(key, value) {
  return function (item) {
    return item[key] === value;
  };
};
var EqualFilter = exports.EqualFilter = function EqualFilter(value) {
  return function (item) {
    return item === value;
  };
};

/***/ }),

/***/ "../node_modules/pwet/src/polyfills/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// NOTE!!!
//
// We have to load polyfills directly from source as non-minified files are not
// published by the polyfills. An issue was raised to discuss this problem and
// to see if it can be resolved.
//
// See https://github.com/webcomponents/custom-elements/issues/45

// ES2015 polyfills required for the polyfills to work in older browsers.
__webpack_require__("../node_modules/array.from/index.js").shim();
__webpack_require__("../node_modules/object.assign/index.js").shim();
__webpack_require__("../node_modules/es6-promise/dist/es6-promise.js").polyfill();

// We have to include this first so that it can patch native. This must be done
// before any polyfills are loaded.
__webpack_require__("../node_modules/pwet/src/polyfills/native-shim.js");
//
// // // Template polyfill is necessary to use shadycss in IE11
// // // this comes before custom elements because of
// // // https://github.com/webcomponents/template/blob/master/template.js#L39
__webpack_require__("../node_modules/@webcomponents/template/template.js");
//
// // This comes after the native shim because it requries it to be patched first.
__webpack_require__("../node_modules/@webcomponents/custom-elements/src/custom-elements.js");

/***/ }),

/***/ "../node_modules/pwet/src/polyfills/native-shim.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.customElements && eval("/**\n * @license\n * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.\n * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt\n * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt\n * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt\n * Code distributed by Google as part of the polymer project is also\n * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt\n */\n\n/**\n * This shim allows elements written in, or compiled to, ES5 to work on native\n * implementations of Custom Elements.\n *\n * ES5-style classes don't work with native Custom Elements because the\n * HTMLElement constructor uses the value of `new.target` to look up the custom\n * element definition for the currently called constructor. `new.target` is only\n * set when `new` is called and is only propagated via super() calls. super()\n * is not emulatable in ES5. The pattern of `SuperClass.call(this)`` only works\n * when extending other ES5-style classes, and does not propagate `new.target`.\n *\n * This shim allows the native HTMLElement constructor to work by generating and\n * registering a stand-in class instead of the users custom element class. This\n * stand-in class's constructor has an actual call to super().\n * `customElements.define()` and `customElements.get()` are both overridden to\n * hide this stand-in class from users.\n *\n * In order to create instance of the user-defined class, rather than the stand\n * in, the stand-in's constructor swizzles its instances prototype and invokes\n * the user-defined constructor. When the user-defined constructor is called\n * directly it creates an instance of the stand-in class to get a real extension\n * of HTMLElement and returns that.\n *\n * There are two important constructors: A patched HTMLElement constructor, and\n * the StandInElement constructor. They both will be called to create an element\n * but which is called first depends on whether the browser creates the element\n * or the user-defined constructor is called directly. The variables\n * `browserConstruction` and `userConstruction` control the flow between the\n * two constructors.\n *\n * This shim should be better than forcing the polyfill because:\n *   1. It's smaller\n *   2. All reaction timings are the same as native (mostly synchronous)\n *   3. All reaction triggering DOM operations are automatically supported\n *\n * There are some restrictions and requirements on ES5 constructors:\n *   1. All constructors in a inheritance hierarchy must be ES5-style, so that\n *      they can be called with Function.call(). This effectively means that the\n *      whole application must be compiled to ES5.\n *   2. Constructors must return the value of the emulated super() call. Like\n *      `return SuperClass.call(this)`\n *   3. The `this` reference should not be used before the emulated super() call\n *      just like `this` is illegal to use before super() in ES6.\n *   4. Constructors should not create other custom elements before the emulated\n *      super() call. This is the same restriction as with native custom\n *      elements.\n *\n *  Compiling valid class-based custom elements to ES5 will satisfy these\n *  requirements with the latest version of popular transpilers.\n */\n(() => {\n  'use strict';\n\n  // Do nothing if `customElements` does not exist.\n  if (!window.customElements) return;\n\n  const NativeHTMLElement = window.HTMLElement;\n  const nativeDefine = window.customElements.define;\n  const nativeGet = window.customElements.get;\n\n  /**\n   * Map of user-provided constructors to tag names.\n   *\n   * @type {Map<Function, string>}\n   */\n  const tagnameByConstructor = new Map();\n\n  /**\n   * Map of tag names to user-provided constructors.\n   *\n   * @type {Map<string, Function>}\n   */\n  const constructorByTagname = new Map();\n\n\n  /**\n   * Whether the constructors are being called by a browser process, ie parsing\n   * or createElement.\n   */\n  let browserConstruction = false;\n\n  /**\n   * Whether the constructors are being called by a user-space process, ie\n   * calling an element constructor.\n   */\n  let userConstruction = false;\n\n  window.HTMLElement = function() {\n    if (!browserConstruction) {\n      const tagname = tagnameByConstructor.get(this.constructor);\n      const fakeClass = nativeGet.call(window.customElements, tagname);\n\n      // Make sure that the fake constructor doesn't call back to this constructor\n      userConstruction = true;\n      const instance = new (fakeClass)();\n      return instance;\n    }\n    // Else do nothing. This will be reached by ES5-style classes doing\n    // HTMLElement.call() during initialization\n    browserConstruction = false;\n  };\n  // By setting the patched HTMLElement's prototype property to the native\n  // HTMLElement's prototype we make sure that:\n  //     document.createElement('a') instanceof HTMLElement\n  // works because instanceof uses HTMLElement.prototype, which is on the\n  // ptototype chain of built-in elements.\n  window.HTMLElement.prototype = NativeHTMLElement.prototype;\n\n  window.customElements.define = (tagname, elementClass) => {\n    const elementProto = elementClass.prototype;\n    const StandInElement = class extends NativeHTMLElement {\n      constructor() {\n        // Call the native HTMLElement constructor, this gives us the\n        // under-construction instance as `this`:\n        super();\n\n        // The prototype will be wrong up because the browser used our fake\n        // class, so fix it:\n        Object.setPrototypeOf(this, elementProto);\n\n        if (!userConstruction) {\n          // Make sure that user-defined constructor bottom's out to a do-nothing\n          // HTMLElement() call\n          browserConstruction = true;\n          // Call the user-defined constructor on our instance:\n          elementClass.call(this);\n        }\n        userConstruction = false;\n      }\n    };\n    const standInProto = StandInElement.prototype;\n    StandInElement.observedAttributes = elementClass.observedAttributes;\n    standInProto.connectedCallback = elementProto.connectedCallback;\n    standInProto.disconnectedCallback = elementProto.disconnectedCallback;\n    standInProto.attributeChangedCallback = elementProto.attributeChangedCallback;\n    standInProto.adoptedCallback = elementProto.adoptedCallback;\n\n    tagnameByConstructor.set(elementClass, tagname);\n    constructorByTagname.set(tagname, elementClass);\n    nativeDefine.call(window.customElements, tagname, StandInElement);\n  };\n\n  window.customElements.get = (tagname) => constructorByTagname.get(tagname);\n\n})();\n");

/***/ }),

/***/ "../node_modules/pwet/src/polyfills/shadow-dom.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Force the polyfill in Safari 10.0.0 and 10.0.1.
var _window = window,
    navigator = _window.navigator;
var userAgent = navigator.userAgent;

var safari = userAgent.indexOf('Safari/60') !== -1;
var safariVersion = safari && userAgent.match(/Version\/([^\s]+)/)[1];
var safariVersions = [0, 1].map(function (v) {
  return '10.0.' + v;
}).concat(['10.0']);

if (safari && safariVersions.indexOf(safariVersion) > -1) {
  window.ShadyDOM = { force: true };
}

__webpack_require__("../node_modules/@webcomponents/shadydom/shadydom.min.js");
__webpack_require__("../node_modules/@webcomponents/shadycss/scoping-shim.min.js");
__webpack_require__("../node_modules/@webcomponents/shadycss/apply-shim.min.js");
__webpack_require__("../node_modules/@webcomponents/shadycss/custom-style-interface.min.js");

var _require = __webpack_require__("../node_modules/@webcomponents/shadycss/src/style-util.js"),
    applyStyle = _require.applyStyle;

module.exports = {
  applyStyle: applyStyle
};

/***/ }),

/***/ "../node_modules/pwet/src/property.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utilities = __webpack_require__("../node_modules/pwet/src/utilities.js");

var _kwak = __webpack_require__("../node_modules/kwak/lib/index.js");

var Property = function Property(property) {

  (0, _kwak.assert)((0, _kwak.isObject)(property), '\'property\' must be an object');

  var name = property.name,
      _property$coerce = property.coerce,
      coerce = _property$coerce === undefined ? _utilities.identity : _property$coerce,
      defaultValue = property.defaultValue;


  (0, _kwak.assert)((0, _kwak.isString)(name), 'Invalid property: \'name\' must be a string');
  (0, _kwak.assert)((0, _kwak.isFunction)(coerce), 'Invalid \'' + name + '\' property: \'coerce\' must be a function');

  // if (attribute) {
  //
  //   assert(Attribute.isAttribute(attribute), `'attribute' is not an Attribute object`);
  //
  //   if (isUndefined(defaultValue) && !isUndefined(attribute.defaultValue))
  //     defaultValue = attribute.defaultValue;
  //
  //   if (attribute.coerce !== coerce)
  //     coerce = attribute.coerce;
  // }

  if (!(0, _kwak.isUndefined)(defaultValue) && coerce !== _utilities.identity) {

    if ((0, _kwak.isUndefined)(coerce(defaultValue))) {
      defaultValue = null;
      console.warn('Invalid \'' + name + '\' property: \'coerce\' called with \'defaultValue\' has returned undefined');
    }
  }

  return Object.freeze(Object.assign(property, {
    name: name,
    coerce: coerce,
    defaultValue: defaultValue
  }));
};

Property.array = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Object.assign({
    coerce: function coerce(value) {
      return Array.isArray(value) ? value : !value ? null : [value];
    },
    defaultValue: []
  }, options);
};

Property.object = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Object.assign({
    defaultValue: {},
    coerce: function coerce(value) {
      return (0, _kwak.isUndefined)(value) || !(0, _kwak.isObject)(value) ? void 0 : value;
    }
  }, options);
};

Property.plain = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Property.object(Object.assign({
    coerce: function coerce(value) {
      return (0, _kwak.isUndefined)(value) || !(0, _kwak.isPlainObject)(value) ? void 0 : value;
    }
  }, options));
};

Property.boolean = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Object.assign({
    coerce: Boolean,
    defaultValue: false
  }, options);
};

exports.default = Property;

/***/ }),

/***/ "../node_modules/pwet/src/utilities.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decorate = exports.isAttached = exports.not = exports.toggle = exports.identity = exports.noop = exports.clone = undefined;

var _kwak = __webpack_require__("../node_modules/kwak/lib/index.js");

var clone = exports.clone = function clone(input) {
  return !(0, _kwak.isArray)(input) ? (0, _kwak.isObject)(input) && !(0, _kwak.isNull)(input) ? Object.assign({}, input) : input : input.map(clone);
};

var noop = exports.noop = function noop() {};
var identity = exports.identity = function identity(arg) {
  return arg;
};
var toggle = exports.toggle = function toggle(input) {
  return !input;
};
var not = exports.not = toggle;
var isAttached = exports.isAttached = function isAttached(element) {

  if (element === document) return true;

  element = element.parentNode;
  if (element) return isAttached(element);

  return false;
};
var decorate = exports.decorate = function decorate(func, decorator) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return decorator.bind.apply(decorator, [null, func].concat(args));
};

/***/ }),

/***/ "../src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__("../src/wall/index.js");

/***/ }),

/***/ "../src/wall/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wall = __webpack_require__("../src/wall/wall.js");

var _wall2 = _interopRequireDefault(_wall);

var _wall3 = __webpack_require__("../src/wall/wall.styl");

var _wall4 = _interopRequireDefault(_wall3);

var _pwet = __webpack_require__("../node_modules/pwet/src/component.js");

var _pwet2 = _interopRequireDefault(_pwet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _pwet2.default.define(Object.assign(_wall2.default, {
  style: _wall4.default
}));

/***/ }),

/***/ "../src/wall/wall.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _property = __webpack_require__("../node_modules/pwet/src/property.js");

var _property2 = _interopRequireDefault(_property);

var _attribute = __webpack_require__("../node_modules/pwet/src/attribute.js");

var _attribute2 = _interopRequireDefault(_attribute);

var _kwak = __webpack_require__("../node_modules/kwak/lib/index.js");

var _pwetIdom = __webpack_require__("../node_modules/pwet-idom/src/index.js");

var _pwetIdom2 = _interopRequireDefault(_pwetIdom);

var _idomUtil = __webpack_require__("../node_modules/idom-util/src/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Wall = function Wall(component) {};

Wall.properties = {
  bricks: _attribute2.default.array(),
  brickHeight: _attribute2.default.integer({ defaultValue: 240 })
};

Wall.logLevel = 1;

Wall.decorators = [_pwetIdom2.default];

Wall.shadow = { mode: 'open' };

Wall.initialize = function (_ref, properties, initialize) {
  var element = _ref.element;


  properties.bricks = properties.bricks.reduce(function (bricks, brick, i) {

    if (!(0, _kwak.isPlainObject)(brick) || !(0, _kwak.isString)(brick.src)) return bricks;

    if (!(0, _kwak.isString)(brick.flex) || brick.flex.length < 1) brick.flex = 'initial';

    bricks.push(brick);

    return bricks;
  }, []);

  initialize(!(0, _kwak.isDeeplyEqual)(element.bricks, properties.bricks));
};

Wall.render = function (component) {
  var element = component.element;
  var _element$properties = element.properties,
      bricks = _element$properties.bricks,
      brickHeight = _element$properties.brickHeight;


  (0, _idomUtil.renderStyle)(Wall.style);

  (0, _idomUtil.renderDiv)("bricks", ['class', 'bricks'], function () {
    var brickStyle = void 0;

    bricks.forEach(function (brick, i) {

      brickStyle = "--flex: " + brick.flex + ";";
      brickStyle += "--height: " + brickHeight + ";";

      (0, _idomUtil.renderDiv)("brick" + i, ['class', 'brick'], 'style', brickStyle, function () {

        (0, _idomUtil.renderImage)(brick.src, null, []);
      });
    });
  });
};

exports.default = Wall;

/***/ }),

/***/ "../src/wall/wall.styl":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ":host {\n  height: 100%;\n  width: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.bricks {\n  display: flex;\n  flex-wrap: wrap;\n  overflow-y: auto;\n  list-style: none;\n  padding: 0;\n}\n.brick {\n  flex: var(--flex, 1);\n  border: 1px solid #000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  max-width: 100%;\n  transition: all 1s;\n}\n.brick img {\n  display: block;\n  flex: 1;\n  min-width: 100%;\n  object-fit: cover;\n  object-position: 50% 50%;\n  height: var(--height);\n  min-height: var(--height);\n}\n", ""]);

// exports


/***/ }),

/***/ "./index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__("../node_modules/pwet/src/polyfills/index.js");

__webpack_require__("../node_modules/pwet/src/polyfills/shadow-dom.js");

__webpack_require__("../src/index.js");

/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),

/***/ "./node_modules/process/browser.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),

/***/ 0:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

/******/ });
//# sourceMappingURL=main.js.map