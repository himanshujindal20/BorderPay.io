/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';

const express = require('express')
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const channelName = envOrDefault('CHANNEL_NAME', 'mychannel');
const chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic');
const mspId = envOrDefault('MSP_ID', 'Org1MSP');

// Path to crypto materials.
const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com'));

// Path to user private key directory.
const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));

// Path to user certificate directory.
const certDirectoryPath = envOrDefault('CERT_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts'));

// Path to peer tls certificate.
const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));

// Gateway peer endpoint.
const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');

// Gateway peer SSL host name override.
const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');

const utf8Decoder = new TextDecoder();
const assetId = `asset${Date.now()}`;

async function main(): Promise<void> {

    await displayInputParameters();

    // The gRPC client connection should be shared by all Gateway connections to this endpoint.
    const client = await newGrpcConnection();

    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
        // Default timeouts for different gRPC calls
        evaluateOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        endorseOptions: () => {
            return { deadline: Date.now() + 15000 }; // 15 seconds
        },
        submitOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        commitStatusOptions: () => {
            return { deadline: Date.now() + 60000 }; // 1 minute
        },
    });

    try {
        // Get a network instance representing the channel where the smart contract is deployed.
        const network = gateway.getNetwork(channelName);

        // Get the smart contract from the network.
        const contract = network.getContract(chaincodeName);

        // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
        await initLedger(contract);

        app.post('/initLedger', async (req:any, res:any) => {
            try {
                await initLedger(contract);
                res.status(200).json({ message: 'Ledger initialized' });
            }
            catch (error) {
                console.error('Error initializing ledger:', error);
                res.status(500).json({ message: 'Error initializing ledger' });
            }
        });

        app.post('/createUser', async (req:any, res:any) => {
            try {
                const { id, password, accountType } = req.body;
                await createUser(contract, id, password, accountType);
                res.status(200).json({ message: 'User created' });
            }
            catch (error) {
                console.error('Error creating user:', error);
                res.status(500).json({ message: 'Error creating user' });
            }
        });

        app.post('/createContract', async (req:any, res:any) => {
            try {
                const { employer_id, employee_id, salary, is_running } = req.body;
                await createContract(contract, employer_id, employee_id, salary, is_running);
                res.status(200).json({ message: 'Contract created' });
            }
            catch (error) {
                console.error('Error creating contract:', error);
                res.status(500).json({ message: 'Error creating contract' });
            }
        });

        app.post('/readUser', async (req:any, res:any) => {
            try {
                const { id } = req.body;
                const result=await readUser(contract, id);
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error reading user:', error);
                res.status(500).json({ message: 'Error reading user' });
            }
        });

        app.post('/readBank', async (req:any, res:any) => {
            try {
                const { id } = req.body;
                const result=await readBank(contract, id);
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error reading bank:', error);
                res.status(500).json({ message: 'Error reading bank' });
            }
        });

        app.post('/readContract', async (req:any, res:any) => {
            try {
                const { id } = req.body;
                await readContract(contract, id);
                res.status(200).json({ message: 'Contract read' });
            }
            catch (error) {
                console.error('Error reading contract:', error);
                res.status(500).json({ message: 'Error reading contract' });
            }
        });

        app.post('/transferMoney', async (req:any, res:any) => {
            try {
                const { employer_id, employee_id } = req.body;
                await transferMoney(contract, employer_id, employee_id);
                res.status(200).json({ message: 'Money transferred' });
            }
            catch (error) {
                console.error('Error transferring money:', error);
                res.status(500).json({ message: 'Error transferring money' });
            }
        });

        app.post('/UserValid', async (req:any, res:any) => {
            try {
                const { id, password } = req.body;
                const result = await UserValid(contract, id, password);
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error validating user:', error);
                res.status(500).json({ message: 'Error validating user' });
            }
        });

        app.get('/getAllContracts', async (req:any, res:any) => {
            try {
                const result = await getAllContracts(contract);
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error reading contracts:', error);
                res.status(500).json({ message: 'Error reading contracts' });
            }
        });

        app.get('/getAllUsers', async (req:any, res:any) => {
            try {
                const result = await getAllUsers(contract);
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error reading users:', error);
                res.status(500).json({ message: 'Error reading users' });
            }
        });

    } finally {
        // gateway.close();
        // client.close();
    }
}

main().catch(error => {
    console.error('******** FAILED to run the application:', error);
    process.exitCode = 1;
});

async function newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

async function newIdentity(): Promise<Identity> {
    const certPath = await getFirstDirFileName(certDirectoryPath);
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function getFirstDirFileName(dirPath: string): Promise<string> {
    const files = await fs.readdir(dirPath);
    return path.join(dirPath, files[0]);
}

async function newSigner(): Promise<Signer> {
    const keyPath = await getFirstDirFileName(keyDirectoryPath);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

/**
 * This type of transaction would typically only be run once by an application the first time it was started after its
 * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
 */
async function initLedger(contract: Contract): Promise<void> {
    console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');

    await contract.submitTransaction('InitLedger');

    console.log('*** Transaction committed successfully');
}

/**
 * Evaluate a transaction to query ledger state.
 */
async function createUser(contract: Contract, id: string, password: string, accountType: string): Promise<void> {
    console.log('\n--> Submit Transaction: CreateUser, creates new user with ID, Password, AccountType arguments');

    await contract.submitTransaction(
        'CreateUser',
        id,
        password,
        accountType,
    );

    console.log('*** Transaction committed successfully');
}

// createContract takes input employer_id string, employee_id string, salary string, is_running string)
async function createContract(contract: Contract, employer_id: string, employee_id: string, salary: string, is_running: string): Promise<void> {
    console.log('\n--> Submit Transaction: CreateContract, creates new contract with EmployerID, EmployeeID, Salary, IsRunning arguments');

    await contract.submitTransaction(
        'CreateContract',
        employer_id,
        employee_id,
        salary,
        is_running,
    );

    console.log('*** Transaction committed successfully');
}

// readUser takes input id string
async function readUser(contract: Contract, id: string): Promise<any> {
    console.log('\n--> Evaluate Transaction: ReadUser, function returns user attributes');

    const resultBytes = await contract.evaluateTransaction('ReadUser', id);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log('*** Result:', result);
    return(result);
}

async function readBank(contract: Contract, id: string): Promise<any> {
    console.log('\n--> Evaluate Transaction: ReadBank, function returns user attributes');

    const resultBytes = await contract.evaluateTransaction('ReadBank', id);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log('*** Result:', result);
    return(result);
}

//  readContract takes input id string
async function readContract(contract: Contract, id: string): Promise<void> {
    console.log('\n--> Evaluate Transaction: ReadContract, function returns contract attributes');

    const resultBytes = await contract.evaluateTransaction('ReadContract', id);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log('*** Result:', result);
}

// transferMoney takes input employer_id string, employee_id string
async function transferMoney(contract: Contract, employer_id: string, employee_id: string): Promise<void> {
    console.log('\n--> Submit Transaction: TransferMoney, updates existing user money');

    await contract.submitTransaction(
        'TransferMoney',
        employer_id,
        employee_id,
    );

    console.log('*** Transaction committed successfully');
}

// UserValid takes input id string, password string
async function UserValid(contract: Contract, id: string, password: string): Promise<any> {
    console.log('\n--> Evaluate Transaction: UserValid, function returns user attributes');

    const resultBytes = await contract.evaluateTransaction('UserValid', id, password);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result;
}

// getAllContracts takes no input
async function getAllContracts(contract: Contract): Promise<any> {
    console.log('\n--> Evaluate Transaction: GetAllContracts, function returns all the current contracts on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAllContracts');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result;
}

// getAllUsers takes no input
async function getAllUsers(contract: Contract): Promise<any> {
    console.log('\n--> Evaluate Transaction: GetAllUsers, function returns all the current users on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAllUsers');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result;
}

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

/**
 * displayInputParameters() will print the global scope parameters used by the main driver routine.
 */
async function displayInputParameters(): Promise<void> {
    console.log(`channelName:       ${channelName}`);
    console.log(`chaincodeName:     ${chaincodeName}`);
    console.log(`mspId:             ${mspId}`);
    console.log(`cryptoPath:        ${cryptoPath}`);
    console.log(`keyDirectoryPath:  ${keyDirectoryPath}`);
    console.log(`certDirectoryPath: ${certDirectoryPath}`);
    console.log(`tlsCertPath:       ${tlsCertPath}`);
    console.log(`peerEndpoint:      ${peerEndpoint}`);
    console.log(`peerHostAlias:     ${peerHostAlias}`);
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});