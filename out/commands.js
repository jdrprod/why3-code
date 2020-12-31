"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prove = exports.Status = void 0;
const child_process_1 = require("child_process");
var Status;
(function (Status) {
    Status[Status["Valid"] = 0] = "Valid";
    Status[Status["Timeout"] = 1] = "Timeout";
    Status[Status["Unknown"] = 2] = "Unknown";
})(Status = exports.Status || (exports.Status = {}));
let analyse_result = (s) => {
    let tokens = s.split(' ');
    let fname = tokens[0];
    let module = tokens[1];
    let declaration = tokens[2];
    switch (tokens[3]) {
        case "Unknow":
            return { fname, module, declaration, status: Status.Unknown };
        case "Timeout":
            return { fname, module, declaration, status: Status.Timeout };
        case "Valid":
            return { fname, module, declaration, status: Status.Valid };
        default:
            return { fname, module, declaration, status: Status.Unknown };
    }
};
function prove(fpath, prover, succ, err) {
    let why3 = child_process_1.spawn('why3', ['prove', '-P', prover]);
    let ctx = new Map();
    why3.stdout.on('data', (data) => {
        var _a;
        let { module, declaration, status } = analyse_result(data);
        if (ctx.has(module)) {
            (_a = ctx.get(module)) === null || _a === void 0 ? void 0 : _a.set(declaration, status);
        }
        else {
            ctx.set(module, new Map([
                [declaration, status]
            ]));
        }
    });
    why3.on('exit', (code) => {
        if (code !== null) {
            succ(ctx);
        }
        else {
            err(`why3 call exited with anormal exit code ${code}`);
        }
    });
}
exports.prove = prove;
//# sourceMappingURL=commands.js.map