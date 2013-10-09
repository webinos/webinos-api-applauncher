/*******************************************************************************
 *  Code contributed to the webinos project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *	 http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Copyright 2013 Fraunhofer FOKUS
 ******************************************************************************/

describe("AppLauncher API", function() {
	var appLauncherService;
	var appLauncherServiceBound;

	webinos.discovery.findServices(new ServiceType("http://webinos.org/api/applauncher"), {
		onFound: function (service) {
			appLauncherService = service;
		}
	});

	beforeEach(function() {
		waitsFor(function() {
			return !!appLauncherService;
		}, "the discovery to find an AppLauncher service", 10000);
	});

	it("should be available from the discovery", function() {
		expect(appLauncherService).toBeDefined();
	});

	it("has the necessary properties as service object", function() {
		expect(appLauncherService.state).toBeDefined();
		expect(appLauncherService.api).toEqual(jasmine.any(String));
		expect(appLauncherService.id).toEqual(jasmine.any(String));
		expect(appLauncherService.displayName).toEqual(jasmine.any(String));
		expect(appLauncherService.description).toEqual(jasmine.any(String));
		expect(appLauncherService.icon).toEqual(jasmine.any(String));
		expect(appLauncherService.bindService).toEqual(jasmine.any(Function));
	});

	it("can be bound", function() {
		appLauncherService.bindService({onBind: function(service) {
			appLauncherServiceBound = service;
		}});

		waitsFor(function() {
			return !!appLauncherServiceBound;
		}, "the service to be bound", 4000);
	});

	describe("with bound service", function() {

		beforeEach(function() {
			waitsFor(function() {
				return !!appLauncherServiceBound;
			}, "service is defined, was bound");
		});

		it("has AppLauncher service methods", function() {
			expect(appLauncherServiceBound.launchApplication).toEqual(jasmine.any(Function));
			expect(appLauncherServiceBound.appInstalled).toEqual(jasmine.any(Function));
		});
		
		it("can launch an application!", function() {
			var isLaunched;
			appLauncherServiceBound.launchApplication(function() {
				isLaunched = true;
			}, function() {}, "http://google.com");
			
			waitsFor(function() {
				return isLaunched;
			});
		});
	});
	
});
