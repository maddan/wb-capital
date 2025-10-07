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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlossaryController = void 0;
const common_1 = require("@nestjs/common");
const MAP = {
    dscr: "DSCR shows how easily a property’s income covers the mortgage. 1.60 means a 60% cushion.",
    noi: "NOI is rent and other income minus operating expenses (before loan payments).",
    cap_rate: "Cap rate is NOI divided by price — a quick yield measure.",
    debt_cost: "Debt cost is the interest rate and terms we pay to the lender for the loan.",
    ltv: "LTV is the loan-to-value percentage. 75% LTV means 25% down payment."
};
let GlossaryController = class GlossaryController {
    get(key) {
        var _a;
        const text = (_a = MAP[key.toLowerCase()]) !== null && _a !== void 0 ? _a : 'Not found';
        return { key, text };
    }
};
exports.GlossaryController = GlossaryController;
__decorate([
    (0, common_1.Get)(':key'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GlossaryController.prototype, "get", null);
exports.GlossaryController = GlossaryController = __decorate([
    (0, common_1.Controller)('glossary')
], GlossaryController);
//# sourceMappingURL=glossary.controller.js.map