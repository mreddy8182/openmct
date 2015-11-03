/*global define,describe,it,expect,beforeEach,waitsFor,jasmine,window,afterEach*/

define(
    ['../../src/controllers/TimelineGanttController'],
    function (TimelineGanttController) {
        "use strict";

        var TEST_MAX_OFFSCREEN = 50;

        describe("The timeline Gantt bar controller", function () {
            var mockTimespan,
                testScroll,
                mockToPixels,
                controller;

            // Shorthands for passing these arguments to the controller
            function width() {
                return controller.width(
                    mockTimespan,
                    testScroll,
                    mockToPixels
                );
            }
            function left() {
                return controller.left(
                    mockTimespan,
                    testScroll,
                    mockToPixels
                );
            }


            beforeEach(function () {
                mockTimespan = jasmine.createSpyObj(
                    'timespan',
                    ['getStart', 'getEnd', 'getDuration']
                );
                testScroll = { x: 0, width: 2000 };
                mockToPixels = jasmine.createSpy('toPixels');

                mockTimespan.getStart.andReturn(100);
                mockTimespan.getDuration.andReturn(50);
                mockTimespan.getEnd.andReturn(150);

                mockToPixels.andCallFake(function (t) { return t * 10; });

                controller = new TimelineGanttController(TEST_MAX_OFFSCREEN);
            });

            it("positions start and end points correctly on-screen", function () {
                // Test's initial conditions are nominal, so should have
                // the same return value as mockToPixels
                expect(left()).toEqual(1000);
                expect(width()).toEqual(500);
            });

            it("prevents excessive off screen values to the left", function () {
                testScroll.x = 1200;
                expect(left()).toEqual(1150);
                expect(width()).toEqual(350); // ...such that right edge is 1500
            });

            it("prevents excessive off screen values to the right", function () {
                testScroll.width = 1200;
                expect(left()).toEqual(1000);
                expect(width()).toEqual(250); // ...such that right edge is 1250
            });

            it("prevents excessive off screen values on both edges", function () {
                testScroll.x = 1100;
                testScroll.width = 200; // Visible right edge is now 1300
                expect(left()).toEqual(1050);
                expect(width()).toEqual(300); // ...such that right edge is 1350
            });



        });
    }
);