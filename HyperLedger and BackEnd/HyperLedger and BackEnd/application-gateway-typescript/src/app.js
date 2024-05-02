"use strict";
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var grpc = require("@grpc/grpc-js");
var fabric_gateway_1 = require("@hyperledger/fabric-gateway");
var crypto = require("crypto");
var fs_1 = require("fs");
var path = require("path");
var util_1 = require("util");
var express = require('express');
var cors = require('cors');
var app = express();
var bcrypt = require('bcrypt');
var port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
var channelName = envOrDefault('CHANNEL_NAME', 'mychannel');
var chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic');
var mspId = envOrDefault('MSP_ID', 'Org1MSP');
// Path to crypto materials.
var cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com'));
// Path to user private key directory.
var keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));
// Path to user certificate directory.
var certDirectoryPath = envOrDefault('CERT_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts'));
// Path to peer tls certificate.
var tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));
// Gateway peer endpoint.
var peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');
// Gateway peer SSL host name override.
var peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');
var utf8Decoder = new util_1.TextDecoder();
var assetId = "asset".concat(Date.now());
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var client, gateway, _a, network, contract_1;
        var _b;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, displayInputParameters()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, newGrpcConnection()];
                case 2:
                    client = _c.sent();
                    _a = fabric_gateway_1.connect;
                    _b = {
                        client: client
                    };
                    return [4 /*yield*/, newIdentity()];
                case 3:
                    _b.identity = _c.sent();
                    return [4 /*yield*/, newSigner()];
                case 4:
                    gateway = _a.apply(void 0, [(_b.signer = _c.sent(),
                            // Default timeouts for different gRPC calls
                            _b.evaluateOptions = function () {
                                return { deadline: Date.now() + 5000 }; // 5 seconds
                            },
                            _b.endorseOptions = function () {
                                return { deadline: Date.now() + 15000 }; // 15 seconds
                            },
                            _b.submitOptions = function () {
                                return { deadline: Date.now() + 5000 }; // 5 seconds
                            },
                            _b.commitStatusOptions = function () {
                                return { deadline: Date.now() + 60000 }; // 1 minute
                            },
                            _b)]);
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, , 7, 8]);
                    network = gateway.getNetwork(channelName);
                    contract_1 = network.getContract(chaincodeName);
                    // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
                    return [4 /*yield*/, initLedger(contract_1)];
                case 6:
                    // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
                    _c.sent();
                    app.post('/initLedger', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, initLedger(contract_1)];
                                case 1:
                                    _a.sent();
                                    res.status(200).json({ message: 'Ledger initialized' });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_1 = _a.sent();
                                    console.error('Error initializing ledger:', error_1);
                                    res.status(500).json({ message: 'Error initializing ledger' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/createUser', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, id, password, accountType, error_2;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, id = _a.id, password = _a.password, accountType = _a.accountType;
                                    return [4 /*yield*/, createUser(contract_1, id, password, accountType)];
                                case 1:
                                    _b.sent();
                                    res.status(200).json({ message: 'User created' });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_2 = _b.sent();
                                    console.error('Error creating user:', error_2);
                                    res.status(500).json({ message: 'Error creating user' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/createContract', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, employer_id, employee_id, salary, is_running, error_3;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, employer_id = _a.employer_id, employee_id = _a.employee_id, salary = _a.salary, is_running = _a.is_running;
                                    return [4 /*yield*/, createContract(contract_1, employer_id, employee_id, salary, is_running)];
                                case 1:
                                    _b.sent();
                                    res.status(200).json({ message: 'Contract created' });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_3 = _b.sent();
                                    console.error('Error creating contract:', error_3);
                                    res.status(500).json({ message: 'Error creating contract' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/readUser', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, result, error_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    id = req.body.id;
                                    return [4 /*yield*/, readUser(contract_1, id)];
                                case 1:
                                    result = _a.sent();
                                    res.status(200).json(result);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_4 = _a.sent();
                                    console.error('Error reading user:', error_4);
                                    res.status(500).json({ message: 'Error reading user' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/readBank', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, result, error_5;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    id = req.body.id;
                                    return [4 /*yield*/, readBank(contract_1, id)];
                                case 1:
                                    result = _a.sent();
                                    res.status(200).json(result);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_5 = _a.sent();
                                    console.error('Error reading bank:', error_5);
                                    res.status(500).json({ message: 'Error reading bank' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/readContract', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, error_6;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    id = req.body.id;
                                    return [4 /*yield*/, readContract(contract_1, id)];
                                case 1:
                                    _a.sent();
                                    res.status(200).json({ message: 'Contract read' });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_6 = _a.sent();
                                    console.error('Error reading contract:', error_6);
                                    res.status(500).json({ message: 'Error reading contract' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/transferMoney', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, employer_id, employee_id, error_7;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, employer_id = _a.employer_id, employee_id = _a.employee_id;
                                    return [4 /*yield*/, transferMoney(contract_1, employer_id, employee_id)];
                                case 1:
                                    _b.sent();
                                    res.status(200).json({ message: 'Money transferred' });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_7 = _b.sent();
                                    console.error('Error transferring money:', error_7);
                                    res.status(500).json({ message: 'Error transferring money' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/UserValid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, id, password, result, error_8;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, id = _a.id, password = _a.password;
                                    return [4 /*yield*/, UserValid(contract_1, id, password)];
                                case 1:
                                    result = _b.sent();
                                    res.status(200).json(result);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_8 = _b.sent();
                                    console.error('Error validating user:', error_8);
                                    res.status(500).json({ message: 'Error validating user' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/getAllContracts', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var result, error_9;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, getAllContracts(contract_1)];
                                case 1:
                                    result = _a.sent();
                                    res.status(200).json(result);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_9 = _a.sent();
                                    console.error('Error reading contracts:', error_9);
                                    res.status(500).json({ message: 'Error reading contracts' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/getAllUsers', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var result, error_10;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, getAllUsers(contract_1)];
                                case 1:
                                    result = _a.sent();
                                    res.status(200).json(result);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_10 = _a.sent();
                                    console.error('Error reading users:', error_10);
                                    res.status(500).json({ message: 'Error reading users' });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 8];
                case 7: return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
main().catch(function (error) {
    console.error('******** FAILED to run the application:', error);
    process.exitCode = 1;
});
function newGrpcConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var tlsRootCert, tlsCredentials;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readFile(tlsCertPath)];
                case 1:
                    tlsRootCert = _a.sent();
                    tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
                    return [2 /*return*/, new grpc.Client(peerEndpoint, tlsCredentials, {
                            'grpc.ssl_target_name_override': peerHostAlias,
                        })];
            }
        });
    });
}
function newIdentity() {
    return __awaiter(this, void 0, void 0, function () {
        var certPath, credentials;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getFirstDirFileName(certDirectoryPath)];
                case 1:
                    certPath = _a.sent();
                    return [4 /*yield*/, fs_1.promises.readFile(certPath)];
                case 2:
                    credentials = _a.sent();
                    return [2 /*return*/, { mspId: mspId, credentials: credentials }];
            }
        });
    });
}
function getFirstDirFileName(dirPath) {
    return __awaiter(this, void 0, void 0, function () {
        var files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readdir(dirPath)];
                case 1:
                    files = _a.sent();
                    return [2 /*return*/, path.join(dirPath, files[0])];
            }
        });
    });
}
function newSigner() {
    return __awaiter(this, void 0, void 0, function () {
        var keyPath, privateKeyPem, privateKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getFirstDirFileName(keyDirectoryPath)];
                case 1:
                    keyPath = _a.sent();
                    return [4 /*yield*/, fs_1.promises.readFile(keyPath)];
                case 2:
                    privateKeyPem = _a.sent();
                    privateKey = crypto.createPrivateKey(privateKeyPem);
                    return [2 /*return*/, fabric_gateway_1.signers.newPrivateKeySigner(privateKey)];
            }
        });
    });
}
/**
 * This type of transaction would typically only be run once by an application the first time it was started after its
 * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
 */
function initLedger(contract) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
                    return [4 /*yield*/, contract.submitTransaction('InitLedger')];
                case 1:
                    _a.sent();
                    console.log('*** Transaction committed successfully');
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Evaluate a transaction to query ledger state.
 */
function createUser(contract, id, password, accountType) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Submit Transaction: CreateUser, creates new user with ID, Password, AccountType arguments');
                    return [4 /*yield*/, contract.submitTransaction('CreateUser', id, password, accountType)];
                case 1:
                    _a.sent();
                    console.log('*** Transaction committed successfully');
                    return [2 /*return*/];
            }
        });
    });
}
// createContract takes input employer_id string, employee_id string, salary string, is_running string)
function createContract(contract, employer_id, employee_id, salary, is_running) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Submit Transaction: CreateContract, creates new contract with EmployerID, EmployeeID, Salary, IsRunning arguments');
                    return [4 /*yield*/, contract.submitTransaction('CreateContract', employer_id, employee_id, salary, is_running)];
                case 1:
                    _a.sent();
                    console.log('*** Transaction committed successfully');
                    return [2 /*return*/];
            }
        });
    });
}
// readUser takes input id string
function readUser(contract, id) {
    return __awaiter(this, void 0, void 0, function () {
        var resultBytes, resultJson, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Evaluate Transaction: ReadUser, function returns user attributes');
                    return [4 /*yield*/, contract.evaluateTransaction('ReadUser', id)];
                case 1:
                    resultBytes = _a.sent();
                    resultJson = utf8Decoder.decode(resultBytes);
                    result = JSON.parse(resultJson);
                    console.log('*** Result:', result);
                    return [2 /*return*/, (result)];
            }
        });
    });
}
function readBank(contract, id) {
    return __awaiter(this, void 0, void 0, function () {
        var resultBytes, resultJson, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Evaluate Transaction: ReadBank, function returns user attributes');
                    return [4 /*yield*/, contract.evaluateTransaction('ReadBank', id)];
                case 1:
                    resultBytes = _a.sent();
                    resultJson = utf8Decoder.decode(resultBytes);
                    result = JSON.parse(resultJson);
                    console.log('*** Result:', result);
                    return [2 /*return*/, (result)];
            }
        });
    });
}
//  readContract takes input id string
function readContract(contract, id) {
    return __awaiter(this, void 0, void 0, function () {
        var resultBytes, resultJson, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Evaluate Transaction: ReadContract, function returns contract attributes');
                    return [4 /*yield*/, contract.evaluateTransaction('ReadContract', id)];
                case 1:
                    resultBytes = _a.sent();
                    resultJson = utf8Decoder.decode(resultBytes);
                    result = JSON.parse(resultJson);
                    console.log('*** Result:', result);
                    return [2 /*return*/];
            }
        });
    });
}
// transferMoney takes input employer_id string, employee_id string
function transferMoney(contract, employer_id, employee_id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Submit Transaction: TransferMoney, updates existing user money');
                    return [4 /*yield*/, contract.submitTransaction('TransferMoney', employer_id, employee_id)];
                case 1:
                    _a.sent();
                    console.log('*** Transaction committed successfully');
                    return [2 /*return*/];
            }
        });
    });
}
// UserValid takes input id string, password string
function UserValid(contract, id, password) {
    return __awaiter(this, void 0, void 0, function () {
        var resultBytes, resultJson, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Evaluate Transaction: UserValid, function returns user attributes');
                    return [4 /*yield*/, contract.evaluateTransaction('UserValid', id, password)];
                case 1:
                    resultBytes = _a.sent();
                    resultJson = utf8Decoder.decode(resultBytes);
                    result = JSON.parse(resultJson);
                    return [2 /*return*/, result];
            }
        });
    });
}
// getAllContracts takes no input
function getAllContracts(contract) {
    return __awaiter(this, void 0, void 0, function () {
        var resultBytes, resultJson, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Evaluate Transaction: GetAllContracts, function returns all the current contracts on the ledger');
                    return [4 /*yield*/, contract.evaluateTransaction('GetAllContracts')];
                case 1:
                    resultBytes = _a.sent();
                    resultJson = utf8Decoder.decode(resultBytes);
                    result = JSON.parse(resultJson);
                    return [2 /*return*/, result];
            }
        });
    });
}
// getAllUsers takes no input
function getAllUsers(contract) {
    return __awaiter(this, void 0, void 0, function () {
        var resultBytes, resultJson, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n--> Evaluate Transaction: GetAllUsers, function returns all the current users on the ledger');
                    return [4 /*yield*/, contract.evaluateTransaction('GetAllUsers')];
                case 1:
                    resultBytes = _a.sent();
                    resultJson = utf8Decoder.decode(resultBytes);
                    result = JSON.parse(resultJson);
                    return [2 /*return*/, result];
            }
        });
    });
}
/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key, defaultValue) {
    return process.env[key] || defaultValue;
}
/**
 * displayInputParameters() will print the global scope parameters used by the main driver routine.
 */
function displayInputParameters() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("channelName:       ".concat(channelName));
            console.log("chaincodeName:     ".concat(chaincodeName));
            console.log("mspId:             ".concat(mspId));
            console.log("cryptoPath:        ".concat(cryptoPath));
            console.log("keyDirectoryPath:  ".concat(keyDirectoryPath));
            console.log("certDirectoryPath: ".concat(certDirectoryPath));
            console.log("tlsCertPath:       ".concat(tlsCertPath));
            console.log("peerEndpoint:      ".concat(peerEndpoint));
            console.log("peerHostAlias:     ".concat(peerHostAlias));
            return [2 /*return*/];
        });
    });
}
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
