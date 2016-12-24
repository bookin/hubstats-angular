"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var MorrisAreaDirective = (function () {
    function MorrisAreaDirective(el) {
        el.nativeElement.style.height = '250px';
        el.nativeElement.id = this.name;
    }
    MorrisAreaDirective.prototype.ngAfterViewInit = function () {
        new Morris.Area({
            'element': this.name,
            'data': JSON.parse(this.data),
            'xkey': 'x',
            'ykeys': ['count', 'uniques'],
            'labels': ['Visits', 'Uniques'],
            'xLabels': 'day',
            'behaveLikeLine': true,
            'dateFormat': function (x) {
                var date = new Date(x);
                return ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear().toString().replace(new RegExp('^.{2}'), '');
            },
            'lineColors': ['#87D37C', '#4183D7'],
            'lineWidth': 2,
            'hideHover': true,
            'fillOpacity': 0.5,
            'resize': true
        });
    };
    return MorrisAreaDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], MorrisAreaDirective.prototype, "name", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], MorrisAreaDirective.prototype, "data", void 0);
MorrisAreaDirective = __decorate([
    core_1.Directive({
        selector: '[morris-area]'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], MorrisAreaDirective);
exports.MorrisAreaDirective = MorrisAreaDirective;
//# sourceMappingURL=morris-area.directive.js.map