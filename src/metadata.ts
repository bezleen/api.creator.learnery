/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger": { "models": [[import("./user/dto/edit-user.dto"), { "EditUserDto": { email: { required: false, type: () => String }, firstName: { required: false, type: () => String }, lastName: { required: false, type: () => String }, avatar: { required: false, type: () => String } } }], [import("./auth/dto/auth.dto"), { "AuthDto": { tokenId: { required: true, type: () => String } }, "JwtDto": { sub: { required: true, type: () => String }, email: { required: true, type: () => String } }, "localAuthDto": { email: { required: true, type: () => String }, password: { required: true, type: () => String } }, "registerDto": { email: { required: true, type: () => String }, password: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, avatar: { required: true, type: () => String } } }], [import("./material/entities/material.entity"), { "Material": {} }], [import("./auth/entities/auth.entity"), { "Auth": {} }]], "controllers": [[import("./app/app.controller"), { "AppController": { "getHello": {}, "getHealth": {} } }], [import("./user/user.controller"), { "UserController": { "getMe": {}, "editUser": {} } }], [import("./auth/auth.controller"), { "AuthController": { "googleAuth": {}, "googleAuthCallback": {}, "googleLogin": { type: Object }, "login": { type: Object }, "signUp": { type: Object }, "refreshTokens": {}, "logout": {} } }], [import("./material/material.controller"), { "MaterialController": { "getPerformanceTaskPDF": {}, "getWorksheetPDF": {}, "getQuizPDF": {}, "stopStreaming": {} } }]] } };
};