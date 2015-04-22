//angular.module('MyApp.Directives', []);
//
//angular.module('MyApp.Directives').directive('browseTo', function ($ionicGesture) {
//    return {
//        restrict: 'A',
//        link: function ($scope, $element, $attrs) {
//            var handleTap = function (e) {
//                var inAppBrowser = window.open(encodeURI($attrs.browseTo), '_system');
//            };
//            var tapGesture = $ionicGesture.on('tap', handleTap, $element);
//            $scope.$on('$destroy', function () {
//                // Clean up - unbind drag gesture handler
//                $ionicGesture.off(tapGesture, 'tap', handleTap);
//            });
//        }
//    }
//})
//

var ITEM_TPL_CONTENT_ANCHOR =
    '<a class="item-content" ng-href="{{$href()}}" target="{{$target()}}"></a>';
var ITEM_TPL_CONTENT =
    '<div class="item-content"></div>';
/**
 * @ngdoc directive
 * @name ionItem
 * @parent ionic.directive:ionList
 * @module ionic
 * @restrict E
 * Creates a list-item that can easily be swiped,
 * deleted, reordered, edited, and more.
 *
 * See {@link ionic.directive:ionList} for a complete example & explanation.
 *
 * Can be assigned any item class name. See the
 * [list CSS documentation](/docs/components/#list).
 *
 * @usage
 *
 * ```html
 * <ion-list>
 * <ion-item>Hello!</ion-item>
 * <ion-item href="#/detail">
 * Link to detail page
 * </ion-item>
 * </ion-list>
 * ```
 */

var IonicModule = angular.module('ionic');

IonicModule
    .directive('ionItemGarg', [
        '$animate',
        '$compile',
        function($animate, $compile) {
            return {
                restrict: 'E',
                controller: ['$scope', '$element', function($scope, $element) {
                    this.$scope = $scope;
                    this.$element = $element;
                }],
                scope: true,
                compile: function($element, $attrs) {
                    var isAnchor = angular.isDefined($attrs.href) ||
                        angular.isDefined($attrs.ngHref) ||
                        angular.isDefined($attrs.uiSref);
                    var isComplexItem = isAnchor ||
//Lame way of testing, but we have to know at compile what to do with the element
                        /ion-(delete|option|reorder)-button/i.test($element.html());
                    if (isComplexItem) {
                        var innerElement = jqLite(isAnchor ? ITEM_TPL_CONTENT_ANCHOR : ITEM_TPL_CONTENT);
                        innerElement.append($element.contents() + "<div>Garg1337</div>");
                        $element.append(innerElement);
                        $element.addClass('item item-complex Garg1337');
                    } else {
                        $element.addClass('item Garg1337');
                    }
                    return function link($scope, $element, $attrs) {
                        $scope.$href = function() {
                            return $attrs.href || $attrs.ngHref;
                        };
                        $scope.$target = function() {
                            return $attrs.target || '_self';
                        };
                    };
                }
            };
        }]);

(function () {

    var myDirective = function ($ionicGesture) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                var handleTap = function (e) {
                    var inAppBrowser = window.open(encodeURI($attrs.browseTo), '_system');
                };
                var tapGesture = $ionicGesture.on('tap', handleTap, $element);
                $scope.$on('$destroy', function () {
                    // Clean up - unbind drag gesture handler
                    $ionicGesture.off(tapGesture, 'tap', handleTap);
                });
            }
        }
    };

    var module = angular.module("whattobuy.directives");
    module.directive("myDirective", myDirective);

}());