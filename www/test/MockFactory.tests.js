describe("MockFactory", function () {

    var $injector, mockFactory;

    beforeEach(function () {
        module("whattobuy");
        inject(function (_$injector_) {
            $injector = _$injector_;
            mockFactory  = $injector.get(toolNames.MockFactory);
        });
    });

    it("should check all Mocks to be valid against real implementation", (function () {

        var ErrorStoreMock = mockFactory.ErrorStoreMock;
        expect(getMethods(ErrorStoreMock)).toEqual(getMethods($injector.get(dataproviderNames.ErrorStore)));

        var FeedServiceMock = mockFactory.FeedServiceMock;
        expect(getMethods(FeedServiceMock)).toEqual(getMethods($injector.get(serviceNames.FeedService)));

        var CommodityCacheMock = mockFactory.CommodityCacheMock;
        expect(getMethods(CommodityCacheMock)).toEqual(getMethods($injector.get(dataproviderNames.CommodityCache)));

        var ErrorServiceMock = mockFactory.ErrorServiceMock;
        expect(getMethods(ErrorServiceMock)).toEqual(getMethods($injector.get(serviceNames.ErrorService)));

        expect(getMethods(mockFactory.IonicLoadingExtensionMock)).toEqual(getMethods($injector.get(toolNames.IonicLoadingExtension)));

        expect(getMethods(mockFactory.ControllerNavigationMock)).toEqual(getMethods($injector.get(controllerNames.ControllerNavigation)));

        expect(getMethods(mockFactory.PopupExtensionMock)).toEqual(getMethods($injector.get(toolNames.PopupExtension)));

    }));

});